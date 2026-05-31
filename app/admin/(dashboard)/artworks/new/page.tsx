import { createArtworkAction } from '@/app/admin/actions'
import { ArtworkForm } from '@/features/admin/ArtworkForm'

export default function NewArtworkPage() {
  return (
    <div>
      <h1 className="mb-8 font-bebas text-4xl">NEW ARTWORK</h1>
      <ArtworkForm action={createArtworkAction} submitLabel="CREATE ARTWORK →" />
    </div>
  )
}
