import type { Metadata } from 'next'
import Link from 'next/link'
import { OrderStatusPoller } from '@/components/order/OrderStatusPoller'
import { isSupabaseConfigured } from '@/lib/env'
import { formatUsd } from '@/lib/money'
import { getOrderByNumber } from '@/server/repositories/orders'
import type { OrderStatus } from '@/types/database'

export const metadata: Metadata = {
  title: 'Order',
  robots: { index: false },
}

const STATUS_COPY: Record<OrderStatus, { label: string; note: string }> = {
  draft: { label: 'Draft', note: 'Your order has not been submitted yet.' },
  pending_payment: {
    label: 'Awaiting Payment',
    note: 'We are waiting for your payment to confirm. This page updates automatically once it does.',
  },
  paid: { label: 'Confirmed', note: 'Payment received — your prints are entering production.' },
  fulfilled: { label: 'In Production', note: 'Your prints are being prepared.' },
  shipped: { label: 'Shipped', note: 'Your order is on its way.' },
  delivered: { label: 'Delivered', note: 'Your order has been delivered. Thank you.' },
  failed: { label: 'Payment Failed', note: 'We could not confirm your payment. Please try again.' },
  cancelled: { label: 'Cancelled', note: 'This order was cancelled.' },
  refunded: { label: 'Refunded', note: 'This order was refunded.' },
}

export default async function OrderPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params
  const order = isSupabaseConfigured ? await getOrderByNumber(orderNumber) : null

  const status = order?.status ?? 'pending_payment'
  const copy = STATUS_COPY[status]

  const isPending = status === 'pending_payment' || status === 'draft'

  return (
    <section className="mx-auto max-w-2xl px-6 py-32 text-center">
      {isPending && <OrderStatusPoller />}
      <p className="font-barlow text-muted" style={{ fontSize: '10px', letterSpacing: '0.36em' }}>
        ORDER
      </p>
      <h1 className="mb-2 font-bebas text-5xl text-white">{orderNumber}</h1>
      <p className="mb-6 font-cinzel text-blue-bright text-sm tracking-widest">{copy.label}</p>
      <p className="mb-8 font-garamond text-white/65 italic">{copy.note}</p>

      {order && (
        <p className="mb-8 font-bebas text-2xl text-white">{formatUsd(order.total_minor)}</p>
      )}

      <Link
        href="/"
        className="inline-block border border-blue-bright px-8 py-4 font-barlow text-blue-bright transition-all hover:bg-blue-bright hover:text-black"
        style={{ fontSize: '11px', letterSpacing: '0.22em' }}
      >
        BACK TO SHOP
      </Link>
    </section>
  )
}
