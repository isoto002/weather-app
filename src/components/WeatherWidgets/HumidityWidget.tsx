import { useWeatherContext } from '../../context/WeatherContext'

export function HumidityWidget() {
  const { weatherData } = useWeatherContext()
  const { current } = weatherData

  if (!current) return null

  const humidity = current.main.humidity
  const label = humidity > 70 ? 'High' : humidity > 40 ? 'Moderate' : 'Low'

  return (
    <div className="glass p-4">
      <p className="section-label mb-2">Humidity</p>
      <p className="text-2xl font-light text-white">{humidity}%</p>
      <p className="text-[10px] text-white/50 mt-1">{label}</p>
    </div>
  )
}
