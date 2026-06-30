import Link from 'next/link'

interface SiteTopBarProps {
  /** Breadcrumb shown in the centre, e.g. "THE COLLECTION" or "GALLERY" */
  crumb?: string
}

function LionSigil() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <circle cx="20" cy="20" r="18" stroke="rgba(37,99,235,0.18)" strokeWidth="0.6" />
      <circle cx="20" cy="20" r="15" stroke="rgba(37,99,235,0.12)" strokeWidth="0.5" strokeDasharray="2 3" />
      <path
        d="M20 5 Q29 5 34 13 Q38 20 34 27 Q29 35 20 35 Q11 35 6 27 Q2 20 6 13 Q11 5 20 5"
        fill="none"
        stroke="rgba(37,99,235,0.5)"
        strokeWidth="0.8"
      />
      <line x1="14" y1="7.5" x2="12.5" y2="3.5" stroke="rgba(37,99,235,0.6)" strokeWidth="0.7" strokeLinecap="round" />
      <line x1="20" y1="6" x2="20" y2="1.5" stroke="rgba(59,130,246,0.75)" strokeWidth="0.9" strokeLinecap="round" />
      <line x1="26" y1="7.5" x2="27.5" y2="3.5" stroke="rgba(37,99,235,0.6)" strokeWidth="0.7" strokeLinecap="round" />
      <line x1="10.5" y1="12" x2="7.5" y2="9" stroke="rgba(37,99,235,0.4)" strokeWidth="0.6" strokeLinecap="round" />
      <line x1="29.5" y1="12" x2="32.5" y2="9" stroke="rgba(37,99,235,0.4)" strokeWidth="0.6" strokeLinecap="round" />
      <ellipse cx="20" cy="21" rx="7.5" ry="8" fill="none" stroke="rgba(59,130,246,0.32)" strokeWidth="0.6" />
      <circle cx="17" cy="19.5" r="1.4" fill="none" stroke="rgba(59,130,246,0.7)" strokeWidth="0.7" />
      <circle cx="23" cy="19.5" r="1.4" fill="none" stroke="rgba(59,130,246,0.7)" strokeWidth="0.7" />
      <circle cx="17" cy="19.5" r="0.45" fill="rgba(59,130,246,0.6)" />
      <circle cx="23" cy="19.5" r="0.45" fill="rgba(59,130,246,0.6)" />
      <path
        d="M19 22.5 L20 23.5 L21 22.5"
        fill="none"
        stroke="rgba(59,130,246,0.5)"
        strokeWidth="0.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M16.5 27.5 Q20 30 23.5 27.5" fill="none" stroke="rgba(201,168,76,0.65)" strokeWidth="0.85" strokeLinecap="round" />
      <path d="M14 25 Q15.5 27 17 26" fill="none" stroke="rgba(201,168,76,0.32)" strokeWidth="0.6" strokeLinecap="round" />
      <path d="M26 25 Q24.5 27 23 26" fill="none" stroke="rgba(201,168,76,0.32)" strokeWidth="0.6" strokeLinecap="round" />
    </svg>
  )
}

export function SiteTopBar({ crumb }: SiteTopBarProps) {
  return (
    <nav
      className="sticky top-0 z-40 flex items-center justify-between"
      style={{
        height: 64,
        padding: '0 clamp(16px, 4vw, 28px)',
        borderBottom: '0.5px solid rgba(37,99,235,0.18)',
        background: 'rgba(4,8,16,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
      aria-label="Site navigation"
    >
      {/* Shimmer top accent — matches scrolled Navbar */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background:
            'linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.5) 35%, rgba(201,168,76,0.45) 58%, transparent 100%)',
          animation: 'shimmerLine 6s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      {/* Logo — mirrors Navbar exactly */}
      <Link
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
      </Link>

      {/* Centred breadcrumb — hidden on narrow screens to avoid logo overlap */}
      {crumb && (
        <span
          aria-current="page"
          className="absolute left-1/2 hidden -translate-x-1/2 sm:block"
          style={{
            fontFamily: 'var(--font-barlow), sans-serif',
            fontSize: 10,
            letterSpacing: '0.32em',
            color: 'rgba(148,184,248,0.55)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          {crumb}
        </span>
      )}

      {/* Back link — styled to match the cart button in Navbar */}
      <Link
        href="/"
        className="flex items-center gap-1.5 rounded-sm border transition-all duration-200 hover:border-[rgba(59,130,246,0.6)] hover:bg-[rgba(37,99,235,0.08)] hover:text-blue-bright"
        style={{
          fontFamily: 'var(--font-barlow), sans-serif',
          fontSize: 10,
          letterSpacing: '0.22em',
          color: 'rgba(59,130,246,0.75)',
          textDecoration: 'none',
          borderColor: 'rgba(59,130,246,0.22)',
          padding: '6px 12px',
          minHeight: 36,
        }}
      >
        ← HOME
      </Link>
    </nav>
  )
}
