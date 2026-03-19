import { useWeatherContext } from '../../context/WeatherContext'

const DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']

function degToDirection(deg: number): string {
  return DIRECTIONS[Math.round(deg / 45) % 8]
}

export function WindWidget() {
  const { weatherData } = useWeatherContext()
  const { current } = weatherData

  if (!current) return null

  return (
    <div className="glass p-4">
      <p className="text-[9px] uppercase tracking-[0.15em] text-white/40 mb-2">Wind</p>
      <p className="text-2xl font-light text-white">{Math.round(current.wind.speed)} mph</p>
      <p className="text-[10px] text-white/50 mt-1">{degToDirection(current.wind.deg)}</p>
    </div>
  )
}
