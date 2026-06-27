'use client'

import { useEffect, useRef } from 'react'

/**
 * Custom cursor for pointer-capable devices.
 * Drives DOM position via requestAnimationFrame + refs — never via React state —
 * so mouse-move events cause zero React re-renders.
 * Automatically hidden on touch-only devices.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only run on devices with a precise pointer (mouse/trackpad)
    if (!window.matchMedia('(pointer: fine)').matches) return

    const pos = { x: -100, y: -100 }
    const ring = { x: -100, y: -100 }
    let hovering = false
    let rafId = 0

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX
      pos.y = e.clientY

      const target = e.target as HTMLElement
      hovering = !!(
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]')
      )
    }

    const tick = () => {
      // Lerp ring toward cursor
      ring.x += (pos.x - ring.x) * 0.18
      ring.y += (pos.y - ring.y) * 0.18

      const dot = dotRef.current
      const ringEl = ringRef.current

      if (dot) {
        dot.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`
        dot.style.width = hovering ? '6px' : '10px'
        dot.style.height = hovering ? '6px' : '10px'
        dot.style.background = hovering ? '#c9a84c' : '#3b82f6'
      }

      if (ringEl) {
        ringEl.style.transform = `translate(${ring.x}px, ${ring.y}px) translate(-50%, -50%)`
        ringEl.style.width = hovering ? '52px' : '36px'
        ringEl.style.height = hovering ? '52px' : '36px'
        ringEl.style.borderColor = hovering ? '#c9a84c' : 'rgba(59,130,246,0.5)'
      }

      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        className="fixed pointer-events-none z-[999]"
        style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: '#3b82f6',
          mixBlendMode: 'difference',
          transition: 'width 0.15s, height 0.15s, background 0.15s',
          willChange: 'transform',
        }}
      />
      <div
        ref={ringRef}
        className="fixed pointer-events-none z-[999]"
        style={{
          width: '36px',
          height: '36px',
          border: '1px solid rgba(59,130,246,0.5)',
          borderRadius: '50%',
          transition: 'width 0.15s, height 0.15s, border-color 0.15s',
          willChange: 'transform',
        }}
      />
    </>
  )
}
