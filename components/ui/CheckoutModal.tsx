'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, clearCart, getTotalNGN } = useCartStore()
  const [step, setStep] = useState(1)
  const [deliveryType, setDeliveryType] = useState<'lagos' | 'nigeria' | 'international'>(
    'lagos'
  )
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto'>('card')
  const [selectedCrypto, setSelectedCrypto] = useState<'BTC' | 'ETH' | 'USDT' | 'USDC'>('BTC')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  })
  const [orderRef, setOrderRef] = useState<string>('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleStepAdvance = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handleSubmitPayment = () => {
    const ref = `DP${Date.now()}`
    setOrderRef(ref)
    setStep(3)
  }

  const handleClose = () => {
    clearCart()
    setStep(1)
    setFormData({ firstName: '', lastName: '', email: '', phone: '', address: '' })
    setOrderRef('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="bg-black border border-border-blue rounded-lg max-w-lg w-full max-h-96 overflow-y-auto"
        style={{ animation: 'scale-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        {/* Step indicator */}
        <div className="flex gap-2 p-6 border-b border-border-default">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full transition-all ${
                i <= step ? 'bg-blue-bright' : 'bg-border-default'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Step 1: Details */}
          {step === 1 && (
            <div>
              <h2
                className="font-bebas text-white mb-6"
                style={{
                  fontSize: '24px',
                  letterSpacing: '0.04em',
                }}
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
                  className="w-full bg-transparent border-b border-white/14 focus:border-blue-bright pb-2 text-sm placeholder:text-muted transition-colors"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-white/14 focus:border-blue-bright pb-2 text-sm placeholder:text-muted transition-colors"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-white/14 focus:border-blue-bright pb-2 text-sm placeholder:text-muted transition-colors"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-white/14 focus:border-blue-bright pb-2 text-sm placeholder:text-muted transition-colors"
                />

                <select
                  value={deliveryType}
                  onChange={(e) =>
                    setDeliveryType(e.target.value as 'lagos' | 'nigeria' | 'international')
                  }
                  className="w-full bg-transparent border-b border-white/14 focus:border-blue-bright pb-2 text-sm text-white"
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

                {(deliveryType === 'nigeria' || deliveryType === 'international') && (
                  <input
                    type="text"
                    name="address"
                    placeholder="Delivery Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-white/14 focus:border-blue-bright pb-2 text-sm placeholder:text-muted transition-colors"
                  />
                )}
              </div>

              <button
                onClick={handleStepAdvance}
                className="w-full bg-blue-primary hover:bg-blue-bright text-white py-3 font-barlow"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.22em',
                }}
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
                style={{
                  fontSize: '24px',
                  letterSpacing: '0.04em',
                }}
              >
                PAYMENT METHOD
              </h2>

              {/* Method tabs */}
              <div className="flex gap-2 mb-8">
                {['card', 'crypto'].map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method as 'card' | 'crypto')}
                    className={`flex-1 py-3 px-4 border transition-all font-barlow ${
                      paymentMethod === method
                        ? 'border-blue-bright bg-blue-glow-soft'
                        : 'border-border-default'
                    }`}
                    style={{
                      fontSize: '11px',
                      letterSpacing: '0.2em',
                    }}
                  >
                    {method === 'card' ? '💳 PAYSTACK' : '₿ CRYPTO'}
                  </button>
                ))}
              </div>

              {paymentMethod === 'card' ? (
                <div className="space-y-6 mb-8">
                  {/* Order summary */}
                  <div className="border border-border-default p-4">
                    <div
                      className="font-barlow text-muted text-xs mb-4"
                      style={{ letterSpacing: '0.2em' }}
                    >
                      ORDER SUMMARY
                    </div>
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm mb-2">
                        <span className="text-white/65">{item.artwork.title}</span>
                        <span className="text-blue-bright">{item.artwork.priceNGN}</span>
                      </div>
                    ))}
                    <div className="border-t border-border-default pt-4 mt-4 flex justify-between">
                      <span className="font-barlow" style={{ fontSize: '11px', letterSpacing: '0.22em' }}>
                        TOTAL
                      </span>
                      <span className="font-bebas text-blue-bright text-xl">{getTotalNGN()}</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted" style={{ fontSize: '9px', letterSpacing: '0.16em' }}>
                    Card details never stored by DIPBLU
                  </p>

                  <button
                    onClick={handleSubmitPayment}
                    className="w-full bg-blue-primary hover:bg-blue-bright text-white py-3 font-barlow"
                    style={{
                      fontSize: '11px',
                      letterSpacing: '0.22em',
                    }}
                  >
                    PAY WITH PAYSTACK →
                  </button>
                </div>
              ) : (
                <div className="space-y-6 mb-8">
                  {/* Coin selector */}
                  <div className="flex gap-2 flex-wrap">
                    {['BTC', 'ETH', 'USDT', 'USDC'].map((coin) => (
                      <button
                        key={coin}
                        onClick={() => setSelectedCrypto(coin as any)}
                        className={`px-4 py-2 border transition-all text-xs font-barlow ${
                          selectedCrypto === coin
                            ? 'border-gold text-gold'
                            : 'border-border-default text-white/60'
                        }`}
                        style={{ letterSpacing: '0.2em' }}
                      >
                        {coin}
                      </button>
                    ))}
                  </div>

                  {/* Wallet address */}
                  <div className="bg-panel p-4 rounded sm">
                    <p className="text-xs text-muted mb-3" style={{ letterSpacing: '0.16em' }}>
                      SEND TO:
                    </p>
                    <div className="font-mono text-xs text-white/70 break-all mb-3">
                      {selectedCrypto === 'BTC'
                        ? 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
                        : selectedCrypto === 'ETH'
                          ? '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
                          : selectedCrypto === 'USDT'
                            ? 'TJRabPrwbZy45sbavfcjoeQDEc17A5aQSr'
                            : '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'}
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          selectedCrypto === 'BTC'
                            ? 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
                            : selectedCrypto === 'ETH'
                              ? '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
                              : selectedCrypto === 'USDT'
                                ? 'TJRabPrwbZy45sbavfcjoeQDEc17A5aQSr'
                                : '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
                        )
                      }}
                      className="text-blue-bright text-xs hover:text-blue-dim transition-colors"
                      style={{ letterSpacing: '0.2em' }}
                    >
                      COPY
                    </button>
                  </div>

                  <p className="text-xs text-muted" style={{ fontSize: '9px', letterSpacing: '0.16em' }}>
                    Amount: {getTotalNGN()} (~$USD equivalent)
                  </p>

                  <button
                    onClick={handleSubmitPayment}
                    className="w-full bg-blue-primary hover:bg-blue-bright text-white py-3 font-barlow"
                    style={{
                      fontSize: '11px',
                      letterSpacing: '0.22em',
                    }}
                  >
                    I HAVE SENT PAYMENT →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="text-center">
              <div
                className="text-5xl text-blue-bright mb-6"
                style={{ animation: 'scale-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
              >
                ✦
              </div>
              <h2
                className="font-bebas text-white mb-4"
                style={{
                  fontSize: '36px',
                  letterSpacing: '0.04em',
                }}
              >
                ORDER PLACED
              </h2>
              <p
                className="font-garamond italic text-white/65 mb-6"
                style={{
                  fontSize: '16px',
                  lineHeight: '1.7',
                }}
              >
                Your order has been received. You&apos;ll receive a confirmation email shortly. See you
                at the unboxing.
              </p>
              <div
                className="font-cinzel text-blue-bright text-sm mb-8"
                style={{ letterSpacing: '0.18em' }}
              >
                REF: {orderRef}
              </div>

              <button
                onClick={handleClose}
                className="w-full bg-blue-primary hover:bg-blue-bright text-white py-3 font-barlow"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.22em',
                }}
              >
                CLOSE
              </button>
            </div>
          )}
        </div>

        <style>{`
          @keyframes scale-in {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  )
}
