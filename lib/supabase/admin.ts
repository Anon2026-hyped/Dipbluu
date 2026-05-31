import 'server-only'

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { publicEnv, requireServiceRoleKey } from '@/lib/env'

/**
 * Service-role Supabase client — BYPASSES RLS. Server-only (guarded by the
 * `server-only` import). Use exclusively for trusted writes: order creation,
 * payment reconciliation, admin mutations. Never expose to the browser.
 *
 * Intentionally untyped: the hand-written schema types are placeholders. Once
 * `supabase gen types` is run against the live DB, swap them in here and in the
 * repositories. Repository functions enforce their own input/output contracts.
 */
export function createAdminClient() {
  if (!publicEnv.supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set.')
  }
  return createSupabaseClient(publicEnv.supabaseUrl, requireServiceRoleKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
