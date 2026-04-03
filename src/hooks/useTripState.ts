import { useCallback, useEffect, useState } from 'react'
import type { FirebaseClients } from '../services/firebaseClient'
import {
  readFileAsDataUrl,
  readLocalTrip,
  saveTripToFirestore,
  subscribeToTripDocument,
  uploadTripBannerToStorage,
  writeLocalTrip,
} from '../services/tripService'
import type { TripEvent, TripState } from '../types/trip'
import { DEFAULT_TRIP } from '../utilities/defaultTrip'

export type TripSyncMode = 'firebase' | 'local'

export function useTripState(firebase: FirebaseClients | null) {
  const mode: TripSyncMode = firebase ? 'firebase' : 'local'
  const [trip, setTrip] = useState<TripState>(() => (firebase ? { ...DEFAULT_TRIP } : readLocalTrip()))
  const [ready, setReady] = useState(() => !firebase)
  const [syncError, setSyncError] = useState<string | null>(null)

  useEffect(() => {
    if (!firebase) return
    const unsub = subscribeToTripDocument(
      firebase,
      (next) => {
        setSyncError(null)
        setTrip(next)
        setReady(true)
      },
      (message) => {
        setSyncError(message)
        setReady(true)
      },
    )
    return () => unsub()
  }, [firebase])

  const persistFromState = useCallback(
    (next: TripState) => {
      if (mode === 'local') {
        writeLocalTrip(next)
        return
      }
      if (!firebase) return
      void (async () => {
        try {
          await saveTripToFirestore(firebase, next)
        } catch (e) {
          const message = e instanceof Error ? e.message : 'Failed to save trip'
          setSyncError(message)
        }
      })()
    },
    [firebase, mode],
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
        try {
          const url = await uploadTripBannerToStorage(firebase, file)
          updateTrip({ bannerUrl: url })
        } catch (e) {
          const message = e instanceof Error ? e.message : 'Upload failed'
          setSyncError(message)
        }
        return
      }
      try {
        const dataUrl = await readFileAsDataUrl(file)
        updateTrip({ bannerUrl: dataUrl })
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Failed to read image'
        setSyncError(message)
      }
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
