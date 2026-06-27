'use client'

import { useEffect, useState } from 'react'

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

function LiveStamp() {
  const [stamp, setStamp] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setStamp(`${MONTHS[now.getMonth()]} · ${now.getFullYear()}`)
    }
    update()

    // Recalculate at midnight so the month/year flips without a refresh
    const msUntilMidnight = () => {
      const now = new Date()
      return (
        new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime()
      )
    }
    const timeout = setTimeout(() => {
      update()
    }, msUntilMidnight())

    return () => clearTimeout(timeout)
  }, [])

  if (!stamp) return null

  return (
    <span className="font-bebas text-gold" style={{ fontSize: '13px', letterSpacing: '0.2em' }}>
      {stamp}
    </span>
  )
}

const STATIC_ITEMS = [
  'NWUNYE ODOGWU',
  'PANIC',
  'AFRICAN COWBOY',
  '333 EDITIONS',
  'A BLIND DROP',
  'BOANERGES',
  'A ROYAL PRIESTHOOD',
]

// Sentinel value — rendered as <LiveStamp /> instead of plain text
const LIVE_MARKER = '__LIVE__'

const ITEMS = [...STATIC_ITEMS, LIVE_MARKER]

function MarqueeItem({ item }: { item: string }) {
  return (
    <div className="flex items-center gap-4 whitespace-nowrap">
      {item === LIVE_MARKER ? (
        <LiveStamp />
      ) : (
        <span
          className="font-bebas text-muted"
          style={{ fontSize: '13px', letterSpacing: '0.2em' }}
        >
          {item}
        </span>
      )}
      <div
        className="rounded-full bg-blue-bright opacity-60"
        style={{ width: '4px', height: '4px' }}
      />
    </div>
  )
}

export function Marquee() {
  const looped = [...ITEMS, ...ITEMS]

  return (
    <section className="border-t border-b border-border-default bg-panel py-3.5 overflow-hidden">
      <div className="flex items-center">
        <div
          className="marquee-track flex gap-4"
          style={{ animation: 'scroll-slow 26s linear infinite' }}
        >
          {looped.map((item, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: decorative marquee — items duplicated intentionally
            <MarqueeItem key={`a-${i}`} item={item} />
          ))}
        </div>

        <div
          className="marquee-track flex gap-4"
          style={{ animation: 'scroll-slow 26s linear infinite' }}
        >
          {looped.map((item, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: decorative marquee — items duplicated intentionally
            <MarqueeItem key={`b-${i}`} item={item} />
          ))}
        </div>
      </div>

      <style>{`
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}
