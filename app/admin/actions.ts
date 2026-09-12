export type ActionState = { error?: string }

export async function createArtworkAction(): Promise<ActionState> {
  return { error: 'Artwork management is disabled in manual fulfillment mode.' }
}

export async function updateArtworkAction(): Promise<ActionState> {
  return { error: 'Artwork management is disabled in manual fulfillment mode.' }
}

export async function deleteArtworkAction(): Promise<void> {
  return
}

export async function signOutAction(): Promise<void> {
  return
}
