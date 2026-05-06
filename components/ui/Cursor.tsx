'use client'

import { useEffect, useRef, useState } from 'react'

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [ringPos, setRingPos] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })

      // Ring follows with delay
      setTimeout(() => {
        setRingPos({ x: e.clientX, y: e.clientY })
      }, 50)

      // Check if hovering over interactive element
      const target = e.target as HTMLElement
      const isInteractive =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.hasAttribute('role') === true ||
        target.closest('button') ||
        target.closest('a')

      setIsHovering(!!isInteractive)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <>
      {/* Dot cursor */}
      <div
        ref={dotRef}
        className={`fixed pointer-events-none z-50 transition-all duration-200 ${
          isHovering ? 'scale-75' : 'scale-100'
        }`}
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          width: isHovering ? '6px' : '10px',
          height: isHovering ? '6px' : '10px',
          borderRadius: '50%',
          background: isHovering ? '#c9a84c' : '#3b82f6',
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'difference',
        }}
      />

      {/* Ring cursor */}
      <div
        ref={ringRef}
        className="fixed pointer-events-none z-50"
        style={{
          left: `${ringPos.x}px`,
          top: `${ringPos.y}px`,
          width: isHovering ? '52px' : '36px',
          height: isHovering ? '52px' : '36px',
          border: isHovering ? '1px solid #c9a84c' : '1px solid rgba(59, 130, 246, 0.5)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          transition: 'all 0.15s ease-out',
        }}
      />
    </>
  )
}
