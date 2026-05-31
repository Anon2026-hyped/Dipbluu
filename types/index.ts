export interface Artwork {
  id: string
  /** URL-safe identifier for routing (e.g. /art/the-lion). */
  slug: string
  title: string
  edition: string
  /** Price in USD minor units (cents). e.g. 2200 = $22.00 */
  priceUsdCents: number
  /** Price in NGN minor units (kobo). e.g. 3_333_300 = ₦33,333 */
  priceNgnKobo: number
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

export type DeliveryType = 'lagos' | 'nigeria' | 'international'
export type PaymentMethod = 'card' | 'crypto'
export type OrderStatus = 'pending' | 'completed' | 'failed'

export interface Order {
  id: string
  items: CartItem[]
  /** Order total in USD minor units (cents). */
  totalUsdCents: number
  /** Order total in NGN minor units (kobo). */
  totalNgnKobo: number
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
