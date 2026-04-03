import type { TripEvent } from '../types/trip'
import { groupEventsByDayLabel } from '../utilities/tripLogic'
import { EventRow } from './EventRow'

interface ItinerarySectionProps {
  events: TripEvent[]
  conflicts: Set<string>
  onEditEvent: (event: TripEvent) => void
  onDeleteEvent: (id: string) => void
}

export const ItinerarySection = ({
  events,
  conflicts,
  onEditEvent,
  onDeleteEvent,
}: ItinerarySectionProps) => {
  const groups = groupEventsByDayLabel(events)

  return (
    <main className="relative mx-4 mt-6 pb-28">
      <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-zinc-500">Itinerary</h3>
      {groups.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/30 px-4 py-8 text-center text-sm text-zinc-500">
          No events yet. Tap + to add hotels, restaurants, or activities.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {groups.map((g) => (
            <div key={g.dayKey}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-500/90">{g.label}</p>
              <ul className="flex flex-col gap-2">
                {g.items.map((ev) => (
                  <EventRow
                    key={ev.id}
                    event={ev}
                    hasConflict={conflicts.has(ev.id)}
                    onEdit={onEditEvent}
                    onDelete={onDeleteEvent}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
