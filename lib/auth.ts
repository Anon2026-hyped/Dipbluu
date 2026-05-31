import 'server-only'

import type { User } from '@supabase/supabase-js'
import { adminAllowlist } from '@/lib/env'
import { createClient } from '@/lib/supabase/server'

/**
 * Returns the signed-in user only if their email is on the admin allowlist.
 * Server-side authorization gate — used by the admin layout and server actions
 * (defense in depth alongside middleware).
 */
export async function getAdminUser(): Promise<User | null> {
  const supabase = await createClient()
  if (!supabase) return null

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email || !adminAllowlist.includes(user.email.toLowerCase())) return null
  return user
}
