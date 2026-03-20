import { useWeatherContext } from '../../context/WeatherContext'
import { CountUp } from '../CountUp/CountUp'

const DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']

export function degToDirection(deg: number): string {
  return DIRECTIONS[Math.round(deg / 45) % 8]
}

export function WindWidget() {
  const { weatherData } = useWeatherContext()
  const { current } = weatherData

  if (!current) return null

  return (
    <div className="glass p-4">
      <p className="section-label mb-2">Wind</p>
      <CountUp value={Math.round(current.wind.speed)} suffix=" mph" className="text-2xl font-light text-white" />
      <p className="text-[10px] text-white/50 mt-1">{degToDirection(current.wind.deg)}</p>
    </div>
  )
}
