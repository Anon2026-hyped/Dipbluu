'use client'

import { useEffect } from 'react'

interface MenuOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Menu */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-sm bg-near-black border-l border-border-blue z-50 transition-transform duration-500 overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.77, 0, 0.175, 1)' }}
      >
        <div className="p-8 pt-14">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white/40 hover:text-blue-bright text-2xl transition-colors duration-300 hover:rotate-90"
          >
            ✕
          </button>

          {/* Artist quote */}
          <div className="mb-12">
            <p
              className="font-garamond italic text-center text-white/55 mb-6"
              style={{ fontSize: 'clamp(16px, 1.6vw, 18px)', lineHeight: '1.6' }}
            >
              I&apos;m looking forward to having you. Acquire a piece below.
            </p>
            <p className="font-garamond italic text-center text-muted-2 text-xs">
              — Dipblu
            </p>
          </div>

          {/* Artwork thumbnail */}
          <div className="mb-8 flex justify-center">
            <div
              className="border border-border-gold bg-panel w-44 h-52 flex items-center justify-center relative"
              style={{
                boxShadow: 'inset 0 0 28px rgba(37,99,235,0.08)',
              }}
            >
              <svg
                width="80"
                height="80"
                viewBox="0 0 40 40"
                className="opacity-40"
              >
                <circle cx="20" cy="20" r="18" fill="none" stroke="#3b82f6" strokeWidth="1" />
              </svg>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="space-y-0 border-t border-border-default">
            {['THE WORKS', 'CURRENT DROP', 'ACQUIRE', 'QUESTIONS', 'ARCHIVE'].map(
              (link, i) => (
                <div
                  key={link}
                  className={`border-b border-border-default ${i === 0 ? 'border-t' : ''}`}
                >
                  <button
                    className="w-full text-left py-6 font-barlow text-white/70 hover:text-blue-bright transition-all ease-out duration-200 hover:pl-2"
                    style={{ fontSize: '12.5px', letterSpacing: '0.32em' }}
                  >
                    {link}
                  </button>
                </div>
              )
            )}
          </nav>

          {/* Social links */}
          <div className="mt-12 flex gap-6 justify-center">
            {['INSTAGRAM', 'EMAIL', 'WHATSAPP'].map((social) => (
              <button
                key={social}
                className="text-muted hover:text-blue-bright transition-colors text-xs"
                style={{ letterSpacing: '0.22em' }}
              >
                {social}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
