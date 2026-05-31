'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useCartStore } from '@/features/cart'
import { formatNgn } from '@/lib/money'
import type { Artwork } from '@/types'

export function Gallery({ artworks }: { artworks: Artwork[] }) {
  const addItem = useCartStore((state) => state.addItem)
  const [addedId, setAddedId] = useState<string | null>(null)

  const handleAdd = (artwork: Artwork) => {
    addItem(artwork, 1)
    setAddedId(artwork.id)
    setTimeout(() => setAddedId((cur) => (cur === artwork.id ? null : cur)), 1600)
  }

  return (
    <section id="works" className="border-border-default border-t py-20 sm:py-28">
      {/* Header */}
      <div className="mb-12 px-6 sm:mb-16 sm:px-12">
        <p
          className="mb-4 font-barlow text-blue-bright"
          style={{ fontSize: '10px', letterSpacing: '0.4em' }}
        >
          THE COLLECTION
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2
            className="font-bebas text-white leading-[0.85]"
            style={{ fontSize: 'clamp(56px, 10vw, 130px)', letterSpacing: '0.02em' }}
          >
            THE WORKS
          </h2>
          <p
            className="max-w-xs font-garamond text-muted-2 italic sm:text-right"
            style={{ fontSize: '15px', lineHeight: 1.6 }}
          >
            {artworks.length} pieces. One collection. The full brotherhood.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 px-6 sm:gap-4 sm:px-12 lg:grid-cols-3">
        {artworks.map((artwork, idx) => (
          <article key={artwork.id} className="group relative overflow-hidden bg-panel">
            <Link
              href={`/art/${artwork.slug}`}
              className="relative block aspect-[4/5] overflow-hidden"
              aria-label={`View ${artwork.title}`}
            >
              {artwork.imageUrl ? (
                <Image
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-blue-dim/20 to-black">
                  <span className="text-4xl text-blue-bright/50">◻</span>
                </div>
              )}

              {/* Legibility gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/5 to-black/25" />

              {/* Index */}
              <span className="absolute top-4 left-4 font-bebas text-sm text-white/55 tracking-widest">
                {String(idx + 1).padStart(2, '0')}
              </span>

              {/* Gold hover frame */}
              <span className="pointer-events-none absolute inset-3 border border-gold/0 transition-colors duration-500 group-hover:border-gold/40" />

              {/* Info */}
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <h3
                  className="translate-y-0 font-cinzel text-white transition-transform duration-500 sm:translate-y-1 sm:group-hover:translate-y-0"
                  style={{ fontSize: 'clamp(13px, 1.4vw, 16px)', letterSpacing: '0.1em' }}
                >
                  {artwork.title}
                </h3>
                <p
                  className="mt-1 font-barlow text-[10px] text-white/45"
                  style={{ letterSpacing: '0.24em' }}
                >
                  {artwork.edition}
                </p>
                <p
                  className="mt-3 font-bebas text-blue-bright"
                  style={{ fontSize: '22px', letterSpacing: '0.05em' }}
                >
                  {formatNgn(artwork.priceNgnKobo)}
                </p>
              </div>
            </Link>

            {/* Add to bag — sibling of the link so it doesn't navigate */}
            <button
              type="button"
              onClick={() => handleAdd(artwork)}
              aria-label={`Add ${artwork.title} to bag`}
              className={`absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border text-lg backdrop-blur transition-all duration-300 sm:h-10 sm:w-10 ${
                addedId === artwork.id
                  ? 'border-gold bg-gold/20 text-gold'
                  : 'border-white/25 bg-black/50 text-white hover:border-blue-bright hover:bg-blue-bright/20 hover:text-blue-bright'
              }`}
            >
              {addedId === artwork.id ? '✓' : '+'}
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
