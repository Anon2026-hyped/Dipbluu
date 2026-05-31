import Script from 'next/script'
import { isAnalyticsEnabled } from '@/lib/analytics'

/**
 * Loads the cookieless Plausible script only when analytics is enabled.
 * Renders nothing otherwise — no third-party requests, no consent banner needed.
 */
export function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
  if (!isAnalyticsEnabled() || !domain) return null

  return (
    <Script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  )
}
