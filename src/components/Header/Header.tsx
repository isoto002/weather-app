import { useState, useEffect, useRef } from 'react'
import { useWeatherContext } from '../../context/WeatherContext'
import { searchCities } from '../../lib/api'
import type { City, OWMGeoResult } from '../../types/weather'

export function Header() {
  const { city, setCity, removeCity, recentCities, unit, toggleUnit, theme, toggleTheme } =
    useWeatherContext()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<OWMGeoResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      const cities = await searchCities(query)
      setResults(cities)
      setShowResults(true)
    }, 300)

    return () => clearTimeout(debounceRef.current)
  }, [query])

  const handleSelect = (result: OWMGeoResult) => {
    const newCity: City = {
      name: result.name,
      lat: result.lat,
      lon: result.lon,
      country: result.country,
      state: result.state,
    }
    setCity(newCity)
    setQuery('')
    setResults([])
    setShowResults(false)
    inputRef.current?.blur()
  }

  const handleRecentClick = (c: City) => {
    setCity(c)
  }

  return (
    <header className="sticky top-0 z-50 px-4 py-3">
      <div className="max-w-3xl mx-auto">
        {/* Top row: search + toggles */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => results.length > 0 && setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
              placeholder="Search city..."
              aria-label="Search for a city"
              className="w-full glass px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-white/20"
            />

            {/* Autocomplete dropdown */}
            {showResults && results.length > 0 && (
              <ul className="absolute top-full left-0 right-0 mt-1 glass p-1 max-h-60 overflow-y-auto z-50">
                {results.map((r, i) => (
                  <li key={`${r.lat}-${r.lon}-${i}`}>
                    <button
                      type="button"
                      onClick={() => handleSelect(r)}
                      className="w-full text-left px-3 py-2 text-sm text-white/80 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {r.name}{r.state ? `, ${r.state}` : ''}, {r.country}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Unit toggle */}
          <button
            onClick={toggleUnit}
            aria-label={`Switch to ${unit === 'F' ? 'Celsius' : 'Fahrenheit'}`}
            className="glass px-3 py-2 text-sm text-white/70 hover:text-white transition-colors"
          >
            °{unit === 'F' ? 'C' : 'F'}
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="glass px-3 py-2 text-sm transition-colors"
          >
            {theme === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19'}
          </button>

        </div>

        {/* Recent cities */}
        {recentCities.length > 0 && (
          <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
            {recentCities.map((c) => (
              <span
                key={`${c.lat}-${c.lon}`}
                className={`flex-shrink-0 flex items-center gap-1 pl-3 pr-1.5 py-1 text-xs rounded-full transition-colors ${
                  city?.lat === c.lat && city?.lon === c.lon
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70'
                }`}
              >
                <button onClick={() => handleRecentClick(c)}>{c.name}</button>
                <button
                  onClick={(e) => { e.stopPropagation(); removeCity(c) }}
                  aria-label={`Remove ${c.name}`}
                  className="text-white/30 hover:text-white/70 ml-0.5 text-[10px]"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
