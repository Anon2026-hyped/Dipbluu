'use client'

import { useState } from 'react'
import { useCartStore } from '@/features/cart'
import { formatNgn } from '@/lib/money'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  onCheckout: () => void
}

export function CartDrawer({ isOpen, onClose, onCheckout }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, subtotalNgnKobo } = useCartStore()
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto'>('card')

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close cart"
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-sm bg-near-black border-l border-border-blue z-50 flex flex-col transition-transform duration-500 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.77, 0, 0.175, 1)' }}
      >
        {/* Header */}
        <div className="border-b border-border-default p-6 flex items-center justify-between">
          <h2
            className="font-bebas text-white"
            style={{
              fontSize: '24px',
              letterSpacing: '0.04em',
            }}
          >
            BAG
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="text-4xl text-white/20 mb-4">◻</div>
              <p className="font-barlow text-muted text-xs" style={{ letterSpacing: '0.22em' }}>
                YOUR BAG IS EMPTY
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="border-b border-border-default pb-4 last:border-b-0">
                  <div className="flex gap-4 mb-3">
                    {/* Thumb */}
                    <div className="w-16 h-20 bg-panel border border-border-default flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-bright text-xs">◻</span>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h3
                        className="font-barlow text-white text-xs mb-1"
                        style={{ letterSpacing: '0.2em' }}
                      >
                        {item.artwork.title}
                      </h3>
                      <p
                        className="font-barlow text-muted text-xs mb-2"
                        style={{
                          fontSize: '9.5px',
                          letterSpacing: '0.16em',
                        }}
                      >
                        {item.artwork.edition}
                      </p>
                      <p
                        className="font-bebas text-blue-bright"
                        style={{ fontSize: '20px', letterSpacing: '0.06em' }}
                      >
                        {formatNgn(item.artwork.priceNgnKobo)}
                      </p>
                    </div>
                  </div>

                  {/* Quantity & Remove */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.artwork.id, item.quantity - 1)}
                        className="w-6 h-6 border border-border-default hover:border-blue-bright flex items-center justify-center text-xs"
                      >
                        −
                      </button>
                      <span className="w-4 text-center font-barlow">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.artwork.id, item.quantity + 1)}
                        className="w-6 h-6 border border-border-default hover:border-blue-bright flex items-center justify-center text-xs"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.artwork.id)}
                      className="text-muted hover:text-blue-bright transition-colors"
                      style={{ fontSize: '9px', letterSpacing: '0.16em' }}
                    >
                      REMOVE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border-default p-6 space-y-4">
            {/* Total */}
            <div className="flex items-baseline justify-between mb-6">
              <span
                className="font-barlow text-muted"
                style={{ fontSize: '9.5px', letterSpacing: '0.2em' }}
              >
                TOTAL
              </span>
              <span
                className="font-bebas text-white"
                style={{
                  fontSize: '28px',
                  letterSpacing: '0.04em',
                }}
              >
                {formatNgn(subtotalNgnKobo())}
              </span>
            </div>

            {/* Payment method toggle */}
            <div className="flex gap-2 mb-4">
              {['card', 'crypto'].map((method) => (
                <button
                  type="button"
                  key={method}
                  onClick={() => setPaymentMethod(method as 'card' | 'crypto')}
                  className={`flex-1 py-2 px-3 border transition-all ${
                    paymentMethod === method
                      ? 'border-blue-bright bg-blue-glow-soft'
                      : 'border-border-default'
                  }`}
                  style={{
                    fontSize: '9px',
                    letterSpacing: '0.2em',
                  }}
                >
                  {method === 'card' ? '💳 CARD' : '₿ CRYPTO'}
                </button>
              ))}
            </div>

            {/* Checkout button */}
            <button
              type="button"
              onClick={onCheckout}
              className="w-full bg-blue-primary hover:bg-blue-bright text-white py-3 font-barlow transition-all"
              style={{
                fontSize: '11px',
                letterSpacing: '0.22em',
              }}
            >
              PROCEED TO CHECKOUT →
            </button>
          </div>
        )}
      </div>
    </>
  )
}
