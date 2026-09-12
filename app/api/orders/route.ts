import { NextResponse } from 'next/server'
import { listLocalOrders } from '@/lib/localOrderStore'

export const runtime = 'nodejs'

export async function GET() {
  return NextResponse.json({
    orders: listLocalOrders().map((order) => ({
      id: order.id,
      orderNumber: order.order_number,
      email: order.email,
      status: order.status,
      totalMinor: order.total_minor,
      currency: order.currency,
      paymentProvider: order.payment_provider,
      createdAt: order.created_at,
    })),
  })
}
