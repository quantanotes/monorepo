create table sync_status (
  table_name text not null,
  space_id text not null,
  is_synced boolean not null default false,
  primary key (table_name, is_synced)
);
--> statement-breakpoint
call activate_triggers('items'); --> statement-breakpoint
call activate_triggers('tags'); --> statement-breakpoint
call activate_triggers('item_tags'); --> statement-breakpoint
call activate_triggers('tag_tags'); --> statement-breakpoint
call activate_triggers('tools'); --> statement-breakpoint
call activate_triggers('tasks'); --> statement-breakpoint
call activate_triggers('pinned'); --> statement-breakpoint