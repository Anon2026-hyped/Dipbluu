import type { Metadata } from 'next'
import { SiteTopBar } from '@/components/layout/SiteTopBar'
import { ArtworkCard } from '@/components/ui/ArtworkCard'
import { getArtworks } from '@/server/repositories/artworks'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Browse the BOANERGES collection of limited-edition art prints.',
}

export const revalidate = 300

export default async function GalleryPage() {
  const artworks = await getArtworks()

  return (
    <div className="min-h-screen bg-black text-white">
      <SiteTopBar crumb="THE COLLECTION" />

      <main className="mx-auto max-w-6xl px-6 py-16 sm:px-12">
        <div className="mb-12">
          <p
            className="mb-4 font-barlow text-blue-bright"
            style={{ fontSize: '10px', letterSpacing: '0.4em' }}
          >
            THE COLLECTION
          </p>
          <h1
            className="font-bebas text-white leading-none"
            style={{ fontSize: 'clamp(56px, 10vw, 130px)', letterSpacing: '0.02em' }}
          >
            THE WORKS
          </h1>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {artworks.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      </main>
    </div>
  )
}
