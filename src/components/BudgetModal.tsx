import { useState } from 'react'
import { ModalScrim } from './ModalScrim'

interface BudgetModalProps {
  budget: number
  onClose: () => void
  onSave: (b: number) => void
}

export const BudgetModal = ({ budget, onClose, onSave }: BudgetModalProps) => {
  const [value, setValue] = useState(budget > 0 ? String(budget) : '')

  return (
    <ModalScrim title="Trip budget" onClose={onClose}>
      <label className="block text-xs font-medium text-zinc-400">Total budget (USD)</label>
      <input
        type="number"
        min={0}
        step="0.01"
        className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:ring-2 focus:ring-emerald-500/50"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="0"
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
          onClick={() => onSave(Math.max(0, parseFloat(value) || 0))}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
        >
          Save
        </button>
      </div>
    </ModalScrim>
  )
}
