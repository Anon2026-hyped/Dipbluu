'use client'

import { useState } from 'react'
import { Footer } from '@/components/layout/Footer'
import { MenuOverlay } from '@/components/layout/MenuOverlay'
import { Navbar } from '@/components/layout/Navbar'
import { Acquire } from '@/components/sections/Acquire'
import { DropInfo } from '@/components/sections/DropInfo'
import { FAQ } from '@/components/sections/FAQ'
import { Gallery } from '@/components/sections/Gallery'
import { Hero } from '@/components/sections/Hero'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { Marquee } from '@/components/sections/Marquee'
import { QuoteBlock } from '@/components/sections/QuoteBlock'
import { AmbientSound } from '@/components/ui/AmbientSound'
import { CartDrawer } from '@/components/ui/CartDrawer'
import { CheckoutModal } from '@/components/ui/CheckoutModal'
import { Cursor } from '@/components/ui/Cursor'
import { Toast } from '@/components/ui/Toast'
import { useCartStore } from '@/features/cart'
import type { Artwork } from '@/types'

/**
 * Client island for the home route — owns the interactive overlay state
 * (menu / cart / checkout). Rendered by the server component app/page.tsx.
 */
export function HomeExperience({ artworks }: { artworks: Artwork[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [toast, setToast] = useState({ visible: false, message: '', product: '' })

  const cartCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  )

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
        <Navbar
          onCartClick={handleCartClick}
          onMenuClick={handleMenuClick}
          cartCount={cartCount}
          isMenuOpen={isMenuOpen}
        />

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
          <Gallery artworks={artworks} />
          <Acquire />
          <HowItWorks />
          <QuoteBlock />
          <FAQ />
        </main>

        <Footer />
      </div>

      <AmbientSound />
    </>
  )
}
