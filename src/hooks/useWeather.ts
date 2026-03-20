import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchCurrentWeather, fetchForecast, fetchAirQuality } from '../lib/api'
import { fetchAlerts } from '../lib/nws-api'
import { getWeatherCondition } from '../lib/weather-utils'
import type {
  OWMCurrentWeather,
  DayForecast,
  OWMAirQuality,
  NWSAlert,
  OWMForecastItem,
} from '../types/weather'

interface UseWeatherResult {
  current: OWMCurrentWeather | null
  forecast: DayForecast[]
  airQuality: OWMAirQuality | null
  alerts: NWSAlert[]
  loading: boolean
  error: string | null
  refresh: () => void
  lastFetchedAt: number | null
  hourlyItems: OWMForecastItem[]
}

const CACHE_TTL = 10 * 60 * 1000 // 10 minutes

function processForecast(items: OWMForecastItem[]): DayForecast[] {
  const dayMap = new Map<string, OWMForecastItem[]>()

  for (const item of items) {
    const date = item.dt_txt.split(' ')[0]
    if (!dayMap.has(date)) dayMap.set(date, [])
    dayMap.get(date)!.push(item)
  }

  const days: DayForecast[] = []
  for (const [date, dayItems] of dayMap) {
    if (days.length >= 5) break
    const temps = dayItems.map((i) => i.main.temp)
    const midday = dayItems.find((i) => i.dt_txt.includes('12:00')) ?? dayItems[0]

    days.push({
      date,
      dayName: new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' }),
      tempHigh: Math.round(Math.max(...temps)),
      tempLow: Math.round(Math.min(...temps)),
      condition: getWeatherCondition(midday.weather[0].id),
      conditionId: midday.weather[0].id,
      icon: midday.weather[0].icon,
      pop: Math.max(...dayItems.map((i) => i.pop)),
      windSpeed: Math.max(...dayItems.map((i) => i.wind.speed)),
    })
  }

  return days
}

export function useWeather(lat: number | null, lon: number | null): UseWeatherResult {
  const [current, setCurrent] = useState<OWMCurrentWeather | null>(null)
  const [forecast, setForecast] = useState<DayForecast[]>([])
  const [airQuality, setAirQuality] = useState<OWMAirQuality | null>(null)
  const [alerts, setAlerts] = useState<NWSAlert[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastFetchedAt, setLastFetchedAt] = useState<number | null>(null)
  const [hourlyItems, setHourlyItems] = useState<OWMForecastItem[]>([])
  const cacheRef = useRef<{ key: string; time: number } | null>(null)

  const fetchAll = useCallback(async () => {
    if (lat === null || lon === null) return

    const cacheKey = `${lat},${lon}`
    if (
      cacheRef.current &&
      cacheRef.current.key === cacheKey &&
      Date.now() - cacheRef.current.time < CACHE_TTL
    ) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const [currentData, forecastData, aqiData, alertsData] = await Promise.all([
        fetchCurrentWeather(lat, lon),
        fetchForecast(lat, lon),
        fetchAirQuality(lat, lon).catch(() => null),
        fetchAlerts(lat, lon),
      ])

      setCurrent(currentData)
      setForecast(processForecast(forecastData.list))
      setHourlyItems(forecastData.list.slice(0, 8))
      setAirQuality(aqiData)
      setAlerts(alertsData)
      cacheRef.current = { key: cacheKey, time: Date.now() }
      setLastFetchedAt(Date.now())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data')
    } finally {
      setLoading(false)
    }
  }, [lat, lon])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const refresh = useCallback(() => {
    cacheRef.current = null
    fetchAll()
  }, [fetchAll])

  return { current, forecast, airQuality, alerts, loading, error, refresh, lastFetchedAt, hourlyItems }
}
