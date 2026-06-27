'use client'

import Image from 'next/image'
import { useCartStore } from '@/features/cart'
import { formatUsd } from '@/lib/money'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  onCheckout: () => void
}

export function CartDrawer({ isOpen, onClose, onCheckout }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, subtotalUsdCents } = useCartStore()
  const count = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close cart"
        tabIndex={isOpen ? 0 : -1}
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Drawer */}
      <aside
        aria-hidden={!isOpen}
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-sm flex-col border-border-blue border-l bg-near-black/95 backdrop-blur-xl transition-transform duration-500 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.77, 0, 0.175, 1)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-border-default border-b p-6">
          <h2 className="flex items-baseline gap-2 font-bebas text-white text-2xl tracking-wide">
            BAG
            {count > 0 && <span className="font-barlow text-blue-bright text-xs">({count})</span>}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="text-white/40 text-xl transition-colors hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 text-4xl text-white/20">◻</div>
              <p className="font-barlow text-muted text-xs" style={{ letterSpacing: '0.22em' }}>
                YOUR BAG IS EMPTY
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 border-border-default border-b pb-5 last:border-b-0"
                >
                  {/* Thumb */}
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden border border-border-default bg-panel">
                    {item.artwork.imageUrl ? (
                      <Image
                        src={item.artwork.imageUrl}
                        alt={item.artwork.title}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-blue-bright/60 text-xs">
                        ◻
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className="font-cinzel text-sm text-white"
                        style={{ letterSpacing: '0.08em' }}
                      >
                        {item.artwork.title}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeItem(item.artwork.id)}
                        aria-label={`Remove ${item.artwork.title}`}
                        className="text-muted text-xs transition-colors hover:text-blue-bright"
                      >
                        ✕
                      </button>
                    </div>
                    <p
                      className="mt-1 font-barlow text-muted"
                      style={{ fontSize: '9px', letterSpacing: '0.16em' }}
                    >
                      {item.artwork.edition}
                    </p>

                    <div className="mt-auto flex items-end justify-between pt-3">
                      {/* Quantity stepper */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.artwork.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="flex h-6 w-6 items-center justify-center border border-border-default text-xs transition-colors hover:border-blue-bright"
                        >
                          −
                        </button>
                        <span className="w-5 text-center font-barlow text-sm">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.artwork.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="flex h-6 w-6 items-center justify-center border border-border-default text-xs transition-colors hover:border-blue-bright"
                        >
                          +
                        </button>
                      </div>
                      {/* Line total */}
                      <p
                        className="font-bebas text-blue-bright text-xl"
                        style={{ letterSpacing: '0.05em' }}
                      >
                        {formatUsd(item.artwork.priceUsdCents * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-border-default border-t p-6">
            <div className="mb-1 flex items-baseline justify-between">
              <span
                className="font-barlow text-muted"
                style={{ fontSize: '10px', letterSpacing: '0.22em' }}
              >
                SUBTOTAL
              </span>
              <span className="font-bebas text-2xl text-white" style={{ letterSpacing: '0.04em' }}>
                {formatUsd(subtotalUsdCents())}
              </span>
            </div>
            <p
              className="mb-5 font-barlow text-muted"
              style={{ fontSize: '9px', letterSpacing: '0.14em' }}
            >
              SHIPPING & CURRENCY CALCULATED AT CHECKOUT
            </p>
            <button
              type="button"
              onClick={onCheckout}
              className="w-full bg-blue-primary py-3.5 font-barlow text-white transition-all hover:bg-blue-bright"
              style={{ fontSize: '11px', letterSpacing: '0.22em' }}
            >
              PROCEED TO CHECKOUT →
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
