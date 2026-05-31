import { z } from 'zod'

/**
 * Validated environment access.
 *
 * Design goal: the app must build and run even before real credentials are
 * set (placeholders → graceful fallback to seed data), but fail loudly when a
 * server feature that genuinely needs a secret is invoked without it.
 */

const PLACEHOLDERS = new Set([
  '',
  'your_supabase_anon_key',
  'your_supabase_service_role_key',
  'https://YOUR_PROJECT.supabase.co',
])

const isReal = (value: string | undefined): value is string =>
  typeof value === 'string' && value.length > 0 && !PLACEHOLDERS.has(value)

const publicSchema = z.object({
  siteUrl: z.string().url().default('http://localhost:3000'),
  supabaseUrl: z.string().optional(),
  supabaseAnonKey: z.string().optional(),
})

export const publicEnv = publicSchema.parse({
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
})

/** True only when the public Supabase URL + anon key are real (not placeholders). */
export const isSupabaseConfigured =
  isReal(publicEnv.supabaseUrl) && isReal(publicEnv.supabaseAnonKey)

/** Service-role key (server only). Returns undefined when not configured. */
export function getServiceRoleKey(): string | undefined {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  return isReal(key) ? key : undefined
}

/** Service-role key or throw — for code paths that cannot proceed without it. */
export function requireServiceRoleKey(): string {
  const key = getServiceRoleKey()
  if (!key) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not set. Configure Supabase env vars (see .env.example).',
    )
  }
  return key
}

export const storageBucket = process.env.SUPABASE_STORAGE_BUCKET ?? 'artworks'

/** Admin email allowlist for gating the admin area. */
export const adminAllowlist = (process.env.ADMIN_ALLOWLIST_EMAILS ?? '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean)
