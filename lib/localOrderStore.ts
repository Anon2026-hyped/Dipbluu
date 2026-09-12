import { randomUUID } from 'node:crypto'

import type { OrderRow, OrderStatus, PaymentProvider, PaymentStatus } from '@/types/database'

export interface LocalCreateOrderInput {
  orderNumber: string
  email: string
  currency: string
  subtotalMinor: number
  shippingMinor: number
  totalMinor: number
  paymentProvider: PaymentProvider
  idempotencyKey: string
  items: Array<{
    artworkId: string | null
    printOptionId: string | null
    titleSnapshot: string
    unitPriceMinor: number
    quantity: number
  }>
  shipping: {
    fullName: string
    email: string
    address: string
    phone?: string
  }
}

const orders = new Map<string, OrderRow>()
const orderItems = new Map<string, Array<{ title_snapshot: string; quantity: number }>>()
const payments = new Map<string, {
  orderId: string
  provider: PaymentProvider
  providerRef: string
  amountMinor: number
  currency: string
  status: PaymentStatus
}>()
const webhookIds = new Set<string>()

const nowIso = () => new Date().toISOString()

function withLocalOrder(input: LocalCreateOrderInput): OrderRow {
  const existing = Array.from(orders.values()).find(
    (order) => order.idempotency_key === input.idempotencyKey,
  )
  if (existing) return existing

  const id = randomUUID()
  const order: OrderRow = {
    id,
    order_number: input.orderNumber,
    email: input.email,
    status: 'pending_payment',
    currency: input.currency,
    subtotal_minor: input.subtotalMinor,
    shipping_minor: input.shippingMinor,
    total_minor: input.totalMinor,
    payment_provider: input.paymentProvider,
    payment_status: 'pending',
    idempotency_key: input.idempotencyKey,
    created_at: nowIso(),
    updated_at: nowIso(),
  }

  orders.set(id, order)
  orderItems.set(id, input.items.map((item) => ({
    title_snapshot: item.titleSnapshot,
    quantity: item.quantity,
  })))

  return order
}

export function createLocalOrder(input: LocalCreateOrderInput): OrderRow {
  return withLocalOrder(input)
}

export function getLocalOrderByNumber(orderNumber: string): OrderRow | null {
  const order = Array.from(orders.values()).find((entry) => entry.order_number === orderNumber)
  return order ?? null
}

export function listLocalOrders(): OrderRow[] {
  return Array.from(orders.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )
}

export function getLocalOrderById(orderId: string): OrderRow | null {
  return orders.get(orderId) ?? null
}

export function getLocalOrderByPaymentRef(providerRef: string): OrderRow | null {
  const payment = Array.from(payments.values()).find((entry) => entry.providerRef === providerRef)
  return payment ? orders.get(payment.orderId) ?? null : null
}

export function recordLocalPaymentInit(input: {
  orderId: string
  provider: PaymentProvider
  providerRef: string
  amountMinor: number
  currency: string
}): void {
  payments.set(input.providerRef, {
    orderId: input.orderId,
    provider: input.provider,
    providerRef: input.providerRef,
    amountMinor: input.amountMinor,
    currency: input.currency,
    status: 'pending',
  })
}

export function getLocalOrderItemsSummary(orderId: string): Array<{ title: string; quantity: number }> {
  return (orderItems.get(orderId) ?? []).map((row) => ({
    title: row.title_snapshot,
    quantity: row.quantity,
  }))
}

export function updateLocalOrderStatus(
  orderId: string,
  status: OrderStatus,
  paymentStatus?: PaymentStatus,
): void {
  const order = orders.get(orderId)
  if (!order) return

  order.status = status
  order.updated_at = nowIso()
  if (paymentStatus) order.payment_status = paymentStatus
}

export function recordLocalWebhookEvent(
  provider: PaymentProvider,
  eventId: string,
  _payload: unknown,
): boolean {
  const key = `${provider}:${eventId}`
  if (webhookIds.has(key)) return false
  webhookIds.add(key)
  return true
}
