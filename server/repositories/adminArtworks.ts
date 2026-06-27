import 'server-only'

import { randomUUID } from 'node:crypto'
import { storageBucket } from '@/lib/env'
import { createAdminClient } from '@/lib/supabase/admin'
import type { ArtworkImageRow, ArtworkRow, PrintOptionRow } from '@/types/database'

export interface AdminArtwork extends ArtworkRow {
  print_options: PrintOptionRow[]
  artwork_images: ArtworkImageRow[]
}

export interface ArtworkWriteInput {
  title: string
  slug: string
  medium?: string
  edition: string
  description?: string
  status: 'draft' | 'published' | 'sold_out'
  priceUsdCents: number
  stock: number
  editionSize?: number
}

/** All artworks incl. drafts (service role bypasses RLS). Newest first. */
export async function listAllArtworks(): Promise<AdminArtwork[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('artworks')
    .select('*, print_options(*), artwork_images(*)')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as AdminArtwork[]
}

export async function getAdminArtwork(id: string): Promise<AdminArtwork | null> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('artworks')
    .select('*, print_options(*), artwork_images(*)')
    .eq('id', id)
    .maybeSingle()
  return (data as AdminArtwork) ?? null
}

export async function createArtwork(input: ArtworkWriteInput): Promise<string> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('artworks')
    .insert({
      slug: input.slug,
      title: input.title,
      medium: input.medium ?? null,
      edition: input.edition,
      description: input.description ?? null,
      status: input.status,
    })
    .select('id')
    .single()
  if (error || !data) throw new Error(`createArtwork failed: ${error?.message ?? 'unknown'}`)

  const artworkId = data.id as string
  const { error: optError } = await supabase.from('print_options').insert({
    artwork_id: artworkId,
    name: 'Standard Print',
    edition_size: input.editionSize ?? null,
    stock: input.stock,
    price_usd_cents: input.priceUsdCents,
  })
  if (optError) throw new Error(`print option failed: ${optError.message}`)
  return artworkId
}

export async function updateArtwork(id: string, input: ArtworkWriteInput): Promise<void> {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('artworks')
    .update({
      slug: input.slug,
      title: input.title,
      medium: input.medium ?? null,
      edition: input.edition,
      description: input.description ?? null,
      status: input.status,
    })
    .eq('id', id)
  if (error) throw new Error(`updateArtwork failed: ${error.message}`)

  await supabase
    .from('print_options')
    .update({
      stock: input.stock,
      edition_size: input.editionSize ?? null,
      price_usd_cents: input.priceUsdCents,
    })
    .eq('artwork_id', id)
}

export async function deleteArtwork(id: string): Promise<void> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('artworks').delete().eq('id', id)
  if (error) throw new Error(`deleteArtwork failed: ${error.message}`)
}

/** Uploads an image to Storage and records it. Handles upload failures cleanly. */
export async function addArtworkImage(artworkId: string, file: File, alt: string): Promise<void> {
  const supabase = createAdminClient()
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const path = `${artworkId}/${randomUUID()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from(storageBucket)
    .upload(path, file, { contentType: file.type, upsert: false })
  if (uploadError) throw new Error(`image upload failed: ${uploadError.message}`)

  const { error: rowError } = await supabase.from('artwork_images').insert({
    artwork_id: artworkId,
    storage_path: path,
    alt,
    position: 0,
  })
  // Roll back the orphaned upload if the DB row fails.
  if (rowError) {
    await supabase.storage.from(storageBucket).remove([path])
    throw new Error(`image record failed: ${rowError.message}`)
  }
}
