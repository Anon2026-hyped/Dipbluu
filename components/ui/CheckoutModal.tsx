'use client'

import { useState } from 'react'
import { useCartStore } from '@/features/cart'
import { useCheckout } from '@/features/checkout/useCheckout'
import { track } from '@/lib/analytics'
import { formatNgn, formatUsd } from '@/lib/money'
import type { CheckoutInput } from '@/lib/validation/checkout'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
}

type DeliveryType = 'lagos' | 'nigeria' | 'international'
type PaymentMethod = 'card' | 'crypto'

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, clearCart, subtotalNgnKobo, subtotalUsdCents } = useCartStore()
  const { loading, error, crypto, orderNumber, start, reset } = useCheckout()

  const [step, setStep] = useState(1)
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('lagos')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  })

  const isInternational = deliveryType === 'international'
  const total = isInternational ? formatUsd(subtotalUsdCents()) : formatNgn(subtotalNgnKobo())

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const detailsValid =
    formData.firstName.trim() !== '' &&
    /.+@.+\..+/.test(formData.email) &&
    (deliveryType === 'lagos' || formData.address.trim() !== '')

  const handleStepAdvance = () => {
    if (detailsValid) setStep(2)
  }

  const handlePay = async () => {
    // Crypto only applies to international orders; Nigeria always routes to Paystack.
    const method: PaymentMethod = isInternational ? paymentMethod : 'card'
    const input: CheckoutInput = {
      items: items.map((item) => ({ artworkId: item.artwork.id, quantity: item.quantity })),
      deliveryType,
      paymentMethod: method,
      shipping: {
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        address: formData.address.trim() || 'Lagos pickup',
        phone: formData.phone.trim() || undefined,
      },
    }
    track('checkout_start', { delivery: deliveryType, method })
    await start(input)
    // Redirect providers navigate away inside start(); crypto returns details.
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="bg-black border border-border-blue rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto"
        style={{ animation: 'scale-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        {/* Step indicator */}
        <div className="flex gap-2 p-6 border-b border-border-default">
          {[1, 2].map((i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full transition-all ${
                i <= step ? 'bg-blue-bright' : 'bg-border-default'
              }`}
            />
          ))}
        </div>

        <div className="p-8">
          {/* Step 1: Details */}
          {step === 1 && (
            <div>
              <h2
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
                  <option value="lagos" className="bg-black">
                    Lagos Pickup
                  </option>
                  <option value="nigeria" className="bg-black">
                    Nigeria Delivery
                  </option>
                  <option value="international" className="bg-black">
                    International Shipping
                  </option>
                </select>

                {deliveryType !== 'lagos' && (
                  <textarea
                    name="address"
                    placeholder="Shipping Address (street, city, country)"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={2}
                    className={`${fieldClass} resize-none`}
                  />
                )}
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
                className="font-bebas text-white mb-6"
                style={{ fontSize: '24px', letterSpacing: '0.04em' }}
              >
                PAYMENT
              </h2>

              {/* Method tabs — crypto only offered for international orders */}
              {isInternational && (
                <div className="flex gap-2 mb-8">
                  {(['card', 'crypto'] as const).map((method) => (
                    <button
                      type="button"
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`flex-1 py-3 px-4 border transition-all font-barlow ${
                        paymentMethod === method
                          ? 'border-blue-bright bg-blue-glow-soft'
                          : 'border-border-default'
                      }`}
                      style={{ fontSize: '11px', letterSpacing: '0.2em' }}
                    >
                      {method === 'card' ? '💳 CARD' : '₿ BITCOIN'}
                    </button>
                  ))}
                </div>
              )}

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
                      {isInternational
                        ? formatUsd(item.artwork.priceUsdCents * item.quantity)
                        : formatNgn(item.artwork.priceNgnKobo * item.quantity)}
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

              {/* Crypto: show the live BTC address once the order is created */}
              {crypto ? (
                <div className="space-y-4">
                  <div className="bg-panel p-4 rounded">
                    <p className="text-xs text-muted mb-2" style={{ letterSpacing: '0.16em' }}>
                      SEND EXACTLY
                    </p>
                    <p className="font-bebas text-gold text-xl mb-3">{crypto.amountBtc} BTC</p>
                    <p className="text-xs text-muted mb-1" style={{ letterSpacing: '0.16em' }}>
                      TO ADDRESS
                    </p>
                    <div className="font-mono text-xs text-white/70 break-all mb-3">
                      {crypto.address}
                    </div>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(crypto.address)}
                      className="text-blue-bright text-xs hover:text-blue-dim transition-colors"
                      style={{ letterSpacing: '0.2em' }}
                    >
                      COPY ADDRESS
                    </button>
                  </div>
                  <p
                    className="text-xs text-muted"
                    style={{ fontSize: '9px', letterSpacing: '0.16em' }}
                  >
                    Payment confirms automatically after network confirmations.
                  </p>
                  {orderNumber && (
                    <a
                      href={`/order/${orderNumber}`}
                      className="block w-full text-center bg-blue-primary hover:bg-blue-bright text-white py-3 font-barlow"
                      style={{ fontSize: '11px', letterSpacing: '0.22em' }}
                    >
                      VIEW ORDER STATUS →
                    </a>
                  )}
                </div>
              ) : (
                <>
                  <p
                    className="mb-4 text-xs text-muted"
                    style={{ fontSize: '9px', letterSpacing: '0.16em' }}
                  >
                    You'll be redirected to a secure checkout. Card details are never stored by
                    BOANERGES.
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
                </>
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
