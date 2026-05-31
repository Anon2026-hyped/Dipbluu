import type { Metadata } from 'next'
import { ArtworkCard } from '@/components/ui/ArtworkCard'
import { getArtworks } from '@/server/repositories/artworks'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Browse the BOANERGES collection of limited-edition art prints.',
}

// ISR: revalidate the catalog periodically; data comes from Supabase (or seed).
export const revalidate = 300

export default async function GalleryPage() {
  const artworks = await getArtworks()

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="mb-8 text-4xl font-semibold">Gallery</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {artworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </div>
    </section>
  )
}
