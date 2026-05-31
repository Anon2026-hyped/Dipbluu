import { notFound } from 'next/navigation'
import { updateArtworkAction } from '@/app/admin/actions'
import { ArtworkForm } from '@/features/admin/ArtworkForm'
import { getAdminArtwork } from '@/server/repositories/adminArtworks'

export const dynamic = 'force-dynamic'

export default async function EditArtworkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const artwork = await getAdminArtwork(id)
  if (!artwork) notFound()

  const option = artwork.print_options[0]
  const initial = {
    title: artwork.title,
    slug: artwork.slug,
    edition: artwork.edition,
    description: artwork.description ?? '',
    status: artwork.status,
    priceUsd: (option?.price_usd_cents ?? 0) / 100,
    priceNgn: (option?.price_ngn_kobo ?? 0) / 100,
    stock: option?.stock ?? 0,
    editionSize: option?.edition_size ?? ('' as const),
  }

  return (
    <div>
      <h1 className="mb-8 font-bebas text-4xl">EDIT · {artwork.title}</h1>
      <ArtworkForm
        action={updateArtworkAction}
        artworkId={id}
        initial={initial}
        submitLabel="SAVE CHANGES →"
      />
    </div>
  )
}
