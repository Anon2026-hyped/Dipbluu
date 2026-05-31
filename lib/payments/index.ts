import 'server-only'

import type { DeliveryType } from '@/types/database'
import { blockonomicsProvider } from './blockonomics'
import { paystackProvider } from './paystack'
import { stripeProvider } from './stripe'
import type { Currency, PaymentProvider, PaymentProviderId } from './types'

export type PaymentMethod = 'card' | 'crypto'

const registry: Record<PaymentProviderId, PaymentProvider> = {
  stripe: stripeProvider,
  blockonomics: blockonomicsProvider,
  paystack: paystackProvider,
}

export function getProvider(id: PaymentProviderId): PaymentProvider {
  return registry[id]
}

/**
 * Routing rule:
 *   Nigeria (lagos/nigeria) → Paystack (NGN)
 *   International + card     → Stripe (USD)
 *   International + crypto   → Blockonomics (BTC, priced in USD)
 */
export function selectProvider(deliveryType: DeliveryType, method: PaymentMethod): PaymentProvider {
  if (deliveryType === 'lagos' || deliveryType === 'nigeria') return paystackProvider
  return method === 'crypto' ? blockonomicsProvider : stripeProvider
}

/** Charge currency for a provider. */
export function currencyFor(id: PaymentProviderId): Currency {
  return id === 'paystack' ? 'NGN' : 'USD'
}

export type { Currency, InitResult, PaymentProvider, PaymentProviderId } from './types'
