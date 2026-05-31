import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { isSupabaseConfigured, publicEnv } from '@/lib/env'
import type { Database } from '@/types/database'

/**
 * Server Supabase client (anon key + user session cookies, RLS-enforced).
 * Use in Server Components, Route Handlers, and Server Actions.
 * Returns null when Supabase is not configured.
 */
export async function createClient() {
  if (!isSupabaseConfigured || !publicEnv.supabaseUrl || !publicEnv.supabaseAnonKey) {
    return null
  }

  const cookieStore = await cookies()

  return createServerClient<Database>(publicEnv.supabaseUrl, publicEnv.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options)
          }
        } catch {
          // Called from a Server Component (read-only cookies); safe to ignore
          // — session refresh is handled by middleware.
        }
      },
    },
  })
}
