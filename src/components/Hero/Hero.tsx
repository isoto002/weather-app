import { useWeatherContext } from '../../context/WeatherContext'
import { convertTemp, getWeatherCondition } from '../../lib/weather-utils'
import { useElapsedTime } from '../../hooks/useElapsedTime'
import { CountUp } from '../CountUp/CountUp'

const CONDITION_EMOJI: Record<string, { emoji: string; animation: string }> = {
  clear: { emoji: '☀️', animation: 'emoji-spin' },
  'partly-cloudy': { emoji: '⛅', animation: 'emoji-float' },
  cloudy: { emoji: '☁️', animation: 'emoji-float' },
  rain: { emoji: '🌧️', animation: 'emoji-bob' },
  thunderstorm: { emoji: '⛈️', animation: 'emoji-shake' },
  snow: { emoji: '🌨️', animation: 'emoji-drift' },
  fog: { emoji: '🌫️', animation: 'emoji-fog-pulse' },
}

function getGreeting(timezoneOffset: number): string {
  const utcMs = Date.now() + new Date().getTimezoneOffset() * 60_000
  const localHour = new Date(utcMs + timezoneOffset * 1000).getHours()
  if (localHour >= 5 && localHour < 12) return 'Good Morning'
  if (localHour >= 12 && localHour < 17) return 'Good Afternoon'
  if (localHour >= 17 && localHour < 21) return 'Good Evening'
  return 'Tonight'
}

export function Hero() {
  const { city, weatherData, unit, geoError, refresh, lastFetchedAt } = useWeatherContext()
  const { current, loading, error } = weatherData
  const elapsed = useElapsedTime(lastFetchedAt)

  if (loading) {
    return (
      <section className="text-center py-16 px-4" aria-live="polite">
        <div>
          <div className="h-4 w-32 skeleton-shimmer rounded mx-auto mb-4" />
          <div className="h-16 w-40 skeleton-shimmer rounded mx-auto mb-4" />
          <div className="h-4 w-24 skeleton-shimmer rounded mx-auto" />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="text-center py-16 px-4" aria-live="assertive">
        <p className="text-red-400 text-lg">{error}</p>
        <p className="text-white/40 text-sm mt-2">Try searching for a city above</p>
        <button
          onClick={refresh}
          className="mt-4 px-4 py-2 text-sm glass text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          Retry
        </button>
      </section>
    )
  }

  if (!current || !city) {
    return (
      <section className="text-center py-16 px-4">
        <p className="text-white/50 text-lg">Search for a city to see the weather</p>
        {geoError && <p className="text-white/30 text-sm mt-2">{geoError}</p>}
      </section>
    )
  }

  const temp = Math.round(convertTemp(current.main.temp, unit))
  const feelsLike = Math.round(convertTemp(current.main.feels_like, unit))
  const high = Math.round(convertTemp(current.main.temp_max, unit))
  const low = Math.round(convertTemp(current.main.temp_min, unit))
  const condition = getWeatherCondition(current.weather[0].id)
  const emojiInfo = CONDITION_EMOJI[condition] ?? CONDITION_EMOJI.clear
  const greeting = getGreeting(current.timezone ?? 0)

  return (
    <section className="text-center py-12 px-4" aria-live="polite">
      <p className="section-label mb-1">{greeting}</p>
      <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-2">
        {city.name}{city.state ? `, ${city.state}` : ''}, {city.country}
      </p>

      <span className={`inline-block text-4xl mb-2 ${emojiInfo.animation}`}>
        {emojiInfo.emoji}
      </span>

      <p className="text-7xl font-extralight text-white leading-none temp-pulse">
        <CountUp value={temp} suffix={`°${unit}`} />
      </p>

      <p className="text-white/60 mt-3 text-base capitalize">
        {current.weather[0].description}
      </p>

      <div className="flex justify-center gap-6 mt-3">
        <span className="text-sm text-white/40">
          H: <CountUp value={high} suffix={`°${unit}`} />
        </span>
        <span className="text-sm text-white/40">
          L: <CountUp value={low} suffix={`°${unit}`} />
        </span>
      </div>

      <p className="text-xs text-white/30 mt-2">
        Feels like <CountUp value={feelsLike} suffix={`°${unit}`} />
      </p>

      {elapsed && (
        <button
          onClick={refresh}
          className="text-[10px] text-white/20 mt-3 hover:text-white/40 hover:underline transition-colors cursor-pointer"
          aria-label="Refresh weather data"
        >
          ↻ {elapsed}
        </button>
      )}
    </section>
  )
}
