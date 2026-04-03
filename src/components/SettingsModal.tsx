import { useState } from 'react'
import { ModalScrim } from './ModalScrim'

interface SettingsModalProps {
  tripName: string
  collaboratorCount: number
  onClose: () => void
  onSave: (name: string, count: number) => void
  onBannerFile: (file: File) => void
}

export const SettingsModal = ({
  tripName,
  collaboratorCount,
  onClose,
  onSave,
  onBannerFile,
}: SettingsModalProps) => {
  const [name, setName] = useState(tripName)
  const [count, setCount] = useState(String(collaboratorCount))

  return (
    <ModalScrim title="Trip settings" onClose={onClose}>
      <label className="block text-xs font-medium text-zinc-400">Trip name</label>
      <input
        className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none ring-emerald-500/0 focus:ring-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label className="mt-4 block text-xs font-medium text-zinc-400">People on the trip (for split)</label>
      <input
        type="number"
        min={1}
        className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:ring-2 focus:ring-emerald-500/50"
        value={count}
        onChange={(e) => setCount(e.target.value)}
      />
      <label className="mt-4 block text-xs font-medium text-zinc-400">Banner image</label>
      <input
        type="file"
        accept="image/*"
        className="mt-1 w-full text-sm text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-3 file:py-2 file:text-zinc-200"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onBannerFile(f)
        }}
      />
      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onSave(name.trim() || 'My trip', Math.max(1, parseInt(count, 10) || 1))}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
        >
          Save
        </button>
      </div>
    </ModalScrim>
  )
}
