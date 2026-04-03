import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

export interface FirebaseClients {
  app: FirebaseApp
  db: Firestore
  storage: FirebaseStorage
}

function tryInitFirebase(): FirebaseClients | null {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID
  if (!apiKey || !projectId) return null

  const app = initializeApp({
    apiKey,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? `${projectId}.firebaseapp.com`,
    projectId,
    storageBucket:
      import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? `${projectId}.appspot.com`,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '',
  })

  return {
    app,
    db: getFirestore(app),
    storage: getStorage(app),
  }
}

let firebaseSingleton: FirebaseClients | null | undefined

/** Single init — calling `initializeApp` more than once throws. */
export function getFirebaseClients(): FirebaseClients | null {
  if (firebaseSingleton !== undefined) return firebaseSingleton
  firebaseSingleton = tryInitFirebase()
  return firebaseSingleton
}
