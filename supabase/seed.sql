-- Seed catalog — mirrors lib/artworks.ts. Safe to re-run (idempotent on slug).

insert into artworks (slug, title, edition, status) values
  ('the-lion',  'THE LION',  'EDITION OF 111 · BLIND DROP', 'published'),
  ('the-crown', 'THE CROWN', 'EDITION OF 111 · BLIND DROP', 'published'),
  ('the-altar', 'THE ALTAR', 'EDITION OF 111 · BLIND DROP', 'published')
on conflict (slug) do nothing;

-- One default print option per artwork ($22.00 / ₦33,333).
insert into print_options (artwork_id, name, edition_size, stock, price_usd_cents, price_ngn_kobo)
select a.id, 'Standard Print', 111, 111, 2200, 3333300
from artworks a
where a.slug in ('the-lion', 'the-crown', 'the-altar')
  and not exists (
    select 1 from print_options p where p.artwork_id = a.id and p.name = 'Standard Print'
  );
