'use client'

import { useEffect, useState } from 'react'

// Keyframes (pulseGlow, shimmerLine, tickFlash) live in animations/keyframes.css.

interface NavbarProps {
  onCartClick: () => void
  onMenuClick: () => void
  cartCount: number
  isMenuOpen?: boolean
}

/* ── Lion Sigil ── */
function LionSigil() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      style={{ animation: 'pulseGlow 4s ease-in-out infinite', display: 'block' }}
    >
      {/* rings */}
      <circle cx="20" cy="20" r="18" stroke="rgba(37,99,235,0.18)" strokeWidth="0.6" />
      <circle
        cx="20"
        cy="20"
        r="15"
        stroke="rgba(37,99,235,0.12)"
        strokeWidth="0.5"
        strokeDasharray="2 3"
      />

      {/* mane outline */}
      <path
        d="M20 5 Q29 5 34 13 Q38 20 34 27 Q29 35 20 35 Q11 35 6 27 Q2 20 6 13 Q11 5 20 5"
        fill="none"
        stroke="rgba(37,99,235,0.5)"
        strokeWidth="0.8"
      />

      {/* mane spikes */}
      <line
        x1="14"
        y1="7.5"
        x2="12.5"
        y2="3.5"
        stroke="rgba(37,99,235,0.6)"
        strokeWidth="0.7"
        strokeLinecap="round"
      />
      <line
        x1="20"
        y1="6"
        x2="20"
        y2="1.5"
        stroke="rgba(59,130,246,0.75)"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
      <line
        x1="26"
        y1="7.5"
        x2="27.5"
        y2="3.5"
        stroke="rgba(37,99,235,0.6)"
        strokeWidth="0.7"
        strokeLinecap="round"
      />
      <line
        x1="10.5"
        y1="12"
        x2="7.5"
        y2="9"
        stroke="rgba(37,99,235,0.4)"
        strokeWidth="0.6"
        strokeLinecap="round"
      />
      <line
        x1="29.5"
        y1="12"
        x2="32.5"
        y2="9"
        stroke="rgba(37,99,235,0.4)"
        strokeWidth="0.6"
        strokeLinecap="round"
      />

      {/* face */}
      <ellipse
        cx="20"
        cy="21"
        rx="7.5"
        ry="8"
        fill="none"
        stroke="rgba(59,130,246,0.32)"
        strokeWidth="0.6"
      />

      {/* eyes */}
      <circle
        cx="17"
        cy="19.5"
        r="1.4"
        fill="none"
        stroke="rgba(59,130,246,0.7)"
        strokeWidth="0.7"
      />
      <circle
        cx="23"
        cy="19.5"
        r="1.4"
        fill="none"
        stroke="rgba(59,130,246,0.7)"
        strokeWidth="0.7"
      />
      <circle cx="17" cy="19.5" r="0.45" fill="rgba(59,130,246,0.6)" />
      <circle cx="23" cy="19.5" r="0.45" fill="rgba(59,130,246,0.6)" />

      {/* nose */}
      <path
        d="M19 22.5 L20 23.5 L21 22.5"
        fill="none"
        stroke="rgba(59,130,246,0.5)"
        strokeWidth="0.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* gold chin / beard */}
      <path
        d="M16.5 27.5 Q20 30 23.5 27.5"
        fill="none"
        stroke="rgba(201,168,76,0.65)"
        strokeWidth="0.85"
        strokeLinecap="round"
      />
      <path
        d="M14 25 Q15.5 27 17 26"
        fill="none"
        stroke="rgba(201,168,76,0.32)"
        strokeWidth="0.6"
        strokeLinecap="round"
      />
      <path
        d="M26 25 Q24.5 27 23 26"
        fill="none"
        stroke="rgba(201,168,76,0.32)"
        strokeWidth="0.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

/* ── Countdown digit unit ── */
function CdUnit({ value, label, flash }: { value: string; label: string; flash: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginRight: 8 }}>
      <span
        style={{
          fontFamily: 'var(--font-bebas), sans-serif',
          fontSize: 17,
          letterSpacing: '0.04em',
          lineHeight: 1,
          minWidth: 20,
          textAlign: 'center',
          color: flash ? '#ffffff' : '#e8efff',
          transition: 'color 0.15s',
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-barlow), sans-serif',
          fontWeight: 300,
          fontSize: 8,
          letterSpacing: '0.18em',
          color: 'rgba(59,130,246,0.65)',
          lineHeight: 1,
        }}
      >
        {label}
      </span>
    </div>
  )
}

/* ── Cart icon ── */
function CartIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 3h2l.9 2.7" stroke="#3b82f6" strokeWidth="1.4" strokeLinecap="round" />
      <path
        d="M5.9 5.7h13.6L18 14.7H8.4L5.9 5.7Z"
        stroke="#3b82f6"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="19" r="1" fill="#3b82f6" />
      <circle cx="17" cy="19" r="1" fill="#3b82f6" />
    </svg>
  )
}

/* ══════════════════════════════════════════════════════════════
   MAIN NAVBAR
══════════════════════════════════════════════════════════════ */
export function Navbar({ onCartClick, onMenuClick, cartCount, isMenuOpen = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuHover, setMenuHover] = useState(false)
  const [flashSecs, setFlashSecs] = useState(false)
  const [countdown, setCountdown] = useState({ days: 4, hours: 11, minutes: 30, seconds: 0 })

  /* scroll detection */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* countdown */
  useEffect(() => {
    const interval = setInterval(() => {
      setFlashSecs(true)
      setTimeout(() => setFlashSecs(false), 160)

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
        if (days < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
        return { days, hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')

  /* ── styles ── */
  const navStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    height: 64,
    display: 'flex',
    alignItems: 'stretch',
    transition: 'background 0.35s ease, border-color 0.35s ease, backdrop-filter 0.35s ease',
    borderBottom: scrolled ? '0.5px solid rgba(37,99,235,0.18)' : '0.5px solid transparent',
    background: scrolled ? 'rgba(4,8,16,0.88)' : 'transparent',
    backdropFilter: scrolled ? 'blur(20px)' : 'none',
    WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
  }

  /* shimmer top line — always present, more visible when scrolled */
  const shimmerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    background:
      'linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.5) 35%, rgba(201,168,76,0.45) 58%, transparent 100%)',
    animation: 'shimmerLine 6s ease-in-out infinite',
    opacity: scrolled ? 1 : 0,
    transition: 'opacity 0.4s ease',
    pointerEvents: 'none',
  }

  const innerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 clamp(16px, 4vw, 28px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    height: '100%',
  }

  return (
    <nav style={navStyle} aria-label="Main navigation">
      {/* shimmer top accent */}
      <div style={shimmerStyle} aria-hidden="true" />

      <div style={innerStyle}>
        {/* ── LOGO ── */}
        <a
          href="/"
          aria-label="Boanerges home"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <LionSigil />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, gap: 3 }}>
            <span
              style={{
                fontFamily: 'var(--font-bebas), sans-serif',
                fontSize: 20,
                letterSpacing: '0.18em',
                color: '#f0f4ff',
                lineHeight: 1,
              }}
            >
              BOANERGES
            </span>
            <span
              className="hidden sm:block"
              style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 10,
                letterSpacing: '0.22em',
                color: 'rgba(201,168,76,0.8)',
                lineHeight: 1,
              }}
            >
              A Royal Priesthood
            </span>
          </div>
        </a>

        {/* ── CENTRE NAV (lg+) ──
           Display is controlled by the `hidden lg:flex` classes, NOT inline,
           otherwise an inline `display: flex` would override `.hidden` and
           leak the links onto mobile. */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            alignItems: 'center',
            gap: 36,
          }}
          className="hidden lg:flex"
        >
          {(
            [
              { label: 'WORKS', href: '#works' },
              { label: 'DROP', href: '#drop' },
              { label: 'CONTACT', href: '#contact' },
            ] as const
          ).map(({ label, href }) => (
            <a
              key={label}
              href={href}
              style={{
                fontFamily: 'var(--font-barlow), sans-serif',
                fontWeight: 400,
                fontSize: 10,
                letterSpacing: '0.3em',
                color: 'rgba(180,195,230,0.55)',
                textDecoration: 'none',
                position: 'relative',
                paddingBottom: 2,
                transition: 'color 0.25s',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.color = '#94b8f8'
                const bar = e.currentTarget.querySelector('span') as HTMLSpanElement
                if (bar) bar.style.width = '100%'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.color = 'rgba(180,195,230,0.55)'
                const bar = e.currentTarget.querySelector('span') as HTMLSpanElement
                if (bar) bar.style.width = '0%'
              }}
            >
              {label}
              {/* sliding underline */}
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '0%',
                  height: 1,
                  background: 'rgba(59,130,246,0.75)',
                  transition: 'width 0.3s cubic-bezier(.4,0,.2,1)',
                  display: 'block',
                }}
              />
            </a>
          ))}
        </div>

        {/* ── RIGHT CLUSTER ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {/* Countdown (lg+ — kept off phones to avoid clutter; also lives in the Drop section) */}
          <div
            className="hidden lg:flex"
            style={{ flexDirection: 'column', alignItems: 'center', gap: 3 }}
            role="timer"
            aria-label="Drop countdown"
          >
            <span
              style={{
                fontFamily: 'var(--font-barlow), sans-serif',
                fontSize: 8,
                letterSpacing: '0.28em',
                color: 'rgba(148,184,248,0.4)',
                fontWeight: 400,
              }}
            >
              DROP ENDS IN
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <CdUnit value={pad(countdown.days)} label="D" flash={false} />
              <Dot />
              <CdUnit value={pad(countdown.hours)} label="H" flash={false} />
              <Dot />
              <CdUnit value={pad(countdown.minutes)} label="M" flash={false} />
              <Dot />
              <CdUnit value={pad(countdown.seconds)} label="S" flash={flashSecs} />
            </div>
          </div>

          {/* Divider */}
          <div
            className="hidden lg:block"
            style={{ width: 1, height: 18, background: 'rgba(59,130,246,0.13)' }}
            aria-hidden="true"
          />

          {/* Region (lg+) */}
          <button
            type="button"
            className="hidden lg:block"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-barlow), sans-serif',
              fontSize: 9,
              letterSpacing: '0.22em',
              color: 'rgba(148,184,248,0.38)',
              padding: 0,
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(148,184,248,0.8)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(148,184,248,0.38)'
            }}
            aria-label="Change region"
          >
            NIGERIA · NGN ▾
          </button>

          {/* Cart */}
          <button
            onClick={onCartClick}
            type="button"
            aria-label={`Open cart, ${cartCount} item${cartCount !== 1 ? 's' : ''}`}
            style={{
              background: 'none',
              border: '0.5px solid rgba(59,130,246,0.22)',
              cursor: 'pointer',
              padding: '6px 12px',
              minHeight: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 7,
              borderRadius: 2,
              transition: 'border-color 0.2s, background 0.2s',
              position: 'relative',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.borderColor = 'rgba(59,130,246,0.6)'
              el.style.background = 'rgba(37,99,235,0.08)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.borderColor = 'rgba(59,130,246,0.22)'
              el.style.background = 'none'
            }}
          >
            <CartIcon />
            <span
              aria-hidden="true"
              style={{
                fontFamily: 'var(--font-bebas), sans-serif',
                fontSize: 12,
                color: '#3b82f6',
                letterSpacing: '0.08em',
                lineHeight: 1,
                minWidth: 10,
                textAlign: 'center',
              }}
            >
              {cartCount}
            </span>
          </button>

          {/* Hamburger — morphs to an X when the menu is open */}
          <button
            type="button"
            onClick={onMenuClick}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 44,
              minHeight: 44,
              padding: 0,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => {
              setMenuHover(true)
              ;(e.currentTarget as HTMLButtonElement).style.opacity = '0.65'
            }}
            onMouseLeave={(e) => {
              setMenuHover(false)
              ;(e.currentTarget as HTMLButtonElement).style.opacity = '1'
            }}
          >
            {/* fixed-size icon box so the bars can converge into an X */}
            <span
              aria-hidden="true"
              style={{ position: 'relative', display: 'block', width: 22, height: 14 }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: 1,
                  width: 22,
                  background: 'rgba(220,230,255,0.75)',
                  transformOrigin: 'center',
                  transform: isMenuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none',
                  transition: 'transform 0.3s cubic-bezier(.4,0,.2,1), width 0.25s ease',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 6.5,
                  height: 1,
                  width: isMenuOpen ? 22 : menuHover ? 22 : 14,
                  background: 'rgba(220,230,255,0.75)',
                  opacity: isMenuOpen ? 0 : 1,
                  transition: 'opacity 0.2s ease, width 0.25s ease',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 13,
                  height: 1,
                  width: 22,
                  background: 'rgba(220,230,255,0.75)',
                  transformOrigin: 'center',
                  transform: isMenuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none',
                  transition: 'transform 0.3s cubic-bezier(.4,0,.2,1), width 0.25s ease',
                }}
              />
            </span>
          </button>
        </div>
      </div>
    </nav>
  )
}

/* tiny dot separator between countdown units */
function Dot() {
  return (
    <span
      aria-hidden="true"
      style={{
        fontFamily: 'var(--font-barlow), sans-serif',
        fontSize: 10,
        color: 'rgba(59,130,246,0.22)',
        margin: '0 4px 0 -4px',
        alignSelf: 'center',
        lineHeight: 1,
      }}
    >
      ·
    </span>
  )
}
