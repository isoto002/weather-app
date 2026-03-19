import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getFirestore, collection, addDoc, type Firestore } from 'firebase/firestore'

let app: FirebaseApp | null = null
let db: Firestore | null = null

function getDb(): Firestore {
  if (db) return db

  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  }

  if (!firebaseConfig.projectId) {
    throw new Error('Firebase is not configured. Set VITE_FIREBASE_* environment variables.')
  }

  app = initializeApp(firebaseConfig)
  db = getFirestore(app)
  return db
}

export async function subscribeToEmail(email: string, city: string, unit: string): Promise<void> {
  const firestore = getDb()
  const unsubscribeToken = crypto.randomUUID()
  await addDoc(collection(firestore, 'emailSubscriptions'), {
    email,
    city,
    unit,
    unsubscribeToken,
    createdAt: new Date().toISOString(),
  })
}
