import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useGeolocation } from '../hooks/useGeolocation'
import { useWeather } from '../hooks/useWeather'
import type { City, TemperatureUnit, ThemeMode } from '../types/weather'

interface WeatherContextType {
  // Location
  city: City | null
  setCity: (city: City) => void
  removeCity: (city: City) => void
  recentCities: City[]

  // Weather data
  weatherData: Omit<ReturnType<typeof useWeather>, 'refresh'>
  refresh: () => void

  // Preferences
  unit: TemperatureUnit
  toggleUnit: () => void
  theme: ThemeMode
  toggleTheme: () => void

  // Geolocation
  geoError: string | null
  geoLoading: boolean

  // Fetch metadata
  lastFetchedAt: number | null
}

const WeatherContext = createContext<WeatherContextType | null>(null)

export function WeatherProvider({ children }: { children: ReactNode }) {
  const geo = useGeolocation()
  const [unit, setUnit] = useLocalStorage<TemperatureUnit>('weather-unit', 'F')
  const [theme, setTheme] = useLocalStorage<ThemeMode>(
    'weather-theme',
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark'
  )
  const [recentCities, setRecentCities] = useLocalStorage<City[]>('weather-recent-cities', [])
  const [selectedCity, setSelectedCity] = useState<City | null>(null)

  const activeLat = selectedCity?.lat ?? geo.lat
  const activeLon = selectedCity?.lon ?? geo.lon

  const weather = useWeather(activeLat, activeLon)

  const setCity = useCallback(
    (city: City) => {
      setSelectedCity(city)
      setRecentCities((prev) => {
        const filtered = prev.filter(
          (c) => !(c.lat === city.lat && c.lon === city.lon)
        )
        return [city, ...filtered].slice(0, 5)
      })
    },
    [setRecentCities]
  )

  const removeCity = useCallback(
    (city: City) => {
      setRecentCities((prev) =>
        prev.filter((c) => !(c.lat === city.lat && c.lon === city.lon))
      )
    },
    [setRecentCities]
  )

  const toggleUnit = useCallback(() => {
    setUnit((prev) => (prev === 'F' ? 'C' : 'F'))
  }, [setUnit])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [setTheme])

  // Derive city from weather data if using geolocation
  const city: City | null = selectedCity ?? (weather.current
    ? {
        name: weather.current.name,
        lat: weather.current.coord.lat,
        lon: weather.current.coord.lon,
        country: weather.current.sys.country,
      }
    : null)

  return (
    <WeatherContext.Provider
      value={{
        city,
        setCity,
        removeCity,
        recentCities,
        weatherData: weather,
        refresh: weather.refresh,
        unit,
        toggleUnit,
        theme,
        toggleTheme,
        geoError: geo.error,
        geoLoading: geo.loading,
        lastFetchedAt: weather.lastFetchedAt,
      }}
    >
      {children}
    </WeatherContext.Provider>
  )
}

export function useWeatherContext(): WeatherContextType {
  const context = useContext(WeatherContext)
  if (!context) {
    throw new Error('useWeatherContext must be used within a WeatherProvider')
  }
  return context
}
