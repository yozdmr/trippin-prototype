interface SyncErrorBannerProps {
  message: string
}

export const SyncErrorBanner = ({ message }: SyncErrorBannerProps) => (
  <div className="mx-4 mt-3 rounded-lg border border-amber-900/80 bg-amber-950/40 px-3 py-2 text-sm text-amber-200">
    Sync issue: {message}. You can still edit; check Firestore rules and config.
  </div>
)
