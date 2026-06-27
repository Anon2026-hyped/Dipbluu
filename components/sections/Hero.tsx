'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const IMG = 'https://raw.githubusercontent.com/Anon2026-hyped/Boanerges/main'

// Ordered to match lib/artworks.ts so alts are descriptive
const IMAGES: { src: string; alt: string }[] = [
  { src: `${IMG}/Hero(1).jpg`, alt: 'Chaos in Eko' },
  { src: `${IMG}/IMG_1089(1).jpg`, alt: 'Nwunye Odogwu' },
  { src: `${IMG}/IMG_1093(1).jpg`, alt: 'Panic' },
  { src: `${IMG}/IMG_1094(1).jpg`, alt: 'African Cowboy' },
  { src: `${IMG}/IMG_1095(1).jpg`, alt: 'The Watcher' },
  { src: `${IMG}/IMG_1097(1).jpg`, alt: 'The Guardian' },
  { src: `${IMG}/IMG_1098(1).jpg`, alt: 'Die Lit' },
  { src: `${IMG}/IMG_1099(1).jpg`, alt: 'Ampute Samurai' },
  { src: `${IMG}/IMG_1100(1).jpg`, alt: 'Odogwu in Repose' },
  { src: `${IMG}/IMG_1101(1).jpg`, alt: 'End of Days' },
]

const SLIDE_DUR = 6
const TOTAL = IMAGES.length * SLIDE_DUR
const IMAGE_COUNT = IMAGES.length

const FADE_IN_END = ((0.4 / TOTAL) * 100).toFixed(3)
const HOLD_END = (((SLIDE_DUR - 0.6) / TOTAL) * 100).toFixed(3)
const FADE_OUT_END = ((SLIDE_DUR / TOTAL) * 100).toFixed(3)

export function Hero() {
  const [counter, setCounter] = useState(1)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    intervalRef.current = setInterval(() => {
      setCounter((c) => (c % IMAGE_COUNT) + 1)
    }, SLIDE_DUR * 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <>
      {/* Parametric crossfade keyframes — percentages computed from timing
          constants, so these stay component-scoped (not in keyframes.css). */}
      <style>{`
        @keyframes cf-slide {
          0%                   { opacity: 0; }
          ${FADE_IN_END}%      { opacity: 1; }
          ${HOLD_END}%         { opacity: 1; }
          ${FADE_OUT_END}%     { opacity: 0; }
          100%                 { opacity: 0; }
        }

        @keyframes kb-zoom-out {
          from { transform: scale(1.10); }
          to   { transform: scale(1.00); }
        }

        @keyframes title-show {
          0%                              { opacity: 0; transform: translateY(18px); }
          3%                              { opacity: 1; transform: translateY(0);    }
          ${(((SLIDE_DUR * 0.75) / TOTAL) * 100).toFixed(3)}%  { opacity: 1; }
          ${(((SLIDE_DUR * 0.95) / TOTAL) * 100).toFixed(3)}%  { opacity: 0; transform: translateY(-8px); }
          100%                            { opacity: 0; }
        }

        @keyframes box-open {
          from { height: 100%; }
          to   { height: 9vh;  }
        }

        @keyframes scroll-pulse {
          0%, 100% { transform: scaleY(1);   opacity: 0.45; }
          50%      { transform: scaleY(0.4); opacity: 0.15; }
        }

        @keyframes corner-in      { to { opacity: 0.4;  } }
        @keyframes fade-in-delay  { to { opacity: 0.45; } }

        /*
          Anamorphic knob blur:
          SVG feGaussianBlur with stdDeviationX >> stdDeviationY
          creates the horizontal oval stretch of a real anamorphic lens.
          The radial mask keeps the center of frame sharp.
        */
        .anamorphic-blur {
          position: absolute;
          inset: 0;
          z-index: 4;
          pointer-events: none;
          filter: url(#anamorphic);
          /* Radial mask: sharp center, blurred at left/right edges */
          -webkit-mask-image: radial-gradient(
            ellipse 55% 80% at 50% 50%,
            transparent 0%,
            transparent 35%,
            rgba(0,0,0,0.2) 55%,
            rgba(0,0,0,0.6) 70%,
            rgba(0,0,0,1)   100%
          );
          mask-image: radial-gradient(
            ellipse 55% 80% at 50% 50%,
            transparent 0%,
            transparent 35%,
            rgba(0,0,0,0.2) 55%,
            rgba(0,0,0,0.6) 70%,
            rgba(0,0,0,1)   100%
          );
        }
      `}</style>

      {/* ── SVG filter definition (hidden, referenced by CSS) ── */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <filter
            id="anamorphic"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            colorInterpolationFilters="sRGB"
          >
            {/*
              stdDeviation="28 2":
                X=28 → heavy horizontal smear (anamorphic bokeh stretch)
                Y=2  → barely any vertical blur (lens stays "tall")
              This mimics the oval out-of-focus discs you see on Cooke/Hawk anamorphic glass.
            */}
            <feGaussianBlur stdDeviation="28 2" />
          </filter>
        </defs>
      </svg>

      <section
        style={{
          position: 'relative',
          width: '100%',
          height: '100svh',
          overflow: 'hidden',
          background: '#0a0a0f',
        }}
      >
        {/* ── Slide stack ── */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          {IMAGES.map(({ src, alt }, i) => (
            <div
              key={src}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0,
                animation: `cf-slide ${TOTAL}s ${i * SLIDE_DUR}s linear infinite`,
              }}
            >
              <Image
                src={src}
                alt={alt}
                fill
                sizes="100vw"
                priority={i === 0}
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
                  transformOrigin: 'center center',
                  animation: `kb-zoom-out ${SLIDE_DUR}s ${i * SLIDE_DUR}s ease-out infinite`,
                }}
              />
            </div>
          ))}
        </div>

        {/* ── Dark gradient overlay ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            background:
              'linear-gradient(180deg, rgba(10,10,15,0.50) 0%, rgba(10,10,15,0.08) 35%, rgba(10,10,15,0.08) 65%, rgba(10,10,15,0.65) 100%)',
          }}
        />

        {/* ── Scan lines ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 3,
            pointerEvents: 'none',
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.025) 3px, rgba(0,0,0,0.025) 4px)',
          }}
        />

        {/* ── Anamorphic lens blur (the knob effect) ── */}
        <div className="anamorphic-blur" />

        {/* ── Frame corners ── */}
        {(['tl', 'tr', 'bl', 'br'] as const).map((pos) => (
          <div
            key={pos}
            style={{
              position: 'absolute',
              zIndex: 16,
              width: 36,
              height: 36,
              opacity: 0,
              animation: 'corner-in 1s 1.2s ease forwards',
              ...(pos.includes('t') ? { top: '11vh' } : { bottom: '11vh' }),
              ...(pos.includes('l') ? { left: '2.5vw' } : { right: '2.5vw' }),
              borderTop: pos.includes('t') ? '1px solid #c9a96e' : undefined,
              borderBottom: pos.includes('b') ? '1px solid #c9a96e' : undefined,
              borderLeft: pos.includes('l') ? '1px solid #c9a96e' : undefined,
              borderRight: pos.includes('r') ? '1px solid #c9a96e' : undefined,
            }}
          />
        ))}

        {/* ── Title ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 15,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 2rem',
            opacity: 0,
            animation: `title-show ${TOTAL}s 0.5s ease forwards`,
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-cinzel), serif',
              fontSize: 'clamp(0.55rem, 1.2vw, 0.75rem)',
              letterSpacing: '0.38em',
              color: '#c9a96e',
              textTransform: 'uppercase',
              marginBottom: '1.6rem',
              opacity: 0.85,
            }}
          >
            The Art of
          </p>

          <h1
            style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontSize: 'clamp(3.2rem, 9vw, 8rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: '#f5efe6',
              lineHeight: 0.92,
              textAlign: 'center',
              letterSpacing: '-0.01em',
              textShadow: '0 4px 60px rgba(0,0,0,0.6)',
            }}
          >
            Boanerges
            <br />
            <span style={{ fontStyle: 'normal', fontWeight: 600, color: '#e8d5a3' }}>
              Collection
            </span>
          </h1>

          <div
            style={{
              width: 1,
              height: 52,
              background: 'linear-gradient(to bottom, transparent, #c9a96e, transparent)',
              margin: '2.2rem auto',
              opacity: 0.6,
            }}
          />

          <p
            style={{
              fontFamily: 'var(--font-cinzel), serif',
              fontSize: 'clamp(0.6rem, 1.4vw, 0.85rem)',
              letterSpacing: '0.3em',
              color: 'rgba(245,239,230,0.55)',
              textTransform: 'uppercase',
              textAlign: 'center',
            }}
          >
            Where Vision Becomes Form
          </p>
        </div>

        {/* ── Slide counter ── */}
        <div
          style={{
            position: 'absolute',
            bottom: '5vh',
            right: '3vw',
            zIndex: 16,
            fontFamily: 'var(--font-cinzel), serif',
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            color: 'rgba(201,169,110,0.5)',
            opacity: 0,
            animation: 'corner-in 1s 1.6s ease forwards',
          }}
        >
          {String(counter).padStart(2, '0')} / {String(IMAGE_COUNT).padStart(2, '0')}
        </div>

        {/* ── Scroll cue ── */}
        <div
          style={{
            position: 'absolute',
            bottom: '5vh',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 15,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            opacity: 0,
            animation: 'fade-in-delay 1s 2.4s ease forwards',
          }}
        >
          <div
            style={{
              width: 1,
              height: 44,
              background: '#c9a96e',
              transformOrigin: 'top',
              animation: 'scroll-pulse 2s ease-in-out infinite',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-cinzel), serif',
              fontSize: '0.52rem',
              letterSpacing: '0.28em',
              color: '#c9a96e',
              textTransform: 'uppercase',
            }}
          >
            Scroll
          </span>
        </div>
      </section>
    </>
  )
}
