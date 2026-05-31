'use client'

import { useRef, useState } from 'react'

const SRC = process.env.NEXT_PUBLIC_AMBIENT_AUDIO_URL

/**
 * Optional ambient-sound toggle. Off by default, plays only on a user gesture
 * (never autoplays), preference persisted. Renders nothing unless an audio URL
 * is configured, so there's never a broken/silent control.
 */
export function AmbientSound() {
  const [on, setOn] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  if (!SRC) return null

  const toggle = () => {
    const next = !on
    setOn(next)
    const audio = audioRef.current
    if (!audio) return
    if (next) audio.play().catch(() => setOn(false))
    else audio.pause()
    try {
      localStorage.setItem('ambient-sound', next ? 'on' : 'off')
    } catch {
      // ignore storage failures (private mode etc.)
    }
  }

  return (
    <>
      {/* biome-ignore lint/a11y/useMediaCaption: ambient instrumental loop, no spoken content */}
      <audio ref={audioRef} src={SRC} loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={on}
        aria-label={on ? 'Mute ambient sound' : 'Play ambient sound'}
        className="fixed bottom-5 left-5 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-border-blue bg-black/60 text-blue-bright backdrop-blur transition-colors hover:border-blue-bright"
      >
        <span className={on ? '' : 'opacity-40'}>♪</span>
      </button>
    </>
  )
}
