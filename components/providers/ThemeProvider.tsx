'use client'

import { ReactNode } from 'react'

export function ThemeProvider({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-slate-950 text-white">{children}</div>
}
