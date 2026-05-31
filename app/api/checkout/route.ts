import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/env'
import { checkoutSchema } from '@/lib/validation/checkout'
import { startCheckout } from '@/server/services/orderService'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json(
      { error: 'Checkout is not configured. Set Supabase + payment env vars.' },
      { status: 503 },
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const parsed = checkoutSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed.', issues: parsed.error.issues },
      { status: 422 },
    )
  }

  // Client sends a stable Idempotency-Key so retried submits never duplicate.
  const idempotencyKey = req.headers.get('idempotency-key') ?? randomUUID()

  try {
    const result = await startCheckout(parsed.data, idempotencyKey)
    return NextResponse.json(result)
  } catch (err) {
    console.error('[checkout] failed:', err)
    return NextResponse.json({ error: 'Checkout failed. Please try again.' }, { status: 500 })
  }
}
