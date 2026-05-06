'use client'

import { createContext, useContext, useState } from 'react'

interface CartContextValue {
  items: unknown[]
  addItem: (item: unknown) => void
}

const CartContext = createContext<CartContextValue>({ items: [], addItem: () => {} })

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<unknown[]>([])
  const addItem = (item: unknown) => setItems((current) => [...current, item])

  return <CartContext.Provider value={{ items, addItem }}>{children}</CartContext.Provider>
}

export function useCart() {
  return useContext(CartContext)
}
