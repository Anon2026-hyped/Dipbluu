'use client'

import { createBrowserClient } from '@supabase/ssr'
import { publicEnv } from '@/lib/env'
import type { Database } from '@/types/database'

/**
 * Browser Supabase client (anon key, RLS-enforced). Use in client components.
 * Returns null when Supabase is not configured so callers can degrade.
 */
export function createClient() {
  if (!publicEnv.supabaseUrl || !publicEnv.supabaseAnonKey) return null
  return createBrowserClient<Database>(publicEnv.supabaseUrl, publicEnv.supabaseAnonKey)
}
