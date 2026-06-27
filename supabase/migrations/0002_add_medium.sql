-- Add medium column to artworks table.
-- Existing rows default to 'Oil on Canvas'; NULL is allowed for legacy/admin-created rows.
alter table artworks add column if not exists medium text;
