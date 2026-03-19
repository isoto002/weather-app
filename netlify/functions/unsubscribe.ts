import type { Context } from '@netlify/functions'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

const db = getFirestore()

export default async function handler(request: Request, context: Context) {
  const url = new URL(request.url)
  const token = url.searchParams.get('token')

  if (!token) {
    return new Response('Missing token', { status: 400 })
  }

  const snapshot = await db
    .collection('emailSubscriptions')
    .where('unsubscribeToken', '==', token)
    .get()

  if (snapshot.empty) {
    return new Response('<html><body style="font-family:-apple-system,sans-serif;text-align:center;padding:60px 20px;"><h2>Already unsubscribed</h2><p>You are not subscribed to any weather emails.</p></body></html>', {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    })
  }

  for (const doc of snapshot.docs) {
    await doc.ref.delete()
  }

  return new Response('<html><body style="font-family:-apple-system,sans-serif;text-align:center;padding:60px 20px;"><h2>Unsubscribed</h2><p>You will no longer receive daily weather emails.</p></body></html>', {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  })
}
