import { NextResponse } from 'next/server'
import { handleProviderWebhook } from '@/server/services/orderService'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const { status } = await handleProviderWebhook('paystack', req)
  return NextResponse.json({ received: status === 200 }, { status })
}
