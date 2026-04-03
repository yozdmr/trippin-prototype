import type { TripEvent } from '../types/trip'
import { formatTimeInZone } from '../utilities/datetime'

interface EventRowProps {
  event: TripEvent
  hasConflict: boolean
  onEdit: (event: TripEvent) => void
  onDelete: (id: string) => void
}

export const EventRow = ({ event, hasConflict, onEdit, onDelete }: EventRowProps) => (
  <li className="flex gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 ring-1 ring-zinc-800/80">
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold uppercase text-zinc-300">
          {event.type}
        </span>
        <span className={`font-medium ${hasConflict ? 'text-red-400' : 'text-zinc-100'}`}>{event.name}</span>
      </div>
      {event.location ? <p className="mt-1 truncate text-xs text-zinc-500">{event.location}</p> : null}
      <p className="mt-1 text-xs text-zinc-400">
        {formatTimeInZone(event.startMs, event.timeZone)}
        {hasConflict ? <span className="ml-2 font-medium text-red-400">Time conflict</span> : null}
      </p>
      <p className="mt-1 text-sm tabular-nums text-zinc-300">${event.cost.toFixed(2)}</p>
    </div>
    <div className="flex shrink-0 flex-col gap-1">
      <button
        type="button"
        onClick={() => onEdit(event)}
        className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
        aria-label={`Edit ${event.name}`}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
          />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => onDelete(event.id)}
        className="rounded-lg p-2 text-zinc-400 hover:bg-red-950/50 hover:text-red-300"
        aria-label={`Delete ${event.name}`}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  </li>
)
