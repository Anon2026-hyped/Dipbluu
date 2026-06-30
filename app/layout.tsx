import type { Metadata } from 'next'
import './globals.css'
import '@/animations/keyframes.css'
import { Analytics } from '@/components/analytics/Analytics'
import { AmbientJazz } from '@/components/ui/AmbientJazz'
import { fontVariables } from '@/lib/fonts'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'BOANERGES',
    template: '%s · BOANERGES',
  },
  description: 'A modern art commerce experience — limited-edition prints, shipped worldwide.',
  openGraph: {
    type: 'website',
    siteName: 'BOANERGES',
    title: 'BOANERGES',
    description: 'Limited-edition art prints, shipped worldwide.',
    url: siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BOANERGES',
    description: 'Limited-edition art prints, shipped worldwide.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        {children}
        <AmbientJazz />
        <Analytics />
      </body>
    </html>
  )
}
