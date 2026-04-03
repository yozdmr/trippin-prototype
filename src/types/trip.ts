export type EventType = 'Hotel' | 'Restaurant' | 'Activity'

export const EVENT_TYPE_OPTIONS: readonly EventType[] = ['Hotel', 'Restaurant', 'Activity']

export interface TripEvent {
  id: string
  type: EventType
  name: string
  cost: number
  location: string
  startMs: number
  durationMin: number
  timeZone: string
}

export interface TripState {
  tripName: string
  budget: number
  collaboratorCount: number
  bannerUrl: string | null
  events: TripEvent[]
}

export const TRIP_DOC_ID = 'default'
export const LOCAL_STORAGE_KEY = 'trippin-trip-v1'
