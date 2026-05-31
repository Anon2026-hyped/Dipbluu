import 'server-only'

import Stripe from 'stripe'
import type { InitResult, NormalizedWebhookEvent, PaymentContext, PaymentProvider } from './types'

let cached: Stripe | null = null

function client(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set.')
  cached ??= new Stripe(key)
  return cached
}

export const stripeProvider: PaymentProvider = {
  id: 'stripe',

  async initialize(ctx: PaymentContext): Promise<InitResult> {
    const session = await client().checkout.sessions.create({
      mode: 'payment',
      customer_email: ctx.email,
      client_reference_id: ctx.orderNumber,
      metadata: { orderNumber: ctx.orderNumber, orderId: ctx.orderId },
      payment_intent_data: { metadata: { orderNumber: ctx.orderNumber } },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: ctx.currency.toLowerCase(),
            unit_amount: ctx.amountMinor,
            product_data: { name: ctx.description },
          },
        },
      ],
      success_url: ctx.successUrl,
      cancel_url: ctx.cancelUrl,
    })

    if (!session.url) throw new Error('Stripe did not return a checkout URL.')
    return { kind: 'redirect', provider: 'stripe', url: session.url, reference: session.id }
  },

  async verifyWebhook(req: Request): Promise<NormalizedWebhookEvent | null> {
    const secret = process.env.STRIPE_WEBHOOK_SECRET
    const signature = req.headers.get('stripe-signature')
    if (!secret || !signature) return null

    const body = await req.text()
    let event: Stripe.Event
    try {
      event = await client().webhooks.constructEventAsync(body, signature, secret)
    } catch {
      return null // bad signature
    }

    const base = { provider: 'stripe' as const, eventId: event.id, type: event.type }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      return {
        ...base,
        providerRef: session.id,
        orderNumber: session.metadata?.orderNumber ?? session.client_reference_id ?? null,
        status: session.payment_status === 'paid' ? 'confirmed' : 'pending',
        amountMinor: session.amount_total ?? null,
        currency: (session.currency?.toUpperCase() as 'USD' | 'NGN') ?? null,
      }
    }

    if (event.type === 'checkout.session.expired') {
      const session = event.data.object as Stripe.Checkout.Session
      return {
        ...base,
        providerRef: session.id,
        orderNumber: session.metadata?.orderNumber ?? null,
        status: 'expired',
        amountMinor: null,
        currency: null,
      }
    }

    // Acknowledged but not actionable.
    return {
      ...base,
      providerRef: null,
      orderNumber: null,
      status: 'pending',
      amountMinor: null,
      currency: null,
    }
  },
}
