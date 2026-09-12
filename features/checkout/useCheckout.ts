'use client'

import { useCallback, useRef, useState } from 'react'
import type { InitResult } from '@/lib/payments/types'
import type { CheckoutInput } from '@/lib/validation/checkout'

interface CheckoutState {
  loading: boolean
  error: string | null
  /** Set once an order is created (used to link to the status page). */
  orderNumber: string | null
}

/**
 * Drives the checkout API. Generates a stable Idempotency-Key per attempt so
 * retries (double-clicks, network retries) never create duplicate orders.
 * Paystack redirects the browser away to complete the payment.
 */
export function useCheckout() {
  const [state, setState] = useState<CheckoutState>({
    loading: false,
    error: null,
    orderNumber: null,
  })
  const idempotencyKey = useRef<string>(crypto.randomUUID())

  const start = useCallback(async (input: CheckoutInput) => {
    setState({ loading: true, error: null, orderNumber: null })
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey.current,
        },
        body: JSON.stringify(input),
      })

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null
        setState({
          loading: false,
          error: data?.error ?? 'Checkout failed.',
          orderNumber: null,
        })
        return
      }

      const result = (await res.json()) as { orderNumber: string; init: InitResult }
      if (result.init.kind === 'redirect') {
        window.location.assign(result.init.url)
        return
      }
      setState({
        loading: false,
        error: null,
        orderNumber: result.orderNumber,
      })
    } catch {
      setState({
        loading: false,
        error: 'Network error. Please try again.',
        orderNumber: null,
      })
    }
  }, [])

  /** Reset the idempotency key to begin a genuinely new order. */
  const reset = useCallback(() => {
    idempotencyKey.current = crypto.randomUUID()
    setState({ loading: false, error: null, orderNumber: null })
  }, [])

  return { ...state, start, reset }
}
