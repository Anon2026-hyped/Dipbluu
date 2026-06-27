import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'
import type { OrderRow, OrderStatus, PaymentProvider, PaymentStatus } from '@/types/database'

export interface NewOrderItem {
  artworkId: string | null
  printOptionId: string | null
  titleSnapshot: string
  unitPriceMinor: number
  quantity: number
}

export interface NewShippingAddress {
  fullName: string
  email: string
  /** Single free-text address block (may include city/country). Stored in line1. */
  address: string
  phone?: string
}

export interface CreateOrderInput {
  orderNumber: string
  email: string
  currency: string
  subtotalMinor: number
  shippingMinor: number
  totalMinor: number
  paymentProvider: PaymentProvider
  idempotencyKey: string
  items: NewOrderItem[]
  shipping: NewShippingAddress
}

/**
 * Idempotent order creation. If an order already exists for `idempotencyKey`
 * (a retried submit), the existing order is returned instead of a duplicate.
 *
 * NOTE: Phase 4 promotes the multi-table writes below into a single Postgres
 * RPC for true atomicity. The unique constraint on `idempotency_key` already
 * guarantees no duplicate orders even under concurrent retries.
 */
export async function createOrder(input: CreateOrderInput): Promise<OrderRow> {
  const supabase = createAdminClient()

  const existing = await supabase
    .from('orders')
    .select('*')
    .eq('idempotency_key', input.idempotencyKey)
    .maybeSingle()

  if (existing.data) return existing.data

  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      order_number: input.orderNumber,
      email: input.email,
      currency: input.currency,
      subtotal_minor: input.subtotalMinor,
      shipping_minor: input.shippingMinor,
      total_minor: input.totalMinor,
      payment_provider: input.paymentProvider,
      payment_status: 'pending',
      idempotency_key: input.idempotencyKey,
      status: 'pending_payment',
    })
    .select('*')
    .single()

  if (error || !order) {
    throw new Error(`createOrder failed: ${error?.message ?? 'unknown error'}`)
  }

  await supabase.from('order_items').insert(
    input.items.map((item) => ({
      order_id: order.id,
      artwork_id: item.artworkId,
      print_option_id: item.printOptionId,
      title_snapshot: item.titleSnapshot,
      unit_price_minor: item.unitPriceMinor,
      quantity: item.quantity,
    })),
  )

  await supabase.from('shipping_addresses').insert({
    order_id: order.id,
    full_name: input.shipping.fullName,
    email: input.shipping.email,
    line1: input.shipping.address,
    city: null,
    country: null,
    phone: input.shipping.phone ?? null,
  })

  return order
}

export async function getOrderByNumber(orderNumber: string): Promise<OrderRow | null> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('orders')
    .select('*')
    .eq('order_number', orderNumber)
    .maybeSingle()
  return data ?? null
}

export async function getOrderById(orderId: string): Promise<OrderRow | null> {
  const supabase = createAdminClient()
  const { data } = await supabase.from('orders').select('*').eq('id', orderId).maybeSingle()
  return data ?? null
}

/** Records the payment attempt and its provider reference (e.g. session id / BTC address). */
export async function recordPaymentInit(input: {
  orderId: string
  provider: PaymentProvider
  providerRef: string
  amountMinor: number
  currency: string
}): Promise<void> {
  const supabase = createAdminClient()
  // Upsert by provider_ref so retried inits don't duplicate the payment row.
  const { error } = await supabase.from('payments').upsert(
    {
      order_id: input.orderId,
      provider: input.provider,
      provider_ref: input.providerRef,
      status: 'pending',
      amount_minor: input.amountMinor,
      currency: input.currency,
    },
    { onConflict: 'provider_ref' },
  )
  if (error) throw new Error(`recordPaymentInit failed: ${error.message}`)
}

/** Resolves the order behind a payment reference (used by Blockonomics callbacks). */
export async function getOrderByPaymentRef(providerRef: string): Promise<OrderRow | null> {
  const supabase = createAdminClient()
  const { data: payment } = await supabase
    .from('payments')
    .select('order_id')
    .eq('provider_ref', providerRef)
    .maybeSingle()
  if (!payment?.order_id) return null
  return getOrderById(payment.order_id)
}

export async function getOrderItemsSummary(
  orderId: string,
): Promise<{ title: string; quantity: number }[]> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('order_items')
    .select('title_snapshot, quantity')
    .eq('order_id', orderId)
  return (data ?? []).map((row: { title_snapshot: string; quantity: number }) => ({
    title: row.title_snapshot,
    quantity: row.quantity,
  }))
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  paymentStatus?: PaymentStatus,
): Promise<void> {
  const supabase = createAdminClient()
  const patch: { status: OrderStatus; payment_status?: PaymentStatus; updated_at: string } = {
    status,
    updated_at: new Date().toISOString(),
  }
  if (paymentStatus) patch.payment_status = paymentStatus
  const { error } = await supabase.from('orders').update(patch).eq('id', orderId)
  if (error) throw new Error(`updateOrderStatus failed: ${error.message}`)
}

/**
 * Records a provider webhook event. Returns false if this event_id was already
 * processed (deduplication), so callers can skip re-processing safely.
 */
export async function recordWebhookEvent(
  provider: PaymentProvider,
  eventId: string,
  payload: unknown,
): Promise<boolean> {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('webhook_events')
    .insert({ provider, event_id: eventId, payload })
  // 23505 = unique_violation → already processed
  if (error) {
    if (error.code === '23505') return false
    throw new Error(`recordWebhookEvent failed: ${error.message}`)
  }
  return true
}
