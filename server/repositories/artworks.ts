import 'server-only'

import { artworks as seedArtworks } from '@/lib/artworks'
import type { Artwork } from '@/types'

export async function getArtworks(): Promise<Artwork[]> {
  return seedArtworks
}

export async function getArtworkBySlug(slug: string): Promise<Artwork | null> {
  return seedArtworks.find((a) => a.slug === slug) ?? null
}
