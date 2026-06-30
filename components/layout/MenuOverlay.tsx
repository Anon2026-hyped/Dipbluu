'use client'

import Image from 'next/image'
import { useEffect } from 'react'

interface MenuOverlayProps {
  isOpen: boolean
  onClose: () => void
}

const HERO_IMAGE = 'https://raw.githubusercontent.com/Anon2026-hyped/Boanerges/main/Hero(1).jpg'

const LINKS = [
  { label: 'HOME', href: '/' },
  { label: 'GALLERY', href: '/gallery' },
  { label: 'THE WORKS', href: '/#works' },
  { label: 'CURRENT DROP', href: '/#drop' },
  { label: 'ACQUIRE', href: '/#acquire' },
  { label: 'ABOUT', href: '/#about' },
  { label: 'QUESTIONS', href: '/#questions' },
  { label: 'CONTACT', href: '/#contact' },
]

const SOCIALS = [
  { label: 'INSTAGRAM', href: 'https://instagram.com/boanergizz', external: true },
  { label: 'EMAIL', href: 'mailto:bludeep4@gmail.com', external: false },
  // Replace the number below with the studio's WhatsApp line.
  { label: 'WHATSAPP', href: 'https://wa.me/2347041222119', external: true },
]

export function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close menu"
        tabIndex={isOpen ? 0 : -1}
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal={isOpen ? 'true' : undefined}
        aria-label="Navigation menu"
        aria-hidden={!isOpen}
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-sm flex-col overflow-y-auto border-border-blue border-l bg-near-black/95 backdrop-blur-xl transition-transform duration-500 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.77, 0, 0.175, 1)' }}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-sm border border-white/10 text-white/50 transition-all duration-300 hover:rotate-90 hover:border-blue-bright/40 hover:text-blue-bright"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <line x1="11" y1="1" x2="1" y2="11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </button>

        {/* Hero image */}
        <div className="relative h-56 w-full shrink-0 overflow-hidden">
          <Image src={HERO_IMAGE} alt="BOANERGES" fill sizes="384px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-near-black via-near-black/30 to-transparent" />
        </div>

        <div className="flex flex-1 flex-col px-7 pt-6 pb-10">
          {/* Artist note */}
          <div className="mb-8">
            <p
              className="mb-3 text-center font-garamond text-white/65 italic"
              style={{ fontSize: 'clamp(15px, 1.6vw, 17px)', lineHeight: '1.65' }}
            >
              I&apos;m looking forward to having you. Acquire a piece below.
            </p>
            <p
              className="text-center font-cinzel text-gold text-xs"
              style={{ letterSpacing: '0.22em' }}
            >
              — BOANERGES
            </p>
          </div>

          {/* Navigation */}
          <nav className="border-border-default border-t">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={onClose}
                className="group flex items-center justify-between border-border-default border-b py-4 font-barlow text-sm text-white/75 transition-colors duration-200 hover:text-blue-bright"
                style={{ letterSpacing: '0.28em' }}
              >
                {link.label}
                <span className="translate-x-0 text-blue-bright/0 transition-all duration-200 group-hover:translate-x-1 group-hover:text-blue-bright">
                  →
                </span>
              </a>
            ))}
          </nav>

          {/* Socials */}
          <div className="mt-auto flex justify-center gap-6 pt-10">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.external ? '_blank' : undefined}
                rel={social.external ? 'noopener noreferrer' : undefined}
                className="font-barlow text-muted text-xs transition-colors hover:text-blue-bright"
                style={{ letterSpacing: '0.2em' }}
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}
