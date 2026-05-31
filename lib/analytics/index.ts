/**
 * Privacy-aware analytics. Cookieless (Plausible), no PII, respects Do Not Track.
 * No-ops entirely when unconfigured or disabled.
 */

export function isAnalyticsEnabled(): boolean {
  return (
    process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true' &&
    Boolean(process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN)
  )
}

type EventProps = Record<string, string | number | boolean>

interface PlausibleWindow {
  plausible?: (event: string, options?: { props?: EventProps }) => void
}

/** Track a funnel event (page_view is automatic). Safe to call anywhere. */
export function track(event: string, props?: EventProps): void {
  if (typeof window === 'undefined') return
  if (navigator.doNotTrack === '1') return
  const w = window as unknown as PlausibleWindow
  w.plausible?.(event, props ? { props } : undefined)
}
