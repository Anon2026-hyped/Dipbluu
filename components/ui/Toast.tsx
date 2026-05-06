'use client'

import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  productName?: string
  isVisible: boolean
  onClose: () => void
}

export function Toast({ message, productName, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 2800)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  return (
    <div
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-panel border border-border-blue px-6 py-4 z-50"
      style={{
        animation: 'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <div
        className="font-barlow text-white text-center"
        style={{
          fontSize: '11px',
          letterSpacing: '0.2em',
        }}
      >
        {productName && (
          <>
            <span className="text-blue-bright">{productName}</span>
            <span className="mx-2">—</span>
          </>
        )}
        {message}
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            transform: translate(-50%, 100px);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
