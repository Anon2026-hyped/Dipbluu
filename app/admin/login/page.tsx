'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const supabase = createClient()
    if (!supabase) {
      setError('Authentication is not configured. Set Supabase env vars.')
      setLoading(false)
      return
    }
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin` },
    })
    setLoading(false)
    if (otpError) setError(otpError.message)
    else setSent(true)
  }

  return (
    <section className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <h1 className="mb-2 font-bebas text-4xl text-white">ADMIN</h1>
      <p className="mb-8 font-garamond text-white/60 italic">Sign in with a magic link.</p>

      {sent ? (
        <p className="font-barlow text-blue-bright text-sm">
          Check your inbox — a sign-in link is on its way to {email}.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            required
            placeholder="you@yourdomain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Admin email"
            className="w-full border-white/14 border-b bg-transparent pb-2 text-sm text-white placeholder:text-muted transition-colors focus:border-blue-bright"
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-primary py-3 font-barlow text-white transition-all hover:bg-blue-bright disabled:opacity-40"
            style={{ fontSize: '11px', letterSpacing: '0.22em' }}
          >
            {loading ? 'SENDING…' : 'SEND MAGIC LINK →'}
          </button>
        </form>
      )}
    </section>
  )
}
