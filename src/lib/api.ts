import type {
  OWMCurrentWeather,
  OWMForecastResponse,
  OWMAirQuality,
  OWMGeoResult,
} from '../types/weather'

const API_KEY = import.meta.env.VITE_OWM_API_KEY
const BASE_URL = 'https://api.openweathermap.org'

async function fetchJSON<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }
  return response.json()
}

export async function fetchCurrentWeather(
  lat: number,
  lon: number
): Promise<OWMCurrentWeather> {
  return fetchJSON<OWMCurrentWeather>(
    `${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
  )
}

export async function fetchForecast(
  lat: number,
  lon: number
): Promise<OWMForecastResponse> {
  return fetchJSON<OWMForecastResponse>(
    `${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
  )
}

export async function fetchAirQuality(
  lat: number,
  lon: number
): Promise<OWMAirQuality> {
  return fetchJSON<OWMAirQuality>(
    `${BASE_URL}/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  )
}

export async function reverseGeocode(lat: number, lon: number): Promise<OWMGeoResult | null> {
  const results = await fetchJSON<OWMGeoResult[]>(
    `${BASE_URL}/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
  )
  return results[0] ?? null
}

export async function searchCities(query: string): Promise<OWMGeoResult[]> {
  if (!query.trim()) return []
  const encoded = encodeURIComponent(query).replace(/%20/g, '+')
  return fetchJSON<OWMGeoResult[]>(
    `${BASE_URL}/geo/1.0/direct?q=${encoded}&limit=5&appid=${API_KEY}`
  )
}
