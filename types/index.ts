export interface Artwork {
  id: string
  /** URL-safe identifier for routing (e.g. /art/nwunye-odogwu). */
  slug: string
  title: string
  /** Material medium, e.g. "Oil on Canvas" or "Acrylic on Canvas". */
  medium?: string
  edition: string
  /** Price in USD minor units (cents). e.g. 200000 = $2,000.00 */
  priceUsdCents: number
  description?: string
  /** Public URL of the primary image (Supabase Storage), when available. */
  imageUrl?: string
  /** Blurhash placeholder for the primary image, when available. */
  blurhash?: string
}

export interface CartItem {
  id: string
  artwork: Artwork
  quantity: number
}

export type DeliveryType = 'standard' | 'international'
export type PaymentMethod = 'card' | 'crypto'
export type OrderStatus = 'pending' | 'completed' | 'failed'

export interface Order {
  id: string
  items: CartItem[]
  /** Order total in USD minor units (cents). */
  totalUsdCents: number
  email: string
  firstName: string
  lastName: string
  phone: string
  deliveryType: DeliveryType
  address?: string
  paymentMethod: PaymentMethod
  status: OrderStatus
  createdAt: Date
}
