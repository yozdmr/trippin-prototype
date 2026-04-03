import { DateTime } from 'luxon'
import { useState, type FormEvent } from 'react'
import { EVENT_TYPE_OPTIONS, type EventType, type TripEvent } from '../types/trip'
import { COMMON_TIMEZONES, startMsToWallParts, wallTimeToStartMs } from '../utilities/datetime'
import { createEventId } from '../utilities/createEventId'
import { defaultDurationForType } from '../utilities/tripLogic'
import { ModalScrim } from './ModalScrim'

interface EventFormModalProps {
  mode: 'create' | 'edit'
  initial?: TripEvent
  onClose: () => void
  onSubmit: (e: TripEvent) => void
}

export const EventFormModal = ({ mode, initial, onClose, onSubmit }: EventFormModalProps) => {
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
      id: initial?.id ?? createEventId(),
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
            {EVENT_TYPE_OPTIONS.map((t) => (
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
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
          >
            {mode === 'create' ? 'Add' : 'Save'}
          </button>
        </div>
      </form>
    </ModalScrim>
  )
}
