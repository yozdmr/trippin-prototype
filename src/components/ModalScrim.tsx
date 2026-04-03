import type { ReactNode } from 'react'

interface ModalScrimProps {
  title: string
  children: ReactNode
  onClose: () => void
}

export const ModalScrim = ({ title, children, onClose }: ModalScrimProps) => (
  <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
    <button
      type="button"
      className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      aria-label="Close"
      onClick={onClose}
    />
    <div
      className="relative z-10 max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-t-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl sm:rounded-2xl"
      role="dialog"
      aria-modal
      aria-labelledby="modal-title"
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 id="modal-title" className="text-lg font-semibold text-zinc-100">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
          aria-label="Close dialog"
        >
          ✕
        </button>
      </div>
      {children}
    </div>
  </div>
)
