import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { getFirebaseClients } from './firebase/client'
import { useTripState } from './hooks/useTripState'
import { COMMON_TIMEZONES, startMsToWallParts, wallTimeToStartMs } from './lib/datetime'
import { defaultDurationForType, getConflictingEventIds, groupEventsByDayLabel, perPersonShare, totalEventCost, budgetSpendColor } from './lib/tripLogic'
import type { EventType, TripEvent } from './lib/types'
import { DateTime } from 'luxon'

const EVENT_TYPES: EventType[] = ['Hotel', 'Restaurant', 'Activity']

function newId(): string {
  return crypto.randomUUID()
}

function formatTimeInZone(startMs: number, timeZone: string): string {
  return DateTime.fromMillis(startMs, { zone: timeZone }).toFormat('h:mm a ZZZZ')
}

export default function App() {
  const firebase = useMemo(() => getFirebaseClients(), [])
  const { trip, ready, mode, syncError, updateTrip, addEvent, updateEvent, deleteEvent, uploadBanner } =
    useTripState(firebase)

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [budgetOpen, setBudgetOpen] = useState(false)
  const [eventModal, setEventModal] = useState<{ mode: 'create' | 'edit'; event?: TripEvent } | null>(null)

  const conflicts = useMemo(() => getConflictingEventIds(trip.events), [trip.events])
  const groups = useMemo(() => groupEventsByDayLabel(trip.events), [trip.events])
  const total = useMemo(() => totalEventCost(trip.events), [trip.events])
  const share = useMemo(() => perPersonShare(total, trip.collaboratorCount), [total, trip.collaboratorCount])
  const spendColor = useMemo(() => budgetSpendColor(total, trip.budget), [total, trip.budget])

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-zinc-950 text-zinc-100">
        <p className="text-sm opacity-80">Loading trip…</p>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100">
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

      {syncError ? (
        <div className="mx-4 mt-3 rounded-lg border border-amber-900/80 bg-amber-950/40 px-3 py-2 text-sm text-amber-200">
          Sync issue: {syncError}. You can still edit; check Firestore rules and config.
        </div>
      ) : null}

      {mode === 'local' ? (
        <div className="mx-4 mt-3 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs text-zinc-400">
          Local mode — data saves in this browser. Add{' '}
          <code className="rounded bg-zinc-800 px-1 py-0.5 text-zinc-300">.env</code> Firebase vars for
          Firestore + Storage sync.
        </div>
      ) : null}

      <section className="relative mx-4 mt-4 overflow-hidden rounded-2xl ring-1 ring-zinc-800">
        <div
          className="relative min-h-36 bg-zinc-800 bg-cover bg-center"
          style={
            trip.bannerUrl
              ? { backgroundImage: `url(${trip.bannerUrl})` }
              : undefined
          }
        >
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
          <div className="relative flex min-h-36 flex-col justify-end p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-emerald-300/90">Trip</p>
            <h2 className="text-2xl font-bold text-white drop-shadow">{trip.tripName || 'Untitled trip'}</h2>
          </div>
        </div>
      </section>

      <div className="mx-4 mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          className="rounded-full bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-100 ring-1 ring-zinc-700 hover:bg-zinc-700"
        >
          Trip name &amp; banner
        </button>
        <button
          type="button"
          onClick={() => setBudgetOpen(true)}
          className="rounded-full bg-emerald-600/90 px-4 py-2 text-sm font-medium text-white ring-1 ring-emerald-500/50 hover:bg-emerald-500"
        >
          Budget
        </button>
      </div>

      <div className="mx-4 mt-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-sm text-zinc-400">Expenses</p>
          <p className="text-lg font-semibold tabular-nums" style={{ color: spendColor }}>
            ${total.toFixed(2)}
            {trip.budget > 0 ? (
              <span className="text-sm font-normal text-zinc-500"> / ${trip.budget.toFixed(2)}</span>
            ) : null}
          </p>
        </div>
        <p className="mt-1 text-xs text-zinc-500">
          Per person ({trip.collaboratorCount}):{' '}
          <span className="tabular-nums text-zinc-300">${share.toFixed(2)}</span>
        </p>
      </div>

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
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-500/90">
                  {g.label}
                </p>
                <ul className="flex flex-col gap-2">
                  {g.items.map((ev) => (
                    <li
                      key={ev.id}
                      className="flex gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 ring-1 ring-zinc-800/80"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold uppercase text-zinc-300">
                            {ev.type}
                          </span>
                          <span
                            className={`font-medium ${conflicts.has(ev.id) ? 'text-red-400' : 'text-zinc-100'}`}
                          >
                            {ev.name}
                          </span>
                        </div>
                        {ev.location ? (
                          <p className="mt-1 truncate text-xs text-zinc-500">{ev.location}</p>
                        ) : null}
                        <p className="mt-1 text-xs text-zinc-400">
                          {formatTimeInZone(ev.startMs, ev.timeZone)}
                          {conflicts.has(ev.id) ? (
                            <span className="ml-2 font-medium text-red-400">Time conflict</span>
                          ) : null}
                        </p>
                        <p className="mt-1 text-sm tabular-nums text-zinc-300">${ev.cost.toFixed(2)}</p>
                      </div>
                      <div className="flex shrink-0 flex-col gap-1">
                        <button
                          type="button"
                          onClick={() => setEventModal({ mode: 'edit', event: ev })}
                          className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                          aria-label={`Edit ${ev.name}`}
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
                          onClick={() => deleteEvent(ev.id)}
                          className="rounded-lg p-2 text-zinc-400 hover:bg-red-950/50 hover:text-red-300"
                          aria-label={`Delete ${ev.name}`}
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
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </main>

      <button
        type="button"
        onClick={() => setEventModal({ mode: 'create' })}
        className="fixed bottom-6 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-3xl font-light text-zinc-950 shadow-lg shadow-emerald-900/40 ring-2 ring-emerald-400/30 hover:bg-emerald-400"
        aria-label="Add event"
      >
        +
      </button>

      {settingsOpen ? (
        <SettingsModal
          tripName={trip.tripName}
          collaboratorCount={trip.collaboratorCount}
          onClose={() => setSettingsOpen(false)}
          onSave={(name, count) => {
            updateTrip({ tripName: name, collaboratorCount: count })
            setSettingsOpen(false)
          }}
          onBannerFile={(file) => void uploadBanner(file)}
        />
      ) : null}

      {budgetOpen ? (
        <BudgetModal
          budget={trip.budget}
          onClose={() => setBudgetOpen(false)}
          onSave={(b) => {
            updateTrip({ budget: b })
            setBudgetOpen(false)
          }}
        />
      ) : null}

      {eventModal ? (
        <EventFormModal
          key={eventModal.mode === 'edit' ? eventModal.event?.id : 'new'}
          mode={eventModal.mode}
          initial={eventModal.event}
          onClose={() => setEventModal(null)}
          onSubmit={(payload) => {
            if (eventModal.mode === 'create') {
              addEvent(payload)
            } else if (eventModal.event) {
              updateEvent(eventModal.event.id, payload)
            }
            setEventModal(null)
          }}
        />
      ) : null}
    </div>
  )
}

function SettingsModal({
  tripName,
  collaboratorCount,
  onClose,
  onSave,
  onBannerFile,
}: {
  tripName: string
  collaboratorCount: number
  onClose: () => void
  onSave: (name: string, count: number) => void
  onBannerFile: (file: File) => void
}) {
  const [name, setName] = useState(tripName)
  const [count, setCount] = useState(String(collaboratorCount))

  return (
    <ModalScrim title="Trip settings" onClose={onClose}>
      <label className="block text-xs font-medium text-zinc-400">Trip name</label>
      <input
        className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none ring-emerald-500/0 focus:ring-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label className="mt-4 block text-xs font-medium text-zinc-400">People on the trip (for split)</label>
      <input
        type="number"
        min={1}
        className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:ring-2 focus:ring-emerald-500/50"
        value={count}
        onChange={(e) => setCount(e.target.value)}
      />
      <label className="mt-4 block text-xs font-medium text-zinc-400">Banner image</label>
      <input
        type="file"
        accept="image/*"
        className="mt-1 w-full text-sm text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-3 file:py-2 file:text-zinc-200"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onBannerFile(f)
        }}
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
          onClick={() => onSave(name.trim() || 'My trip', Math.max(1, parseInt(count, 10) || 1))}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
        >
          Save
        </button>
      </div>
    </ModalScrim>
  )
}

function BudgetModal({
  budget,
  onClose,
  onSave,
}: {
  budget: number
  onClose: () => void
  onSave: (b: number) => void
}) {
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

function EventFormModal({
  mode,
  initial,
  onClose,
  onSubmit,
}: {
  mode: 'create' | 'edit'
  initial?: TripEvent
  onClose: () => void
  onSubmit: (e: TripEvent) => void
}) {
  const tz = initial?.timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'UTC'
  const wall = initial
    ? startMsToWallParts(initial.startMs, initial.timeZone)
    : { date: DateTime.now().setZone(tz).toFormat('yyyy-MM-dd'), time: '12:00' }

  const [type, setType] = useState<EventType>(initial?.type ?? 'Activity')
  const [name, setName] = useState(initial?.name ?? '')
  const [cost, setCost] = useState(initial ? String(initial.cost) : '')
  const [location, setLocation] = useState(initial?.location ?? '')
  const [date, setDate] = useState(wall.date)
  const [time, setTime] = useState(wall.time)
  const [timeZone, setTimeZone] = useState(initial?.timeZone ?? tz)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const startMs = wallTimeToStartMs(date, time, timeZone)
    const durationMin =
      initial && initial.type === type ? initial.durationMin : defaultDurationForType(type)
    const payload: TripEvent = {
      id: initial?.id ?? newId(),
      type,
      name: name.trim() || 'Untitled',
      cost: Math.max(0, parseFloat(cost) || 0),
      location: location.trim(),
      startMs,
      durationMin,
      timeZone,
    }
    onSubmit(payload)
  }

  return (
    <ModalScrim title={mode === 'create' ? 'New event' : 'Edit event'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-xs font-medium text-zinc-400">Type</label>
          <select
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
            value={type}
            onChange={(e) => setType(e.target.value as EventType)}
          >
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-zinc-400">Name</label>
          <input
            required
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-zinc-400">Cost (USD)</label>
          <input
            type="number"
            min={0}
            step="0.01"
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-zinc-400">Location (optional)</label>
          <input
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-medium text-zinc-400">Date</label>
            <input
              type="date"
              required
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-2 text-sm text-zinc-100"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-400">Time</label>
            <input
              type="time"
              required
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-2 text-sm text-zinc-100"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-zinc-400">Timezone</label>
          <select
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
            value={timeZone}
            onChange={(e) => setTimeZone(e.target.value)}
          >
            {COMMON_TIMEZONES.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800">
            Cancel
          </button>
          <button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500">
            {mode === 'create' ? 'Add' : 'Save'}
          </button>
        </div>
      </form>
    </ModalScrim>
  )
}

function ModalScrim({
  title,
  children,
  onClose,
}: {
  title: string
  children: ReactNode
  onClose: () => void
}) {
  return (
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
}
