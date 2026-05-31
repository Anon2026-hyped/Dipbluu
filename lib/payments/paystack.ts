import 'server-only'

import { createHmac, timingSafeEqual } from 'node:crypto'
import type { InitResult, NormalizedWebhookEvent, PaymentContext, PaymentProvider } from './types'

const API = 'https://api.paystack.co'

function secretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY
  if (!key) throw new Error('PAYSTACK_SECRET_KEY is not set.')
  return key
}

export const paystackProvider: PaymentProvider = {
  id: 'paystack',

  async initialize(ctx: PaymentContext): Promise<InitResult> {
    const res = await fetch(`${API}/transaction/initialize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: ctx.email,
        amount: ctx.amountMinor, // kobo
        currency: ctx.currency,
        reference: ctx.orderNumber,
        callback_url: ctx.successUrl,
        metadata: { orderNumber: ctx.orderNumber, orderId: ctx.orderId },
      }),
    })

    const json = (await res.json()) as {
      status: boolean
      message: string
      data?: { authorization_url: string; reference: string }
    }
    if (!res.ok || !json.status || !json.data) {
      throw new Error(`Paystack initialize failed: ${json.message ?? res.statusText}`)
    }
    return {
      kind: 'redirect',
      provider: 'paystack',
      url: json.data.authorization_url,
      reference: json.data.reference,
    }
  },

  async verifyWebhook(req: Request): Promise<NormalizedWebhookEvent | null> {
    const signature = req.headers.get('x-paystack-signature')
    if (!signature) return null

    const body = await req.text()
    const expected = createHmac('sha512', secretKey()).update(body).digest('hex')

    const a = Buffer.from(expected)
    const b = Buffer.from(signature)
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null

    const event = JSON.parse(body) as {
      event: string
      data: { id?: number | string; reference: string; amount?: number; currency?: string }
    }
    const ref = event.data.reference
    const confirmed = event.event === 'charge.success'

    return {
      provider: 'paystack',
      eventId: `${event.event}:${ref}:${event.data.id ?? ''}`,
      type: event.event,
      providerRef: ref,
      orderNumber: ref, // we set reference = orderNumber at init
      status: confirmed ? 'confirmed' : 'pending',
      amountMinor: event.data.amount ?? null,
      currency: (event.data.currency as 'USD' | 'NGN') ?? null,
    }
  },
}
