export interface Artwork {
  id: 'lion' | 'crown' | 'altar'
  title: string
  edition: string
  price: number
  priceNGN: string
  description?: string
}

export interface CartItem {
  id: string
  artwork: Artwork
  quantity: number
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  totalNGN: string
  email: string
  firstName: string
  lastName: string
  phone: string
  deliveryType: 'lagos' | 'nigeria' | 'international'
  address?: string
  paymentMethod: 'card' | 'crypto'
  status: 'pending' | 'completed' | 'failed'
  createdAt: Date
}

export interface PayStackResponse {
  status: boolean
  message: string
  data?: {
    authorization_url: string
    access_code: string
    reference: string
  }
}
