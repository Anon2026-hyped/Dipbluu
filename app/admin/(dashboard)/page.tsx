import Link from 'next/link'
import { deleteArtworkAction } from '@/app/admin/actions'
import { formatUsd } from '@/lib/money'
import { type AdminArtwork, listAllArtworks } from '@/server/repositories/adminArtworks'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  let artworks: AdminArtwork[] = []
  let loadError: string | null = null
  try {
    artworks = await listAllArtworks()
  } catch (err) {
    loadError = err instanceof Error ? err.message : 'Failed to load artworks.'
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-bebas text-4xl">ARTWORKS</h1>
        <Link
          href="/admin/artworks/new"
          className="bg-blue-primary px-6 py-3 font-barlow text-white text-xs transition-all hover:bg-blue-bright"
          style={{ letterSpacing: '0.22em' }}
        >
          + NEW ARTWORK
        </Link>
      </div>

      {loadError && (
        <div className="mb-6 rounded border border-amber-500/40 bg-amber-500/10 p-4">
          <p className="font-barlow text-amber-200 text-xs uppercase tracking-[0.2em]">
            Manual fulfillment mode
          </p>
          <p className="mt-2 font-barlow text-sm text-muted">
            {loadError} The storefront is running without the database-backed admin layer. New orders
            will be handled through payment webhooks and WhatsApp alerts instead.
          </p>
        </div>
      )}

      {!loadError && artworks.length === 0 && (
        <p className="font-garamond text-muted italic">No artworks yet. Create your first one.</p>
      )}

      <div className="divide-y divide-border-default border-border-default border-t">
        {artworks.map((artwork) => {
          const option = artwork.print_options[0]
          return (
            <div key={artwork.id} className="flex items-center justify-between gap-4 py-4">
              <div className="min-w-0">
                <p className="font-cinzel text-sm text-white">{artwork.title}</p>
                <p className="font-barlow text-muted text-xs">
                  /{artwork.slug} · {artwork.status} · {artwork.artwork_images.length} image(s)
                </p>
              </div>
              <div className="text-right">
                <p className="font-bebas text-blue-bright">
                  {option ? formatUsd(option.price_usd_cents) : '—'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={`/admin/artworks/${artwork.id}`}
                  className="font-barlow text-muted text-xs transition-colors hover:text-blue-bright"
                  style={{ letterSpacing: '0.18em' }}
                >
                  EDIT
                </Link>
                <form action={deleteArtworkAction}>
                  <input type="hidden" name="id" value={artwork.id} />
                  <button
                    type="submit"
                    className="font-barlow text-muted text-xs transition-colors hover:text-red-400"
                    style={{ letterSpacing: '0.18em' }}
                  >
                    DELETE
                  </button>
                </form>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
