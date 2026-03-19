import { useWeatherContext } from '../../context/WeatherContext'
import { convertTemp, formatTemp } from '../../lib/weather-utils'

export function Hero() {
  const { city, weatherData, unit, geoError, refresh } = useWeatherContext()
  const { current, loading, error } = weatherData

  if (loading) {
    return (
      <section className="text-center py-16 px-4" aria-live="polite">
        <div className="animate-pulse">
          <div className="h-4 w-32 bg-white/10 rounded mx-auto mb-4" />
          <div className="h-16 w-40 bg-white/10 rounded mx-auto mb-4" />
          <div className="h-4 w-24 bg-white/10 rounded mx-auto" />
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

  const temp = convertTemp(current.main.temp, unit)
  const feelsLike = convertTemp(current.main.feels_like, unit)
  const high = convertTemp(current.main.temp_max, unit)
  const low = convertTemp(current.main.temp_min, unit)

  return (
    <section className="text-center py-12 px-4" aria-live="polite">
      <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-2">
        {city.name}{city.state ? `, ${city.state}` : ''}, {city.country}
      </p>
      <p className="text-7xl font-extralight text-white leading-none">
        {formatTemp(temp, unit)}
      </p>
      <p className="text-white/60 mt-3 text-base capitalize">
        {current.weather[0].description}
      </p>
      <div className="flex justify-center gap-6 mt-3">
        <span className="text-sm text-white/40">H: {formatTemp(high, unit)}</span>
        <span className="text-sm text-white/40">L: {formatTemp(low, unit)}</span>
      </div>
      <p className="text-xs text-white/30 mt-2">
        Feels like {formatTemp(feelsLike, unit)}
      </p>
    </section>
  )
}
