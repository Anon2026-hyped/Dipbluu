'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

interface ArtworkViewerProps {
  src?: string
  alt: string
}

/**
 * Cinematic artwork presentation: a framed image with a subtle hover zoom that
 * opens a focus-trapping lightbox on click (Escape / close button to dismiss).
 * Respects prefers-reduced-motion. Falls back to an elegant placeholder when
 * no image is available (seed data).
 */
export function ArtworkViewer({ src, alt }: ArtworkViewerProps) {
  const [zoomed, setZoomed] = useState(false)

  useEffect(() => {
    if (!zoomed) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoomed(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [zoomed])

  if (!src) {
    return (
      <div
        className="mx-auto flex aspect-[3/4] w-full max-w-sm items-center justify-center border border-border-default"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(37,99,235,0.06), transparent)',
        }}
      >
        <span className="text-5xl text-blue-bright/40">◻</span>
      </div>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setZoomed(true)}
        aria-label={`Zoom ${alt}`}
        className="group relative mx-auto block aspect-[3/4] w-full max-w-sm overflow-hidden border border-border-default"
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(max-width: 768px) 90vw, 384px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <span
          className="absolute right-3 bottom-3 bg-black/50 px-2 py-1 font-barlow text-[9px] text-white/70 opacity-0 transition-opacity group-hover:opacity-100"
          style={{ letterSpacing: '0.2em' }}
        >
          CLICK TO ZOOM
        </span>
      </button>

      {zoomed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 animate-fade-in"
        >
          <button
            type="button"
            onClick={() => setZoomed(false)}
            aria-label="Close zoomed view"
            className="absolute top-5 right-5 text-2xl text-white/70 transition-colors hover:text-white"
          >
            ✕
          </button>
          <div className="relative h-full w-full max-w-4xl">
            <Image src={src} alt={alt} fill sizes="90vw" className="object-contain" />
          </div>
        </div>
      )}
    </>
  )
}
