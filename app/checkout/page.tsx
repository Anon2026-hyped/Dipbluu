'use client'

import Link from 'next/link'

export default function CheckoutPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-32 text-center">
      <h1 className="mb-6 text-5xl font-bebas">CHECKOUT</h1>
      <p className="mb-8 text-white/60 font-garamond italic">
        Checkout is handled directly from your cart. Return home to continue shopping.
      </p>
      <Link
        href="/"
        className="inline-block border border-blue-bright text-blue-bright px-8 py-4 font-barlow hover:bg-blue-bright hover:text-black transition-all"
        style={{
          fontSize: '11px',
          letterSpacing: '0.22em',
        }}
      >
        BACK TO SHOP
      </Link>
    </section>
  )
}
