/**
 * Money helpers — the single source of truth for currency handling.
 *
 * Rule: amounts are stored and computed as INTEGER MINOR UNITS
 * (USD cents, NGN kobo) everywhere. Formatting to a display string
 * happens only at the presentation boundary, via these helpers.
 */

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const ngnFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
})

/** Format USD cents (e.g. 2200) as "$22.00". */
export function formatUsd(cents: number): string {
  return usdFormatter.format(cents / 100)
}

/** Format NGN kobo (e.g. 3_333_300) as "₦33,333". */
export function formatNgn(kobo: number): string {
  return ngnFormatter.format(kobo / 100)
}
