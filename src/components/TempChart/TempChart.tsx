import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useWeatherContext } from '../../context/WeatherContext'
import { convertTemp } from '../../lib/weather-utils'

export function TempChart() {
  const { weatherData, unit } = useWeatherContext()
  const { forecast, loading } = weatherData

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
    <section className="px-4 max-w-3xl mx-auto mt-4">
      <div className="glass p-4">
        <p className="text-[10px] uppercase tracking-[0.15em] text-white/40 mb-3">
          Temperature Trend
        </p>
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={data}>
            <XAxis
              dataKey="name"
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                background: 'rgba(0,0,0,0.7)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '12px',
              }}
              formatter={(value: number) => [`${value}\u00B0${unit}`, '']}
            />
            <Line
              type="monotone"
              dataKey="high"
              stroke="rgba(0,122,255,0.8)"
              strokeWidth={2}
              dot={{ fill: 'rgba(0,122,255,0.8)', r: 3 }}
              name="High"
            />
            <Line
              type="monotone"
              dataKey="low"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={{ fill: 'rgba(255,255,255,0.3)', r: 3 }}
              name="Low"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
