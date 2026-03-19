import { useWeatherContext } from '../../context/WeatherContext'
import { convertTemp } from '../../lib/weather-utils'

const WEATHER_ICONS: Record<string, string> = {
  '01d': '\u2600\uFE0F', '01n': '\uD83C\uDF19',
  '02d': '\u26C5', '02n': '\u2601\uFE0F',
  '03d': '\u2601\uFE0F', '03n': '\u2601\uFE0F',
  '04d': '\u2601\uFE0F', '04n': '\u2601\uFE0F',
  '09d': '\uD83C\uDF27\uFE0F', '09n': '\uD83C\uDF27\uFE0F',
  '10d': '\uD83C\uDF26\uFE0F', '10n': '\uD83C\uDF27\uFE0F',
  '11d': '\u26C8\uFE0F', '11n': '\u26C8\uFE0F',
  '13d': '\uD83C\uDF28\uFE0F', '13n': '\uD83C\uDF28\uFE0F',
  '50d': '\uD83C\uDF2B\uFE0F', '50n': '\uD83C\uDF2B\uFE0F',
}

export function Forecast() {
  const { weatherData, unit } = useWeatherContext()
  const { forecast, loading } = weatherData

  if (loading || forecast.length === 0) {
    return (
      <section className="px-4 max-w-3xl mx-auto">
        <div className="glass p-4">
          <div className="animate-pulse flex gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex-1 text-center">
                <div className="h-3 w-8 bg-white/10 rounded mx-auto mb-2" />
                <div className="h-8 w-8 bg-white/10 rounded mx-auto mb-2" />
                <div className="h-3 w-12 bg-white/10 rounded mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="px-4 max-w-3xl mx-auto" aria-live="polite">
      <div className="glass p-4">
        <p className="text-[10px] uppercase tracking-[0.15em] text-white/40 mb-3">
          5-Day Forecast
        </p>
        <div className="flex gap-2">
          {forecast.map((day) => (
            <div key={day.date} className="flex-1 text-center">
              <p className="text-[10px] text-white/50 mb-1">{day.dayName}</p>
              <p className="text-2xl mb-1">
                {WEATHER_ICONS[day.icon] ?? '\uD83C\uDF24\uFE0F'}
              </p>
              <p className="text-xs text-white/70">
                {Math.round(convertTemp(day.tempHigh, unit))}\u00B0
              </p>
              <p className="text-xs text-white/40">
                {Math.round(convertTemp(day.tempLow, unit))}\u00B0
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
