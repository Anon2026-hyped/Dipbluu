/**
 * Hand-written Supabase schema types (mirror of supabase/migrations).
 * When the Supabase CLI is wired up, replace with `supabase gen types`.
 *
 * Money columns are integer minor units (USD cents / NGN kobo), matching lib/money.ts.
 */

export type ArtworkStatus = 'draft' | 'published' | 'sold_out'
export type OrderStatus =
  | 'draft'
  | 'pending_payment'
  | 'paid'
  | 'fulfilled'
  | 'shipped'
  | 'delivered'
  | 'failed'
  | 'cancelled'
  | 'refunded'
export type PaymentProvider = 'stripe' | 'blockonomics' | 'paystack'
export type PaymentStatus = 'pending' | 'confirmed' | 'failed' | 'expired'
export type DeliveryType = 'lagos' | 'nigeria' | 'international'

export interface ArtworkRow {
  id: string
  slug: string
  title: string
  edition: string
  description: string | null
  status: ArtworkStatus
  created_at: string
  updated_at: string
}

export interface ArtworkImageRow {
  id: string
  artwork_id: string
  storage_path: string
  alt: string | null
  width: number | null
  height: number | null
  blurhash: string | null
  position: number
}

export interface PrintOptionRow {
  id: string
  artwork_id: string
  name: string
  edition_size: number | null
  stock: number
  price_usd_cents: number
  price_ngn_kobo: number
}

export interface OrderRow {
  id: string
  order_number: string
  email: string
  status: OrderStatus
  currency: string
  subtotal_minor: number
  shipping_minor: number
  total_minor: number
  payment_provider: PaymentProvider | null
  payment_status: PaymentStatus | null
  idempotency_key: string | null
  created_at: string
  updated_at: string
}

export interface OrderItemRow {
  id: string
  order_id: string
  artwork_id: string | null
  print_option_id: string | null
  title_snapshot: string
  unit_price_minor: number
  quantity: number
}

export interface ShippingAddressRow {
  order_id: string
  full_name: string
  email: string
  line1: string
  line2: string | null
  city: string | null
  state: string | null
  postal_code: string | null
  country: string | null
  phone: string | null
}

export interface PaymentRow {
  id: string
  order_id: string
  provider: PaymentProvider
  provider_ref: string
  status: PaymentStatus
  amount_minor: number
  currency: string
  raw: unknown
  created_at: string
}

export interface WebhookEventRow {
  id: string
  provider: PaymentProvider
  event_id: string
  payload: unknown
  processed_at: string
}

type Insert<T, Optional extends keyof T> = Omit<T, Optional> & Partial<Pick<T, Optional>>

export interface Database {
  public: {
    Tables: {
      artworks: {
        Row: ArtworkRow
        Insert: Insert<ArtworkRow, 'id' | 'created_at' | 'updated_at' | 'description' | 'status'>
        Update: Partial<ArtworkRow>
        Relationships: []
      }
      artwork_images: {
        Row: ArtworkImageRow
        Insert: Insert<ArtworkImageRow, 'id' | 'alt' | 'width' | 'height' | 'blurhash' | 'position'>
        Update: Partial<ArtworkImageRow>
        Relationships: []
      }
      print_options: {
        Row: PrintOptionRow
        Insert: Insert<PrintOptionRow, 'id' | 'edition_size' | 'stock'>
        Update: Partial<PrintOptionRow>
        Relationships: []
      }
      orders: {
        Row: OrderRow
        Insert: Insert<
          OrderRow,
          | 'id'
          | 'created_at'
          | 'updated_at'
          | 'status'
          | 'shipping_minor'
          | 'payment_provider'
          | 'payment_status'
          | 'idempotency_key'
        >
        Update: Partial<OrderRow>
        Relationships: []
      }
      order_items: {
        Row: OrderItemRow
        Insert: Insert<OrderItemRow, 'id' | 'artwork_id' | 'print_option_id'>
        Update: Partial<OrderItemRow>
        Relationships: []
      }
      shipping_addresses: {
        Row: ShippingAddressRow
        Insert: Insert<ShippingAddressRow, 'line2' | 'state' | 'postal_code' | 'phone'>
        Update: Partial<ShippingAddressRow>
        Relationships: []
      }
      payments: {
        Row: PaymentRow
        Insert: Insert<PaymentRow, 'id' | 'created_at'>
        Update: Partial<PaymentRow>
        Relationships: []
      }
      webhook_events: {
        Row: WebhookEventRow
        Insert: Insert<WebhookEventRow, 'id' | 'processed_at'>
        Update: Partial<WebhookEventRow>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
