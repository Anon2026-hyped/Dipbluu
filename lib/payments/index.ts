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
 *   card   → Stripe (USD)
 *   crypto → Blockonomics (BTC, priced in USD)
 */
export function selectProvider(
  _deliveryType: DeliveryType,
  _method: PaymentMethod,
): PaymentProvider {
  return paystackProvider
}

/** This storefront uses Paystack in NGN for the simplest minimal checkout flow. */
export function currencyFor(_id: PaymentProviderId): Currency {
  return 'NGN'
}

export type { Currency, InitResult, PaymentProvider, PaymentProviderId } from './types'
