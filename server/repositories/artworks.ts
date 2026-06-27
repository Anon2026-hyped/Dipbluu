import 'server-only'

import { artworks as seedArtworks } from '@/lib/artworks'
import { isSupabaseConfigured, publicEnv, storageBucket } from '@/lib/env'
import { createClient } from '@/lib/supabase/server'
import type { Artwork } from '@/types'
import type { ArtworkImageRow, ArtworkRow, PrintOptionRow } from '@/types/database'

type ArtworkWithRelations = ArtworkRow & {
  print_options: PrintOptionRow[]
  artwork_images: ArtworkImageRow[]
}

function publicImageUrl(path: string): string {
  return `${publicEnv.supabaseUrl}/storage/v1/object/public/${storageBucket}/${path}`
}

/** Map a DB row (+ its cheapest print option, primary image) to the app's Artwork shape. */
function toArtwork(row: ArtworkWithRelations): Artwork {
  const cheapest = [...row.print_options].sort((a, b) => a.price_usd_cents - b.price_usd_cents)[0]
  const primary = [...(row.artwork_images ?? [])].sort((a, b) => a.position - b.position)[0]
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    medium: row.medium ?? undefined,
    edition: row.edition,
    description: row.description ?? undefined,
    priceUsdCents: cheapest?.price_usd_cents ?? 0,
    imageUrl: primary ? publicImageUrl(primary.storage_path) : undefined,
    blurhash: primary?.blurhash ?? undefined,
  }
}

const SELECT = '*, print_options(*), artwork_images(*)'

/** Published artworks. Falls back to seed data when Supabase isn't configured. */
export async function getArtworks(): Promise<Artwork[]> {
  if (!isSupabaseConfigured) return seedArtworks

  const supabase = await createClient()
  if (!supabase) return seedArtworks

  const { data, error } = await supabase
    .from('artworks')
    .select(SELECT)
    .eq('status', 'published')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('[artworks] getArtworks failed, falling back to seed:', error.message)
    return seedArtworks
  }
  return (data as ArtworkWithRelations[]).map(toArtwork)
}

/** Single published artwork by slug, or null. */
export async function getArtworkBySlug(slug: string): Promise<Artwork | null> {
  if (!isSupabaseConfigured) {
    return seedArtworks.find((a) => a.slug === slug) ?? null
  }

  const supabase = await createClient()
  if (!supabase) return seedArtworks.find((a) => a.slug === slug) ?? null

  const { data, error } = await supabase
    .from('artworks')
    .select(SELECT)
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (error) {
    console.error('[artworks] getArtworkBySlug failed:', error.message)
    return null
  }
  return data ? toArtwork(data as ArtworkWithRelations) : null
}
