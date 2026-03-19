import { useWeatherContext } from '../../context/WeatherContext'
import { getWeatherCondition, getOutfitSuggestion } from '../../lib/weather-utils'

export function OutfitWidget() {
  const { weatherData } = useWeatherContext()
  const { current } = weatherData

  if (!current) return null

  const condition = getWeatherCondition(current.weather[0].id)
  const suggestion = getOutfitSuggestion(current.main.temp, condition)

  return (
    <div className="glass p-4">
      <p className="section-label mb-2">
        What to Wear
      </p>
      <p className="text-2xl mb-1">{suggestion.icons.slice(0, 3).join(' ')}</p>
      <p className="text-[10px] text-white/50 mt-1">{suggestion.summary}</p>
    </div>
  )
}
