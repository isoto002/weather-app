import { useWeatherContext } from '../../context/WeatherContext'
import { getGoldenHour } from '../../lib/weather-utils'

function formatTime(unix: number): string {
  return new Date(unix * 1000).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function SunWidget() {
  const { weatherData } = useWeatherContext()
  const { current } = weatherData

  if (!current) return null

  const { sunrise, sunset } = current.sys
  const golden = getGoldenHour(sunrise, sunset)
  const now = current.dt
  const dayLength = sunset - sunrise
  const elapsed = Math.max(0, Math.min(dayLength, now - sunrise))
  const progress = dayLength > 0 ? (elapsed / dayLength) * 100 : 0

  return (
    <div className="glass p-4">
      <p className="text-[9px] uppercase tracking-[0.15em] text-white/40 mb-2">
        Sunrise & Sunset
      </p>

      {/* Sun arc */}
      <div className="relative h-12 mb-2">
        <svg viewBox="0 0 200 60" className="w-full h-full" aria-hidden="true">
          <path
            d="M 10 55 Q 100 -10 190 55"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="2"
          />
          <path
            d="M 10 55 Q 30 35 50 30"
            fill="none"
            stroke="rgba(255, 183, 77, 0.3)"
            strokeWidth="3"
          />
          <path
            d="M 150 30 Q 170 35 190 55"
            fill="none"
            stroke="rgba(255, 183, 77, 0.3)"
            strokeWidth="3"
          />
          <circle
            cx={10 + (progress / 100) * 180}
            cy={55 - Math.sin((progress / 100) * Math.PI) * 55}
            r="5"
            fill="rgba(255, 200, 50, 0.9)"
          />
        </svg>
      </div>

      <div className="flex justify-between text-[10px]">
        <span className="text-white/50">↑ {formatTime(sunrise)}</span>
        <span className="text-amber-300/60 text-[9px]">
          Golden {formatTime(golden.evening.start)}
        </span>
        <span className="text-white/50">↓ {formatTime(sunset)}</span>
      </div>
    </div>
  )
}
