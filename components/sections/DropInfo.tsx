'use client'

import { useEffect, useRef, useState } from 'react'

export function DropInfo() {
  const [displayStats, setDisplayStats] = useState({
    claimed: 0,
    editions: 0,
    works: 0,
  })
  const statsRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          let frame = 0
          const frames = 90
          const interval = setInterval(() => {
            frame++
            const progress = frame / frames
            setDisplayStats({
              claimed: Math.floor(62 * progress),
              editions: Math.floor(1110 * progress),
              works: Math.floor(10 * progress),
            })
            if (frame >= frames) {
              clearInterval(interval)
              setDisplayStats({ claimed: 62, editions: 1110, works: 10 })
            }
          }, 16)
        }
      },
      { threshold: 0.5 },
    )

    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="drop"
      ref={statsRef}
      className="grid grid-cols-1 md:grid-cols-2 gap-20 px-6 sm:px-12 py-20 max-w-6xl mx-auto border-b border-border-default"
    >
      {/* Left Column - Stats */}
      <div className="flex flex-col gap-0">
        {/* Stat 1 */}
        <div className="border-b border-border-blue pb-8 mb-8">
          <div
            className="font-bebas text-white mb-2"
            style={{
              fontSize: 'clamp(56px, 9vw, 96px)',
              letterSpacing: '0.04em',
            }}
          >
            {displayStats.claimed}
          </div>
          <div
            className="font-barlow text-muted"
            style={{ fontSize: '10px', letterSpacing: '0.32em' }}
          >
            PIECES CLAIMED
          </div>
        </div>

        {/* Stat 2 */}
        <div className="border-b border-border-blue pb-8 mb-8">
          <div
            className="font-bebas text-white mb-2"
            style={{
              fontSize: 'clamp(56px, 9vw, 96px)',
              letterSpacing: '0.04em',
            }}
          >
            {displayStats.editions}
          </div>
          <div
            className="font-barlow text-muted"
            style={{ fontSize: '10px', letterSpacing: '0.32em' }}
          >
            TOTAL EDITIONS
          </div>
        </div>

        {/* Stat 3 */}
        <div>
          <div
            className="font-bebas text-white mb-2"
            style={{
              fontSize: 'clamp(56px, 9vw, 96px)',
              letterSpacing: '0.04em',
            }}
          >
            {displayStats.works}
          </div>
          <div
            className="font-barlow text-muted"
            style={{ fontSize: '10px', letterSpacing: '0.32em' }}
          >
            WORKS IN DROP
          </div>
        </div>
      </div>

      {/* Right Column - Description */}
      <div>
        <div
          className="font-barlow text-blue-bright mb-4"
          style={{ fontSize: '10px', letterSpacing: '0.32em' }}
        >
          THE DROP · SERIES I
        </div>

        <div
          className="font-cinzel text-white mb-8"
          style={{
            fontSize: '15px',
            letterSpacing: '0.18em',
          }}
        >
          10 WORKS · 1,110 TOTAL EDITIONS · ₦33,333 EACH
        </div>

        <p
          className="font-garamond italic text-white/78 mb-8 max-w-md"
          style={{
            fontSize: 'clamp(18px, 2vw, 21px)',
            lineHeight: '1.8',
          }}
        >
          Last month, I unveiled three new works as part of my latest collection. The Lion, The
          Crown, and The Altar — collectively forming the brotherhood, now sit at the centre of this
          blind drop.
        </p>

        {/* Work chips */}
        <div className="flex flex-wrap gap-3">
          {['THE LION', 'THE CROWN', 'THE ALTAR'].map((work) => (
            <button
              type="button"
              key={work}
              className="border border-gold/30 text-gold/75 hover:border-gold hover:bg-gold-dim px-3 py-2 transition-colors"
              style={{
                fontSize: '9.5px',
                letterSpacing: '0.2em',
              }}
            >
              {work}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
