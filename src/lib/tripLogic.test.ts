import { describe, expect, it } from 'vitest'
import type { TripEvent, TripState } from './types'
import {
  addEventToTrip,
  budgetSpendColor,
  getConflictingEventIds,
  perPersonShare,
  removeEventFromTrip,
  sortEventsChronologically,
  totalEventCost,
  updateEventInTrip,
} from './tripLogic'

const baseEvent = (over: Partial<TripEvent>): TripEvent => ({
  id: 'e1',
  type: 'Restaurant',
  name: 'Lunch',
  cost: 40,
  location: '',
  startMs: 1_700_000_000_000,
  durationMin: 120,
  timeZone: 'UTC',
  ...over,
})

const emptyTrip: TripState = {
  tripName: 'Test',
  budget: 600,
  collaboratorCount: 2,
  bannerUrl: null,
  events: [],
}

describe('addEventToTrip / updateEventInTrip / removeEventFromTrip', () => {
  it('adds an event', () => {
    const e = baseEvent({ id: 'a' })
    const next = addEventToTrip(emptyTrip, e)
    expect(next.events).toHaveLength(1)
    expect(next.events[0].name).toBe('Lunch')
  })

  it('updates an event by id', () => {
    const trip = addEventToTrip(emptyTrip, baseEvent({ id: 'x', cost: 10 }))
    const next = updateEventInTrip(trip, 'x', { cost: 99, name: 'Dinner' })
    expect(next.events[0].cost).toBe(99)
    expect(next.events[0].name).toBe('Dinner')
  })

  it('removes an event by id', () => {
    const trip = addEventToTrip(addEventToTrip(emptyTrip, baseEvent({ id: 'a' })), baseEvent({ id: 'b' }))
    const next = removeEventFromTrip(trip, 'a')
    expect(next.events.map((x) => x.id)).toEqual(['b'])
  })
})

describe('totalEventCost and perPersonShare', () => {
  it('sums event costs', () => {
    const trip = addEventToTrip(
      addEventToTrip(emptyTrip, baseEvent({ id: 'a', cost: 100 })),
      baseEvent({ id: 'b', cost: 50 }),
    )
    expect(totalEventCost(trip.events)).toBe(150)
  })

  it('splits total across collaborators', () => {
    expect(perPersonShare(300, 3)).toBe(100)
    expect(perPersonShare(300, 0)).toBe(300)
  })
})

describe('budgetSpendColor', () => {
  it('is green when spend is low relative to budget', () => {
    const c = budgetSpendColor(100, 600)
    expect(c).toMatch(/^rgb\(/)
    const m = c.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
    expect(m).toBeTruthy()
    const g = Number(m![2])
    const r = Number(m![1])
    expect(g).toBeGreaterThan(r)
  })

  it('shifts red as spend approaches budget', () => {
    const low = budgetSpendColor(100, 600)
    const high = budgetSpendColor(600, 600)
    expect(low).not.toBe(high)
  })
})

describe('sortEventsChronologically', () => {
  it('orders by startMs ascending', () => {
    const later = baseEvent({ id: 'later', startMs: 2_000 })
    const earlier = baseEvent({ id: 'earlier', startMs: 1_000 })
    const sorted = sortEventsChronologically([later, earlier])
    expect(sorted.map((e) => e.id)).toEqual(['earlier', 'later'])
  })

  it('reorders after simulated edit', () => {
    const a = baseEvent({ id: 'a', startMs: 5_000 })
    const b = baseEvent({ id: 'b', startMs: 10_000 })
    let trip = addEventToTrip(addEventToTrip(emptyTrip, a), b)
    trip = updateEventInTrip(trip, 'a', { startMs: 20_000 })
    const sorted = sortEventsChronologically(trip.events)
    expect(sorted.map((e) => e.id)).toEqual(['b', 'a'])
  })
})

describe('getConflictingEventIds', () => {
  it('flags overlapping intervals', () => {
    const hotel = baseEvent({
      id: 'h',
      type: 'Hotel',
      startMs: 0,
      durationMin: 24 * 60,
    })
    const r = baseEvent({
      id: 'r',
      type: 'Restaurant',
      startMs: 60 * 60_000,
      durationMin: 120,
    })
    const ids = getConflictingEventIds([hotel, r])
    expect(ids.has('h')).toBe(true)
    expect(ids.has('r')).toBe(true)
  })

  it('does not flag non-overlapping events', () => {
    const a = baseEvent({ id: 'a', startMs: 0, durationMin: 60 })
    const b = baseEvent({ id: 'b', startMs: 2 * 60 * 60_000, durationMin: 60 })
    expect(getConflictingEventIds([a, b]).size).toBe(0)
  })
})
