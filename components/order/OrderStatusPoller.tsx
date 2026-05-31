'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Refreshes the server-rendered order page on an interval while payment is
 * still pending, so the DB-driven status updates without a manual reload.
 */
export function OrderStatusPoller({ intervalMs = 8000 }: { intervalMs?: number }) {
  const router = useRouter()

  useEffect(() => {
    const id = setInterval(() => router.refresh(), intervalMs)
    return () => clearInterval(id)
  }, [router, intervalMs])

  return null
}
