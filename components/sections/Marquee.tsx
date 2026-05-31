'use client'

export function Marquee() {
  const items = [
    'THE LION',
    'THE CROWN',
    'THE ALTAR',
    '333 EDITIONS',
    'A BLIND DROP',
    'BOANERGES',
    '2025',
    'LAGOS',
    'NIGERIA',
    'A ROYAL PRIESTHOOD',
  ]

  return (
    <section className="border-t border-b border-border-default bg-panel py-3.5 overflow-hidden">
      <div className="flex items-center">
        {/* Animated scroll container */}
        <div
          className="flex gap-4 animate-scroll-slow"
          style={{ animation: 'scroll-slow 22s linear infinite' }}
        >
          {/* First set */}
          {[...items, ...items].map((item, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static decorative marquee — items are intentionally duplicated and never reordered
            <div key={`${item}-${i}`} className="flex items-center gap-4 whitespace-nowrap">
              <span
                className="font-bebas text-muted"
                style={{
                  fontSize: '13px',
                  letterSpacing: '0.2em',
                }}
              >
                {item}
              </span>
              <div
                className="w-1 h-1 rounded-full bg-blue-bright opacity-60"
                style={{ width: '4px', height: '4px' }}
              />
            </div>
          ))}
        </div>

        {/* Second set for seamless loop (duplicated for CSS animation) */}
        <div
          className="flex gap-4 animate-scroll-slow"
          style={{ animation: 'scroll-slow 22s linear infinite' }}
        >
          {[...items, ...items].map((item, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static decorative marquee — items are intentionally duplicated and never reordered
            <div key={`${item}-dup-${i}`} className="flex items-center gap-4 whitespace-nowrap">
              <span
                className="font-bebas text-muted"
                style={{
                  fontSize: '13px',
                  letterSpacing: '0.2em',
                }}
              >
                {item}
              </span>
              <div className="w-1 h-1 rounded-full bg-blue-bright opacity-60" />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        div:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}
