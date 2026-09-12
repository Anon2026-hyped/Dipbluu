/**
 * Row shapes for the in-memory order store (lib/localOrderStore.ts).
 *
 * Money columns are integer minor units (USD cents), matching lib/money.ts.
 */

export type OrderStatus =
  | 'draft'
  | 'pending_payment'
  | 'paid'
  | 'fulfilled'
  | 'shipped'
  | 'delivered'
  | 'failed'
  | 'cancelled'
  | 'refunded'
export type PaymentProvider = 'paystack'
export type PaymentStatus = 'pending' | 'confirmed' | 'failed' | 'expired'
export type DeliveryType = 'standard' | 'international'

export interface OrderRow {
  id: string
  order_number: string
  email: string
  status: OrderStatus
  currency: string
  subtotal_minor: number
  shipping_minor: number
  total_minor: number
  payment_provider: PaymentProvider | null
  payment_status: PaymentStatus | null
  idempotency_key: string | null
  created_at: string
  updated_at: string
}
