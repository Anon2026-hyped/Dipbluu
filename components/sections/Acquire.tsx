'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import type { Artwork } from '@/types'

const PACKAGE_OPTIONS = [
  { tier: 'ONE PRINT', price: '₦33,333', usd: '≈ $22 USD', id: 'one' },
  { tier: 'TWO PRINTS · MOST POPULAR', price: '₦66,666', usd: '≈ $44 USD', id: 'two', featured: true },
  { tier: 'THREE PRINTS · FULL SET', price: '₦99,999', usd: '≈ $66 USD', id: 'three' },
]

export function Acquire() {
  const [addedId, setAddedId] = useState<string | null>(null)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (optionId: string) => {
    setAddedId(optionId)
    setTimeout(() => setAddedId(null), 2000)

    // Example artwork for cart
    const artwork: Artwork = {
      id: optionId as any,
      title: `${optionId.toUpperCase()} PRINT PACKAGE`,
      edition: 'BLIND DROP',
      price: optionId === 'one' ? 22 : optionId === 'two' ? 44 : 66,
      priceNGN: optionId === 'one' ? '₦33,333' : optionId === 'two' ? '₦66,666' : '₦99,999',
    }
    addItem(artwork, 1)
  }

  return (
    <section className="py-20 px-6 sm:px-12">
      <div
        className="text-center mb-12 font-barlow text-muted"
        style={{ fontSize: '10px', letterSpacing: '0.36em' }}
      >
        ACQUIRE
      </div>

      {/* Price Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-border-default max-w-4xl mx-auto mb-12">
        {PACKAGE_OPTIONS.map((option, idx) => (
          <div
            key={option.id}
            className={`p-8 border-r last:border-r-0 ${
              option.featured
                ? 'border-t-2 border-t-blue-primary bg-blue-bright/6'
                : ''
            }`}
            style={{
              transform: option.featured ? 'translateY(-16px)' : 'none',
            }}
          >
            <div
              className="font-barlow text-muted mb-4"
              style={{ fontSize: '9.5px', letterSpacing: '0.32em' }}
            >
              {option.tier}
            </div>

            <div
              className={`font-bebas mb-2 ${
                option.featured ? 'text-blue-bright' : 'text-white'
              }`}
              style={{
                fontSize: 'clamp(28px, 4vw, 44px)',
                letterSpacing: '0.04em',
              }}
            >
              {option.price}
            </div>

            <div
              className="font-barlow text-muted mb-6"
              style={{
                fontSize: '10.5px',
                letterSpacing: '0.16em',
              }}
            >
              {option.usd}
            </div>

            <button
              onClick={() => handleAddToCart(option.id)}
              className={`w-full border px-4 py-3 font-barlow transition-all text-xs ${
                addedId === option.id
                  ? 'border-gold text-gold'
                  : option.featured
                    ? 'border-blue-bright text-blue-bright hover:bg-blue-primary hover:text-black hover:shadow-lg'
                    : 'border-white/35 text-white hover:border-blue-bright hover:text-blue-bright'
              }`}
              style={{
                fontSize: '10.5px',
                letterSpacing: '0.28em',
              }}
            >
              {addedId === option.id ? '✓ ADDED' : 'ACQUIRE'}
            </button>
          </div>
        ))}
      </div>

      {/* Original Triptych Row */}
      <div
        className="flex flex-col md:flex-row gap-6 border border-border-gold bg-gold-dim p-7 max-w-4xl mx-auto"
        style={{ background: 'rgba(201, 168, 76, 0.15)' }}
      >
        <div className="flex-1">
          <div
            className="font-barlow text-gold/70 mb-2"
            style={{ fontSize: '10px', letterSpacing: '0.28em' }}
          >
            THE ORIGINAL TRIPTYCH
          </div>
          <div
            className="font-bebas text-gold mb-0 line-through"
            style={{
              fontSize: 'clamp(24px, 3vw, 32px)',
              letterSpacing: '0.06em',
              opacity: 0.4,
            }}
          >
            ₦10,207,600.00
          </div>
        </div>

        <div className="flex-1">
          <div
            className="font-barlow text-muted text-xs"
            style={{ letterSpacing: '0.22em' }}
          >
            ACQUIRED · PRIVATE COLLECTION
          </div>
        </div>

        <div>
          <button
            disabled
            className="border border-muted text-muted px-6 py-2 font-barlow text-xs opacity-40 cursor-not-allowed"
            style={{ letterSpacing: '0.28em' }}
          >
            SOLD
          </button>
        </div>
      </div>
    </section>
  )
}
