import { NextResponse } from 'next/server'
import { handleProviderWebhook } from '@/server/services/orderService'

export const runtime = 'nodejs'

// Blockonomics delivers its HTTP callback as a GET with query params.
export async function GET(req: Request) {
  const { status } = await handleProviderWebhook('blockonomics', req)
  return NextResponse.json({ received: status === 200 }, { status })
}
