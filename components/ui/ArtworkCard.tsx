'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useCartStore } from '@/features/cart'
import { formatNgn } from '@/lib/money'
import type { Artwork } from '@/types'

interface ArtworkCardProps {
  artwork: Artwork
}

export function ArtworkCard({ artwork }: ArtworkCardProps) {
  const [isAdded, setIsAdded] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const handleAdd = () => {
    addItem(artwork, 1)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <article className="bg-panel border border-border-default overflow-hidden">
      <div className="relative aspect-[3/4] bg-gradient-to-b from-blue-dim/20 to-black flex items-center justify-center overflow-hidden">
        {artwork.imageUrl ? (
          <Image
            src={artwork.imageUrl}
            alt={artwork.title}
            fill
            sizes="(max-width: 1024px) 50vw, 380px"
            className="object-cover"
          />
        ) : (
          <span className="text-blue-bright text-4xl opacity-60">◻</span>
        )}
      </div>

      <div className="p-5">
        <h3
          className="font-cinzel text-white mb-1"
          style={{
            fontSize: '14px',
            letterSpacing: '0.12em',
          }}
        >
          {artwork.title}
        </h3>
        <p className="font-barlow text-muted text-xs mb-3" style={{ letterSpacing: '0.28em' }}>
          {artwork.edition}
        </p>
        <div className="flex items-end justify-between">
          <p
            className="font-bebas text-blue-bright"
            style={{
              fontSize: '22px',
              letterSpacing: '0.06em',
            }}
          >
            {formatNgn(artwork.priceNgnKobo)}
          </p>
          <button
            type="button"
            onClick={handleAdd}
            className={`font-barlow text-xs border-b transition-colors ${
              isAdded
                ? 'border-gold text-gold'
                : 'border-border-default text-muted hover:text-blue-bright hover:border-blue-bright'
            }`}
            style={{ letterSpacing: '0.22em' }}
          >
            {isAdded ? '✓ ADDED' : 'ADD TO BAG'}
          </button>
        </div>
      </div>
    </article>
  )
}
