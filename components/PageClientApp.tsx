'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { Cursor } from '@/components/ui/Cursor'
import { Navbar } from '@/components/layout/Navbar'
import { MenuOverlay } from '@/components/layout/MenuOverlay'
import { Hero } from '@/components/sections/Hero'
import { Marquee } from '@/components/sections/Marquee'
import { DropInfo } from '@/components/sections/DropInfo'
import { Gallery } from '@/components/sections/Gallery'
import { Acquire } from '@/components/sections/Acquire'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { QuoteBlock } from '@/components/sections/QuoteBlock'
import { FAQ } from '@/components/sections/FAQ'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/ui/CartDrawer'
import { CheckoutModal } from '@/components/ui/CheckoutModal'
import { Toast } from '@/components/ui/Toast'

export default function PageClientApp() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [toast, setToast] = useState({ visible: false, message: '', product: '' })

  const cartItems = useCartStore((state) => state.items)
  const cartCount = cartItems.length

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen)
    if (isCartOpen) setIsCartOpen(false)
  }

  const handleCartClick = () => {
    setIsCartOpen(!isCartOpen)
    if (isMenuOpen) setIsMenuOpen(false)
  }

  const handleCheckout = () => {
    setIsCartOpen(false)
    setIsCheckoutOpen(true)
  }

  return (
    <>
      <Cursor />

      <div className="min-h-screen bg-black text-white">
        <Navbar onMenuClick={handleCartClick} cartCount={cartCount} />

        <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          onCheckout={handleCheckout}
        />

        <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />

        <Toast
          isVisible={toast.visible}
          message={toast.message}
          productName={toast.product}
          onClose={() => setToast({ ...toast, visible: false })}
        />

        <main>
          <Hero />
          <Marquee />
          <DropInfo />
          <Gallery />
          <Acquire />
          <HowItWorks />
          <QuoteBlock />
          <FAQ />
        </main>

        <Footer />
      </div>
    </>
  )
}
