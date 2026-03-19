import { useState } from 'react'
import { useWeatherContext } from '../../context/WeatherContext'

export function AlertBanner() {
  const { weatherData } = useWeatherContext()
  const { alerts } = weatherData
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())

  const activeAlerts = alerts.filter((a) => !dismissedIds.has(a.id))

  if (activeAlerts.length === 0) return null

  return (
    <div className="px-4 max-w-3xl mx-auto mt-2 space-y-2" role="alert">
      {activeAlerts.map((alert) => {
        const severity = alert.properties.severity
        const bgColor =
          severity === 'Extreme' || severity === 'Severe'
            ? 'bg-red-500/20 border-red-500/30'
            : 'bg-orange-500/20 border-orange-500/30'
        const textColor =
          severity === 'Extreme' || severity === 'Severe'
            ? 'text-red-300'
            : 'text-orange-300'

        return (
          <div
            key={alert.id}
            className={`${bgColor} border rounded-xl p-3 flex items-start gap-3`}
          >
            <span className={`${textColor} text-lg flex-shrink-0`}>⚠️</span>
            <div className="flex-1 min-w-0">
              <p className={`${textColor} text-sm font-medium`}>
                {alert.properties.event}
              </p>
              <p className="text-white/60 text-xs mt-1 line-clamp-2">
                {alert.properties.headline}
              </p>
            </div>
            <button
              onClick={() => setDismissedIds((prev) => new Set(prev).add(alert.id))}
              className="text-white/30 hover:text-white/60 text-sm flex-shrink-0"
              aria-label="Dismiss alert"
            >
              ✕
            </button>
          </div>
        )
      })}
    </div>
  )
}
