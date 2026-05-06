'use client'

import { useEffect, useState } from 'react'

interface NavbarProps {
  onMenuClick: () => void
  cartCount: number
}

export function Navbar({ onMenuClick, cartCount }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [countdown, setCountdown] = useState({
    days: 4,
    hours: 11,
    minutes: 30,
    seconds: 0,
  })

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrolled(currentScrollY > 60)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        let { days, hours, minutes, seconds } = prev
        seconds--

        if (seconds < 0) {
          seconds = 59
          minutes--
        }
        if (minutes < 0) {
          minutes = 59
          hours--
        }
        if (hours < 0) {
          hours = 23
          days--
        }
        if (days < 0) {
          return { days: 0, hours: 0, minutes: 0, seconds: 0 }
        }

        return { days, hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-14 transition-all duration-300 ${
        scrolled
          ? 'bg-black/92 backdrop-blur-2xl border-b border-border-default'
          : 'bg-transparent'
      }`}
    >
      <div className="h-full px-6 flex items-center justify-between max-w-6xl mx-auto w-full">
        {/* Logo - Left */}
        <div className="flex items-center gap-3 h-full group">
          {/* Lion SVG Logo */}
          <svg
            width="28"
            height="28"
            viewBox="0 0 40 40"
            className="mb-0.5 group-hover:drop-shadow-lg transition-all duration-300"
            style={{
              animation: 'pulseGlow 4s ease-in-out infinite',
              filter: 'drop-shadow(0 0 8px rgba(37,99,235,0.4))',
            }}
          >
            <defs>
              <style>{`
                @keyframes pulseGlow {
                  0%, 100% { filter: drop-shadow(0 0 8px rgba(37,99,235,0.4)); }
                  50% { filter: drop-shadow(0 0 16px rgba(59,130,246,0.85)); }
                }
              `}</style>
            </defs>
            {/* Outer ring */}
            <circle cx="20" cy="20" r="19" fill="none" stroke="#2563eb" strokeWidth="0.7" opacity="0.2" />

            {/* Lion head and body outline */}
            <path
              d="M 20 8 Q 28 8 32 14 Q 35 20 32 26 Q 28 32 20 33 Q 12 32 8 26 Q 5 20 8 14 Q 12 8 20 8"
              fill="none"
              stroke="#2563eb"
              strokeWidth="1.2"
              opacity="0.7"
            />

            {/* Mane spikes */}
            <line x1="15" y1="10" x2="14" y2="6" stroke="#2563eb" strokeWidth="0.7" opacity="0.7" />
            <line x1="20" y1="9" x2="20" y2="4" stroke="#2563eb" strokeWidth="0.8" opacity="0.8" />
            <line x1="25" y1="10" x2="26" y2="6" stroke="#2563eb" strokeWidth="0.7" opacity="0.7" />

            {/* Face/eye area */}
            <circle cx="17" cy="19" r="1.5" fill="none" stroke="#2563eb" strokeWidth="0.7" opacity="0.6" />
            <circle cx="23" cy="19" r="1.5" fill="none" stroke="#2563eb" strokeWidth="0.7" opacity="0.6" />

            {/* Chin/beard gold accent */}
            <path
              d="M 18 28 Q 20 30 22 28"
              fill="none"
              stroke="#c9a84c"
              strokeWidth="0.8"
              opacity="0.7"
            />
          </svg>

          <div className="flex flex-col leading-none">
            <span className="font-bebas text-sm tracking-wide" style={{ letterSpacing: '0.12em' }}>
              DIPBLU
            </span>
            <span className="font-dancing text-xs text-blue-bright hidden sm:block" style={{ fontSize: '10px' }}>
              A Royal Priesthood
            </span>
          </div>
        </div>

        {/* Countdown - Center (hidden on mobile) */}
        <div className="hidden sm:flex flex-col items-center gap-0 text-sm">
          <span className="text-muted-2" style={{ fontSize: '9px', letterSpacing: '0.2em' }}>
            DROP ENDS IN
          </span>
          <div className="flex items-baseline gap-2" style={{ fontSize: '16px' }}>
            <span className="font-bebas tracking-wider">{pad(countdown.days)}</span>
            <span className="font-barlow text-xs text-blue-bright" style={{ letterSpacing: '0.06em' }}>
              D
            </span>
            <span className="font-bebas tracking-wider">{pad(countdown.hours)}</span>
            <span className="font-barlow text-xs text-blue-bright" style={{ letterSpacing: '0.06em' }}>
              H
            </span>
            <span className="font-bebas tracking-wider">{pad(countdown.minutes)}</span>
            <span className="font-barlow text-xs text-blue-bright" style={{ letterSpacing: '0.06em' }}>
              M
            </span>
            <span className="font-bebas tracking-wider">{pad(countdown.seconds)}</span>
            <span className="font-barlow text-xs text-blue-bright" style={{ letterSpacing: '0.06em' }}>
              S
            </span>
          </div>
        </div>

        {/* Right side - Region selector & Bag & Menu */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Region selector (hidden on mobile) */}
          <button
            className="hidden sm:block text-muted text-xs hover:text-blue-bright transition-colors"
            style={{ letterSpacing: '0.2em' }}
          >
            NIGERIA · NGN ▾
          </button>

          {/* Bag button */}
          <button
            onClick={onMenuClick}
            className="flex items-center gap-2 border border-border-default hover:border-blue-bright transition-colors px-2 py-1 rounded-sm"
            style={{ fontSize: '10px', letterSpacing: '0.18em' }}
          >
            <span>BAG</span>
            <span className="font-bebas text-blue-bright" style={{ fontSize: '11px' }}>
              [{cartCount}]
            </span>
          </button>

          {/* Hamburger menu */}
          <button
            onClick={onMenuClick}
            className="flex flex-col gap-1 hover:opacity-60 transition-opacity"
            style={{ width: '22px', height: '14px' }}
          >
            <div className="h-px bg-white w-full" />
            <div className="h-px bg-white w-3/5 transition-all" />
            <div className="h-px bg-white w-full" />
          </button>
        </div>
      </div>
    </nav>
  )
}
