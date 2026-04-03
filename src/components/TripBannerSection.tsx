import type { CSSProperties } from 'react'

interface TripBannerSectionProps {
  tripName: string
  bannerUrl: string | null
}

export const TripBannerSection = ({ tripName, bannerUrl }: TripBannerSectionProps) => {
  const bannerStyle: CSSProperties | undefined = bannerUrl
    ? { ['--trip-banner-image' as string]: `url(${bannerUrl})` }
    : undefined

  return (
    <section className="relative mx-4 mt-4 overflow-hidden rounded-2xl ring-1 ring-zinc-800">
      <div
        className={`trip-banner-bg relative min-h-36 bg-cover bg-center ${bannerUrl ? '' : 'bg-zinc-800'}`}
        style={bannerStyle}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        <div className="relative flex min-h-36 flex-col justify-end p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-emerald-300/90">Trip</p>
          <h2 className="text-2xl font-bold text-white drop-shadow">{tripName || 'Untitled trip'}</h2>
        </div>
      </div>
    </section>
  )
}
