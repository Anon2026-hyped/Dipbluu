import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { signOutAction } from '@/app/admin/actions'
import { getAdminUser } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false },
}

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminUser()
  if (!user) redirect('/admin/login')

  return (
    <div className="min-h-screen bg-near-black text-white">
      <header className="flex items-center justify-between border-border-default border-b px-6 py-4">
        <Link href="/admin" className="font-bebas text-2xl tracking-wide">
          BOANERGES · ADMIN
        </Link>
        <div className="flex items-center gap-4">
          <span className="font-barlow text-muted text-xs">{user.email}</span>
          <form action={signOutAction}>
            <button
              type="submit"
              className="font-barlow text-muted text-xs transition-colors hover:text-blue-bright"
              style={{ letterSpacing: '0.22em' }}
            >
              SIGN OUT
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-12">{children}</main>
    </div>
  )
}
