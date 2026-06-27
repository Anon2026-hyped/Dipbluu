/**
 * Money helpers — the single source of truth for currency handling.
 *
 * Rule: amounts are stored and computed as INTEGER MINOR UNITS
 * (USD cents) everywhere. Formatting to a display string happens only
 * at the presentation boundary, via these helpers.
 */

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

/** Format USD cents (e.g. 200000) as "$2,000.00". */
export function formatUsd(cents: number): string {
  return usdFormatter.format(cents / 100)
}
