import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useWeatherContext } from '../../context/WeatherContext'
import { convertTemp } from '../../lib/weather-utils'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export function TempChart() {
  const { weatherData, unit, theme } = useWeatherContext()
  const { forecast, loading } = weatherData
  const isLight = theme === 'light'
  const revealRef = useScrollReveal(75)

  if (loading || forecast.length === 0) {
    return (
      <section className="px-4 max-w-3xl mx-auto mt-4">
        <div className="glass p-4">
          <div className="animate-pulse h-[140px] bg-white/5 rounded-lg" />
        </div>
      </section>
    )
  }

  const data = forecast.map((day) => ({
    name: day.dayName,
    high: Math.round(convertTemp(day.tempHigh, unit)),
    low: Math.round(convertTemp(day.tempLow, unit)),
  }))

  return (
    <section ref={revealRef} className="px-4 max-w-3xl mx-auto mt-4">
      <div className="glass p-4">
        <p className="section-label mb-3">
          Temperature Trend
        </p>
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={data}>
            <XAxis
              dataKey="name"
              tick={{ fill: isLight ? '#48484a' : 'rgba(255,255,255,0.4)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval={0}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                background: isLight ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)',
                border: isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: isLight ? '#1d1d1f' : 'white',
                fontSize: '12px',
              }}
              formatter={(value: number, name: string) => [`${value}°${unit}`, name]}
            />
            <Line
              type="monotone"
              dataKey="high"
              stroke={isLight ? 'rgba(0,100,220,0.9)' : 'rgba(0,122,255,0.8)'}
              strokeWidth={2}
              dot={{ fill: isLight ? 'rgba(0,100,220,0.9)' : 'rgba(0,122,255,0.8)', r: 3 }}
              name="High"
            />
            <Line
              type="monotone"
              dataKey="low"
              stroke={isLight ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)'}
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={{ fill: isLight ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)', r: 3 }}
              name="Low"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
