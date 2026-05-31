import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import { adminAllowlist, isSupabaseConfigured, publicEnv } from '@/lib/env'

/**
 * Refreshes the Supabase auth session and gates the /admin area.
 * Unauthenticated or non-allowlisted users are redirected to /admin/login.
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  const path = request.nextUrl.pathname
  const isLogin = path === '/admin/login'

  // Without Supabase configured, the admin area can't authenticate — send to login.
  if (!isSupabaseConfigured || !publicEnv.supabaseUrl || !publicEnv.supabaseAnonKey) {
    if (path.startsWith('/admin') && !isLogin) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
    return NextResponse.next({ request })
  }

  let response = NextResponse.next({ request })

  const supabase = createServerClient(publicEnv.supabaseUrl, publicEnv.supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value)
        response = NextResponse.next({ request })
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options)
        }
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (path.startsWith('/admin') && !isLogin) {
    const allowed = user?.email && adminAllowlist.includes(user.email.toLowerCase())
    if (!allowed) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }

  return response
}
