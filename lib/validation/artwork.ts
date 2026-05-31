import { z } from 'zod'

// Admin form input. Prices are entered in major units (dollars / naira) and
// converted to minor units before persisting.
export const artworkInputSchema = z.object({
  title: z.string().min(1, 'Title is required').max(120),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(120)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers and hyphens'),
  edition: z.string().max(120).default(''),
  description: z.string().max(2000).optional(),
  status: z.enum(['draft', 'published', 'sold_out']).default('draft'),
  priceUsd: z.coerce.number().min(0, 'Price must be ≥ 0'),
  priceNgn: z.coerce.number().min(0, 'Price must be ≥ 0'),
  stock: z.coerce.number().int().min(0).default(0),
  editionSize: z.coerce.number().int().min(0).optional(),
})

export type ArtworkInput = z.infer<typeof artworkInputSchema>
