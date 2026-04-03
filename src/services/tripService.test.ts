import { describe, expect, it } from 'vitest'
import { normalizeTripData } from './tripService'

describe('normalizeTripData', () => {
  it('returns defaults for non-object input', () => {
    const t = normalizeTripData(undefined)
    expect(t.tripName).toBe('My trip')
    expect(t.events).toEqual([])
  })

  it('parses a minimal valid trip document', () => {
    const t = normalizeTripData({
      tripName: 'Spring break',
      budget: 600,
      collaboratorCount: 3,
      bannerUrl: null,
      events: [
        {
          id: 'a',
          type: 'Hotel',
          name: 'Stay',
          cost: 100,
          location: '',
          startMs: 1000,
          durationMin: 60,
          timeZone: 'UTC',
        },
      ],
    })
    expect(t.tripName).toBe('Spring break')
    expect(t.events).toHaveLength(1)
    expect(t.events[0].name).toBe('Stay')
  })
})
