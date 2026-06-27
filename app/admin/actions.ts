'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getAdminUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { artworkInputSchema } from '@/lib/validation/artwork'
import {
  type ArtworkWriteInput,
  addArtworkImage,
  createArtwork,
  deleteArtwork,
  updateArtwork,
} from '@/server/repositories/adminArtworks'

export interface ActionState {
  error?: string
}

function toWriteInput(formData: FormData): ArtworkWriteInput | { error: string } {
  const parsed = artworkInputSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  }
  const d = parsed.data
  return {
    title: d.title,
    slug: d.slug,
    medium: d.medium,
    edition: d.edition,
    description: d.description,
    status: d.status,
    priceUsdCents: Math.round(d.priceUsd * 100),
    stock: d.stock,
    editionSize: d.editionSize,
  }
}

export async function createArtworkAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await getAdminUser())) return { error: 'Unauthorized.' }

  const input = toWriteInput(formData)
  if ('error' in input) return input

  try {
    const artworkId = await createArtwork(input)
    const image = formData.get('image')
    if (image instanceof File && image.size > 0) {
      await addArtworkImage(artworkId, image, input.title)
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to create artwork.' }
  }

  revalidatePath('/admin')
  redirect('/admin')
}

export async function updateArtworkAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await getAdminUser())) return { error: 'Unauthorized.' }

  const id = formData.get('id')
  if (typeof id !== 'string') return { error: 'Missing artwork id.' }

  const input = toWriteInput(formData)
  if ('error' in input) return input

  try {
    await updateArtwork(id, input)
    const image = formData.get('image')
    if (image instanceof File && image.size > 0) {
      await addArtworkImage(id, image, input.title)
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to update artwork.' }
  }

  revalidatePath('/admin')
  redirect('/admin')
}

export async function deleteArtworkAction(formData: FormData): Promise<void> {
  if (!(await getAdminUser())) return
  const id = formData.get('id')
  if (typeof id === 'string') {
    await deleteArtwork(id)
    revalidatePath('/admin')
  }
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient()
  if (supabase) await supabase.auth.signOut()
  redirect('/admin/login')
}
