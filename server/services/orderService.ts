import 'server-only'

import { randomUUID } from 'node:crypto'
import { sendAdminNotification, sendOrderConfirmation } from '@/lib/email'
import { publicEnv } from '@/lib/env'
import {
  createLocalOrder,
  getLocalOrderByNumber,
  getLocalOrderByPaymentRef,
  getLocalOrderItemsSummary,
  recordLocalPaymentInit,
  recordLocalWebhookEvent,
  updateLocalOrderStatus,
} from '@/lib/localOrderStore'
import { formatUsd } from '@/lib/money'
import type { InitResult, PaymentProviderId } from '@/lib/payments'
import { chargeCurrencyFor, getProvider, selectProvider, usdCentsToNgnKobo } from '@/lib/payments'
import type { CheckoutInput } from '@/lib/validation/checkout'
import { getArtworks } from '@/server/repositories/artworks'

function newOrderNumber(): string {
  return `BNG-${randomUUID().slice(0, 8).toUpperCase()}`
}

export interface CheckoutResult {
  orderNumber: string
  init: InitResult
}

/**
 * Creates an order and starts payment. Prices are recomputed from the catalog
 * server-side — client-supplied amounts are never trusted. Idempotent on
 * `idempotencyKey`: a retried submit returns the same order.
 */
export async function startCheckout(
  input: CheckoutInput,
  idempotencyKey: string,
): Promise<CheckoutResult> {
  const catalog = await getArtworks()
  const byId = new Map(catalog.map((a) => [a.id, a]))

  const provider = selectProvider(input.deliveryType, input.paymentMethod)

  // Orders are recorded and displayed in USD (the catalog's pricing currency);
  // the actual Paystack charge is converted to NGN separately, below.
  const currency = 'USD'

  let amountMinor = 0
  const items = input.items.map((item) => {
    const artwork = byId.get(item.artworkId)
    if (!artwork) throw new Error(`Unknown artwork: ${item.artworkId}`)
    const unit = artwork.priceUsdCents
    amountMinor += unit * item.quantity
    return {
      artworkId: artwork.id,
      printOptionId: item.printOptionId ?? null,
      titleSnapshot: artwork.title,
      unitPriceMinor: unit,
      quantity: item.quantity,
    }
  })

  const orderNumber = newOrderNumber()
  const order = createLocalOrder({
    orderNumber,
    email: input.shipping.email,
    currency,
    subtotalMinor: amountMinor,
    shippingMinor: 0,
    totalMinor: amountMinor,
    paymentProvider: provider.id,
    idempotencyKey,
    items,
    shipping: input.shipping,
  })

  const chargeCurrency = chargeCurrencyFor(provider.id)
  const chargeAmountMinor =
    chargeCurrency === 'NGN' ? usdCentsToNgnKobo(order.total_minor) : order.total_minor

  const init = await provider.initialize({
    orderId: order.id,
    orderNumber: order.order_number,
    email: order.email,
    amountMinor: chargeAmountMinor,
    currency: chargeCurrency,
    description: `BOANERGES order ${order.order_number}`,
    successUrl: `${publicEnv.siteUrl}/order/${order.order_number}`,
    cancelUrl: `${publicEnv.siteUrl}/checkout?canceled=1`,
  })

  recordLocalPaymentInit({
    orderId: order.id,
    provider: provider.id,
    providerRef: init.reference,
    amountMinor: chargeAmountMinor,
    currency: chargeCurrency,
  })

  return { orderNumber: order.order_number, init }
}

/**
 * Verifies and processes a provider webhook. The webhook — not the client
 * redirect — is the source of truth for payment status. Idempotent: duplicate
 * deliveries are deduped via an in-memory webhook-id set.
 */
export async function handleProviderWebhook(
  providerId: PaymentProviderId,
  req: Request,
): Promise<{ ok: boolean; status: number }> {
  const provider = getProvider(providerId)
  const event = await provider.verifyWebhook(req)
  if (!event) return { ok: false, status: 400 } // invalid signature

  const fresh = recordLocalWebhookEvent(event.provider, event.eventId, event)
  if (!fresh) return { ok: true, status: 200 } // already processed

  const orderNumber = event.orderNumber
  const providerRef = event.providerRef

  const order = orderNumber
    ? getLocalOrderByNumber(orderNumber)
    : providerRef
      ? getLocalOrderByPaymentRef(providerRef)
      : null

  if (!order) return { ok: true, status: 200 } // unmatched — ack to stop retries

  if (event.status === 'confirmed' && order.status !== 'paid') {
    updateLocalOrderStatus(order.id, 'paid', 'confirmed')

    const summary = {
      orderNumber: order.order_number,
      email: order.email,
      customerName: order.email.split('@')[0] ?? 'there',
      total: formatUsd(order.total_minor),
      items: getLocalOrderItemsSummary(order.id),
    }
    await sendOrderConfirmation(summary)
    await sendAdminNotification(summary)
  } else if (event.status === 'failed' || event.status === 'expired') {
    updateLocalOrderStatus(order.id, 'failed', event.status === 'expired' ? 'expired' : 'failed')
  }

  return { ok: true, status: 200 }
}
