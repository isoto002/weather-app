import { useWeatherContext } from '../../context/WeatherContext'
import { getGoldenHour, formatLocationTime } from '../../lib/weather-utils'

const arcColors = {
  dark: {
    track: 'rgba(255,255,255,0.1)',
    golden: 'rgba(255, 183, 77, 0.3)',
    sun: 'rgba(255, 200, 50, 0.9)',
    time: 'text-white/50',
    goldenText: 'text-amber-300/60',
  },
  light: {
    track: 'rgba(0,0,0,0.12)',
    golden: 'rgba(200, 130, 0, 0.5)',
    sun: 'rgba(230, 160, 0, 0.95)',
    time: 'text-black/50',
    goldenText: 'text-amber-700/70',
  },
} as const

export function SunWidget() {
  const { weatherData, theme } = useWeatherContext()
  const { current } = weatherData
  const colors = arcColors[theme]

  if (!current) return null

  const { sunrise, sunset } = current.sys
  const tz = current.timezone ?? 0
  const golden = getGoldenHour(sunrise, sunset)
  const fmt = (unix: number) => formatLocationTime(unix, tz)
  const now = current.dt
  const dayLength = sunset - sunrise
  const elapsed = Math.max(0, Math.min(dayLength, now - sunrise))
  const progress = dayLength > 0 ? (elapsed / dayLength) * 100 : 0

  return (
    <div className="glass p-4">
      <p className="section-label mb-2">
        Sunrise & Sunset
      </p>

      {/* Sun arc */}
      <div className="relative h-12 mb-2">
        <svg viewBox="0 0 200 60" className="w-full h-full" aria-hidden="true">
          <path
            d="M 10 55 Q 100 -10 190 55"
            fill="none"
            stroke={colors.track}
            strokeWidth="2"
          />
          <path
            d="M 10 55 Q 30 35 50 30"
            fill="none"
            stroke={colors.golden}
            strokeWidth="3"
          />
          <path
            d="M 150 30 Q 170 35 190 55"
            fill="none"
            stroke={colors.golden}
            strokeWidth="3"
          />
          <circle
            cx={10 + (progress / 100) * 180}
            cy={55 - Math.sin((progress / 100) * Math.PI) * 55}
            r="5"
            fill={colors.sun}
          />
        </svg>
      </div>

      <div className="flex justify-between text-[10px]">
        <span className={colors.time}>↑ {fmt(sunrise)}</span>
        <span className={`${colors.goldenText} text-[9px]`}>
          Golden {fmt(golden.evening.start)}
        </span>
        <span className={colors.time}>↓ {fmt(sunset)}</span>
      </div>
    </div>
  )
}
