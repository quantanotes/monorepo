create or replace function update_item_counts () RETURNS TRIGGER as $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE items SET like_count = like_count + 1 WHERE id = NEW.item_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE items SET like_count = like_count - 1 WHERE id = OLD.item_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

create or replace function update_comment_counts () RETURNS TRIGGER as $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE items SET comment_count = comment_count + 1 WHERE id = NEW.item_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE items SET comment_count = comment_count - 1 WHERE id = OLD.item_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

create or replace function update_pin_counts () RETURNS TRIGGER as $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE items SET pin_count = pin_count + 1 WHERE id = NEW.item_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE items SET pin_count = pin_count - 1 WHERE id = OLD.item_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

create trigger update_like_count
after INSERT on likes for EACH row
execute FUNCTION update_item_counts ();

create trigger update_like_count_delete
after DELETE on likes for EACH row
execute FUNCTION update_item_counts ();

create trigger update_comment_count
after INSERT on comments for EACH row
execute FUNCTION update_comment_counts ();

create trigger update_comment_count_delete
after DELETE on comments for EACH row
execute FUNCTION update_comment_counts ();

create trigger update_pin_count
after INSERT on pinned for EACH row
execute FUNCTION update_pin_counts ();

create trigger update_pin_count_delete
after DELETE on pinned for EACH row
execute FUNCTION update_pin_counts ();

UPDATE items SET
  like_count = (SELECT COUNT(*) FROM likes WHERE likes.item_id = items.id),
  comment_count = (SELECT COUNT(*) FROM comments WHERE comments.item_id = items.id),
  pin_count = (SELECT COUNT(*) FROM pinned WHERE pinned.item_id = items.id);
