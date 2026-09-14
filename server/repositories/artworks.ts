import 'server-only'

import { artworks as seedArtworks } from '@/lib/artworks'
import type { Artwork } from '@/types'

export function normalizeArtworkSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')
}

export async function getArtworks(): Promise<Artwork[]> {
  return seedArtworks
}

export async function getArtworkBySlug(slug: string): Promise<Artwork | null> {
  const normalizedSlug = normalizeArtworkSlug(slug)
  return seedArtworks.find((a) => normalizeArtworkSlug(a.slug) === normalizedSlug) ?? null
}
