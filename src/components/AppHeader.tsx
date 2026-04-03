export const AppHeader = () => (
  <header className="sticky top-0 z-30 flex items-center justify-between border-b border-zinc-800 bg-zinc-950/90 px-4 py-3 backdrop-blur">
    <h1 className="text-lg font-semibold tracking-tight text-emerald-400">Trippin&apos;</h1>
    <button
      type="button"
      className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-sm font-medium text-zinc-200 ring-1 ring-zinc-700"
      aria-label="Profile"
    >
      <span className="text-xs">You</span>
    </button>
  </header>
)
