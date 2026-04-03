import { useCallback, useEffect, useMemo, useState } from 'react'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import type { TripEvent, TripState } from '../lib/types'
import { LOCAL_STORAGE_KEY, TRIP_DOC_ID } from '../lib/types'
import { DEFAULT_TRIP } from '../lib/defaultTrip'
import type { FirebaseClients } from '../firebase/client'

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function normalizeEvent(raw: unknown): TripEvent | null {
  if (!isRecord(raw)) return null
  const id = typeof raw.id === 'string' ? raw.id : null
  const type = raw.type
  if (id == null || (type !== 'Hotel' && type !== 'Restaurant' && type !== 'Activity')) return null
  return {
    id,
    type,
    name: typeof raw.name === 'string' ? raw.name : '',
    cost: typeof raw.cost === 'number' && !Number.isNaN(raw.cost) ? raw.cost : Number(raw.cost) || 0,
    location: typeof raw.location === 'string' ? raw.location : '',
    startMs:
      typeof raw.startMs === 'number' && !Number.isNaN(raw.startMs)
        ? raw.startMs
        : Number(raw.startMs) || 0,
    durationMin:
      typeof raw.durationMin === 'number' && !Number.isNaN(raw.durationMin)
        ? raw.durationMin
        : Number(raw.durationMin) || 60,
    timeZone: typeof raw.timeZone === 'string' ? raw.timeZone : 'UTC',
  }
}

function normalizeTrip(data: unknown): TripState {
  if (!isRecord(data)) return { ...DEFAULT_TRIP }
  const eventsRaw = data.events
  const events: TripEvent[] = []
  if (Array.isArray(eventsRaw)) {
    for (const e of eventsRaw) {
      const n = normalizeEvent(e)
      if (n) events.push(n)
    }
  }
  return {
    tripName: typeof data.tripName === 'string' ? data.tripName : DEFAULT_TRIP.tripName,
    budget: typeof data.budget === 'number' && !Number.isNaN(data.budget) ? data.budget : Number(data.budget) || 0,
    collaboratorCount: Math.max(
      1,
      typeof data.collaboratorCount === 'number' && !Number.isNaN(data.collaboratorCount)
        ? Math.floor(data.collaboratorCount)
        : Number(data.collaboratorCount) || 1,
    ),
    bannerUrl: typeof data.bannerUrl === 'string' ? data.bannerUrl : null,
    events,
  }
}

function readLocal(): TripState {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!raw) return { ...DEFAULT_TRIP }
    return normalizeTrip(JSON.parse(raw) as unknown)
  } catch {
    return { ...DEFAULT_TRIP }
  }
}

function writeLocal(trip: TripState) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(trip))
  } catch {
    /* quota or private mode */
  }
}

export type TripSyncMode = 'firebase' | 'local'

export function useTripState(firebase: FirebaseClients | null) {
  const mode: TripSyncMode = firebase ? 'firebase' : 'local'
  const [trip, setTrip] = useState<TripState>(() => (firebase ? { ...DEFAULT_TRIP } : readLocal()))
  const [ready, setReady] = useState(() => !firebase)
  const [syncError, setSyncError] = useState<string | null>(null)

  const docRef = useMemo(() => {
    if (!firebase) return null
    return doc(firebase.db, 'trips', TRIP_DOC_ID)
  }, [firebase])

  useEffect(() => {
    if (!firebase || !docRef) return
    const unsub = onSnapshot(
      docRef,
      (snap) => {
        setSyncError(null)
        if (!snap.exists()) {
          setTrip({ ...DEFAULT_TRIP })
        } else {
          setTrip(normalizeTrip(snap.data()))
        }
        setReady(true)
      },
      (err) => {
        setSyncError(err.message)
        setReady(true)
      },
    )
    return () => unsub()
  }, [firebase, docRef])

  const persistFromState = useCallback(
    (next: TripState) => {
      if (mode === 'local') {
        writeLocal(next)
        return
      }
      if (docRef) void setDoc(docRef, next, { merge: true })
    },
    [docRef, mode],
  )

  const updateTrip = useCallback(
    (patch: Partial<TripState>) => {
      setTrip((prev) => {
        const next = { ...prev, ...patch }
        persistFromState(next)
        return next
      })
    },
    [persistFromState],
  )

  const addEvent = useCallback(
    (event: TripEvent) => {
      setTrip((prev) => {
        const next = { ...prev, events: [...prev.events, event] }
        persistFromState(next)
        return next
      })
    },
    [persistFromState],
  )

  const updateEvent = useCallback(
    (id: string, patch: Partial<TripEvent>) => {
      setTrip((prev) => {
        const next = {
          ...prev,
          events: prev.events.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        }
        persistFromState(next)
        return next
      })
    },
    [persistFromState],
  )

  const deleteEvent = useCallback(
    (id: string) => {
      setTrip((prev) => {
        const next = {
          ...prev,
          events: prev.events.filter((e) => e.id !== id),
        }
        persistFromState(next)
        return next
      })
    },
    [persistFromState],
  )

  const uploadBanner = useCallback(
    async (file: File) => {
      if (mode === 'firebase' && firebase) {
        const ext = file.name.split('.').pop() || 'jpg'
        const storageRef = ref(firebase.storage, `trips/${TRIP_DOC_ID}/banner.${ext}`)
        await uploadBytes(storageRef, file)
        const url = await getDownloadURL(storageRef)
        updateTrip({ bannerUrl: url })
        return
      }
      const reader = new FileReader()
      reader.onload = () => {
        const result = typeof reader.result === 'string' ? reader.result : null
        if (result) updateTrip({ bannerUrl: result })
      }
      reader.readAsDataURL(file)
    },
    [firebase, mode, updateTrip],
  )

  return {
    trip,
    ready,
    mode,
    syncError,
    updateTrip,
    addEvent,
    updateEvent,
    deleteEvent,
    uploadBanner,
  }
}
