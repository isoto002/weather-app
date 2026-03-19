import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export async function subscribeToEmail(email: string, city: string, unit: string): Promise<void> {
  const unsubscribeToken = crypto.randomUUID()
  await addDoc(collection(db, 'emailSubscriptions'), {
    email,
    city,
    unit,
    unsubscribeToken,
    createdAt: new Date().toISOString(),
  })
}

export { db }
