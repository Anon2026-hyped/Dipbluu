import { z } from 'zod'

// Shipping captures the four fields the brief specifies: full name, email,
// address (single free-text block — may include city/country), phone (optional).
export const shippingSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(120),
  email: z.string().email('A valid email is required'),
  address: z.string().min(1, 'Shipping address is required').max(400),
  phone: z.string().max(40).optional(),
})

export const checkoutItemSchema = z.object({
  artworkId: z.string().min(1),
  printOptionId: z.string().min(1).optional(),
  quantity: z.number().int().min(1).max(20),
})

export const checkoutSchema = z.object({
  items: z.array(checkoutItemSchema).min(1, 'Cart is empty'),
  deliveryType: z.enum(['standard', 'international']),
  paymentMethod: z.enum(['card', 'crypto']),
  shipping: shippingSchema,
})

export type ShippingInput = z.infer<typeof shippingSchema>
export type CheckoutItemInput = z.infer<typeof checkoutItemSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
