interface TripActionBarProps {
  onOpenSettings: () => void
  onOpenBudget: () => void
}

export const TripActionBar = ({ onOpenSettings, onOpenBudget }: TripActionBarProps) => (
  <div className="mx-4 mt-4 flex flex-wrap gap-2">
    <button
      type="button"
      onClick={onOpenSettings}
      className="rounded-full bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-100 ring-1 ring-zinc-700 hover:bg-zinc-700"
    >
      Trip name &amp; banner
    </button>
    <button
      type="button"
      onClick={onOpenBudget}
      className="rounded-full bg-emerald-600/90 px-4 py-2 text-sm font-medium text-white ring-1 ring-emerald-500/50 hover:bg-emerald-500"
    >
      Budget
    </button>
  </div>
)
