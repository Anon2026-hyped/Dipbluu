'use client'

import { useEffect, useState } from 'react'

const SLIDES = [
  {
    gradient: 'radial-gradient(ellipse at 40% 30%, #1a0a00, #000)',
    ringColor: '#2563eb',
    accentColor: '#3b82f6',
  },
  {
    gradient: 'radial-gradient(ellipse at 55% 35%, #001035, #000)',
    ringColor: '#2563eb',
    accentColor: '#3b82f6',
  },
  {
    gradient: 'radial-gradient(ellipse at 62% 28%, #0a1a08, #000)',
    ringColor: '#c9a84c',
    accentColor: '#c9a84c',
  },
]

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setAnimated(true)
  }, [])

  const slide = SLIDES[currentSlide]

  return (
    <section
      className="relative w-full min-h-fit py-20 sm:py-32 overflow-hidden bg-black"
      style={{
        background: slide.gradient,
        transition: 'all 1.8s ease',
      }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.1) 100%)',
        }}
      />

      {/* animations moved to Tailwind config - use animate-* classes below */}

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center px-6 sm:px-12 text-center">
        {/* Eyebrow */}
        <div className="mb-8 flex items-center gap-4 justify-center opacity-0 animate-fade-in-up delay-100">
          <div className="w-7 h-px bg-blue-bright" />
          <span
            className="font-barlow text-muted-2 text-xs"
            style={{ letterSpacing: '0.38em' }}
          >
            A BLIND DROP EVENT
          </span>
          <div className="w-7 h-px bg-blue-bright" />
        </div>

        {/* Headline */}
        <div className="mb-8 max-w-4xl">
          {['A', 'ROYAL', 'PRIEST', 'HOOD'].map((word, i) => (
            <div
              key={word}
              className="font-bebas text-white overflow-hidden animate-clip-up"
              style={{
                fontSize: 'clamp(72px, 14vw, 160px)',
                lineHeight: '0.86',
                letterSpacing: '0.02em',
                animationDelay: `${0.3 + i * 0.15}s`,
              }}
            >
              {i === 3 ? (
                <span
                  style={{
                    WebkitTextStroke: '1px rgba(255, 255, 255, 0.3)',
                    color: 'transparent',
                    display: 'block',
                  }}
                >
                  {word}
                </span>
              ) : i === 1 ? (
                <span 
                  className="block text-[#3b82f6] animate-glow-pulse"
                  style={{ textShadow: '0 0 20px rgba(59, 130, 246, 0.5)' }}
                >
                  {word}
                </span>
              ) : (
                <span className="block">{word}</span>
              )}
            </div>
          ))}
        </div>

        {/* Subtext */}
        <p
          className="font-garamond italic text-white/55 max-w-2xl mb-10 opacity-0 animate-fade-in-up"
          style={{ fontSize: 'clamp(16px, 2vw, 18px)', lineHeight: '1.7', animationDelay: '0.4s' }}
        >
          Three works. One blind draw. The Lion, The Crown, and The Altar — available now.
        </p>

        {/* CTA Row */}
        <div className="flex gap-6 mb-10 justify-center opacity-0 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <button
            className="group border border-blue-bright text-blue-bright px-8 py-4 font-barlow transition-all duration-300 flex items-center gap-2 relative overflow-hidden"
            style={{
              fontSize: '11px',
              letterSpacing: '0.22em',
              background: 'linear-gradient(135deg, transparent 0%, rgba(59, 130, 246, 0.05) 50%, transparent 100%)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 28px rgba(59, 130, 246, 0.5), inset 0 0 28px rgba(59, 130, 246, 0.15)';
              e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0px transparent';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            ACQUIRE NOW →
          </button>
          <button
            className="text-white/40 hover:text-white font-barlow transition-all duration-300 text-xs relative group"
            style={{ letterSpacing: '0.22em' }}
          >
            VIEW THE WORKS
            <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-blue-bright to-transparent group-hover:w-full transition-all duration-300" />
          </button>
        </div>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`transition-all duration-300 cursor-pointer ${
              i === currentSlide 
                ? 'bg-blue-bright w-12 h-px shadow-lg' 
                : 'bg-white/20 w-7 h-px hover:bg-white/40'
            }`}
            style={{
              boxShadow: i === currentSlide ? '0 0 12px rgba(59, 130, 246, 0.4)' : 'none',
            }}
          />
        ))}
      </div>
    </section>
  )
}
