import Image from 'next/image'
import Link from 'next/link'

interface SiteTopBarProps {
  /** Breadcrumb shown in the centre, e.g. "THE COLLECTION" or "GALLERY" */
  crumb?: string
}

function LionMark() {
  return (
    <Image
      src="/images/logo-white.png"
      alt=""
      width={44}
      height={30}
      aria-hidden="true"
      style={{ display: 'block' }}
    />
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
        <LionMark />
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
