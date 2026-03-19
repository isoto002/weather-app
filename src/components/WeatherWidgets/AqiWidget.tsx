import { useWeatherContext } from '../../context/WeatherContext'
import { getAqiLabel } from '../../lib/weather-utils'

const AQI_COLORS: Record<string, string> = {
  green: 'text-green-400',
  yellow: 'text-yellow-400',
  orange: 'text-orange-400',
  red: 'text-red-400',
  purple: 'text-purple-400',
  gray: 'text-gray-400',
}

const AQI_BG: Record<string, string> = {
  green: 'bg-green-400',
  yellow: 'bg-yellow-400',
  orange: 'bg-orange-400',
  red: 'bg-red-400',
  purple: 'bg-purple-400',
  gray: 'bg-gray-400',
}

export function AqiWidget() {
  const { weatherData } = useWeatherContext()
  const { airQuality } = weatherData

  if (!airQuality) return null

  const aqi = airQuality.list[0]?.main.aqi ?? 0
  const { label, color } = getAqiLabel(aqi)
  const percentage = (aqi / 5) * 100

  return (
    <div className="glass p-4">
      <p className="section-label mb-2">Air Quality</p>
      <p className={`text-2xl font-light ${AQI_COLORS[color]}`}>{aqi}</p>
      <div className="w-full h-1.5 bg-white/10 rounded-full mt-2">
        <div
          className={`h-full rounded-full ${AQI_BG[color]} transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-[10px] text-white/50 mt-1">{label}</p>
    </div>
  )
}
