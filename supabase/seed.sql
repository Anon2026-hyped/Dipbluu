-- Seed catalog — mirrors lib/artworks.ts. Safe to re-run (idempotent on slug).

insert into artworks (slug, title, medium, edition, status) values
  ('nwunye-odogwu',  'Nwunye Odogwu',  'Oil on Canvas', 'EDITION OF 111 · BLIND DROP', 'published'),
  ('panic',          'Panic',           'Oil on Canvas', 'EDITION OF 111 · BLIND DROP', 'published'),
  ('african-cowboy', 'African Cowboy',  'Oil on Canvas', 'EDITION OF 111 · BLIND DROP', 'published')
on conflict (slug) do nothing;

-- One default print option per artwork (price in USD cents).
insert into print_options (artwork_id, name, edition_size, stock, price_usd_cents)
select a.id, 'Standard Print', 111, 111, po.price_usd_cents
from artworks a
join (values
  ('nwunye-odogwu',  100000),
  ('panic',           40000),
  ('african-cowboy',  50000)
) as po(slug, price_usd_cents) on a.slug = po.slug
where not exists (
  select 1 from print_options p where p.artwork_id = a.id and p.name = 'Standard Print'
);
