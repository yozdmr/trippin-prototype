interface AddTripFabProps {
  onClick: () => void
}

export const AddTripFab = ({ onClick }: AddTripFabProps) => (
  <button
    type="button"
    onClick={onClick}
    className="fixed bottom-6 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-3xl font-light text-zinc-950 shadow-lg shadow-emerald-900/40 ring-2 ring-emerald-400/30 hover:bg-emerald-400"
    aria-label="Add event"
  >
    +
  </button>
)
