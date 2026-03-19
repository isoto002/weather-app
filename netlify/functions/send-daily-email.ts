import type { Config } from '@netlify/functions'
import sgMail from '@sendgrid/mail'
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
sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

async function fetchWeather(city: string) {
  const geoRes = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${process.env.OWM_API_KEY}`
  )
  const [geo] = await geoRes.json()
  if (!geo) return null

  const weatherRes = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${geo.lat}&lon=${geo.lon}&units=imperial&appid=${process.env.OWM_API_KEY}`
  )
  return weatherRes.json()
}

function buildEmail(city: string, weather: any, unit: string, unsubToken: string): string {
  const temp = unit === 'C'
    ? Math.round((weather.main.temp - 32) * 5 / 9)
    : Math.round(weather.main.temp)
  const unitLabel = unit === 'C' ? '°C' : '°F'
  const siteUrl = process.env.URL || 'https://your-weather-app.netlify.app'

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:40px 20px;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',sans-serif;background:#f5f5f7;color:#1d1d1f;">
      <div style="max-width:480px;margin:0 auto;background:white;border-radius:16px;padding:40px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
        <p style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#86868b;margin:0 0 24px;">Daily Weather</p>
        <h1 style="font-size:42px;font-weight:200;margin:0;color:#1d1d1f;">${temp}${unitLabel}</h1>
        <p style="font-size:17px;color:#86868b;margin:8px 0 0;">${weather.weather[0].description}</p>
        <p style="font-size:15px;color:#1d1d1f;margin:24px 0 0;">${city}</p>
        <hr style="border:none;border-top:1px solid #e5e5e5;margin:32px 0;">
        <p style="font-size:13px;color:#86868b;margin:0;">Humidity: ${weather.main.humidity}% · Wind: ${Math.round(weather.wind.speed)} mph</p>
        <p style="font-size:11px;color:#86868b;margin:24px 0 0;">
          <a href="${siteUrl}" style="color:#007AFF;text-decoration:none;">Open Weather App</a>
          &nbsp;·&nbsp;
          <a href="${siteUrl}/.netlify/functions/unsubscribe?token=${unsubToken}" style="color:#86868b;text-decoration:none;">Unsubscribe</a>
        </p>
      </div>
    </body>
    </html>
  `
}

export default async function handler() {
  const snapshot = await db.collection('emailSubscriptions').get()
  if (snapshot.empty) return new Response('No subscribers', { status: 200 })

  // Group subscribers by city to avoid redundant weather fetches
  const byCity = new Map<string, Array<{ email: string; unit: string; unsubscribeToken: string }>>()
  for (const doc of snapshot.docs) {
    const { email, city, unit, unsubscribeToken } = doc.data()
    if (!byCity.has(city)) byCity.set(city, [])
    byCity.get(city)!.push({ email, unit, unsubscribeToken })
  }

  // Fetch weather once per city (parallel)
  const cityWeather = new Map<string, any>()
  await Promise.all(
    Array.from(byCity.keys()).map(async (city) => {
      try {
        const weather = await fetchWeather(city)
        if (weather) cityWeather.set(city, weather)
      } catch (err) {
        console.error(`Failed to fetch weather for ${city}:`, err)
      }
    })
  )

  // Send emails in parallel batches
  const sends = []
  for (const [city, subscribers] of byCity) {
    const weather = cityWeather.get(city)
    if (!weather) continue

    for (const { email, unit, unsubscribeToken } of subscribers) {
      sends.push(
        sgMail.send({
          to: email,
          from: process.env.SENDGRID_FROM_EMAIL!,
          subject: `Weather in ${city}: ${Math.round(weather.main.temp)}°F — ${weather.weather[0].description}`,
          html: buildEmail(city, weather, unit, unsubscribeToken),
        }).catch((err) => console.error(`Failed to send to ${email}:`, err))
      )
    }
  }

  await Promise.all(sends)
  return new Response(`Sent ${sends.length} emails`, { status: 200 })
}

export const config: Config = {
  schedule: '0 12 * * *',
}
