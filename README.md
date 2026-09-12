# BOANERGES

A lightweight, cinematic art-commerce storefront for selling limited-edition prints.
Customers browse a gallery and purchase prints shipped worldwide using Paystack, with order
confirmations by email and seller alerts by email + WhatsApp.

Built with **Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS · Biome**.

---

## Tech stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Server Components + client islands) |
| UI | React 19, Tailwind CSS 3, `next/font` (self-hosted), `next/image` |
| State | Zustand 5 (cart) |
| Catalog | Static seed data (`lib/artworks.ts`) |
| Orders | In-memory store (`lib/localOrderStore.ts`) — no database required |
| Payments | Paystack (NGN card payments; catalog priced in USD, converted at checkout) |
| Email | Resend (order confirmation + admin notification) |
| Alerts | WhatsApp via Twilio (optional, in addition to email) |
| Validation | Zod (env, checkout, shipping) |
| Tooling | Biome (lint + format), TypeScript strict, `noUncheckedIndexedAccess` |

---

## Architecture

Layered and domain-driven. UI never touches a payment SDK directly — it calls a feature hook,
which calls a server action/route, which calls `lib`/`server`.

```
UI (Server / Client Components)
   → features/<domain>        domain logic, hooks, forms
      → lib/ + server/        payments, email, catalog + order repositories
         → Paystack + Resend/Twilio
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
  order/[orderNumber]/     order status (auto-polls while pending)
  admin/                   static "fulfillment is manual" pages (no auth, no dashboard)
  api/
    checkout/              idempotent order creation + payment start
    orders/                order listing (local store)
    webhooks/paystack/
  sitemap.ts  robots.ts  layout.tsx  globals.css

components/                presentational: layout/, sections/, ui/, order/
features/                  cart/ · checkout/ · home/ · catalog/
lib/
  payments/{paystack,fx,types,index}   provider abstraction + USD→NGN conversion
  email/  validation/  localOrderStore.ts  money.ts  fonts.ts  env.ts  artworks.ts
server/
  repositories/artworks.ts   reads the seed catalog
  services/orderService.ts   checkout + webhook orchestration
animations/                keyframes.css + motion tokens
types/                     shared types + order-store row shapes
```

### Payment routing

| Delivery | Provider | Currency |
|---|---|---|
| All checkout flows | Paystack | NGN (kobo), converted from the USD catalog price |

---

## Getting started

```bash
npm install
cp .env.example .env.local        # fill in (see below)
npm run dev                        # http://localhost:3000
```

### Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` / `npm run lint:fix` | Biome check / autofix |
| `npm run format` | Biome format |

### Going live

1. Fill Paystack, Resend, and (optionally) Twilio keys in `.env.local`.
2. Set `USD_NGN_RATE` to the current USD→NGN rate used to convert catalog prices at checkout.
3. Register the Paystack webhook endpoint:
   - Paystack → `/api/webhooks/paystack`

---

## Environment variables

See [`.env.example`](./.env.example) for the full, documented list. `NEXT_PUBLIC_*` are
browser-exposed; everything else is server-only.

> Security: never commit `.env.local`. If a secret is ever committed, rotate it — removing it
> from the working tree does not remove it from git history.

---

## Conventions

- Run `npm run lint` and `npm run typecheck` before committing — both must be clean (Biome is
  configured with accessibility rules at `error`).
- Add new domain logic under `features/` and catalog/order access under `server/repositories/`
  and `server/services/`.
- Keep money in minor units; format with `lib/money.ts`.
