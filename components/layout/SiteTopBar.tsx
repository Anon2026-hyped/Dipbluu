import Link from 'next/link'

interface SiteTopBarProps {
  /** Breadcrumb shown after the logo, e.g. "GALLERY" or "COLLECTION" */
  crumb?: string
}

export function SiteTopBar({ crumb }: SiteTopBarProps) {
  return (
    <nav
      className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border-default bg-black/90 px-6 backdrop-blur-xl sm:px-12"
      aria-label="Site navigation"
    >
      {/* Logo — always goes home */}
      <Link
        href="/"
        className="font-bebas text-lg text-white tracking-widest transition-opacity hover:opacity-70"
        style={{ letterSpacing: '0.18em' }}
      >
        BOANERGES
      </Link>

      {crumb && (
        <span
          className="absolute left-1/2 -translate-x-1/2 font-barlow text-muted"
          style={{ fontSize: '10px', letterSpacing: '0.32em' }}
        >
          {crumb}
        </span>
      )}

      <Link
        href="/"
        className="font-barlow text-blue-bright transition-opacity hover:opacity-70"
        style={{ fontSize: '10px', letterSpacing: '0.22em' }}
      >
        ← HOME
      </Link>
    </nav>
  )
}
