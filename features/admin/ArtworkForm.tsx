'use client'

import { useActionState } from 'react'
import type { ActionState } from '@/app/admin/actions'

export interface ArtworkFormValues {
  title: string
  slug: string
  medium: string
  edition: string
  description: string
  status: 'draft' | 'published' | 'sold_out'
  priceUsd: number
  stock: number
  editionSize: number | ''
}

interface ArtworkFormProps {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>
  artworkId?: string
  initial?: ArtworkFormValues
  submitLabel: string
}

const field =
  'w-full border-white/14 border-b bg-transparent pb-2 text-sm text-white placeholder:text-muted transition-colors focus:border-blue-bright'
const labelText = 'mb-2 block font-barlow text-muted text-xs tracking-widest'

export function ArtworkForm({ action, artworkId, initial, submitLabel }: ArtworkFormProps) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, {})

  return (
    <form action={formAction} className="max-w-xl space-y-6">
      {artworkId && <input type="hidden" name="id" value={artworkId} />}

      <label className="block">
        <span className={labelText}>TITLE</span>
        <input name="title" required defaultValue={initial?.title} className={field} />
      </label>

      <div className="grid grid-cols-2 gap-6">
        <label className="block">
          <span className={labelText}>SLUG</span>
          <input
            name="slug"
            required
            defaultValue={initial?.slug}
            placeholder="the-lion"
            className={field}
          />
        </label>
        <label className="block">
          <span className={labelText}>STATUS</span>
          <select
            name="status"
            defaultValue={initial?.status ?? 'draft'}
            className={`${field} text-white`}
          >
            <option value="draft" className="bg-black">
              Draft
            </option>
            <option value="published" className="bg-black">
              Published
            </option>
            <option value="sold_out" className="bg-black">
              Sold out
            </option>
          </select>
        </label>
      </div>

      <label className="block">
        <span className={labelText}>MEDIUM</span>
        <input
          name="medium"
          defaultValue={initial?.medium}
          placeholder="Oil on Canvas"
          className={field}
        />
      </label>

      <label className="block">
        <span className={labelText}>EDITION</span>
        <input
          name="edition"
          defaultValue={initial?.edition}
          placeholder="EDITION OF 111"
          className={field}
        />
      </label>

      <label className="block">
        <span className={labelText}>DESCRIPTION</span>
        <textarea
          name="description"
          rows={3}
          defaultValue={initial?.description}
          className={`${field} resize-none`}
        />
      </label>

      <label className="block">
        <span className={labelText}>PRICE (USD)</span>
        <input
          name="priceUsd"
          type="number"
          step="0.01"
          min="0"
          required
          defaultValue={initial?.priceUsd}
          className={field}
        />
      </label>

      <div className="grid grid-cols-2 gap-6">
        <label className="block">
          <span className={labelText}>STOCK</span>
          <input
            name="stock"
            type="number"
            step="1"
            min="0"
            defaultValue={initial?.stock ?? 0}
            className={field}
          />
        </label>
        <label className="block">
          <span className={labelText}>EDITION SIZE</span>
          <input
            name="editionSize"
            type="number"
            step="1"
            min="0"
            defaultValue={initial?.editionSize}
            className={field}
          />
        </label>
      </div>

      <label className="block">
        <span className={labelText}>IMAGE {artworkId ? '(adds another)' : ''}</span>
        <input name="image" type="file" accept="image/*" className="text-sm text-white/70" />
      </label>

      {state.error && <p className="text-red-400 text-xs">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="bg-blue-primary px-8 py-3 font-barlow text-white transition-all hover:bg-blue-bright disabled:opacity-40"
        style={{ fontSize: '11px', letterSpacing: '0.22em' }}
      >
        {pending ? 'SAVING…' : submitLabel}
      </button>
    </form>
  )
}
