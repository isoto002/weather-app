import { useState, useEffect } from 'react'
import { useWeatherContext } from '../../context/WeatherContext'
import { searchCities, fetchCurrentWeather } from '../../lib/api'
import { convertTemp, formatTemp } from '../../lib/weather-utils'
import type { City, OWMCurrentWeather, OWMGeoResult } from '../../types/weather'

export function CityComparison() {
  const { city, weatherData, unit } = useWeatherContext()
  const { current } = weatherData

  const [compareCity, setCompareCity] = useState<City | null>(null)
  const [compareWeather, setCompareWeather] = useState<OWMCurrentWeather | null>(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<OWMGeoResult[]>([])
  const [showSearch, setShowSearch] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const timeout = setTimeout(async () => {
      const cities = await searchCities(query)
      setResults(cities)
    }, 300)
    return () => clearTimeout(timeout)
  }, [query])

  const handleSelect = async (result: OWMGeoResult) => {
    const newCity: City = { name: result.name, lat: result.lat, lon: result.lon, country: result.country, state: result.state }
    setCompareCity(newCity)
    setQuery('')
    setResults([])
    setShowSearch(false)
    setLoading(true)
    try {
      const weather = await fetchCurrentWeather(newCity.lat, newCity.lon)
      setCompareWeather(weather)
    } catch {
      setCompareWeather(null)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = () => {
    setCompareCity(null)
    setCompareWeather(null)
  }

  if (!current || !city) return null

  const metrics = compareWeather
    ? [
        { label: 'Temperature', a: current.main.temp, b: compareWeather.main.temp, higherWins: true },
        { label: 'Humidity', a: current.main.humidity, b: compareWeather.main.humidity, higherWins: false },
        { label: 'Wind', a: current.wind.speed, b: compareWeather.wind.speed, higherWins: false },
      ]
    : []

  return (
    <section className="px-4 max-w-3xl mx-auto mt-4">
      <div className="glass p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[9px] uppercase tracking-[0.15em] text-white/40">
            Compare Cities
          </p>
          {compareCity && (
            <button
              onClick={handleRemove}
              className="text-white/30 hover:text-white/60 text-sm"
              aria-label="Remove comparison city"
            >
              ✕
            </button>
          )}
        </div>

        {!compareCity ? (
          <div>
            {showSearch ? (
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search city to compare..."
                  autoFocus
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 outline-none"
                  aria-label="Search for a city to compare"
                />
                {results.length > 0 && (
                  <ul className="absolute top-full left-0 right-0 mt-1 glass p-1 max-h-40 overflow-y-auto z-10">
                    {results.map((r, i) => (
                      <li key={`${r.lat}-${r.lon}-${i}`}>
                        <button
                          type="button"
                          onClick={() => handleSelect(r)}
                          className="w-full text-left px-3 py-2 text-sm text-white/80 hover:bg-white/10 rounded-lg"
                        >
                          {r.name}{r.state ? `, ${r.state}` : ''}, {r.country}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="w-full py-3 text-sm text-white/40 hover:text-white/60 border border-dashed border-white/10 rounded-xl hover:border-white/20 transition-colors"
              >
                + Add a city to compare
              </button>
            )}
          </div>
        ) : loading ? (
          <div className="animate-pulse h-24 bg-white/5 rounded-lg" />
        ) : compareWeather ? (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-4 text-center">
              <div>
                <p className="text-xs text-white/50">{city.name}</p>
                <p className="text-3xl font-extralight text-white">
                  {formatTemp(convertTemp(current.main.temp, unit), unit)}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/50">{compareCity.name}</p>
                <p className="text-3xl font-extralight text-white">
                  {formatTemp(convertTemp(compareWeather.main.temp, unit), unit)}
                </p>
              </div>
            </div>

            {metrics.map(({ label, a, b, higherWins }) => {
              const aWins = higherWins ? a > b : a < b
              const bWins = higherWins ? b > a : b < a
              const formatVal = label === 'Temperature'
                ? (v: number) => formatTemp(convertTemp(v, unit), unit)
                : label === 'Humidity'
                ? (v: number) => `${v}%`
                : (v: number) => `${Math.round(v)} mph`

              return (
                <div key={label} className="flex items-center py-2 border-t border-white/5">
                  <span className={`flex-1 text-sm text-right pr-3 ${aWins ? 'text-green-400' : 'text-white/50'}`}>
                    {formatVal(a)}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-white/30 w-20 text-center">
                    {label}
                  </span>
                  <span className={`flex-1 text-sm text-left pl-3 ${bWins ? 'text-green-400' : 'text-white/50'}`}>
                    {formatVal(b)}
                  </span>
                </div>
              )
            })}
          </div>
        ) : null}
      </div>
    </section>
  )
}
