import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import type { TripEvent, TripState } from '../types/trip'
import { LOCAL_STORAGE_KEY, TRIP_DOC_ID } from '../types/trip'
import { DEFAULT_TRIP } from '../utilities/defaultTrip'
import type { FirebaseClients } from './firebaseClient'

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

export function normalizeTripData(data: unknown): TripState {
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

export function readLocalTrip(): TripState {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!raw) return { ...DEFAULT_TRIP }
    return normalizeTripData(JSON.parse(raw) as unknown)
  } catch {
    return { ...DEFAULT_TRIP }
  }
}

export function writeLocalTrip(trip: TripState): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(trip))
  } catch {
    /* quota or private mode */
  }
}

export function subscribeToTripDocument(
  clients: FirebaseClients,
  onTrip: (trip: TripState) => void,
  onError: (message: string) => void,
): () => void {
  const docRef = doc(clients.db, 'trips', TRIP_DOC_ID)
  return onSnapshot(
    docRef,
    (snap) => {
      if (!snap.exists()) {
        onTrip({ ...DEFAULT_TRIP })
        return
      }
      onTrip(normalizeTripData(snap.data()))
    },
    (err) => {
      onError(err.message)
    },
  )
}

export async function saveTripToFirestore(clients: FirebaseClients, trip: TripState): Promise<void> {
  const docRef = doc(clients.db, 'trips', TRIP_DOC_ID)
  await setDoc(docRef, trip, { merge: true })
}

export async function uploadTripBannerToStorage(clients: FirebaseClients, file: File): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg'
  const storageRef = ref(clients.storage, `trips/${TRIP_DOC_ID}/banner.${ext}`)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : null
      if (result) {
        resolve(result)
        return
      }
      reject(new Error('Failed to read file'))
    }
    reader.onerror = () => {
      reject(reader.error ?? new Error('File read error'))
    }
    reader.readAsDataURL(file)
  })
}
