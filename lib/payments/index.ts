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

/** This storefront uses Paystack in NGN. */
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
