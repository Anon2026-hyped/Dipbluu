import 'server-only'

import { timingSafeEqual } from 'node:crypto'
import type { InitResult, NormalizedWebhookEvent, PaymentContext, PaymentProvider } from './types'

const API = 'https://www.blockonomics.co/api'

function apiKey(): string {
  const key = process.env.BLOCKONOMICS_API_KEY
  if (!key) throw new Error('BLOCKONOMICS_API_KEY is not set.')
  return key
}

function requiredConfirmations(): number {
  return Number(process.env.BLOCKONOMICS_CONFIRMATIONS ?? '2')
}

/** Current BTC price in the given fiat (USD per BTC). */
async function btcPrice(currency: 'USD'): Promise<number> {
  const res = await fetch(`${API}/price?currency=${currency}`)
  const json = (await res.json()) as { price: number }
  if (!res.ok || !json.price) throw new Error('Blockonomics price lookup failed.')
  return json.price
}

export const blockonomicsProvider: PaymentProvider = {
  id: 'blockonomics',

  async initialize(ctx: PaymentContext): Promise<InitResult> {
    // Blockonomics prices in fiat; we charge USD and settle in BTC.
    const price = await btcPrice('USD')
    const amountBtc = (ctx.amountMinor / 100 / price).toFixed(8)

    const res = await fetch(`${API}/new_address`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey()}` },
    })
    const json = (await res.json()) as { address?: string }
    if (!res.ok || !json.address) throw new Error('Blockonomics new_address failed.')

    // 15-minute price-lock window (covers BTC volatility — see risk analysis).
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()
    return {
      kind: 'crypto',
      provider: 'blockonomics',
      address: json.address,
      amountBtc,
      reference: json.address, // address is the payment reference; mapped to order at init
      expiresAt,
    }
  },

  async verifyWebhook(req: Request): Promise<NormalizedWebhookEvent | null> {
    // Blockonomics HTTP callback is a GET with query params; the shared secret
    // is appended to the callback URL we register in their dashboard.
    const url = new URL(req.url)
    const provided = url.searchParams.get('secret') ?? ''
    const expected = process.env.BLOCKONOMICS_CALLBACK_SECRET ?? ''
    if (!expected) return null
    const a = Buffer.from(provided)
    const b = Buffer.from(expected)
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null

    const addr = url.searchParams.get('addr')
    const txid = url.searchParams.get('txid') ?? ''
    const status = Number(url.searchParams.get('status') ?? '0') // 0/1/2 confirmations bucket

    return {
      provider: 'blockonomics',
      eventId: `${addr}:${txid}:${status}`,
      type: `blockonomics.status.${status}`,
      providerRef: addr, // resolves to order via payments.provider_ref
      orderNumber: null,
      status: status >= requiredConfirmations() ? 'confirmed' : 'pending',
      // Satoshi value isn't a fiat minor unit; reconciliation is amount-in-BTC.
      amountMinor: null,
      currency: null,
    }
  },
}
