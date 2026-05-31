import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArtworkViewer } from '@/features/catalog/ArtworkViewer'
import { publicEnv } from '@/lib/env'
import { formatNgn, formatUsd } from '@/lib/money'
import { getArtworkBySlug, getArtworks } from '@/server/repositories/artworks'

export const revalidate = 300

export async function generateStaticParams() {
  const artworks = await getArtworks()
  return artworks.map((artwork) => ({ slug: artwork.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const artwork = await getArtworkBySlug(slug)
  if (!artwork) return { title: 'Not found' }

  const title = artwork.title
  const description =
    artwork.description ?? `${artwork.title} — ${artwork.edition}. A limited-edition art print.`
  const url = `${publicEnv.siteUrl}/art/${artwork.slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website' },
  }
}

export default async function ArtworkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const artwork = await getArtworkBySlug(slug)
  if (!artwork) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: artwork.title,
    description:
      artwork.description ?? `${artwork.title} — ${artwork.edition}. A limited-edition art print.`,
    brand: { '@type': 'Brand', name: 'BOANERGES' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: (artwork.priceUsdCents / 100).toFixed(2),
      availability: 'https://schema.org/InStock',
      url: `${publicEnv.siteUrl}/art/${artwork.slug}`,
    },
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-24 text-center">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data (static, server-generated)
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-10">
        <ArtworkViewer src={artwork.imageUrl} alt={artwork.title} />
      </div>

      <p className="font-barlow text-muted" style={{ fontSize: '10px', letterSpacing: '0.36em' }}>
        {artwork.edition}
      </p>
      <h1 className="mb-4 font-cinzel text-4xl text-white tracking-wide">{artwork.title}</h1>

      <p className="mb-2 font-bebas text-3xl text-blue-bright">{formatNgn(artwork.priceNgnKobo)}</p>
      <p className="mb-8 font-barlow text-muted text-sm">≈ {formatUsd(artwork.priceUsdCents)}</p>

      {artwork.description && (
        <p className="mx-auto mb-10 max-w-xl font-garamond text-white/70 italic leading-relaxed">
          {artwork.description}
        </p>
      )}

      <Link
        href="/gallery"
        className="inline-block border border-blue-bright px-8 py-4 font-barlow text-blue-bright transition-all hover:bg-blue-bright hover:text-black"
        style={{ fontSize: '11px', letterSpacing: '0.22em' }}
      >
        VIEW THE COLLECTION
      </Link>
    </section>
  )
}
