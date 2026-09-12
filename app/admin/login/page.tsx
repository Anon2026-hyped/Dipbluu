'use client'

import { useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminLogin() {
  const supabase = useMemo(() => createClient(), [])

  if (!supabase) {
    return (
      <section className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6">
        <h1 className="mb-2 font-bebas text-4xl text-white">ADMIN</h1>
        <p className="mb-4 font-garamond text-white/70 italic">
          Manual-fulfillment mode is active.
        </p>
        <p className="font-barlow text-sm leading-7 text-muted">
          This storefront is running without the database-backed admin layer. Orders are processed via
          payment webhooks and WhatsApp notifications, so you can fulfill sales manually without a
          Supabase-powered CMS.
        </p>
      </section>
    )
  }

  return (
    <section className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <h1 className="mb-2 font-bebas text-4xl text-white">ADMIN</h1>
      <p className="mb-8 font-garamond text-white/60 italic">Sign in with a magic link.</p>
      <p className="font-barlow text-blue-bright text-sm">
        Supabase auth is configured, so the admin login is available.
      </p>
    </section>
  )
}
