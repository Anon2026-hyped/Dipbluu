import 'server-only'

/**
 * Artwork prices are catalogued in USD cents, but Paystack charges are made
 * in NGN. USD_NGN_RATE is a manually maintained constant (₦ per $1) — update
 * it in the environment when the rate moves meaningfully.
 */
function rate(): number {
  const raw = process.env.USD_NGN_RATE
  const parsed = raw ? Number(raw) : Number.NaN
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error('USD_NGN_RATE is not set to a valid positive number.')
  }
  return parsed
}

/** Converts a USD-cents amount to the equivalent NGN-kobo amount to charge. */
export function usdCentsToNgnKobo(usdCents: number): number {
  return Math.round(usdCents * rate())
}
