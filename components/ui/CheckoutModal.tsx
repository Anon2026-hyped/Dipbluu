'use client'

import { useEffect, useRef, useState } from 'react'
import { useCartStore } from '@/features/cart'
import { useCheckout } from '@/features/checkout/useCheckout'
import { formatUsd } from '@/lib/money'
import type { CheckoutInput } from '@/lib/validation/checkout'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
}

type DeliveryType = 'standard' | 'international'
type PaymentMethod = 'card'

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  // Close on Escape + trap focus inside the dialog
  useEffect(() => {
    if (!isOpen) return
    const firstFocusable = dialogRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    firstFocusable?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable?.length) return
      const first = focusable[0] as HTMLElement
      const last = focusable[focusable.length - 1] as HTMLElement
      if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
        e.preventDefault()
        ;(e.shiftKey ? last : first).focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  const { items, clearCart, subtotalUsdCents } = useCartStore()
  const { loading, error, orderNumber, start, reset } = useCheckout()

  const [step, setStep] = useState(1)
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('standard')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  })

  const total = formatUsd(subtotalUsdCents())

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const detailsValid =
    formData.firstName.trim() !== '' &&
    /.+@.+\..+/.test(formData.email) &&
    formData.address.trim() !== ''

  const handleStepAdvance = () => {
    if (detailsValid) setStep(2)
  }

  const handlePay = async () => {
    const method: PaymentMethod = 'card'
    const input: CheckoutInput = {
      items: items.map((item) => ({ artworkId: item.artwork.id, quantity: item.quantity })),
      deliveryType,
      paymentMethod: method,
      shipping: {
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        address: formData.address.trim(),
        phone: formData.phone.trim() || undefined,
      },
    }
    await start(input)
    // Paystack redirects the browser away inside start().
  }

  const handleClose = () => {
    clearCart()
    reset()
    setStep(1)
    setFormData({ firstName: '', lastName: '', email: '', phone: '', address: '' })
    onClose()
  }

  if (!isOpen) return null

  const fieldClass =
    'w-full bg-transparent border-b border-white/14 focus:border-blue-bright pb-2 text-sm placeholder:text-muted transition-colors'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        ref={dialogRef}
        className="bg-black border border-border-blue rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto"
        style={{ animation: 'scale-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        {/* Step indicator + close */}
        <div className="flex items-center gap-3 p-6 border-b border-border-default">
          {[1, 2].map((i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full transition-all ${
                i <= step ? 'bg-blue-bright' : 'bg-border-default'
              }`}
            />
          ))}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close checkout"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-white/10 text-white/45 transition-all duration-200 hover:border-blue-bright/40 hover:text-blue-bright"
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
              <line
                x1="1"
                y1="1"
                x2="10"
                y2="10"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
              <line
                x1="10"
                y1="1"
                x2="1"
                y2="10"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="p-8">
          {/* Step 1: Details */}
          {step === 1 && (
            <div>
              <h2
                id="checkout-modal-title"
                className="font-bebas text-white mb-6"
                style={{ fontSize: '24px', letterSpacing: '0.04em' }}
              >
                YOUR DETAILS
              </h2>

              <div className="space-y-4 mb-8">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={fieldClass}
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={fieldClass}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={fieldClass}
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number (optional)"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={fieldClass}
                />

                <select
                  value={deliveryType}
                  onChange={(e) => setDeliveryType(e.target.value as DeliveryType)}
                  className={`${fieldClass} text-white`}
                >
                  <option value="standard" className="bg-black">
                    Standard Shipping
                  </option>
                  <option value="international" className="bg-black">
                    International Shipping
                  </option>
                </select>

                <textarea
                  name="address"
                  placeholder="Shipping Address (street, city, country)"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={2}
                  className={`${fieldClass} resize-none`}
                />
              </div>

              <button
                type="button"
                onClick={handleStepAdvance}
                disabled={!detailsValid}
                className="w-full bg-blue-primary hover:bg-blue-bright disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 font-barlow"
                style={{ fontSize: '11px', letterSpacing: '0.22em' }}
              >
                CONTINUE →
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div>
              <h2
                id="checkout-modal-title"
                className="font-bebas text-white mb-6"
                style={{ fontSize: '24px', letterSpacing: '0.04em' }}
              >
                PAYMENT
              </h2>

              <div
                className="mb-6 rounded border border-border-default bg-panel p-4 text-xs text-muted"
                style={{ letterSpacing: '0.18em' }}
              >
                PAY WITH PAYSTACK • CARD / BANK TRANSFER
              </div>

              {/* Order summary */}
              <div className="border border-border-default p-4 mb-6">
                <div
                  className="font-barlow text-muted text-xs mb-4"
                  style={{ letterSpacing: '0.2em' }}
                >
                  ORDER SUMMARY
                </div>
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm mb-2">
                    <span className="text-white/65">
                      {item.artwork.title}
                      {item.quantity > 1 ? ` ×${item.quantity}` : ''}
                    </span>
                    <span className="text-blue-bright">
                      {formatUsd(item.artwork.priceUsdCents * item.quantity)}
                    </span>
                  </div>
                ))}
                <div className="border-t border-border-default pt-4 mt-4 flex justify-between">
                  <span
                    className="font-barlow"
                    style={{ fontSize: '11px', letterSpacing: '0.22em' }}
                  >
                    TOTAL
                  </span>
                  <span className="font-bebas text-blue-bright text-xl">{total}</span>
                </div>
              </div>

              {error && (
                <p className="mb-4 text-xs text-red-400" style={{ letterSpacing: '0.04em' }}>
                  {error}
                </p>
              )}

              <p
                className="mb-4 text-xs text-muted"
                style={{ fontSize: '9px', letterSpacing: '0.16em' }}
              >
                You will be redirected to a secure Paystack checkout. Card details are never stored
                by BOANERGES.
              </p>
              <button
                type="button"
                onClick={handlePay}
                disabled={loading || items.length === 0}
                className="w-full bg-blue-primary hover:bg-blue-bright disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 font-barlow"
                style={{ fontSize: '11px', letterSpacing: '0.22em' }}
              >
                {loading ? 'PROCESSING…' : `PAY ${total} →`}
              </button>

              {orderNumber && (
                <a
                  href={`/order/${orderNumber}`}
                  className="mt-4 block w-full text-center bg-blue-primary hover:bg-blue-bright text-white py-3 font-barlow"
                  style={{ fontSize: '11px', letterSpacing: '0.22em' }}
                >
                  VIEW ORDER STATUS →
                </a>
              )}

              <button
                type="button"
                onClick={handleClose}
                className="w-full text-muted hover:text-white py-3 mt-2 font-barlow text-xs transition-colors"
                style={{ letterSpacing: '0.22em' }}
              >
                CANCEL
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
