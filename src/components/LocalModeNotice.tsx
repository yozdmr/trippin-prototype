export const LocalModeNotice = () => (
  <div className="mx-4 mt-3 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs text-zinc-400">
    Local mode — data saves in this browser. Add{' '}
    <code className="rounded bg-zinc-800 px-1 py-0.5 text-zinc-300">.env</code> Firebase vars for Firestore + Storage
    sync.
  </div>
)
