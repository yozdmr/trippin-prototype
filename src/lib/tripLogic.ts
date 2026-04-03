import type { EventType, TripEvent, TripState } from './types'

export function defaultDurationForType(type: EventType): number {
  switch (type) {
    case 'Hotel':
      return 24 * 60
    case 'Restaurant':
      return 120
    case 'Activity':
      return 180
  }
}

export function endMs(event: TripEvent): number {
  return event.startMs + event.durationMin * 60_000
}

export function intervalsOverlap(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aEnd > bStart && bEnd > aStart
}

export function eventsOverlap(a: TripEvent, b: TripEvent): boolean {
  if (a.id === b.id) return false
  return intervalsOverlap(a.startMs, endMs(a), b.startMs, endMs(b))
}

export function getConflictingEventIds(events: TripEvent[]): Set<string> {
  const conflicts = new Set<string>()
  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      if (eventsOverlap(events[i], events[j])) {
        conflicts.add(events[i].id)
        conflicts.add(events[j].id)
      }
    }
  }
  return conflicts
}

export function sortEventsChronologically(events: TripEvent[]): TripEvent[] {
  return [...events].sort((a, b) => a.startMs - b.startMs)
}

export function totalEventCost(events: TripEvent[]): number {
  return events.reduce((sum, e) => sum + e.cost, 0)
}

/** Spend color: green when well under budget, shifts toward red as total approaches budget. */
export function budgetSpendColor(total: number, budget: number): string {
  if (budget <= 0) return 'rgb(22, 163, 74)'
  const ratio = Math.min(1, total / budget)
  const r = Math.round(22 + (220 - 22) * ratio)
  const g = Math.round(163 + (38 - 163) * ratio)
  const b = Math.round(74 + (38 - 74) * ratio)
  return `rgb(${r},${g},${b})`
}

export function perPersonShare(total: number, collaboratorCount: number): number {
  const n = Math.max(1, Math.floor(collaboratorCount) || 1)
  return total / n
}

export function addEventToTrip(trip: TripState, event: TripEvent): TripState {
  return { ...trip, events: [...trip.events, event] }
}

export function updateEventInTrip(
  trip: TripState,
  id: string,
  patch: Partial<TripEvent>,
): TripState {
  return {
    ...trip,
    events: trip.events.map((e) => (e.id === id ? { ...e, ...patch } : e)),
  }
}

export function removeEventFromTrip(trip: TripState, id: string): TripState {
  return { ...trip, events: trip.events.filter((e) => e.id !== id) }
}

export function groupEventsByDayLabel(
  events: TripEvent[],
  locale: string = 'en-US',
): { dayKey: string; label: string; items: TripEvent[] }[] {
  const sorted = sortEventsChronologically(events)
  const map = new Map<string, { label: string; items: TripEvent[] }>()
  for (const e of sorted) {
    const d = new Date(e.startMs)
    const dayKey = d.toISOString().slice(0, 10)
    const label = d.toLocaleDateString(locale, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: e.timeZone || undefined,
    })
    const existing = map.get(dayKey)
    if (existing) {
      existing.items.push(e)
    } else {
      map.set(dayKey, { label, items: [e] })
    }
  }
  return [...map.entries()].map(([dayKey, v]) => ({ dayKey, label: v.label, items: v.items }))
}
