'use client'

import { useState } from 'react'

export function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <footer
      id="contact"
      className="bg-near-black border-t border-border-default pt-20 pb-10 px-6 sm:px-12"
    >
      {/* Ghost logo */}
      <div
        className="font-bebas text-blue-primary/4 mb-20 w-full text-left"
        style={{ fontSize: '60px', letterSpacing: '0.06em' }}
      >
        BOANERGES
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto mb-12">
        {/* Archive column */}
        <div>
          <h3
            className="font-barlow text-muted mb-5"
            style={{ fontSize: '9.5px', letterSpacing: '0.32em' }}
          >
            ARCHIVE
          </h3>
          <div className="space-y-4">
            {['Previous Drops', 'Sold Works', 'Exhibitions'].map((link) => (
              <a
                key={link}
                // biome-ignore lint/a11y/useValidAnchor: placeholder — wire to real archive URL
                href="#"
                className="font-garamond italic text-white/55 hover:text-blue-bright transition-colors block"
                style={{ fontSize: '15px' }}
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        {/* Studio column */}
        <div>
          <h3
            className="font-barlow text-muted mb-5"
            style={{ fontSize: '9.5px', letterSpacing: '0.32em' }}
          >
            STUDIO
          </h3>
          <div className="space-y-4">
            <a
              href="https://instagram.com/boanergizz"
              target="_blank"
              rel="noopener noreferrer"
              className="font-garamond italic text-white/55 hover:text-blue-bright transition-colors block"
              style={{ fontSize: '15px' }}
            >
              Instagram →
            </a>
            <a
              // biome-ignore lint/a11y/useValidAnchor: placeholder — wire to real social URL
              href="#"
              className="font-garamond italic text-white/55 hover:text-blue-bright transition-colors block"
              style={{ fontSize: '15px' }}
            >
              WhatsApp
            </a>
            <a
              href="mailto:bludeep4@gmail.com"
              className="font-garamond italic text-white/55 hover:text-blue-bright transition-colors block"
              style={{ fontSize: '15px' }}
            >
              Email →
            </a>
          </div>
        </div>

        {/* Studio Dispatch column */}
        <div>
          <h3
            className="font-barlow text-muted mb-5"
            style={{ fontSize: '9.5px', letterSpacing: '0.32em' }}
          >
            STUDIO DISPATCH
          </h3>
          <p
            className="font-garamond italic text-white/38 mb-5"
            style={{
              fontSize: '13px',
              lineHeight: '1.68',
            }}
          >
            Notes from the studio. Sent when something is worth saying.
          </p>

          {status === 'success' ? (
            <p
              className="font-barlow text-blue-bright"
              style={{ fontSize: '10px', letterSpacing: '0.22em' }}
            >
              YOU'RE ON THE LIST.
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                name="newsletterEmail"
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === 'loading'}
                className="bg-transparent border-b border-white/14 focus:border-blue-bright pb-2 text-sm placeholder:text-muted transition-colors disabled:opacity-50"
                style={{ fontSize: '14px' }}
              />
              {status === 'error' && (
                <p
                  className="font-barlow text-red-400"
                  style={{ fontSize: '9px', letterSpacing: '0.2em' }}
                >
                  SOMETHING WENT WRONG. TRY AGAIN.
                </p>
              )}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="font-barlow text-muted hover:text-blue-bright transition-colors text-xs border-b border-white/22 pb-1 inline-flex items-center mt-3 disabled:opacity-50"
                style={{ fontSize: '9.5px', letterSpacing: '0.28em', width: 'fit-content' }}
              >
                {status === 'loading' ? 'SENDING…' : 'SUBSCRIBE'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border-default pt-6 mt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <p
          className="font-barlow text-muted"
          style={{
            fontSize: '9.5px',
            letterSpacing: '0.16em',
          }}
        >
          © BOANERGES Limited · All works the property of the artist.
        </p>
        <div className="flex gap-4">
          {['IG', 'EMAIL', 'WA'].map((social) => (
            <a
              key={social}
              // biome-ignore lint/a11y/useValidAnchor: placeholder — wire to real social URL
              href="#"
              className="font-barlow text-muted hover:text-blue-bright transition-colors text-xs"
              style={{
                fontSize: '9.5px',
                letterSpacing: '0.2em',
              }}
            >
              {social}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
