import type { MetadataRoute } from 'next'
import { publicEnv } from '@/lib/env'
import { getArtworks } from '@/server/repositories/artworks'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = publicEnv.siteUrl
  const artworks = await getArtworks()

  return [
    { url: base, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/gallery`, changeFrequency: 'weekly', priority: 0.8 },
    ...artworks.map((artwork) => ({
      url: `${base}/art/${artwork.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
