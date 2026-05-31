import {
  Barlow_Condensed,
  Bebas_Neue,
  Cinzel,
  Cormorant_Garamond,
  EB_Garamond,
} from 'next/font/google'

// Self-hosted via next/font — eliminates render-blocking @import requests and
// layout shift. Each exposes a CSS variable consumed by tailwind.config.ts.

export const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bebas',
})

export const barlow = Barlow_Condensed({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-barlow',
})

export const garamond = EB_Garamond({
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-garamond',
})

export const cinzel = Cinzel({
  weight: ['400', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cinzel',
})

export const cormorant = Cormorant_Garamond({
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cormorant',
})

/** Space-separated font CSS variables to apply on <html>. */
export const fontVariables = [
  bebas.variable,
  barlow.variable,
  garamond.variable,
  cinzel.variable,
  cormorant.variable,
].join(' ')
