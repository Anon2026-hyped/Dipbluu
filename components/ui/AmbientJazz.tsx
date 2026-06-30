'use client'

import { useCallback, useRef, useState } from 'react'

// ── Tempo & timing ────────────────────────────────────────────────────────────
const BPM  = 87
const BEAT = 60 / BPM        // seconds per beat
const STEP = BEAT / 4        // 16th note
const BAR  = BEAT * 4        // one bar

// ── Note frequencies ──────────────────────────────────────────────────────────
const F = {
  G2: 97.999, A2: 110.00, B2: 123.47,
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00,
  A3: 220.00, B3: 246.94, C4: 261.63, D4: 293.66, E4: 329.63,
  F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88, C5: 523.25,
  D5: 587.33,
}

// ── 4-bar jazz-minor chord progression (Am7 → Dm7 → G7 → Em7) ─────────────
const CHORDS: number[][] = [
  [F.A3, F.C4, F.E4, F.G4],   // Am7
  [F.D4, F.F4, F.A4, F.C5],   // Dm7
  [F.G3, F.B3, F.D4, F.F4],   // G7
  [F.E3, F.G3, F.B3, F.D4],   // Em7
]

// ── Walking bass (one note per beat, 4 beats per bar) ────────────────────────
const BASS: number[][] = [
  [F.A2, F.E3, F.G3, F.C3],   // Am7
  [F.D3, F.F3, F.A3, F.C3],   // Dm7
  [F.G2, F.B2, F.D3, F.F3],   // G7
  [F.E3, F.G3, F.B3, F.A3],   // Em7
]

// ── 16-step drum patterns (boom-bap) ─────────────────────────────────────────
const KICK  = [1,0,0,0, 0,0,0,0, 1,0,1,0, 0,0,0,0]
const SNARE = [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0]
const HHAT  = [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0]  // closed 8ths
const OHAT  = [0,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,1,0]  // open hi-hat accents

// ── Noise buffer (shared across all drum hits in one session) ─────────────────
function makeNoise(ctx: AudioContext): AudioBuffer {
  const len = ctx.sampleRate * 2
  const buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const d   = buf.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
  return buf
}

// ── Convolver reverb ──────────────────────────────────────────────────────────
function makeReverb(ctx: AudioContext): ConvolverNode {
  const len = ctx.sampleRate * 2.4
  const buf = ctx.createBuffer(2, len, ctx.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.0)
  }
  const conv = ctx.createConvolver()
  conv.buffer = buf
  return conv
}

// ── Drum synthesis ────────────────────────────────────────────────────────────
function schedKick(ctx: AudioContext, dest: AudioNode, t: number) {
  const osc = ctx.createOscillator()
  const env = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(155, t)
  osc.frequency.exponentialRampToValueAtTime(42, t + 0.065)
  env.gain.setValueAtTime(1.0, t)
  env.gain.exponentialRampToValueAtTime(0.001, t + 0.38)
  osc.connect(env); env.connect(dest)
  osc.start(t); osc.stop(t + 0.42)
}

function schedSnare(ctx: AudioContext, noise: AudioBuffer, dest: AudioNode, t: number) {
  // Noise burst
  const ns  = ctx.createBufferSource()
  ns.buffer = noise
  const hpf = ctx.createBiquadFilter()
  hpf.type  = 'highpass'; hpf.frequency.value = 1800
  const nEnv = ctx.createGain()
  nEnv.gain.setValueAtTime(0.42, t)
  nEnv.gain.exponentialRampToValueAtTime(0.001, t + 0.16)
  ns.connect(hpf); hpf.connect(nEnv); nEnv.connect(dest)
  ns.start(t); ns.stop(t + 0.2)
  // Tone snap
  const osc = ctx.createOscillator()
  const tEnv = ctx.createGain()
  osc.type = 'sine'; osc.frequency.value = 190
  tEnv.gain.setValueAtTime(0.28, t)
  tEnv.gain.exponentialRampToValueAtTime(0.001, t + 0.055)
  osc.connect(tEnv); tEnv.connect(dest)
  osc.start(t); osc.stop(t + 0.07)
}

function schedHat(ctx: AudioContext, noise: AudioBuffer, dest: AudioNode, t: number, open: boolean) {
  const ns  = ctx.createBufferSource()
  ns.buffer = noise
  const bpf = ctx.createBiquadFilter()
  bpf.type  = 'bandpass'; bpf.frequency.value = 9500; bpf.Q.value = 0.7
  const env = ctx.createGain()
  const dec = open ? 0.13 : 0.022
  env.gain.setValueAtTime(open ? 0.22 : 0.16, t)
  env.gain.exponentialRampToValueAtTime(0.001, t + dec)
  ns.connect(bpf); bpf.connect(env); env.connect(dest)
  ns.start(t); ns.stop(t + dec + 0.01)
}

// ── FM Rhodes chord voice ─────────────────────────────────────────────────────
// Carrier sine modulated by 2× harmonic — gives that electric-piano "clank"
function schedRhodes(ctx: AudioContext, dest: AudioNode, freq: number, t: number, dur: number) {
  const mod     = ctx.createOscillator()
  const carrier = ctx.createOscillator()
  const modGain = ctx.createGain()
  const env     = ctx.createGain()

  mod.type = 'sine'; mod.frequency.value = freq * 2
  carrier.type = 'sine'; carrier.frequency.value = freq

  modGain.gain.setValueAtTime(freq * 5.5, t)
  modGain.gain.exponentialRampToValueAtTime(freq * 0.25, t + 0.14)
  modGain.gain.exponentialRampToValueAtTime(0.001, t + dur)

  env.gain.setValueAtTime(0, t)
  env.gain.linearRampToValueAtTime(0.072, t + 0.01)
  env.gain.setValueAtTime(0.060, t + 0.08)
  env.gain.exponentialRampToValueAtTime(0.001, t + dur)

  mod.connect(modGain); modGain.connect(carrier.frequency)
  carrier.connect(env); env.connect(dest)
  mod.start(t); mod.stop(t + dur + 0.05)
  carrier.start(t); carrier.stop(t + dur + 0.05)
}

// ── Walking bass voice ────────────────────────────────────────────────────────
function schedBass(ctx: AudioContext, dest: AudioNode, freq: number, t: number, dur: number) {
  const osc  = ctx.createOscillator()
  const lpf  = ctx.createBiquadFilter()
  const env  = ctx.createGain()
  osc.type = 'sine'; osc.frequency.value = freq
  lpf.type = 'lowpass'; lpf.frequency.value = 380; lpf.Q.value = 0.5
  env.gain.setValueAtTime(0, t)
  env.gain.linearRampToValueAtTime(0.55, t + 0.018)
  env.gain.setValueAtTime(0.48, t + 0.04)
  env.gain.exponentialRampToValueAtTime(0.001, t + dur)
  // 2nd harmonic for "pluck" character
  const osc2 = ctx.createOscillator()
  const env2 = ctx.createGain()
  osc2.type = 'triangle'; osc2.frequency.value = freq * 2
  env2.gain.setValueAtTime(0.06, t)
  env2.gain.exponentialRampToValueAtTime(0.001, t + 0.08)
  osc2.connect(env2); env2.connect(dest)
  osc2.start(t); osc2.stop(t + 0.12)
  osc.connect(lpf); lpf.connect(env); env.connect(dest)
  osc.start(t); osc.stop(t + dur + 0.05)
}

// ── Main engine ───────────────────────────────────────────────────────────────
function startEngine(ctx: AudioContext): () => void {
  const noise   = makeNoise(ctx)
  const reverb  = makeReverb(ctx)

  // Signal chain
  const master  = ctx.createGain()
  const warmLPF = ctx.createBiquadFilter()   // lo-fi warmth
  warmLPF.type  = 'lowpass'; warmLPF.frequency.value = 13000
  master.connect(warmLPF); warmLPF.connect(ctx.destination)

  const reverbGain = ctx.createGain(); reverbGain.gain.value = 0.38
  reverb.connect(reverbGain); reverbGain.connect(master)

  const drumBus  = ctx.createGain(); drumBus.gain.value  = 0.72; drumBus.connect(master)
  const melodBus = ctx.createGain(); melodBus.gain.value = 0.60; melodBus.connect(master)
  const revSend  = ctx.createGain(); revSend.gain.value  = 0.30; revSend.connect(reverb)

  // Fade in
  master.gain.setValueAtTime(0, ctx.currentTime)
  master.gain.linearRampToValueAtTime(0.80, ctx.currentTime + 2.5)

  let barStart = ctx.currentTime + 0.1
  let barIdx   = 0
  let stopped  = false

  const scheduleBar = () => {
    const chords = CHORDS[barIdx % CHORDS.length]!
    const basses = BASS[barIdx % BASS.length]!

    // Rhodes chords — whole bar, with reverb send
    chords.forEach(f => {
      schedRhodes(ctx, melodBus, f, barStart, BAR * 0.93)
      schedRhodes(ctx, revSend,  f, barStart, BAR * 0.93)
    })

    // Walking bass — one note per beat
    basses.forEach((f, i) => schedBass(ctx, melodBus, f, barStart + i * BEAT, BEAT * 0.80))

    // 16-step drums
    for (let s = 0; s < 16; s++) {
      const t = barStart + s * STEP
      if (KICK[s])  schedKick(ctx, drumBus, t)
      if (SNARE[s]) { schedSnare(ctx, noise, drumBus, t); schedSnare(ctx, noise, revSend, t) }
      if (HHAT[s])  schedHat(ctx, noise, drumBus, t, Boolean(OHAT[s]))
    }

    barStart += BAR
    barIdx++
  }

  const tick = () => {
    if (stopped) return
    while (barStart < ctx.currentTime + 1.6) scheduleBar()
    setTimeout(tick, 250)
  }
  tick()

  return () => {
    stopped = true
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.6)
    setTimeout(() => ctx.close(), 2000)
  }
}

// ── React component ───────────────────────────────────────────────────────────
export function AmbientJazz() {
  const [playing, setPlaying] = useState(false)
  const [hover,   setHover]   = useState(false)
  const stopRef = useRef<(() => void) | null>(null)

  const toggle = useCallback(() => {
    if (playing) {
      stopRef.current?.()
      stopRef.current = null
      setPlaying(false)
    } else {
      const ctx = new AudioContext()
      stopRef.current = startEngine(ctx)
      setPlaying(true)
    }
  }, [playing])

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? 'Pause music' : 'Play ambient music'}
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
        border: `0.5px solid ${
          hover    ? 'rgba(59,130,246,0.65)' :
          playing  ? 'rgba(201,168,76,0.50)' :
                     'rgba(59,130,246,0.25)'
        }`,
        background: hover
          ? 'rgba(37,99,235,0.12)'
          : playing
          ? 'rgba(201,168,76,0.08)'
          : 'rgba(4,8,16,0.85)',
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
      <rect x="8"   y="1.5" width="3.5" height="10" rx="1" fill="rgba(201,168,76,0.9)"/>
    </svg>
  )
}
