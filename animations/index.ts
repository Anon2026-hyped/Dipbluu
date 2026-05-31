/**
 * Motion design tokens — shared easings and durations.
 *
 * Use these instead of hardcoding cubic-bezier strings inline so the motion
 * language stays consistent. Phase 5 layers framer-motion variants on top.
 */

export const easing = {
  /** Strong ease-in-out — drawer/overlay slides. */
  expo: 'cubic-bezier(0.77, 0, 0.175, 1)',
  /** Slight overshoot — modal/element entrances. */
  backOut: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  standard: 'ease-out',
} as const

export const duration = {
  fast: '0.3s',
  base: '0.55s',
  slow: '0.8s',
} as const
