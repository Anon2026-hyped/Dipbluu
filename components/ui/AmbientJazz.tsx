'use client'

import { useCallback, useRef, useState } from 'react'

// ── Jazz chord progression: Am9 → Dm9 → G13 → Cmaj9 (i–iv–VII–III) ──
const N = {
  A2: 110.00, C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00,
  A3: 220.00, B3: 246.94, C4: 261.63, D4: 293.66, E4: 329.63,
  F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88, C5: 523.25,
  D5: 587.33, E5: 659.25,
}

const PROGRESSION: { bass: number[]; chord: number[]; beats: number }[] = [
  { bass: [N.A2, N.E3, N.A3, N.G3], chord: [N.A3, N.C4, N.E4, N.G4, N.B4], beats: 4 },
  { bass: [N.D3, N.A3, N.D4, N.C4], chord: [N.D4, N.F4, N.A4, N.C5],       beats: 4 },
  { bass: [N.G3, N.D4, N.G3, N.F3], chord: [N.G3, N.B3, N.D4, N.F4, N.A4], beats: 4 },
  { bass: [N.C3, N.G3, N.C4, N.B3], chord: [N.C4, N.E4, N.G4, N.B4, N.D5], beats: 4 },
]

function buildReverb(ctx: AudioContext) {
  const len = ctx.sampleRate * 4
  const buf = ctx.createBuffer(2, len, ctx.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.4)
  }
  const c = ctx.createConvolver()
  c.buffer = buf
  return c
}

function noteOn(
  ctx: AudioContext,
  dest: AudioNode,
  freq: number,
  startT: number,
  dur: number,
  vol: number,
  filterHz = 1600,
) {
  const osc = ctx.createOscillator()
  const env = ctx.createGain()
  const flt = ctx.createBiquadFilter()
  flt.type = 'lowpass'
  flt.frequency.value = filterHz
  flt.Q.value = 0.5
  osc.type = 'sine'
  osc.frequency.value = freq
  env.gain.setValueAtTime(0, startT)
  env.gain.linearRampToValueAtTime(vol, startT + 0.09)
  env.gain.setValueAtTime(vol, startT + dur * 0.72)
  env.gain.linearRampToValueAtTime(0, startT + dur)
  osc.connect(flt)
  flt.connect(env)
  env.connect(dest)
  osc.start(startT)
  osc.stop(startT + dur + 0.05)
}

function scheduleChord(ctx: AudioContext, wet: AudioNode, dry: AudioNode, freqs: number[], startT: number, dur: number) {
  freqs.forEach((f, i) => {
    const dt = (i - freqs.length / 2) * 1.4  // cents detune for warmth
    const f2 = f * Math.pow(2, dt / 1200)
    noteOn(ctx, dry, f2, startT, dur, 0.042, 2200)
    noteOn(ctx, wet, f2, startT, dur, 0.028, 2200)
    // second slightly detuned oscillator for richness
    noteOn(ctx, wet, f * Math.pow(2, (dt + 4) / 1200), startT, dur, 0.016, 2200)
  })
}

function scheduleBass(ctx: AudioContext, dry: AudioNode, freqs: number[], startT: number, beatSec: number) {
  freqs.forEach((f, i) => {
    const t = startT + i * beatSec
    noteOn(ctx, dry, f, t, beatSec * 0.82, 0.15, 360)
    // Upright-bass overtone
    noteOn(ctx, dry, f * 2, t, beatSec * 0.62, 0.032, 700)
  })
}

export function AmbientJazz() {
  const [playing, setPlaying] = useState(false)
  const [hover, setHover] = useState(false)
  const engineRef = useRef<{ stop: () => void } | null>(null)

  const start = useCallback(() => {
    const ctx = new AudioContext()
    const master = ctx.createGain()
    master.gain.setValueAtTime(0, ctx.currentTime)
    master.gain.linearRampToValueAtTime(0.38, ctx.currentTime + 3)
    master.connect(ctx.destination)

    const reverb = buildReverb(ctx)
    const reverbGain = ctx.createGain()
    reverbGain.gain.value = 0.52
    reverb.connect(reverbGain)
    reverbGain.connect(master)

    const dry = ctx.createGain()
    dry.gain.value = 0.48
    dry.connect(master)

    const BPM = 50                  // slow, relaxed
    const beatSec = 60 / BPM
    let progIdx = 0
    let nextBarTime = ctx.currentTime + 0.1
    let stopped = false

    const tick = () => {
      if (stopped) return
      while (nextBarTime < ctx.currentTime + 1.2) {
        const entry = PROGRESSION[progIdx % PROGRESSION.length]!
        const { bass, chord, beats } = entry
        const barDur = beatSec * beats
        scheduleChord(ctx, reverb, dry, chord, nextBarTime, barDur * 0.94)
        scheduleBass(ctx, dry, bass, nextBarTime, beatSec)
        nextBarTime += barDur
        progIdx = (progIdx + 1) % PROGRESSION.length
      }
      setTimeout(tick, 200)
    }
    tick()

    engineRef.current = {
      stop: () => {
        stopped = true
        master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.8)
        setTimeout(() => ctx.close(), 2200)
      },
    }
  }, [])

  const toggle = useCallback(() => {
    if (playing) {
      engineRef.current?.stop()
      engineRef.current = null
      setPlaying(false)
    } else {
      start()
      setPlaying(true)
    }
  }, [playing, start])

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? 'Pause ambient music' : 'Play ambient music'}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'fixed',
        bottom: 28,
        right: 28,
        zIndex: 45,
        width: 44,
        height: 44,
        borderRadius: '50%',
        border: `0.5px solid ${hover ? 'rgba(59,130,246,0.6)' : playing ? 'rgba(201,168,76,0.45)' : 'rgba(59,130,246,0.25)'}`,
        background: hover
          ? 'rgba(37,99,235,0.10)'
          : playing
          ? 'rgba(201,168,76,0.07)'
          : 'rgba(4,8,16,0.82)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'border-color 0.25s, background 0.25s',
        animation: playing ? 'pulseGlow 4s ease-in-out infinite' : 'none',
      }}
    >
      {playing ? <PauseIcon /> : <NoteIcon />}
    </button>
  )
}

function NoteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 12.5V4l7-1.5v8" stroke="rgba(96,160,255,0.9)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="4.5" cy="12.5" r="1.8" stroke="rgba(96,160,255,0.9)" strokeWidth="1.1"/>
      <circle cx="11.5" cy="10.5" r="1.8" stroke="rgba(96,160,255,0.9)" strokeWidth="1.1"/>
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <rect x="1.5" y="1.5" width="3.5" height="10" rx="1" fill="rgba(201,168,76,0.9)"/>
      <rect x="8" y="1.5" width="3.5" height="10" rx="1" fill="rgba(201,168,76,0.9)"/>
    </svg>
  )
}
