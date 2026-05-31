import type { Artwork } from '@/types'

const IMG = 'https://raw.githubusercontent.com/Anon2026-hyped/Boanerges/main'

// Seed catalog. In Phase 3 this moves to Supabase; the shape stays identical
// (integer minor units), so consumers won't change.
// To re-map which photo belongs to which work, change the imageUrl values below.
export const artworks: Artwork[] = [
  {
    id: 'herald',
    slug: 'the-herald',
    title: 'THE HERALD',
    edition: 'EDITION OF 111 · BLIND DROP',
    priceUsdCents: 2200,
    priceNgnKobo: 3_333_300,
    imageUrl: `${IMG}/Hero(1).jpg`,
  },
  {
    id: 'lion',
    slug: 'the-lion',
    title: 'THE LION',
    edition: 'EDITION OF 111 · BLIND DROP',
    priceUsdCents: 2200,
    priceNgnKobo: 3_333_300,
    imageUrl: `${IMG}/IMG_1089(1).jpg`,
  },
  {
    id: 'crown',
    slug: 'the-crown',
    title: 'THE CROWN',
    edition: 'EDITION OF 111 · BLIND DROP',
    priceUsdCents: 2200,
    priceNgnKobo: 3_333_300,
    imageUrl: `${IMG}/IMG_1093(1).jpg`,
  },
  {
    id: 'altar',
    slug: 'the-altar',
    title: 'THE ALTAR',
    edition: 'EDITION OF 111 · BLIND DROP',
    priceUsdCents: 2200,
    priceNgnKobo: 3_333_300,
    imageUrl: `${IMG}/IMG_1094(1).jpg`,
  },
  {
    id: 'flame',
    slug: 'the-flame',
    title: 'THE FLAME',
    edition: 'EDITION OF 111 · BLIND DROP',
    priceUsdCents: 2200,
    priceNgnKobo: 3_333_300,
    imageUrl: `${IMG}/IMG_1095(1).jpg`,
  },
  {
    id: 'veil',
    slug: 'the-veil',
    title: 'THE VEIL',
    edition: 'EDITION OF 111 · BLIND DROP',
    priceUsdCents: 2200,
    priceNgnKobo: 3_333_300,
    imageUrl: `${IMG}/IMG_1097(1).jpg`,
  },
  {
    id: 'oath',
    slug: 'the-oath',
    title: 'THE OATH',
    edition: 'EDITION OF 111 · BLIND DROP',
    priceUsdCents: 2200,
    priceNgnKobo: 3_333_300,
    imageUrl: `${IMG}/IMG_1098(1).jpg`,
  },
  {
    id: 'relic',
    slug: 'the-relic',
    title: 'THE RELIC',
    edition: 'EDITION OF 111 · BLIND DROP',
    priceUsdCents: 2200,
    priceNgnKobo: 3_333_300,
    imageUrl: `${IMG}/IMG_1099(1).jpg`,
  },
  {
    id: 'psalm',
    slug: 'the-psalm',
    title: 'THE PSALM',
    edition: 'EDITION OF 111 · BLIND DROP',
    priceUsdCents: 2200,
    priceNgnKobo: 3_333_300,
    imageUrl: `${IMG}/IMG_1100(1).jpg`,
  },
  {
    id: 'covenant',
    slug: 'the-covenant',
    title: 'THE COVENANT',
    edition: 'EDITION OF 111 · BLIND DROP',
    priceUsdCents: 2200,
    priceNgnKobo: 3_333_300,
    imageUrl: `${IMG}/IMG_1101(1).jpg`,
  },
]
