import { ArtworkCard } from '@/components/ui/ArtworkCard'
import { artworks } from '@/lib/artworks'

export default function GalleryPage() {
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
