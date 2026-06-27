export type PaymentProviderId = 'stripe' | 'blockonomics' | 'paystack'

export type Currency = 'USD' | 'NGN'

export interface PaymentContext {
  orderId: string
  orderNumber: string
  email: string
  /** Charge amount in integer minor units (USD cents). */
  amountMinor: number
  currency: Currency
  description: string
  /** Absolute URL the provider redirects to after a completed payment. */
  successUrl: string
  /** Absolute URL the provider redirects to if the customer cancels. */
  cancelUrl: string
}

/** What the client needs to continue payment after order creation. */
export type InitResult =
  | { kind: 'redirect'; provider: PaymentProviderId; url: string; reference: string }
  | {
      kind: 'crypto'
      provider: PaymentProviderId
      address: string
      amountBtc: string
      reference: string
      expiresAt: string
    }

export type NormalizedStatus = 'confirmed' | 'failed' | 'pending' | 'expired'

/** Provider webhook event mapped to a provider-agnostic shape. */
export interface NormalizedWebhookEvent {
  provider: PaymentProviderId
  /** Stable id for idempotent processing (dedupe key). */
  eventId: string
  type: string
  /** Provider-side payment/transaction reference. */
  providerRef: string | null
  /** Our order_number, recovered from metadata/reference. */
  orderNumber: string | null
  status: NormalizedStatus
  amountMinor: number | null
  currency: Currency | null
}

export interface PaymentProvider {
  id: PaymentProviderId
  /** Start a payment; returns a redirect URL or crypto address. */
  initialize(ctx: PaymentContext): Promise<InitResult>
  /**
   * Verify + parse an incoming webhook Request. Returns null if the signature
   * is invalid (caller responds 400) — never trust an unverified event.
   */
  verifyWebhook(req: Request): Promise<NormalizedWebhookEvent | null>
}
