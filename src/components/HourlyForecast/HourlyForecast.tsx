import { useWeatherContext } from '../../context/WeatherContext'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { convertTemp, formatLocationTime } from '../../lib/weather-utils'
import type { OWMForecastItem } from '../../types/weather'

const WEATHER_ICONS: Record<string, string> = {
  '01d': '☀️', '01n': '🌙',
  '02d': '⛅', '02n': '☁️',
  '03d': '☁️', '03n': '☁️',
  '04d': '☁️', '04n': '☁️',
  '09d': '🌧️', '09n': '🌧️',
  '10d': '🌦️', '10n': '🌧️',
  '11d': '⛈️', '11n': '⛈️',
  '13d': '🌨️', '13n': '🌨️',
  '50d': '🌫️', '50n': '🌫️',
}

interface HourlyItem {
  time: string
  icon: string
  temp: number
  isNow: boolean
}

export function HourlyForecast() {
  const { weatherData, unit } = useWeatherContext()
  const { current, loading, hourlyItems } = weatherData
  const revealRef = useScrollReveal(0)

  if (loading) {
    return (
      <section className="px-4 max-w-3xl mx-auto mt-4">
        <div className="glass p-4">
          <div className="flex gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[60px] text-center">
                <div className="h-3 w-8 skeleton-shimmer rounded mx-auto mb-2" />
                <div className="h-6 w-6 skeleton-shimmer rounded mx-auto mb-2" />
                <div className="h-3 w-8 skeleton-shimmer rounded mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!current || hourlyItems.length === 0) return null

  const tz = current.timezone ?? 0

  const items: HourlyItem[] = [
    // "Now" item from current weather
    {
      time: 'Now',
      icon: current.weather[0].icon,
      temp: Math.round(convertTemp(current.main.temp, unit)),
      isNow: true,
    },
    // Next 8 forecast slots
    ...hourlyItems.slice(0, 8).map((item: OWMForecastItem) => ({
      time: formatLocationTime(item.dt, tz, { hour: 'numeric', hour12: true }),
      icon: item.weather[0].icon,
      temp: Math.round(convertTemp(item.main.temp, unit)),
      isNow: false,
    })),
  ]

  return (
    <section ref={revealRef} className="px-4 max-w-3xl mx-auto mt-4">
      <div className="glass p-4">
        <p className="section-label mb-3">Hourly Forecast</p>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide" style={{ scrollSnapType: 'x mandatory' }}>
          {items.map((item, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[60px] text-center"
              style={{ scrollSnapAlign: 'start' }}
            >
              <p className={`text-[10px] mb-1 ${item.isNow ? 'text-white/80 font-medium' : 'text-white/40'}`}>
                {item.time}
              </p>
              <p className="text-xl mb-1">
                {WEATHER_ICONS[item.icon] ?? '🌤️'}
              </p>
              <p className={`text-xs ${item.isNow ? 'text-white/80' : 'text-white/60'}`}>
                {item.temp}°
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
