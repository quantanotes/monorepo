create table pks_cache (
  tbl_name text not null primary key,
  pks text [] not null
);

--> statement-breakpoint

create or replace function get_pks(tbl_name text)
returns text[] as $$
declare
	pks text[];
begin
	select array_agg(c.column_name)
	into pks
	from information_schema.table_constraints tc 
	join information_schema.constraint_column_usage
		as ccu
		using (constraint_schema, constraint_name) 
	join information_schema.columns
		as c ON c.table_schema = tc.constraint_schema
  		and tc.table_name = c.table_name
		and ccu.column_name = c.column_name
	where constraint_type = 'PRIMARY KEY' and tc.table_name = tbl_name;

	return pks;
end;
$$ language plpgsql;

--> statement-breakpoint

create or replace function cache_pks(tbl_name text)
returns void as $$
declare
	pks text[];
begin
	select *
	into pks
	from get_pks(tbl_name);
	
	insert into pks_cache(tbl_name, pks)
	values (tbl_name, pks);
end;
$$ language plpgsql;

--> statement-breakpoint

create or replace function get_pks_cached(tbl_name_in text)
returns text[] as $$
declare
	pks_out text[];
begin
	select pks into pks_out
	from pks_cache
	where tbl_name = tbl_name_in;

	return pks_out;
end;
$$ language plpgsql;

--> statement-breakpoint

create or replace function get_where_clause(tbl_name text, record anyelement)
returns text as $$
declare
	tbl_name text;
	pk text;
	pks text[];
	where_conds text[];
	pk_val text;
begin
  tbl_name := pg_typeof(record)::text;
  pks := get_pks_cached(tbl_name);
  where_conds := array[]::text[];
    
	foreach pk in array pks
	loop
		execute format('select ($1).%I', pk) into pk_val using record;
		where_conds := array_append(
			where_conds,
			format('%I = %L', pk, pk_val)
		);
	end loop;
    
  return array_to_string(where_conds, ' AND ');
end;
$$ language plpgsql;

--> statement-breakpoint

create or replace function get_data_cols(tbl_name text)
returns text[] as $$
declare
  pks text[];
  sync_cols text[] := array[
    'is_new',
    'is_deleted',
    'is_sent',
    'is_synced',
    'modified_columns',
    'backup'
  ];
  cols text[];
begin
  pks := get_pks_cached(tbl_name);

  select array_agg(c.column_name)
  into cols 
  from information_schema.columns c
  where c.table_name = tbl_name
  	and c.table_schema = current_schema()
    and c.column_name != ALL(pks)
    and c.column_name != ALL(sync_cols);

  return cols;
end;
$$ language plpgsql;

--> statement-breakpoint

create or replace function is_syncing()
returns boolean AS $$
begin
  return coalesce(nullif(current_setting('electric.syncing', true), ''), 'false')::boolean;
end;
$$ language plpgsql;

--> statement-breakpoint

create or replace function should_bypass_triggers()
returns boolean AS $$
begin
  return coalesce(nullif(current_setting('electric.bypass_triggers', true), ''), 'false')::boolean;
end;
$$ language plpgsql;

--> statement-breakpoint

create or replace function handle_insert()
returns trigger as $$
declare
	col TEXT;
  new_value TEXT;
  old_value TEXT;
	where_clause TEXT;
begin
	if should_bypass_triggers() then
		return new;
	end if;

	where_clause := get_where_clause(tg_table_name, new);

	if is_syncing() then
		new.is_new := false;
		new.is_sent := false;
		new.modified_columns := array[]::text[];

		execute format('select 1 from %I where %s', tg_table_name, where_clause) into old_value;

		if old_value is not null then
			foreach col in array get_data_cols(tg_table_name)
			loop
				execute format('select $1.%I', col) using new into new_value;
				execute format('select %I from %I where %s', col, tg_table_name, where_clause) into old_value;

				if new_value is distinct from old_value then
					execute format('update %I set %I = $1 where %s', tg_table_name, col, where_clause) using new_value;
				end if;
			end loop;

			execute format(
				'update %I set modified_columns = $1, is_new = $2, is_sent = $3 where %s',
				tg_table_name,
				where_clause
			) using array[]::text[], false, false;

			return null;
		end if;
	else
		new.modified_columns := get_data_cols(tg_table_name);
		new.is_new := true;
	end if;

	return new;
end;
$$ language plpgsql;

--> statement-breakpoint

create or replace function handle_update()
returns trigger as $$
declare
	col TEXT;
  new_value TEXT;
  old_value TEXT;
	where_clause TEXT;
begin
	if should_bypass_triggers() then
		return new;
	end if;

	where_clause := get_where_clause(tg_table_name, new);

	if is_syncing() then
		if (old.is_synced = true) or (old.is_sent = true and new.updated_at >= old.updated_at) then
			new.is_new := false;
			new.is_sent := false;
			new.modified_columns := array[]::text[];
			new.backup := null;
		else
			foreach col in array get_data_cols(tg_table_name)
			loop
        if col != any(old.modified_columns) then
          execute format('select ($1).%I', col) using new into new_value;
          execute format('select ($1).%I', col) using old into old_value;
					     
          if new_value is distinct from old_value then
            execute format(
							'update %I set %I = $1 where %s',
							tg_table_name,
							col,
							where_clause
						) using new_value;

            new.backup := jsonb_set(
							coalesce(new.backup, '{}'::jsonb),
							array[col],
							to_jsonb(old_value)
						);
          end if;
        end if;
			end loop;
		end if;
	else
		foreach col in array get_data_cols(tg_table_name)
		loop
			execute format('select ($1).%I', col) using new into new_value;
			execute format('select ($1).%I', col) using old into old_value;

			if new_value is distinct from old_value then
				if not (col = any(old.modified_columns)) then
					new.modified_columns := array_append(
						new.modified_columns,
						col
					);

					new.backup := jsonb_set(
						coalesce(new.backup, '{}'::jsonb),
						array[col],
						to_jsonb(old_value)
					);
				end if;
			end if;
		end loop;

		new.is_sent := false;
	end if;
	
	return new;
end;
$$ language plpgsql;

--> statement-breakpoint

create or replace function handle_delete()
returns trigger as $$
begin
	if should_bypass_triggers() then
		return old;
	end if;

	if is_syncing() then
		return old;
	else
		if old.is_new then
			return old;
		else
			execute format(
				'update %I set is_deleted = true where %s',
				tg_table_name,
				get_where_clause(tg_table_name, old)
			);
			return null;
		end if;
	end if;
end;
$$ language plpgsql;

--> statement-breakpoint

create or replace procedure activate_triggers(tbl_name text)
language plpgsql as $$
begin
	execute format('
		select cache_pks(%1$L);

    create or replace trigger %1$I_insert_trigger
    before insert on %1$I
		for each row
		when (pg_trigger_depth() = 0)
    execute function handle_insert(); 

    create or replace trigger %1$I_update_trigger
    before update on %1$I
		for each row
		when (pg_trigger_depth() = 0)
    execute function handle_update(); 

    create or replace trigger %1$I_delete_trigger
    before delete on %1$I
		for each row
		when (pg_trigger_depth() = 0)
    execute function handle_delete(); 
	', tbl_name);
end;
$$;
