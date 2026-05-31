-- BOANERGES — initial schema
-- Money columns are integer minor units (USD cents / NGN kobo).

-- ── Enums ───────────────────────────────────────────────────────────────────
create type artwork_status as enum ('draft', 'published', 'sold_out');
create type order_status as enum (
  'draft', 'pending_payment', 'paid', 'fulfilled', 'shipped', 'delivered',
  'failed', 'cancelled', 'refunded'
);
create type payment_provider as enum ('stripe', 'blockonomics', 'paystack');
create type payment_status as enum ('pending', 'confirmed', 'failed', 'expired');

-- ── updated_at trigger ──────────────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── artworks ────────────────────────────────────────────────────────────────
create table artworks (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  edition     text not null default '',
  description text,
  status      artwork_status not null default 'draft',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index artworks_status_idx on artworks (status);
create trigger artworks_updated_at before update on artworks
  for each row execute function set_updated_at();

-- ── artwork_images ──────────────────────────────────────────────────────────
create table artwork_images (
  id           uuid primary key default gen_random_uuid(),
  artwork_id   uuid not null references artworks (id) on delete cascade,
  storage_path text not null,
  alt          text,
  width        integer,
  height       integer,
  blurhash     text,
  position     integer not null default 0
);
create index artwork_images_artwork_idx on artwork_images (artwork_id, position);

-- ── print_options ───────────────────────────────────────────────────────────
create table print_options (
  id              uuid primary key default gen_random_uuid(),
  artwork_id      uuid not null references artworks (id) on delete cascade,
  name            text not null,
  edition_size    integer,
  stock           integer not null default 0 check (stock >= 0),
  price_usd_cents integer not null check (price_usd_cents >= 0),
  price_ngn_kobo  integer not null check (price_ngn_kobo >= 0)
);
create index print_options_artwork_idx on print_options (artwork_id);

-- ── orders ──────────────────────────────────────────────────────────────────
create table orders (
  id               uuid primary key default gen_random_uuid(),
  order_number     text not null unique,
  email            text not null,
  status           order_status not null default 'draft',
  currency         text not null,
  subtotal_minor   integer not null check (subtotal_minor >= 0),
  shipping_minor   integer not null default 0 check (shipping_minor >= 0),
  total_minor      integer not null check (total_minor >= 0),
  payment_provider payment_provider,
  payment_status   payment_status,
  idempotency_key  text unique,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index orders_email_idx on orders (email);
create index orders_status_idx on orders (status);
create trigger orders_updated_at before update on orders
  for each row execute function set_updated_at();

-- ── order_items ─────────────────────────────────────────────────────────────
create table order_items (
  id               uuid primary key default gen_random_uuid(),
  order_id         uuid not null references orders (id) on delete cascade,
  artwork_id       uuid references artworks (id) on delete set null,
  print_option_id  uuid references print_options (id) on delete set null,
  title_snapshot   text not null,
  unit_price_minor integer not null check (unit_price_minor >= 0),
  quantity         integer not null check (quantity > 0)
);
create index order_items_order_idx on order_items (order_id);

-- ── shipping_addresses ──────────────────────────────────────────────────────
create table shipping_addresses (
  order_id    uuid primary key references orders (id) on delete cascade,
  full_name   text not null,
  email       text not null,
  line1       text not null,    -- single free-text address block
  line2       text,
  city        text,
  state       text,
  postal_code text,
  country     text,
  phone       text
);

-- ── payments ────────────────────────────────────────────────────────────────
create table payments (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references orders (id) on delete cascade,
  provider     payment_provider not null,
  provider_ref text not null unique,
  status       payment_status not null default 'pending',
  amount_minor integer not null check (amount_minor >= 0),
  currency     text not null,
  raw          jsonb,
  created_at   timestamptz not null default now()
);
create index payments_order_idx on payments (order_id);

-- ── webhook_events (idempotent webhook processing) ──────────────────────────
create table webhook_events (
  id           uuid primary key default gen_random_uuid(),
  provider     payment_provider not null,
  event_id     text not null,
  payload      jsonb,
  processed_at timestamptz not null default now(),
  unique (provider, event_id)
);

-- ── Row Level Security ──────────────────────────────────────────────────────
-- Public can READ published catalog only. All writes go through the service
-- role (server), which bypasses RLS. Orders/payments are never client-readable.
alter table artworks            enable row level security;
alter table artwork_images      enable row level security;
alter table print_options       enable row level security;
alter table orders              enable row level security;
alter table order_items         enable row level security;
alter table shipping_addresses  enable row level security;
alter table payments            enable row level security;
alter table webhook_events      enable row level security;

create policy "public reads published artworks"
  on artworks for select using (status = 'published');

create policy "public reads images of published artworks"
  on artwork_images for select using (
    exists (select 1 from artworks a where a.id = artwork_id and a.status = 'published')
  );

create policy "public reads options of published artworks"
  on print_options for select using (
    exists (select 1 from artworks a where a.id = artwork_id and a.status = 'published')
  );
-- No public policies on orders/order_items/shipping_addresses/payments/webhook_events:
-- access is server-only via the service role.
