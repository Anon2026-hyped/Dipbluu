import 'server-only'

import type { DeliveryType } from '@/types/database'
import { paystackProvider } from './paystack'
import type { Currency, PaymentProvider, PaymentProviderId } from './types'

export type PaymentMethod = 'card'

const registry: Record<PaymentProviderId, PaymentProvider> = {
  paystack: paystackProvider,
}

export function getProvider(id: PaymentProviderId): PaymentProvider {
  return registry[id]
}

/** This storefront uses Paystack for the simplest minimal checkout flow. */
export function selectProvider(
  _deliveryType: DeliveryType,
  _method: PaymentMethod,
): PaymentProvider {
  return paystackProvider
}

/** Catalog prices are USD; Paystack always charges in NGN (see `fx.ts` for the conversion). */
export function chargeCurrencyFor(_id: PaymentProviderId): Currency {
  return 'NGN'
}

export { usdCentsToNgnKobo } from './fx'
export type { Currency, InitResult, PaymentProvider, PaymentProviderId } from './types'
