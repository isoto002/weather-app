import { useWeatherContext } from '../../context/WeatherContext'
import { getBestDay, convertTemp, formatTemp } from '../../lib/weather-utils'

export function BestDay() {
  const { weatherData, unit } = useWeatherContext()
  const { forecast, loading } = weatherData

  if (loading || forecast.length === 0) return null

  const best = getBestDay(forecast)
  const highTemp = convertTemp(best.tempHigh, unit)

  return (
    <section className="px-4 max-w-3xl mx-auto mt-4">
      <div className="glass p-5 text-center">
        <p className="text-[9px] uppercase tracking-[0.15em] text-white/40 mb-3">
          Best Day This Week
        </p>
        <p className="text-lg text-white font-light">
          <span className="text-white/90">{best.dayName}</span>
          {' — '}
          <span>{formatTemp(highTemp, unit)}</span>
          {', '}
          <span className="text-white/60 capitalize">{best.condition.toLowerCase()}</span>
        </p>
        <p className="text-xs text-white/40 mt-2">
          Best day for outdoor plans
        </p>
      </div>
    </section>
  )
}
