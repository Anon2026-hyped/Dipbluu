# BOANERGES

A cinematic, production-grade art-commerce platform for selling limited-edition prints.
Admins upload and manage artworks; customers browse an immersive gallery and purchase prints
shipped worldwide, paying by card (Stripe/Paystack) or Bitcoin (Blockonomics).

Built with **Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS ·
Supabase · Biome**.

---

## Tech stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Server Components + client islands) |
| UI | React 19, Tailwind CSS 3, `next/font` (self-hosted), `next/image` |
| State | Zustand 5 (cart) |
| Data / Auth / Storage | Supabase (Postgres + RLS, magic-link auth, Storage) |
| Payments | Stripe (USD card), Blockonomics (BTC), Paystack (NGN) — one abstraction |
| Email | Resend (order confirmation + admin notification) |
| Validation | Zod (env, checkout, shipping, artwork) |
| Tooling | Biome (lint + format), TypeScript strict, `noUncheckedIndexedAccess` |
| Analytics | Cookieless Plausible (optional, DNT-aware) |

---

## Architecture

Layered and domain-driven. UI never touches a payment SDK or the DB directly — it calls a
feature hook or a server action, which calls `lib`/`server`.

```
UI (Server / Client Components)
   → features/<domain>        domain logic, hooks, forms
      → lib/ + server/        api clients, payments, email, repositories
         → Supabase (Postgres + Auth + Storage) + payment providers
```

Principles:
- **Money is integer minor units everywhere** (USD cents / NGN kobo); formatting only at the edge (`lib/money.ts`).
- **Validation at every boundary** with Zod (forms, API bodies, webhooks, env).
- **Idempotency is first-class**: unique `idempotency_key` on orders; webhook events deduped.
- **Webhooks are the source of truth** for payment status — not client redirects.
- **Prices are recomputed server-side** at checkout; client amounts are never trusted.

### Folder structure

```
app/
  page.tsx                 home (Server Component) → HomeExperience client island
  gallery/                 catalog listing (ISR)
  art/[slug]/              artwork detail — generateMetadata + JSON-LD (SSG)
  order/[orderNumber]/     DB-driven order status (auto-polls while pending)
  admin/                   magic-link login + protected dashboard (route group)
  api/
    checkout/              idempotent order creation + payment start
    webhooks/{stripe,paystack,blockonomics}/
  auth/callback/           magic-link code exchange
  sitemap.ts  robots.ts  layout.tsx  globals.css

components/                presentational: layout/, sections/, ui/, analytics/, order/
features/                  cart/ · checkout/ · home/ · catalog/ · admin/
lib/
  supabase/{client,server,admin}   browser / RSC / service-role clients
  payments/{stripe,paystack,blockonomics,index}   provider abstraction + routing
  email/  validation/  analytics/  money.ts  fonts.ts  env.ts  auth.ts  artworks.ts
server/
  repositories/            the only modules that touch the DB (artworks, orders, admin)
  services/orderService    checkout + webhook orchestration
animations/                keyframes.css + motion tokens
types/                     shared types + hand-written Supabase schema types
supabase/                  SQL migrations + seed + setup guide
proxy.ts                   session refresh + /admin allowlist gate (Next 16 proxy convention)
```

### Payment routing

| Delivery | Provider | Currency |
|---|---|---|
| Lagos / Nigeria | Paystack | NGN (kobo) |
| International — card | Stripe | USD (cents) |
| International — crypto | Blockonomics | BTC (priced in USD) |

---

## Getting started

```bash
npm install
cp .env.example .env.local        # fill in (see below)
npm run dev                        # http://localhost:3000
```

The app **runs without any backend configured** — the catalog falls back to seed data
(`lib/artworks.ts`) and checkout/admin are gated off until Supabase + keys are set.

### Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` / `npm run lint:fix` | Biome check / autofix |
| `npm run format` | Biome format |

### Going live (Supabase + payments)

1. Create a Supabase project; apply `supabase/migrations/0001_init.sql` + `supabase/seed.sql`
   and create a public Storage bucket named `artworks` (see `supabase/README.md`).
2. Fill Supabase, Stripe, Blockonomics, Paystack, and Resend keys in `.env.local`.
3. Register webhook endpoints:
   - Stripe → `/api/webhooks/stripe`
   - Paystack → `/api/webhooks/paystack`
   - Blockonomics → `/api/webhooks/blockonomics?secret=<BLOCKONOMICS_CALLBACK_SECRET>`
4. Set `ADMIN_ALLOWLIST_EMAILS` and sign in at `/admin/login` (magic link).

---

## Environment variables

See [`.env.example`](./.env.example) for the full, documented list. `NEXT_PUBLIC_*` are
browser-exposed; everything else is server-only. Missing/placeholder values degrade gracefully
(seed data, disabled features) rather than crashing.

> Security: never commit `.env.local`. If a secret is ever committed, rotate it — removing it
> from the working tree does not remove it from git history.

---

## Conventions

- Run `npm run lint` and `npm run typecheck` before committing — both must be clean (Biome is
  configured with accessibility rules at `error`).
- Add new domain logic under `features/` and DB access under `server/repositories/`.
- Keep money in minor units; format with `lib/money.ts`.
