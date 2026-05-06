'use client'

import { useRef, useState } from 'react'
import type { Artwork } from '@/types'

const ARTWORKS: Artwork[] = [
  {
    id: 'lion',
    title: 'THE LION',
    edition: 'EDITION OF 111 · BLIND DROP',
    price: 22,
    priceNGN: '₦33,333',
  },
  {
    id: 'crown',
    title: 'THE CROWN',
    edition: 'EDITION OF 111 · BLIND DROP',
    price: 22,
    priceNGN: '₦33,333',
  },
  {
    id: 'altar',
    title: 'THE ALTAR',
    edition: 'EDITION OF 111 · BLIND DROP',
    price: 22,
    priceNGN: '₦33,333',
  },
]

export function Gallery() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = 320
      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const ArtworkSVG = ({ id }: { id: string }) => {
    if (id === 'lion') {
      return (
        <svg viewBox="0 0 300 400" width="100%" height="100%" className="w-full h-full">
          <defs>
            <radialGradient id="lionGrad" cx="40%" cy="30%">
              <stop offset="0%" stopColor="#0c1f4a" />
              <stop offset="100%" stopColor="#000" />
            </radialGradient>
          </defs>
          <rect width="300" height="400" fill="url(#lionGrad)" />
          <circle cx="150" cy="130" r="70" fill="none" stroke="#2563eb" strokeWidth="1.5" opacity="0.4" />
          <path
            d="M 130 130 Q 100 100 80 110 Q 90 130 100 150 Q 90 170 80 190 Q 100 200 130 180 Q 150 200 170 180 Q 200 200 220 190 Q 210 170 200 150 Q 210 130 200 110 Q 180 100 150 100 Z"
            fill="none"
            stroke="#2563eb"
            strokeWidth="2.2"
            opacity="0.7"
          />
          <circle cx="130" cy="120" r="4" fill="none" stroke="#2563eb" strokeWidth="1" opacity="0.6" />
          <circle cx="170" cy="120" r="4" fill="none" stroke="#2563eb" strokeWidth="1" opacity="0.6" />
          <circle cx="150" cy="160" r="3" fill="#c9a84c" opacity="0.4" />
        </svg>
      )
    } else if (id === 'crown') {
      return (
        <svg viewBox="0 0 300 400" width="100%" height="100%" className="w-full h-full">
          <defs>
            <radialGradient id="crownGrad" cx="55%" cy="35%">
              <stop offset="0%" stopColor="#1a0e00" />
              <stop offset="100%" stopColor="#000" />
            </radialGradient>
          </defs>
          <rect width="300" height="400" fill="url(#crownGrad)" />
          <circle cx="150" cy="100" r="35" fill="none" stroke="#2563eb" strokeWidth="1" opacity="0.3" />
          <path
            d="M 100 200 L 120 140 L 150 100 L 180 140 L 200 200 Z"
            fill="none"
            stroke="#c9a84c"
            strokeWidth="2"
            opacity="0.7"
          />
          <line x1="85" y1="220" x2="215" y2="220" stroke="#c9a84c" strokeWidth="1.5" opacity="0.7" />
          <rect x="100" y="220" width="100" height="30" fill="none" stroke="#c9a84c" strokeWidth="1.5" opacity="0.7" />
          <circle cx="150" cy="70" r="8" fill="none" stroke="#c9a84c" strokeWidth="1.5" opacity="0.7" />
          <circle cx="115" cy="180" r="6" fill="none" stroke="#2563eb" strokeWidth="1" opacity="0.6" />
          <circle cx="185" cy="180" r="6" fill="none" stroke="#2563eb" strokeWidth="1" opacity="0.6" />
        </svg>
      )
    } else {
      return (
        <svg viewBox="0 0 300 400" width="100%" height="100%" className="w-full h-full">
          <defs>
            <radialGradient id="altarGrad" cx="62%" cy="28%">
              <stop offset="0%" stopColor="#0d1a0d" />
              <stop offset="100%" stopColor="#000" />
            </radialGradient>
          </defs>
          <rect width="300" height="400" fill="url(#altarGrad)" />
          <circle cx="150" cy="150" r="50" fill="none" stroke="#2563eb" strokeWidth="1" opacity="0.2" strokeDasharray="2,2" />
          <rect x="120" y="200" width="60" height="50" fill="none" stroke="#c9a84c" strokeWidth="2" opacity="0.7" />
          <rect x="110" y="160" width="80" height="40" fill="none" stroke="#2563eb" strokeWidth="1.5" opacity="0.7" />
          <rect x="100" y="120" width="100" height="40" fill="none" stroke="#2563eb" strokeWidth="1.5" opacity="0.7" />
          <line x1="150" y1="160" x2="150" y2="100" stroke="#c9a84c" strokeWidth="1.5" opacity="0.7" />
          <path d="M 140 110 Q 150 95 160 110" fill="none" stroke="#c9a84c" strokeWidth="1.5" opacity="0.7" />
          <line x1="130" y1="260" x2="170" y2="260" stroke="white" strokeWidth="0.8" opacity="0.6" />
        </svg>
      )
    }
  }

  return (
    <section className="border-t border-border-default py-20">
      {/* Header */}
      <div className="px-6 sm:px-12 mb-12 flex items-end justify-between">
        <div>
          <h2
            className="font-bebas text-white mb-2"
            style={{
              fontSize: 'clamp(48px, 8vw, 96px)',
              letterSpacing: '0.06em',
              lineHeight: '0.9',
            }}
          >
            <div>THE</div>
            <div>WORKS</div>
          </h2>
        </div>
        <p
          className="font-garamond italic text-muted max-w-40 text-right"
          style={{ fontSize: '14px' }}
        >
          Three pieces. One collection. The full brotherhood.
        </p>
      </div>

      {/* Gallery */}
      <div className="relative">
        <div
          ref={containerRef}
          className="flex gap-0.5 overflow-x-auto scroll-smooth px-6 sm:px-12"
          style={{ scrollSnapType: 'x mandatory', scrollBehavior: 'smooth' }}
        >
          {ARTWORKS.map((artwork, idx) => (
            <div
              key={artwork.id}
              className="flex-shrink-0 flex flex-col bg-panel"
              style={{
                width: 'clamp(260px, 28vw, 380px)',
                scrollSnapAlign: 'start',
              }}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Artwork canvas */}
              <div
                className="aspect-3/4 bg-gradient-to-b from-blue-dim/20 to-black flex items-center justify-center relative overflow-hidden"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(37,99,235,0.05), transparent)',
                }}
              >
                <div
                  className="transform transition-transform duration-600 ease-out"
                  style={{
                    scale: hoveredIndex === idx ? 1.04 : 1,
                  }}
                >
                  <ArtworkSVG id={artwork.id} />
                </div>
              </div>

              {/* Info bar */}
              <div className="border-t border-border-default p-5">
                <h3
                  className="font-cinzel text-white mb-1"
                  style={{
                    fontSize: '14px',
                    letterSpacing: '0.12em',
                  }}
                >
                  {artwork.title}
                </h3>
                <p
                  className="font-barlow text-muted text-xs mb-3"
                  style={{ letterSpacing: '0.28em' }}
                >
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
                    {artwork.priceNGN}
                  </p>
                  <button
                    className="font-barlow text-muted text-xs border-b border-border-default hover:text-blue-bright hover:border-blue-bright transition-colors"
                    style={{ letterSpacing: '0.22em' }}
                  >
                    ADD TO BAG
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        <div className="absolute bottom-32 right-6 sm:right-12 flex gap-3">
          <button
            onClick={() => scroll('left')}
            className="w-10 h-10 border border-border-default hover:border-blue-bright flex items-center justify-center transition-colors"
          >
            ←
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-10 h-10 border border-border-default hover:border-blue-bright flex items-center justify-center transition-colors"
          >
            →
          </button>
        </div>
      </div>
    </section>
  )
}
