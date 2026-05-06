import { create } from 'zustand'
import type { CartItem, Artwork } from '@/types'

interface CartState {
  items: CartItem[]
  addItem: (artwork: Artwork, quantity: number) => void
  removeItem: (artworkId: string) => void
  updateQuantity: (artworkId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getTotalNGN: () => string
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (artwork, quantity = 1) => {
    set((state) => {
      const existing = state.items.find((item) => item.artwork.id === artwork.id)
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.artwork.id === artwork.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        }
      }
      return {
        items: [
          ...state.items,
          {
            id: `${artwork.id}-${Date.now()}`,
            artwork,
            quantity,
          },
        ],
      }
    })
  },
  removeItem: (artworkId) => {
    set((state) => ({
      items: state.items.filter((item) => item.artwork.id !== artworkId),
    }))
  },
  updateQuantity: (artworkId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(artworkId)
    } else {
      set((state) => ({
        items: state.items.map((item) =>
          item.artwork.id === artworkId ? { ...item, quantity } : item
        ),
      }))
    }
  },
  clearCart: () => set({ items: [] }),
  getTotal: () => {
    return get().items.reduce(
      (sum, item) => sum + item.artwork.price * item.quantity,
      0
    )
  },
  getTotalNGN: () => {
    const total = get().items.reduce(
      (sum, item) =>
        sum +
        parseInt(item.artwork.priceNGN.replace(/,/g, '')) * item.quantity,
      0
    )
    return total.toLocaleString('en-NG')
  },
}))
