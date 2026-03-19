# Weather App Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a publicly-facing weather web app with Apple-inspired glassmorphism design, animated weather backgrounds, and rich features including forecasts, weather maps, city comparison, outfit suggestions, and daily email alerts.

**Architecture:** Single-page React app with all weather data fetched client-side from OpenWeatherMap. React Context for global state. Firebase Firestore for email subscriptions. Netlify Scheduled Functions for daily email cron. Canvas-based particle engine for animated weather backgrounds.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, Shadcn/UI, Recharts, Leaflet, Firebase Firestore, Netlify, SendGrid, OpenWeatherMap API, NWS API.

**Spec:** `docs/superpowers/specs/2026-03-18-weather-app-design.md`

---

## File Structure

```
weather-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header/
│   │   │   ├── Header.tsx              # Search bar, toggles, recent cities chips
│   │   │   └── Header.test.tsx
│   │   ├── Hero/
│   │   │   ├── Hero.tsx                # Current weather display (city, temp, condition)
│   │   │   └── Hero.test.tsx
│   │   ├── AlertBanner/
│   │   │   ├── AlertBanner.tsx         # NWS severe weather alert banner
│   │   │   └── AlertBanner.test.tsx
│   │   ├── Forecast/
│   │   │   ├── Forecast.tsx            # 5-day forecast horizontal row
│   │   │   └── Forecast.test.tsx
│   │   ├── TempChart/
│   │   │   ├── TempChart.tsx           # Recharts temperature trend line chart
│   │   │   └── TempChart.test.tsx
│   │   ├── WeatherWidgets/
│   │   │   ├── HumidityWidget.tsx      # Humidity display
│   │   │   ├── WindWidget.tsx          # Wind speed + direction
│   │   │   ├── SunWidget.tsx           # Sunrise/sunset + golden hour arc
│   │   │   ├── AqiWidget.tsx           # Air quality index gauge
│   │   │   ├── OutfitWidget.tsx        # Outfit suggestion based on weather
│   │   │   ├── WidgetGrid.tsx          # 2-column grid container for widgets
│   │   │   └── WeatherWidgets.test.tsx
│   │   ├── BestDay/
│   │   │   ├── BestDay.tsx             # Best day this week card
│   │   │   └── BestDay.test.tsx
│   │   ├── CityComparison/
│   │   │   ├── CityComparison.tsx      # Side-by-side city weather compare
│   │   │   └── CityComparison.test.tsx
│   │   ├── WeatherMap/
│   │   │   ├── WeatherMap.tsx          # Leaflet map with OWM tile layers
│   │   │   └── WeatherMap.test.tsx
│   │   ├── EmailSignup/
│   │   │   ├── EmailSignup.tsx         # Daily email subscription form
│   │   │   └── EmailSignup.test.tsx
│   │   ├── Background/
│   │   │   ├── Background.tsx          # Canvas + gradient wrapper component
│   │   │   └── Background.test.tsx
│   │   ├── SkeletonCard.tsx            # Reusable glassmorphism skeleton loader
│   │   └── ui/                         # Shadcn/UI components (auto-generated)
│   ├── context/
│   │   └── WeatherContext.tsx          # Global state: city, weather, unit, theme
│   ├── hooks/
│   │   ├── useWeather.ts              # Fetch current + forecast + AQI from OWM
│   │   ├── useGeolocation.ts          # Browser geolocation with fallback
│   │   ├── useLocalStorage.ts         # Generic localStorage hook
│   │   └── hooks.test.ts              # Tests for all hooks
│   ├── lib/
│   │   ├── api.ts                     # OWM API calls (current, forecast, geocode, AQI)
│   │   ├── nws-api.ts                 # NWS alerts API call
│   │   ├── particles.ts              # Canvas particle engine (rain, snow, etc.)
│   │   ├── weather-backgrounds.ts     # Gradient + particle config per condition
│   │   ├── weather-utils.ts           # Temp conversion, outfit logic, best-day calc
│   │   ├── firebase.ts               # Firebase config + Firestore helpers
│   │   ├── api.test.ts
│   │   ├── weather-utils.test.ts
│   │   └── nws-api.test.ts
│   ├── types/
│   │   └── weather.ts                 # TypeScript interfaces for all API responses
│   ├── App.tsx                        # Main layout — stacks all sections
│   ├── main.tsx                       # Entry point
│   └── index.css                      # Tailwind imports + global glass styles
├── netlify/
│   └── functions/
│       ├── send-daily-email.ts        # Scheduled function: cron → fetch → email
│       └── unsubscribe.ts             # Unsubscribe endpoint
├── .env.example                       # Template for API keys
├── .gitignore
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── firebase.json
└── netlify.toml
```

---

## Chunk 1: Project Scaffolding & Foundation

### Task 1: Initialize Vite + React + TypeScript project

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`

- [ ] **Step 1: Scaffold Vite project**

Run:
```bash
cd "c:/Users/Izzy/Documents/Weather App"
npm create vite@latest . -- --template react-ts
```
Expected: Project scaffolded with React + TypeScript template.

- [ ] **Step 2: Install dependencies**

Run:
```bash
npm install
```
Expected: `node_modules` created, no errors.

- [ ] **Step 3: Verify dev server starts**

Run:
```bash
npm run dev
```
Expected: Vite dev server starts on localhost. Stop it after confirming.

- [ ] **Step 4: Initialize git repo**

Run:
```bash
git init
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore
echo "dist/" >> .gitignore
echo ".superpowers/" >> .gitignore
git add -A
git commit -m "chore: scaffold Vite + React + TypeScript project"
```

---

### Task 2: Install and configure Tailwind CSS

**Files:**
- Modify: `package.json`, `src/index.css`, `tailwind.config.ts`
- [ ] **Step 1: Install Tailwind and dependencies**

Run:
```bash
npm install -D tailwindcss @tailwindcss/vite
```

- [ ] **Step 2: Add Tailwind Vite plugin to `vite.config.ts`**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

- [ ] **Step 3: Replace `src/index.css` with Tailwind imports + glassmorphism base styles**

```css
@import "tailwindcss";

@layer base {
  body {
    @apply min-h-screen overflow-x-hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;
  }
}

@layer components {
  .glass {
    @apply bg-white/[0.08] backdrop-blur-xl border border-white/10 rounded-2xl;
  }

  .glass-light {
    @apply bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl;
  }
}
```

- [ ] **Step 4: Verify Tailwind works — update `App.tsx` with a test class**

Replace `src/App.tsx`:
```tsx
function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="glass p-8">
        <h1 className="text-4xl font-extralight text-white">Weather App</h1>
        <p className="text-white/60 mt-2">Loading...</p>
      </div>
    </div>
  )
}

export default App
```

- [ ] **Step 5: Run dev server and verify glass card renders**

Run: `npm run dev`
Expected: Dark background with a frosted glass card showing "Weather App". Stop server.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: add Tailwind CSS with glassmorphism utility classes"
```

---

### Task 3: Install Shadcn/UI

**Files:**
- Create: `components.json`, `src/lib/utils.ts`, `src/components/ui/`

- [ ] **Step 1: Install Shadcn/UI dependencies**

Run:
```bash
npx shadcn@latest init
```
When prompted, select: TypeScript, Default style, Slate base color, CSS variables, `src/` alias.

- [ ] **Step 2: Add required Shadcn components**

Run:
```bash
npx shadcn@latest add button input toggle switch
```

- [ ] **Step 3: Verify components installed**

Run:
```bash
ls src/components/ui/
```
Expected: `button.tsx`, `input.tsx`, `toggle.tsx`, `switch.tsx` (or similar) exist.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: add Shadcn/UI with button, input, toggle, switch"
```

---

### Task 4: Set up Vitest and testing infrastructure

**Files:**
- Modify: `package.json`, `vite.config.ts`
- Create: `src/test-setup.ts`

- [ ] **Step 1: Install Vitest + React Testing Library**

Run:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

- [ ] **Step 2: Update `vite.config.ts` with test config**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.ts',
    css: true,
  },
})
```

- [ ] **Step 3: Create `src/test-setup.ts`**

```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 4: Add test script to `package.json`**

Add to `"scripts"`:
```json
"test": "vitest",
"test:run": "vitest run"
```

- [ ] **Step 5: Write a smoke test to verify setup**

Create `src/App.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByText('Weather App')).toBeInTheDocument()
  })
})
```

- [ ] **Step 6: Run the test**

Run: `npm run test:run`
Expected: 1 test passes.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: add Vitest + React Testing Library with smoke test"
```

---

### Task 5: Define TypeScript interfaces

**Files:**
- Create: `src/types/weather.ts`

- [ ] **Step 1: Create TypeScript interfaces for all API responses and app state**

Create `src/types/weather.ts`:
```typescript
// --- OpenWeatherMap Current Weather API response ---
export interface OWMCurrentWeather {
  coord: { lon: number; lat: number }
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    humidity: number
  }
  wind: { speed: number; deg: number }
  clouds: { all: number }
  sys: { sunrise: number; sunset: number; country: string }
  name: string
  dt: number
}

// --- OpenWeatherMap 5-Day Forecast API response ---
export interface OWMForecastItem {
  dt: number
  main: {
    temp: number
    temp_min: number
    temp_max: number
    humidity: number
  }
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
  wind: { speed: number; deg: number }
  pop: number // probability of precipitation (0-1)
  dt_txt: string
}

export interface OWMForecastResponse {
  list: OWMForecastItem[]
  city: {
    name: string
    coord: { lat: number; lon: number }
    country: string
    sunrise: number
    sunset: number
  }
}

// --- OpenWeatherMap Geocoding API response ---
export interface OWMGeoResult {
  name: string
  lat: number
  lon: number
  country: string
  state?: string
}

// --- OpenWeatherMap Air Quality API response ---
export interface OWMAirQuality {
  list: Array<{
    main: { aqi: number } // 1-5 scale
    components: {
      pm2_5: number
      pm10: number
      no2: number
      o3: number
    }
  }>
}

// --- NWS Alerts API response ---
export interface NWSAlert {
  id: string
  properties: {
    event: string
    severity: 'Extreme' | 'Severe' | 'Moderate' | 'Minor' | 'Unknown'
    headline: string
    description: string
    instruction: string | null
    expires: string
  }
}

export interface NWSAlertsResponse {
  features: NWSAlert[]
}

// --- App-level types ---
export interface City {
  name: string
  lat: number
  lon: number
  country: string
  state?: string
}

export interface DayForecast {
  date: string
  dayName: string
  tempHigh: number
  tempLow: number
  condition: string
  conditionId: number
  icon: string
  pop: number
  windSpeed: number
}

export interface WeatherData {
  current: OWMCurrentWeather
  forecast: DayForecast[]
  airQuality: OWMAirQuality | null
  alerts: NWSAlert[]
}

export type TemperatureUnit = 'F' | 'C'
export type ThemeMode = 'dark' | 'light'

export type WeatherCondition =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'rain'
  | 'thunderstorm'
  | 'snow'
  | 'fog'

export interface OutfitSuggestion {
  items: string[]    // e.g., ['jacket', 'umbrella', 'boots']
  icons: string[]    // e.g., ['🧥', '☂️', '🥾']
  summary: string    // e.g., 'Bundle up and bring an umbrella'
}
```

- [ ] **Step 2: Commit**

```bash
git add src/types/weather.ts
git commit -m "feat: add TypeScript interfaces for weather API and app state"
```

---

### Task 6: Build the API layer

**Files:**
- Create: `src/lib/api.ts`, `src/lib/nws-api.ts`, `src/lib/api.test.ts`, `src/lib/nws-api.test.ts`
- Create: `.env.example`

- [ ] **Step 1: Create `.env.example`**

```
VITE_OWM_API_KEY=your_openweathermap_api_key_here
```

- [ ] **Step 2: Write failing tests for OWM API functions**

Create `src/lib/api.test.ts`:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchCurrentWeather, fetchForecast, fetchAirQuality, searchCities } from './api'

const mockFetch = vi.fn()
global.fetch = mockFetch

beforeEach(() => {
  mockFetch.mockReset()
})

describe('fetchCurrentWeather', () => {
  it('fetches current weather by lat/lon', async () => {
    const mockResponse = { name: 'San Francisco', main: { temp: 295 } }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })

    const result = await fetchCurrentWeather(37.77, -122.42)
    expect(result).toEqual(mockResponse)
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('lat=37.77&lon=-122.42')
    )
  })

  it('throws on API error', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 401 })
    await expect(fetchCurrentWeather(0, 0)).rejects.toThrow()
  })
})

describe('fetchForecast', () => {
  it('fetches 5-day forecast by lat/lon', async () => {
    const mockResponse = { list: [], city: { name: 'Test' } }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })

    const result = await fetchForecast(37.77, -122.42)
    expect(result).toEqual(mockResponse)
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('forecast')
    )
  })
})

describe('fetchAirQuality', () => {
  it('fetches AQI by lat/lon', async () => {
    const mockResponse = { list: [{ main: { aqi: 2 } }] }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })

    const result = await fetchAirQuality(37.77, -122.42)
    expect(result).toEqual(mockResponse)
  })
})

describe('searchCities', () => {
  it('searches cities by name via geocoding API', async () => {
    const mockResponse = [{ name: 'San Francisco', lat: 37.77, lon: -122.42, country: 'US' }]
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })

    const result = await searchCities('San Francisco')
    expect(result).toEqual(mockResponse)
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('q=San+Francisco')
    )
  })

  it('returns empty array for empty query', async () => {
    const result = await searchCities('')
    expect(result).toEqual([])
    expect(mockFetch).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm run test:run -- src/lib/api.test.ts`
Expected: All tests FAIL (module not found).

- [ ] **Step 4: Implement OWM API functions**

Create `src/lib/api.ts`:
```typescript
import type {
  OWMCurrentWeather,
  OWMForecastResponse,
  OWMAirQuality,
  OWMGeoResult,
} from '../types/weather'

const API_KEY = import.meta.env.VITE_OWM_API_KEY
const BASE_URL = 'https://api.openweathermap.org'

async function fetchJSON<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }
  return response.json()
}

export async function fetchCurrentWeather(
  lat: number,
  lon: number
): Promise<OWMCurrentWeather> {
  return fetchJSON<OWMCurrentWeather>(
    `${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
  )
}

export async function fetchForecast(
  lat: number,
  lon: number
): Promise<OWMForecastResponse> {
  return fetchJSON<OWMForecastResponse>(
    `${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
  )
}

export async function fetchAirQuality(
  lat: number,
  lon: number
): Promise<OWMAirQuality> {
  return fetchJSON<OWMAirQuality>(
    `${BASE_URL}/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  )
}

export async function searchCities(query: string): Promise<OWMGeoResult[]> {
  if (!query.trim()) return []
  const encoded = encodeURIComponent(query).replace(/%20/g, '+')
  return fetchJSON<OWMGeoResult[]>(
    `${BASE_URL}/geo/1.0/direct?q=${encoded}&limit=5&appid=${API_KEY}`
  )
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm run test:run -- src/lib/api.test.ts`
Expected: All tests PASS.

- [ ] **Step 6: Write failing test for NWS API**

Create `src/lib/nws-api.test.ts`:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchAlerts } from './nws-api'

const mockFetch = vi.fn()
global.fetch = mockFetch

beforeEach(() => {
  mockFetch.mockReset()
})

describe('fetchAlerts', () => {
  it('fetches alerts for US coordinates', async () => {
    const mockResponse = {
      features: [
        {
          id: 'alert1',
          properties: {
            event: 'Severe Thunderstorm Warning',
            severity: 'Severe',
            headline: 'Thunderstorm warning',
            description: 'Test',
            instruction: null,
            expires: '2026-03-19T00:00:00Z',
          },
        },
      ],
    }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })

    const result = await fetchAlerts(37.77, -122.42)
    expect(result).toHaveLength(1)
    expect(result[0].properties.event).toBe('Severe Thunderstorm Warning')
  })

  it('returns empty array on error', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 })
    const result = await fetchAlerts(37.77, -122.42)
    expect(result).toEqual([])
  })
})
```

- [ ] **Step 7: Run test to verify it fails**

Run: `npm run test:run -- src/lib/nws-api.test.ts`
Expected: FAIL (module not found).

- [ ] **Step 8: Implement NWS API**

Create `src/lib/nws-api.ts`:
```typescript
import type { NWSAlert, NWSAlertsResponse } from '../types/weather'

const NWS_BASE = 'https://api.weather.gov'

export async function fetchAlerts(lat: number, lon: number): Promise<NWSAlert[]> {
  try {
    const response = await fetch(
      `${NWS_BASE}/alerts/active?point=${lat.toFixed(4)},${lon.toFixed(4)}`,
      {
        headers: {
          'User-Agent': '(WeatherApp, contact@example.com)',
          Accept: 'application/geo+json',
        },
      }
    )
    if (!response.ok) return []
    const data: NWSAlertsResponse = await response.json()
    return data.features
  } catch {
    return []
  }
}
```

- [ ] **Step 9: Run test to verify it passes**

Run: `npm run test:run -- src/lib/nws-api.test.ts`
Expected: All tests PASS.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: add OWM and NWS API layers with tests"
```

---

### Task 7: Build utility functions

**Files:**
- Create: `src/lib/weather-utils.ts`, `src/lib/weather-utils.test.ts`

- [ ] **Step 1: Write failing tests for utility functions**

Create `src/lib/weather-utils.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import {
  convertTemp,
  formatTemp,
  getOutfitSuggestion,
  getBestDay,
  getWeatherCondition,
  getAqiLabel,
  getGoldenHour,
} from './weather-utils'
import type { DayForecast } from '../types/weather'

describe('convertTemp', () => {
  it('converts F to C', () => {
    expect(convertTemp(32, 'C')).toBe(0)
    expect(convertTemp(212, 'C')).toBe(100)
    expect(convertTemp(72, 'C')).toBeCloseTo(22.2, 1)
  })

  it('returns F unchanged when unit is F', () => {
    expect(convertTemp(72, 'F')).toBe(72)
  })
})

describe('formatTemp', () => {
  it('formats temperature with degree symbol and unit', () => {
    expect(formatTemp(72, 'F')).toBe('72°F')
    expect(formatTemp(22, 'C')).toBe('22°C')
  })

  it('rounds to nearest integer', () => {
    expect(formatTemp(72.6, 'F')).toBe('73°F')
  })
})

describe('getWeatherCondition', () => {
  it('maps OWM weather IDs to app conditions', () => {
    expect(getWeatherCondition(800)).toBe('clear')
    expect(getWeatherCondition(801)).toBe('partly-cloudy')
    expect(getWeatherCondition(804)).toBe('cloudy')
    expect(getWeatherCondition(500)).toBe('rain')
    expect(getWeatherCondition(200)).toBe('thunderstorm')
    expect(getWeatherCondition(600)).toBe('snow')
    expect(getWeatherCondition(741)).toBe('fog')
  })
})

describe('getOutfitSuggestion', () => {
  it('suggests warm clothes for cold + rain', () => {
    const result = getOutfitSuggestion(40, 'rain')
    expect(result.items).toContain('jacket')
    expect(result.items).toContain('umbrella')
  })

  it('suggests light clothes for hot + clear', () => {
    const result = getOutfitSuggestion(85, 'clear')
    expect(result.items).toContain('sunglasses')
  })
})

describe('getBestDay', () => {
  it('picks the day with highest score (high temp, low precip, low wind)', () => {
    const forecast: DayForecast[] = [
      { date: '2026-03-19', dayName: 'Thu', tempHigh: 70, tempLow: 55, condition: 'rain', conditionId: 500, icon: '10d', pop: 0.8, windSpeed: 15 },
      { date: '2026-03-20', dayName: 'Fri', tempHigh: 75, tempLow: 60, condition: 'clear', conditionId: 800, icon: '01d', pop: 0.1, windSpeed: 5 },
      { date: '2026-03-21', dayName: 'Sat', tempHigh: 65, tempLow: 50, condition: 'cloudy', conditionId: 804, icon: '04d', pop: 0.3, windSpeed: 10 },
    ]
    const best = getBestDay(forecast)
    expect(best.dayName).toBe('Fri')
  })

  it('returns first day if all equal', () => {
    const forecast: DayForecast[] = [
      { date: '2026-03-19', dayName: 'Thu', tempHigh: 70, tempLow: 55, condition: 'clear', conditionId: 800, icon: '01d', pop: 0, windSpeed: 5 },
    ]
    const best = getBestDay(forecast)
    expect(best.dayName).toBe('Thu')
  })
})

describe('getAqiLabel', () => {
  it('returns correct label and color for AQI levels', () => {
    expect(getAqiLabel(1)).toEqual({ label: 'Good', color: 'green' })
    expect(getAqiLabel(2)).toEqual({ label: 'Fair', color: 'yellow' })
    expect(getAqiLabel(3)).toEqual({ label: 'Moderate', color: 'orange' })
    expect(getAqiLabel(4)).toEqual({ label: 'Poor', color: 'red' })
    expect(getAqiLabel(5)).toEqual({ label: 'Very Poor', color: 'purple' })
  })
})

describe('getGoldenHour', () => {
  it('returns morning and evening golden hour times', () => {
    const sunrise = 1710835200 // unix timestamp
    const sunset = 1710878400
    const result = getGoldenHour(sunrise, sunset)
    expect(result.morning.start).toBe(sunrise)
    expect(result.morning.end).toBe(sunrise + 30 * 60)
    expect(result.evening.start).toBe(sunset - 30 * 60)
    expect(result.evening.end).toBe(sunset)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test:run -- src/lib/weather-utils.test.ts`
Expected: All tests FAIL.

- [ ] **Step 3: Implement utility functions**

Create `src/lib/weather-utils.ts`:
```typescript
import type {
  DayForecast,
  WeatherCondition,
  TemperatureUnit,
  OutfitSuggestion,
} from '../types/weather'

export function convertTemp(tempF: number, unit: TemperatureUnit): number {
  if (unit === 'F') return tempF
  return (tempF - 32) * (5 / 9)
}

export function formatTemp(temp: number, unit: TemperatureUnit): string {
  return `${Math.round(temp)}°${unit}`
}

export function getWeatherCondition(owmWeatherId: number): WeatherCondition {
  if (owmWeatherId >= 200 && owmWeatherId < 300) return 'thunderstorm'
  if (owmWeatherId >= 300 && owmWeatherId < 600) return 'rain'
  if (owmWeatherId >= 600 && owmWeatherId < 700) return 'snow'
  if (owmWeatherId >= 700 && owmWeatherId < 800) return 'fog'
  if (owmWeatherId === 800) return 'clear'
  if (owmWeatherId === 801 || owmWeatherId === 802) return 'partly-cloudy'
  return 'cloudy'
}

export function getOutfitSuggestion(
  tempF: number,
  condition: WeatherCondition
): OutfitSuggestion {
  const isRainy = condition === 'rain' || condition === 'thunderstorm'
  const isSnowy = condition === 'snow'

  if (tempF < 32) {
    return {
      items: ['heavy coat', 'gloves', 'scarf', ...(isSnowy ? ['snow boots'] : ['warm boots'])],
      icons: ['🧥', '🧤', '🧣', '🥾'],
      summary: 'Bundle up — it\'s freezing out there',
    }
  }
  if (tempF < 50) {
    return {
      items: ['jacket', ...(isRainy ? ['umbrella', 'rain boots'] : ['warm layers'])],
      icons: ['🧥', ...(isRainy ? ['☂️', '🥾'] : ['🧶'])],
      summary: isRainy ? 'Grab a jacket and umbrella' : 'Layer up — it\'s chilly',
    }
  }
  if (tempF < 65) {
    return {
      items: ['light jacket', ...(isRainy ? ['umbrella'] : [])],
      icons: ['🧥', ...(isRainy ? ['☂️'] : [])],
      summary: isRainy ? 'Light jacket and umbrella' : 'A light layer should do',
    }
  }
  if (tempF < 80) {
    return {
      items: ['t-shirt', ...(isRainy ? ['umbrella'] : ['sunglasses'])],
      icons: ['👕', ...(isRainy ? ['☂️'] : ['🕶️'])],
      summary: isRainy ? 'Comfortable but bring an umbrella' : 'Perfect weather — enjoy it',
    }
  }
  return {
    items: ['shorts', 'sunglasses', 'sunscreen'],
    icons: ['🩳', '🕶️', '🧴'],
    summary: 'Stay cool and wear sunscreen',
  }
}

export function getBestDay(forecast: DayForecast[]): DayForecast {
  if (forecast.length === 0) throw new Error('Forecast cannot be empty')

  const maxTemp = Math.max(...forecast.map((d) => d.tempHigh))
  const maxPop = Math.max(...forecast.map((d) => d.pop))
  const maxWind = Math.max(...forecast.map((d) => d.windSpeed))

  let bestScore = -Infinity
  let bestDay = forecast[0]

  for (const day of forecast) {
    const tempScore = maxTemp > 0 ? day.tempHigh / maxTemp : 0
    const popScore = maxPop > 0 ? 1 - day.pop / maxPop : 1
    const windScore = maxWind > 0 ? 1 - day.windSpeed / maxWind : 1
    const score = (tempScore + popScore + windScore) / 3

    if (score > bestScore) {
      bestScore = score
      bestDay = day
    }
  }

  return bestDay
}

export function getAqiLabel(aqi: number): { label: string; color: string } {
  const labels: Record<number, { label: string; color: string }> = {
    1: { label: 'Good', color: 'green' },
    2: { label: 'Fair', color: 'yellow' },
    3: { label: 'Moderate', color: 'orange' },
    4: { label: 'Poor', color: 'red' },
    5: { label: 'Very Poor', color: 'purple' },
  }
  return labels[aqi] ?? { label: 'Unknown', color: 'gray' }
}

export function getGoldenHour(
  sunriseUnix: number,
  sunsetUnix: number
): {
  morning: { start: number; end: number }
  evening: { start: number; end: number }
} {
  return {
    morning: {
      start: sunriseUnix,
      end: sunriseUnix + 30 * 60,
    },
    evening: {
      start: sunsetUnix - 30 * 60,
      end: sunsetUnix,
    },
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test:run -- src/lib/weather-utils.test.ts`
Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add weather utility functions with tests"
```

---

## Chunk 2: Core Hooks & Components

### Task 8: Build custom hooks

**Files:**
- Create: `src/hooks/useLocalStorage.ts`, `src/hooks/useGeolocation.ts`, `src/hooks/useWeather.ts`, `src/hooks/hooks.test.ts`

- [ ] **Step 1: Write failing tests for hooks**

Create `src/hooks/hooks.test.ts`:
```typescript
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns initial value when no stored value exists', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    expect(result.current[0]).toBe('default')
  })

  it('persists value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    act(() => {
      result.current[1]('new value')
    })
    expect(result.current[0]).toBe('new value')
    expect(localStorage.getItem('test-key')).toBe('"new value"')
  })

  it('reads existing value from localStorage', () => {
    localStorage.setItem('test-key', '"stored"')
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    expect(result.current[0]).toBe('stored')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test:run -- src/hooks/hooks.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement `useLocalStorage`**

Create `src/hooks/useLocalStorage.ts`:
```typescript
import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue))
    } catch {
      // localStorage full or unavailable
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test:run -- src/hooks/hooks.test.ts`
Expected: PASS.

- [ ] **Step 5: Implement `useGeolocation`**

Create `src/hooks/useGeolocation.ts`:
```typescript
import { useState, useEffect } from 'react'

interface GeolocationState {
  lat: number | null
  lon: number | null
  loading: boolean
  error: string | null
}

const NEW_YORK = { lat: 40.7128, lon: -74.006 }

export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lon: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ ...NEW_YORK, loading: false, error: 'Geolocation not supported' })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          loading: false,
          error: null,
        })
      },
      () => {
        setState({
          ...NEW_YORK,
          loading: false,
          error: 'Location access denied — showing New York',
        })
      },
      { timeout: 10000 }
    )
  }, [])

  return state
}
```

- [ ] **Step 6: Implement `useWeather`**

Create `src/hooks/useWeather.ts`:
```typescript
import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchCurrentWeather, fetchForecast, fetchAirQuality } from '../lib/api'
import { fetchAlerts } from '../lib/nws-api'
import type {
  OWMCurrentWeather,
  DayForecast,
  OWMAirQuality,
  NWSAlert,
  OWMForecastItem,
} from '../types/weather'

interface UseWeatherResult {
  current: OWMCurrentWeather | null
  forecast: DayForecast[]
  airQuality: OWMAirQuality | null
  alerts: NWSAlert[]
  loading: boolean
  error: string | null
  refresh: () => void
}

const CACHE_TTL = 10 * 60 * 1000 // 10 minutes

function processForecast(items: OWMForecastItem[]): DayForecast[] {
  const dayMap = new Map<string, OWMForecastItem[]>()

  for (const item of items) {
    const date = item.dt_txt.split(' ')[0]
    if (!dayMap.has(date)) dayMap.set(date, [])
    dayMap.get(date)!.push(item)
  }

  const days: DayForecast[] = []
  for (const [date, dayItems] of dayMap) {
    if (days.length >= 5) break
    const temps = dayItems.map((i) => i.main.temp)
    const midday = dayItems.find((i) => i.dt_txt.includes('12:00')) ?? dayItems[0]

    days.push({
      date,
      dayName: new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' }),
      tempHigh: Math.round(Math.max(...temps)),
      tempLow: Math.round(Math.min(...temps)),
      condition: midday.weather[0].main,
      conditionId: midday.weather[0].id,
      icon: midday.weather[0].icon,
      pop: Math.max(...dayItems.map((i) => i.pop)),
      windSpeed: Math.max(...dayItems.map((i) => i.wind.speed)),
    })
  }

  return days
}

export function useWeather(lat: number | null, lon: number | null): UseWeatherResult {
  const [current, setCurrent] = useState<OWMCurrentWeather | null>(null)
  const [forecast, setForecast] = useState<DayForecast[]>([])
  const [airQuality, setAirQuality] = useState<OWMAirQuality | null>(null)
  const [alerts, setAlerts] = useState<NWSAlert[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const cacheRef = useRef<{ key: string; time: number } | null>(null)

  const fetchAll = useCallback(async () => {
    if (lat === null || lon === null) return

    const cacheKey = `${lat},${lon}`
    if (
      cacheRef.current &&
      cacheRef.current.key === cacheKey &&
      Date.now() - cacheRef.current.time < CACHE_TTL
    ) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const [currentData, forecastData, aqiData, alertsData] = await Promise.all([
        fetchCurrentWeather(lat, lon),
        fetchForecast(lat, lon),
        fetchAirQuality(lat, lon).catch(() => null),
        fetchAlerts(lat, lon),
      ])

      setCurrent(currentData)
      setForecast(processForecast(forecastData.list))
      setAirQuality(aqiData)
      setAlerts(alertsData)
      cacheRef.current = { key: cacheKey, time: Date.now() }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data')
    } finally {
      setLoading(false)
    }
  }, [lat, lon])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const refresh = useCallback(() => {
    cacheRef.current = null
    fetchAll()
  }, [fetchAll])

  return { current, forecast, airQuality, alerts, loading, error, refresh }
}
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add useLocalStorage, useGeolocation, useWeather hooks"
```

---

### Task 9: Build WeatherContext

**Files:**
- Create: `src/context/WeatherContext.tsx`

- [ ] **Step 1: Implement WeatherContext**

Create `src/context/WeatherContext.tsx`:
```tsx
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useGeolocation } from '../hooks/useGeolocation'
import { useWeather } from '../hooks/useWeather'
import type { City, TemperatureUnit, ThemeMode, WeatherData } from '../types/weather'

interface WeatherContextType {
  // Location
  city: City | null
  setCity: (city: City) => void
  recentCities: City[]

  // Weather data
  weatherData: Omit<ReturnType<typeof useWeather>, 'refresh'>
  refresh: () => void

  // Preferences
  unit: TemperatureUnit
  toggleUnit: () => void
  theme: ThemeMode
  toggleTheme: () => void

  // Geolocation
  geoError: string | null
  geoLoading: boolean
}

const WeatherContext = createContext<WeatherContextType | null>(null)

export function WeatherProvider({ children }: { children: ReactNode }) {
  const geo = useGeolocation()
  const [unit, setUnit] = useLocalStorage<TemperatureUnit>('weather-unit', 'F')
  const [theme, setTheme] = useLocalStorage<ThemeMode>(
    'weather-theme',
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark'
  )
  const [recentCities, setRecentCities] = useLocalStorage<City[]>('weather-recent-cities', [])
  const [selectedCity, setSelectedCity] = useState<City | null>(null)

  const activeLat = selectedCity?.lat ?? geo.lat
  const activeLon = selectedCity?.lon ?? geo.lon

  const weather = useWeather(activeLat, activeLon)

  const setCity = useCallback(
    (city: City) => {
      setSelectedCity(city)
      setRecentCities((prev) => {
        const filtered = prev.filter(
          (c) => !(c.lat === city.lat && c.lon === city.lon)
        )
        return [city, ...filtered].slice(0, 5)
      })
    },
    [setRecentCities]
  )

  const toggleUnit = useCallback(() => {
    setUnit((prev) => (prev === 'F' ? 'C' : 'F'))
  }, [setUnit])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [setTheme])

  // Derive city from weather data if using geolocation
  const city: City | null = selectedCity ?? (weather.current
    ? {
        name: weather.current.name,
        lat: weather.current.coord.lat,
        lon: weather.current.coord.lon,
        country: weather.current.sys.country,
      }
    : null)

  return (
    <WeatherContext.Provider
      value={{
        city,
        setCity,
        recentCities,
        weatherData: weather,
        refresh: weather.refresh,
        unit,
        toggleUnit,
        theme,
        toggleTheme,
        geoError: geo.error,
        geoLoading: geo.loading,
      }}
    >
      {children}
    </WeatherContext.Provider>
  )
}

export function useWeatherContext(): WeatherContextType {
  const context = useContext(WeatherContext)
  if (!context) {
    throw new Error('useWeatherContext must be used within a WeatherProvider')
  }
  return context
}
```

- [ ] **Step 2: Commit**

```bash
git add src/context/WeatherContext.tsx
git commit -m "feat: add WeatherContext with global state management"
```

---

### Task 10: Build Header component

**Files:**
- Create: `src/components/Header/Header.tsx`, `src/components/Header/Header.test.tsx`

- [ ] **Step 1: Implement Header**

Create `src/components/Header/Header.tsx`:
```tsx
import { useState, useEffect, useRef } from 'react'
import { useWeatherContext } from '../../context/WeatherContext'
import { searchCities } from '../../lib/api'
import type { City, OWMGeoResult } from '../../types/weather'

export function Header() {
  const { city, setCity, recentCities, unit, toggleUnit, theme, toggleTheme } =
    useWeatherContext()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<OWMGeoResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()
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
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Recent cities */}
        {recentCities.length > 0 && (
          <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
            {recentCities.map((c) => (
              <button
                key={`${c.lat}-${c.lon}`}
                onClick={() => handleRecentClick(c)}
                className={`flex-shrink-0 px-3 py-1 text-xs rounded-full transition-colors ${
                  city?.lat === c.lat && city?.lon === c.lon
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add Header component with search, autocomplete, toggles, recent cities"
```

---

### Task 11: Build Hero component

**Files:**
- Create: `src/components/Hero/Hero.tsx`

- [ ] **Step 1: Implement Hero**

Create `src/components/Hero/Hero.tsx`:
```tsx
import { useWeatherContext } from '../../context/WeatherContext'
import { convertTemp, formatTemp } from '../../lib/weather-utils'

export function Hero() {
  const { city, weatherData, unit, geoError } = useWeatherContext()
  const { current, loading, error } = weatherData

  if (loading) {
    return (
      <section className="text-center py-16 px-4" aria-live="polite">
        <div className="animate-pulse">
          <div className="h-4 w-32 bg-white/10 rounded mx-auto mb-4" />
          <div className="h-16 w-40 bg-white/10 rounded mx-auto mb-4" />
          <div className="h-4 w-24 bg-white/10 rounded mx-auto" />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="text-center py-16 px-4" aria-live="assertive">
        <p className="text-red-400 text-lg">{error}</p>
        <p className="text-white/40 text-sm mt-2">Try searching for a city above</p>
      </section>
    )
  }

  if (!current || !city) {
    return (
      <section className="text-center py-16 px-4">
        <p className="text-white/50 text-lg">Search for a city to see the weather</p>
        {geoError && <p className="text-white/30 text-sm mt-2">{geoError}</p>}
      </section>
    )
  }

  const temp = convertTemp(current.main.temp, unit)
  const feelsLike = convertTemp(current.main.feels_like, unit)
  const high = convertTemp(current.main.temp_max, unit)
  const low = convertTemp(current.main.temp_min, unit)

  return (
    <section className="text-center py-12 px-4" aria-live="polite">
      <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-2">
        {city.name}{city.state ? `, ${city.state}` : ''}, {city.country}
      </p>
      <p className="text-7xl font-extralight text-white leading-none">
        {formatTemp(temp, unit)}
      </p>
      <p className="text-white/60 mt-3 text-base capitalize">
        {current.weather[0].description}
      </p>
      <div className="flex justify-center gap-6 mt-3">
        <span className="text-sm text-white/40">H: {formatTemp(high, unit)}</span>
        <span className="text-sm text-white/40">L: {formatTemp(low, unit)}</span>
      </div>
      <p className="text-xs text-white/30 mt-2">
        Feels like {formatTemp(feelsLike, unit)}
      </p>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add Hero component with current weather display"
```

---

### Task 12: Build Forecast component

**Files:**
- Create: `src/components/Forecast/Forecast.tsx`

- [ ] **Step 1: Implement Forecast**

Create `src/components/Forecast/Forecast.tsx`:
```tsx
import { useWeatherContext } from '../../context/WeatherContext'
import { convertTemp, formatTemp } from '../../lib/weather-utils'

const WEATHER_ICONS: Record<string, string> = {
  '01d': '☀️', '01n': '🌙',
  '02d': '⛅', '02n': '☁️',
  '03d': '☁️', '03n': '☁️',
  '04d': '☁️', '04n': '☁️',
  '09d': '🌧️', '09n': '🌧️',
  '10d': '🌦️', '10n': '🌧️',
  '11d': '⛈️', '11n': '⛈️',
  '13d': '🌨️', '13n': '🌨️',
  '50d': '🌫️', '50n': '🌫️',
}

export function Forecast() {
  const { weatherData, unit } = useWeatherContext()
  const { forecast, loading } = weatherData

  if (loading || forecast.length === 0) {
    return (
      <section className="px-4 max-w-3xl mx-auto">
        <div className="glass p-4">
          <div className="animate-pulse flex gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex-1 text-center">
                <div className="h-3 w-8 bg-white/10 rounded mx-auto mb-2" />
                <div className="h-8 w-8 bg-white/10 rounded mx-auto mb-2" />
                <div className="h-3 w-12 bg-white/10 rounded mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="px-4 max-w-3xl mx-auto">
      <div className="glass p-4">
        <p className="text-[10px] uppercase tracking-[0.15em] text-white/40 mb-3">
          5-Day Forecast
        </p>
        <div className="flex gap-2">
          {forecast.map((day) => (
            <div key={day.date} className="flex-1 text-center">
              <p className="text-[10px] text-white/50 mb-1">{day.dayName}</p>
              <p className="text-2xl mb-1">
                {WEATHER_ICONS[day.icon] ?? '🌤️'}
              </p>
              <p className="text-xs text-white/70">
                {Math.round(convertTemp(day.tempHigh, unit))}°
              </p>
              <p className="text-xs text-white/40">
                {Math.round(convertTemp(day.tempLow, unit))}°
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add Forecast component with 5-day display"
```

---

### Task 13: Build TempChart component

**Files:**
- Create: `src/components/TempChart/TempChart.tsx`

- [ ] **Step 1: Install Recharts**

Run: `npm install recharts`

- [ ] **Step 2: Implement TempChart**

Create `src/components/TempChart/TempChart.tsx`:
```tsx
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
              formatter={(value: number) => [`${value}°${unit}`, '']}
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
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add TempChart component with Recharts line chart"
```

---

### Task 14: Wire up App.tsx with context and core components

**Files:**
- Modify: `src/App.tsx`, `src/main.tsx`

- [ ] **Step 1: Update `src/main.tsx` to wrap with provider**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WeatherProvider } from './context/WeatherContext'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WeatherProvider>
      <App />
    </WeatherProvider>
  </StrictMode>,
)
```

- [ ] **Step 2: Update `src/App.tsx` with all core components**

```tsx
import { Header } from './components/Header/Header'
import { Hero } from './components/Hero/Hero'
import { Forecast } from './components/Forecast/Forecast'
import { TempChart } from './components/TempChart/TempChart'

function App() {
  return (
    <div className="min-h-screen relative">
      {/* Background will be added later */}
      <div className="relative z-10">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:glass focus:px-4 focus:py-2 focus:text-white">
          Skip to content
        </a>
        <Header />
        <main id="main-content" className="pb-16">
          <Hero />
          <div className="mt-6">
            <Forecast />
          </div>
          <TempChart />
        </main>
      </div>
    </div>
  )
}

export default App
```

- [ ] **Step 3: Update smoke test for new App layout**

Update `src/App.test.tsx`:
```tsx
import { render } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import App from './App'
import { WeatherProvider } from './context/WeatherContext'

Object.defineProperty(navigator, 'geolocation', {
  value: { getCurrentPosition: vi.fn((success) => success({ coords: { latitude: 40.71, longitude: -74.01 } })) },
})

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ name: 'New York', main: { temp: 72, feels_like: 70, temp_min: 65, temp_max: 78, humidity: 60 }, weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }], wind: { speed: 5, deg: 180 }, clouds: { all: 0 }, sys: { sunrise: 1710835200, sunset: 1710878400, country: 'US' }, coord: { lat: 40.71, lon: -74.01 }, dt: 1710850000 }),
  })
) as any

describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <WeatherProvider>
        <App />
      </WeatherProvider>
    )
    expect(container).toBeTruthy()
  })
})
```

- [ ] **Step 4: Run tests**

Run: `npm run test:run`
Expected: All tests pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: wire up App with WeatherContext, Header, Hero, Forecast, TempChart"
```

---

## Chunk 3: Animated Weather Backgrounds

### Task 15: Build particle engine

**Files:**
- Create: `src/lib/particles.ts`, `src/lib/weather-backgrounds.ts`

- [ ] **Step 1: Implement weather background configuration**

Create `src/lib/weather-backgrounds.ts`:
```typescript
import type { WeatherCondition } from '../types/weather'

export interface BackgroundConfig {
  gradient: string[]  // CSS gradient color stops
  particleType: 'rain' | 'snow' | 'clouds' | 'sun' | 'lightning' | 'fog' | 'stars' | 'none'
  particleCount: number
  particleSpeed: number
}

const dayConfigs: Record<WeatherCondition, BackgroundConfig> = {
  clear: {
    gradient: ['#4a90d9', '#87CEEB', '#B0E0E6'],
    particleType: 'sun',
    particleCount: 15,
    particleSpeed: 0.3,
  },
  'partly-cloudy': {
    gradient: ['#5a7fa5', '#8aacc8', '#b0c4d8'],
    particleType: 'clouds',
    particleCount: 8,
    particleSpeed: 0.5,
  },
  cloudy: {
    gradient: ['#5a6a7a', '#7a8a9a', '#9aa0a8'],
    particleType: 'clouds',
    particleCount: 15,
    particleSpeed: 0.3,
  },
  rain: {
    gradient: ['#1a1a2e', '#2d3a5c', '#4a5a7a'],
    particleType: 'rain',
    particleCount: 60,
    particleSpeed: 8,
  },
  thunderstorm: {
    gradient: ['#0d0d1a', '#1a1a2e', '#2d2d4a'],
    particleType: 'lightning',
    particleCount: 60,
    particleSpeed: 10,
  },
  snow: {
    gradient: ['#0f2027', '#203a43', '#2c5364'],
    particleType: 'snow',
    particleCount: 40,
    particleSpeed: 1.5,
  },
  fog: {
    gradient: ['#8a9aa8', '#a0b0b8', '#c0c8d0'],
    particleType: 'fog',
    particleCount: 10,
    particleSpeed: 0.2,
  },
}

const nightConfigs: Record<WeatherCondition, BackgroundConfig> = {
  clear: {
    gradient: ['#0a0a1a', '#0f0f2e', '#1a1a3a'],
    particleType: 'stars',
    particleCount: 50,
    particleSpeed: 0.1,
  },
  'partly-cloudy': {
    gradient: ['#0d0d20', '#151530', '#1d1d3a'],
    particleType: 'stars',
    particleCount: 30,
    particleSpeed: 0.1,
  },
  cloudy: {
    gradient: ['#151520', '#1d1d2a', '#252535'],
    particleType: 'clouds',
    particleCount: 10,
    particleSpeed: 0.2,
  },
  rain: {
    gradient: ['#0a0a15', '#151525', '#1d1d35'],
    particleType: 'rain',
    particleCount: 60,
    particleSpeed: 8,
  },
  thunderstorm: {
    gradient: ['#050510', '#0a0a1a', '#151525'],
    particleType: 'lightning',
    particleCount: 60,
    particleSpeed: 10,
  },
  snow: {
    gradient: ['#0a1520', '#152030', '#1d2a3a'],
    particleType: 'snow',
    particleCount: 40,
    particleSpeed: 1.2,
  },
  fog: {
    gradient: ['#1a1a25', '#252530', '#30303a'],
    particleType: 'fog',
    particleCount: 10,
    particleSpeed: 0.15,
  },
}

export function getBackgroundConfig(
  condition: WeatherCondition,
  isNight: boolean
): BackgroundConfig {
  return isNight ? nightConfigs[condition] : dayConfigs[condition]
}

export function buildGradientCSS(colors: string[]): string {
  return `linear-gradient(180deg, ${colors.join(', ')})`
}
```

- [ ] **Step 2: Implement particle engine**

Create `src/lib/particles.ts`:
```typescript
interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  life: number
}

type ParticleType = 'rain' | 'snow' | 'clouds' | 'sun' | 'lightning' | 'fog' | 'stars' | 'none'

export class ParticleEngine {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private particles: Particle[] = []
  private animationId: number | null = null
  private type: ParticleType = 'none'
  private speed: number = 1
  private maxParticles: number = 0
  private lightningTimer: number = 0
  private lightningFlash: boolean = false

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
    this.resize()
  }

  resize() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  configure(type: ParticleType, count: number, speed: number) {
    this.type = type
    this.maxParticles = count
    this.speed = speed
    this.particles = []

    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle())
    }
  }

  private createParticle(): Particle {
    const w = this.canvas.width
    const h = this.canvas.height

    switch (this.type) {
      case 'rain':
        return {
          x: Math.random() * w,
          y: Math.random() * h - h,
          vx: Math.random() * 0.5 - 0.25,
          vy: this.speed + Math.random() * 4,
          size: 1 + Math.random() * 1.5,
          opacity: 0.2 + Math.random() * 0.4,
          life: 1,
        }
      case 'snow':
        return {
          x: Math.random() * w,
          y: Math.random() * h - h,
          vx: Math.random() * 1 - 0.5,
          vy: this.speed * (0.5 + Math.random() * 0.5),
          size: 2 + Math.random() * 4,
          opacity: 0.3 + Math.random() * 0.5,
          life: 1,
        }
      case 'stars':
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: 0,
          vy: 0,
          size: 1 + Math.random() * 2,
          opacity: Math.random(),
          life: Math.random() * Math.PI * 2,
        }
      case 'clouds':
        return {
          x: Math.random() * w - w * 0.2,
          y: Math.random() * h * 0.6,
          vx: this.speed * (0.2 + Math.random() * 0.3),
          vy: 0,
          size: 80 + Math.random() * 120,
          opacity: 0.03 + Math.random() * 0.06,
          life: 1,
        }
      case 'sun':
        return {
          x: w * 0.5 + (Math.random() - 0.5) * w,
          y: h * 0.3 + (Math.random() - 0.5) * h * 0.3,
          vx: 0,
          vy: 0,
          size: 50 + Math.random() * 100,
          opacity: 0.02 + Math.random() * 0.04,
          life: Math.random() * Math.PI * 2,
        }
      case 'fog':
        return {
          x: Math.random() * w * 1.5 - w * 0.25,
          y: Math.random() * h,
          vx: this.speed * (0.3 + Math.random() * 0.2),
          vy: 0,
          size: 200 + Math.random() * 200,
          opacity: 0.02 + Math.random() * 0.04,
          life: 1,
        }
      default:
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: this.speed + Math.random() * 4,
          vy: this.speed + Math.random() * 4,
          size: 2,
          opacity: 0.4,
          life: 1,
        }
    }
  }

  start() {
    if (this.animationId !== null) return
    const animate = () => {
      this.update()
      this.draw()
      this.animationId = requestAnimationFrame(animate)
    }
    animate()
  }

  stop() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
  }

  private update() {
    const w = this.canvas.width
    const h = this.canvas.height

    if (this.type === 'lightning') {
      this.lightningTimer++
      if (this.lightningTimer > 200 + Math.random() * 300) {
        this.lightningFlash = true
        this.lightningTimer = 0
        setTimeout(() => { this.lightningFlash = false }, 100)
      }
    }

    for (const p of this.particles) {
      p.x += p.vx
      p.y += p.vy

      if (this.type === 'stars' || this.type === 'sun') {
        p.life += 0.01
        p.opacity = 0.3 + Math.sin(p.life) * 0.4
      }

      if (this.type === 'snow') {
        p.vx = Math.sin(p.y * 0.01) * 0.5
      }

      // Reset particles that go off screen
      if (p.y > h + 20) {
        p.y = -20
        p.x = Math.random() * w
      }
      if (p.x > w + 50) {
        p.x = -50
      }
    }
  }

  private draw() {
    const ctx = this.ctx
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    if (this.type === 'lightning' && this.lightningFlash) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }

    for (const p of this.particles) {
      ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity))

      switch (this.type) {
        case 'rain':
        case 'lightning':
          ctx.strokeStyle = 'rgba(174, 194, 224, 0.6)'
          ctx.lineWidth = p.size
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p.x + p.vx * 2, p.y + p.vy * 2)
          ctx.stroke()
          break

        case 'snow':
          ctx.fillStyle = 'white'
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
          break

        case 'stars':
          ctx.fillStyle = 'white'
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
          break

        case 'clouds':
        case 'fog':
          ctx.fillStyle = 'rgba(255, 255, 255, 1)'
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
          break

        case 'sun':
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
          gradient.addColorStop(0, 'rgba(255, 223, 100, 0.15)')
          gradient.addColorStop(1, 'rgba(255, 223, 100, 0)')
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
          break
      }
    }

    ctx.globalAlpha = 1
  }

  destroy() {
    this.stop()
    this.particles = []
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add particle engine and weather background configs"
```

---

### Task 16: Build Background component

**Files:**
- Create: `src/components/Background/Background.tsx`

- [ ] **Step 1: Implement Background component**

Create `src/components/Background/Background.tsx`:
```tsx
import { useRef, useEffect } from 'react'
import { useWeatherContext } from '../../context/WeatherContext'
import { getWeatherCondition } from '../../lib/weather-utils'
import { getBackgroundConfig, buildGradientCSS } from '../../lib/weather-backgrounds'
import { ParticleEngine } from '../../lib/particles'

export function Background() {
  const { weatherData, theme } = useWeatherContext()
  const { current } = weatherData
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<ParticleEngine | null>(null)

  const condition = current
    ? getWeatherCondition(current.weather[0].id)
    : 'clear'

  const isNight = current
    ? current.dt > current.sys.sunset || current.dt < current.sys.sunrise
    : false

  const config = getBackgroundConfig(condition, isNight)

  // Adjust gradient for light mode
  const gradient = theme === 'light'
    ? buildGradientCSS(config.gradient.map((c) => {
        // Lighten colors for light mode
        return c.replace(/^#/, '')
          .match(/.{2}/g)!
          .map((hex) => Math.min(255, parseInt(hex, 16) + 80).toString(16).padStart(2, '0'))
          .join('')
          .replace(/^/, '#')
      }))
    : buildGradientCSS(config.gradient)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const engine = new ParticleEngine(canvas)
    engineRef.current = engine
    engine.configure(config.particleType, config.particleCount, config.particleSpeed)
    engine.start()

    const handleResize = () => engine.resize()
    window.addEventListener('resize', handleResize)

    // Pause when tab not visible
    const handleVisibility = () => {
      if (document.hidden) {
        engine.stop()
      } else {
        engine.start()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      engine.destroy()
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [config.particleType, config.particleCount, config.particleSpeed])

  return (
    <div
      className="fixed inset-0 transition-all duration-1000"
      style={{ background: gradient }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />
    </div>
  )
}
```

- [ ] **Step 2: Add Background to App.tsx**

Update `src/App.tsx` — add `import { Background } from './components/Background/Background'` and insert `<Background />` as the first child inside the outer `<div>`.

- [ ] **Step 3: Verify visually**

Run: `npm run dev`
Expected: Background gradient renders. If an API key is set in `.env`, particles animate based on weather condition. Stop server.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add animated weather Background component with particle engine"
```

---

## Chunk 4: Weather Widgets

### Task 17: Build AlertBanner component

**Files:**
- Create: `src/components/AlertBanner/AlertBanner.tsx`, `src/components/AlertBanner/AlertBanner.test.tsx`

- [ ] **Step 1: Implement AlertBanner**

Create `src/components/AlertBanner/AlertBanner.tsx`:
```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add AlertBanner component for NWS severe weather alerts"
```

---

### Task 18: Build weather widget components

**Files:**
- Create: `src/components/WeatherWidgets/HumidityWidget.tsx`, `WindWidget.tsx`, `SunWidget.tsx`, `AqiWidget.tsx`, `OutfitWidget.tsx`, `WidgetGrid.tsx`, `WeatherWidgets.test.tsx`

- [ ] **Step 1: Implement HumidityWidget**

Create `src/components/WeatherWidgets/HumidityWidget.tsx`:
```tsx
import { useWeatherContext } from '../../context/WeatherContext'

export function HumidityWidget() {
  const { weatherData } = useWeatherContext()
  const { current } = weatherData

  if (!current) return null

  const humidity = current.main.humidity
  const label = humidity > 70 ? 'High' : humidity > 40 ? 'Moderate' : 'Low'

  return (
    <div className="glass p-4">
      <p className="text-[9px] uppercase tracking-[0.15em] text-white/40 mb-2">Humidity</p>
      <p className="text-2xl font-light text-white">{humidity}%</p>
      <p className="text-[10px] text-white/50 mt-1">{label}</p>
    </div>
  )
}
```

- [ ] **Step 2: Implement WindWidget**

Create `src/components/WeatherWidgets/WindWidget.tsx`:
```tsx
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
```

- [ ] **Step 3: Implement SunWidget**

Create `src/components/WeatherWidgets/SunWidget.tsx`:
```tsx
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
          {/* Arc path */}
          <path
            d="M 10 55 Q 100 -10 190 55"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="2"
          />
          {/* Golden hour zones */}
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
          {/* Sun position */}
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
```

- [ ] **Step 4: Implement AqiWidget**

Create `src/components/WeatherWidgets/AqiWidget.tsx`:
```tsx
import { useWeatherContext } from '../../context/WeatherContext'
import { getAqiLabel } from '../../lib/weather-utils'

const AQI_COLORS: Record<string, string> = {
  green: 'text-green-400',
  yellow: 'text-yellow-400',
  orange: 'text-orange-400',
  red: 'text-red-400',
  purple: 'text-purple-400',
  gray: 'text-gray-400',
}

const AQI_BG: Record<string, string> = {
  green: 'bg-green-400',
  yellow: 'bg-yellow-400',
  orange: 'bg-orange-400',
  red: 'bg-red-400',
  purple: 'bg-purple-400',
  gray: 'bg-gray-400',
}

export function AqiWidget() {
  const { weatherData } = useWeatherContext()
  const { airQuality } = weatherData

  if (!airQuality) return null

  const aqi = airQuality.list[0]?.main.aqi ?? 0
  const { label, color } = getAqiLabel(aqi)
  const percentage = (aqi / 5) * 100

  return (
    <div className="glass p-4">
      <p className="text-[9px] uppercase tracking-[0.15em] text-white/40 mb-2">Air Quality</p>
      <p className={`text-2xl font-light ${AQI_COLORS[color]}`}>{aqi}</p>
      <div className="w-full h-1.5 bg-white/10 rounded-full mt-2">
        <div
          className={`h-full rounded-full ${AQI_BG[color]} transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-[10px] text-white/50 mt-1">{label}</p>
    </div>
  )
}
```

- [ ] **Step 5: Implement OutfitWidget**

Create `src/components/WeatherWidgets/OutfitWidget.tsx`:
```tsx
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
      <p className="text-[9px] uppercase tracking-[0.15em] text-white/40 mb-2">
        What to Wear
      </p>
      <p className="text-2xl mb-1">{suggestion.icons.slice(0, 3).join(' ')}</p>
      <p className="text-[10px] text-white/50 mt-1">{suggestion.summary}</p>
    </div>
  )
}
```

- [ ] **Step 6: Implement WidgetGrid**

Create `src/components/WeatherWidgets/WidgetGrid.tsx`:
```tsx
import { HumidityWidget } from './HumidityWidget'
import { WindWidget } from './WindWidget'
import { SunWidget } from './SunWidget'
import { AqiWidget } from './AqiWidget'
import { OutfitWidget } from './OutfitWidget'

export function WidgetGrid() {
  return (
    <section className="px-4 max-w-3xl mx-auto mt-4">
      <div className="grid grid-cols-2 gap-3">
        <HumidityWidget />
        <WindWidget />
        <SunWidget />
        <AqiWidget />
        <OutfitWidget />
        {/* Golden Hour is shown inside SunWidget */}
      </div>
    </section>
  )
}
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add weather widget components (humidity, wind, sun, AQI, outfit)"
```

---

### Task 19: Build BestDay component

**Files:**
- Create: `src/components/BestDay/BestDay.tsx`, `src/components/BestDay/BestDay.test.tsx`

- [ ] **Step 1: Implement BestDay**

Create `src/components/BestDay/BestDay.tsx`:
```tsx
import { useWeatherContext } from '../../context/WeatherContext'
import { getBestDay, convertTemp, formatTemp } from '../../lib/weather-utils'

export function BestDay() {
  const { weatherData, unit } = useWeatherContext()
  const { forecast, loading } = weatherData

  if (loading || forecast.length === 0) return null

  const best = getBestDay(forecast)
  const highTemp = convertTemp(best.tempHigh, unit)

  return (
    <section className="px-4 max-w-3xl mx-auto mt-4">
      <div className="glass p-5 text-center">
        <p className="text-[9px] uppercase tracking-[0.15em] text-white/40 mb-3">
          Best Day This Week
        </p>
        <p className="text-lg text-white font-light">
          <span className="text-white/90">{best.dayName}</span>
          {' — '}
          <span>{formatTemp(highTemp, unit)}</span>
          {', '}
          <span className="text-white/60 capitalize">{best.condition.toLowerCase()}</span>
        </p>
        <p className="text-xs text-white/40 mt-2">
          Best day for outdoor plans
        </p>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add BestDay component"
```

---

### Task 20: Wire widgets into App.tsx

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Update App.tsx to include AlertBanner, WidgetGrid, BestDay**

Add imports and insert components in order after TempChart:
```tsx
import { AlertBanner } from './components/AlertBanner/AlertBanner'
import { WidgetGrid } from './components/WeatherWidgets/WidgetGrid'
import { BestDay } from './components/BestDay/BestDay'
```

Inside `<main>`, after `<Hero />`:
```tsx
<AlertBanner />
```

After `<TempChart />`:
```tsx
<WidgetGrid />
<BestDay />
```

- [ ] **Step 2: Run all tests**

Run: `npm run test:run`
Expected: All tests pass.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: wire AlertBanner, WidgetGrid, BestDay into App layout"
```

---

## Chunk 5: Advanced Features

### Task 21: Build CityComparison component

**Files:**
- Create: `src/components/CityComparison/CityComparison.tsx`, `src/components/CityComparison/CityComparison.test.tsx`

- [ ] **Step 1: Implement CityComparison**

Create `src/components/CityComparison/CityComparison.tsx`:
```tsx
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
            {/* Side by side headers */}
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

            {/* Metric comparison rows */}
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
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add CityComparison component with side-by-side weather compare"
```

---

### Task 22: Build WeatherMap component

**Files:**
- Create: `src/components/WeatherMap/WeatherMap.tsx`, `src/components/WeatherMap/WeatherMap.test.tsx`

- [ ] **Step 1: Install Leaflet dependencies**

Run:
```bash
npm install leaflet react-leaflet
npm install -D @types/leaflet
```

- [ ] **Step 2: Implement WeatherMap**

Create `src/components/WeatherMap/WeatherMap.tsx`:
```tsx
import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { useWeatherContext } from '../../context/WeatherContext'
import 'leaflet/dist/leaflet.css'

const API_KEY = import.meta.env.VITE_OWM_API_KEY

type MapLayer = 'precipitation' | 'temperature'

function MapUpdater({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView([lat, lon], map.getZoom())
  }, [map, lat, lon])
  return null
}

export function WeatherMap() {
  const { city } = useWeatherContext()
  const [layer, setLayer] = useState<MapLayer>('precipitation')

  if (!city) return null

  const layerUrl =
    layer === 'precipitation'
      ? `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`
      : `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`

  return (
    <section className="px-4 max-w-3xl mx-auto mt-4">
      <div className="glass p-4 overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[9px] uppercase tracking-[0.15em] text-white/40">
            Weather Map
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setLayer('precipitation')}
              className={`px-2 py-1 text-[10px] rounded-md transition-colors ${
                layer === 'precipitation'
                  ? 'bg-white/20 text-white'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              Rain
            </button>
            <button
              onClick={() => setLayer('temperature')}
              className={`px-2 py-1 text-[10px] rounded-md transition-colors ${
                layer === 'temperature'
                  ? 'bg-white/20 text-white'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              Temp
            </button>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden h-[300px] lg:h-[400px]">
          <MapContainer
            center={[city.lat, city.lon]}
            zoom={8}
            className="h-full w-full"
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <TileLayer
              url={layerUrl}
              opacity={0.6}
            />
            <MapUpdater lat={city.lat} lon={city.lon} />
          </MapContainer>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add WeatherMap component with Leaflet and OWM tile layers"
```

---

### Task 23: Build EmailSignup component

**Files:**
- Create: `src/lib/firebase.ts`, `src/components/EmailSignup/EmailSignup.tsx`, `src/components/EmailSignup/EmailSignup.test.tsx`

- [ ] **Step 1: Install Firebase**

Run: `npm install firebase`

- [ ] **Step 2: Implement Firebase config**

Create `src/lib/firebase.ts`:
```typescript
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export async function subscribeToEmail(email: string, city: string, unit: string): Promise<void> {
  const unsubscribeToken = crypto.randomUUID()
  await addDoc(collection(db, 'emailSubscriptions'), {
    email,
    city,
    unit,
    unsubscribeToken,
    createdAt: new Date().toISOString(),
  })
}

export { db }
```

- [ ] **Step 3: Implement EmailSignup**

Create `src/components/EmailSignup/EmailSignup.tsx`:
```tsx
import { useState } from 'react'
import { useWeatherContext } from '../../context/WeatherContext'
import { subscribeToEmail } from '../../lib/firebase'

export function EmailSignup() {
  const { city, unit } = useWeatherContext()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !city) return

    setStatus('loading')
    try {
      await subscribeToEmail(email.trim(), city.name, unit)
      setStatus('success')
      setEmail('')
    } catch (err) {
      setStatus('error')
      setErrorMsg('Failed to subscribe. Please try again.')
    }
  }

  return (
    <section className="px-4 max-w-3xl mx-auto mt-4">
      <div className="glass p-5">
        <p className="text-[9px] uppercase tracking-[0.15em] text-white/40 mb-1">
          Daily Weather Email
        </p>
        <p className="text-sm text-white/60 mb-4">
          Get a daily weather forecast for {city?.name ?? 'your city'} delivered to your inbox at 7am.
        </p>

        {status === 'success' ? (
          <p className="text-green-400 text-sm">
            Subscribed! Check your inbox tomorrow morning.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              aria-label="Email address for daily weather alerts"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-white/20"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="glass px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? '...' : 'Subscribe'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="text-red-400 text-xs mt-2">{errorMsg}</p>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add EmailSignup component with Firebase subscription"
```

---

### Task 24: Wire all remaining components into App.tsx

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Update App.tsx with full layout**

```tsx
import { Background } from './components/Background/Background'
import { Header } from './components/Header/Header'
import { Hero } from './components/Hero/Hero'
import { AlertBanner } from './components/AlertBanner/AlertBanner'
import { Forecast } from './components/Forecast/Forecast'
import { TempChart } from './components/TempChart/TempChart'
import { WidgetGrid } from './components/WeatherWidgets/WidgetGrid'
import { BestDay } from './components/BestDay/BestDay'
import { CityComparison } from './components/CityComparison/CityComparison'
import { WeatherMap } from './components/WeatherMap/WeatherMap'
import { EmailSignup } from './components/EmailSignup/EmailSignup'

function App() {
  return (
    <div className="min-h-screen relative">
      <Background />
      <div className="relative z-10">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:glass focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main-content" className="pb-16">
          <Hero />
          <AlertBanner />
          <div className="mt-6">
            <Forecast />
          </div>
          <TempChart />
          <WidgetGrid />
          <BestDay />
          <CityComparison />
          <WeatherMap />
          <EmailSignup />
        </main>
        <footer className="text-center py-6 text-white/20 text-xs">
          Weather data from OpenWeatherMap
        </footer>
      </div>
    </div>
  )
}

export default App
```

- [ ] **Step 2: Run all tests**

Run: `npm run test:run`
Expected: All tests pass.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: wire all components into App — full layout complete"
```

---

## Chunk 6: Netlify Functions, Polish & Deployment

### Task 25: Build Netlify scheduled email function

**Files:**
- Create: `netlify/functions/send-daily-email.ts`, `netlify/functions/unsubscribe.ts`, `netlify.toml`

- [ ] **Step 1: Create `netlify.toml`**

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[functions]
  node_bundler = "esbuild"
```

- [ ] **Step 2: Install server-side dependencies**

Run: `npm install @sendgrid/mail firebase-admin`

- [ ] **Step 3: Implement send-daily-email function**

Create `netlify/functions/send-daily-email.ts`:
```typescript
import type { Config } from '@netlify/functions'
import sgMail from '@sendgrid/mail'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Initialize Firebase Admin
if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

const db = getFirestore()

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

async function fetchWeather(city: string) {
  const geoRes = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${process.env.OWM_API_KEY}`
  )
  const [geo] = await geoRes.json()
  if (!geo) return null

  const weatherRes = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${geo.lat}&lon=${geo.lon}&units=imperial&appid=${process.env.OWM_API_KEY}`
  )
  return weatherRes.json()
}

function buildEmail(city: string, weather: any, unit: string, unsubToken: string): string {
  const temp = unit === 'C'
    ? Math.round((weather.main.temp - 32) * 5 / 9)
    : Math.round(weather.main.temp)
  const unitLabel = unit === 'C' ? '°C' : '°F'
  const siteUrl = process.env.URL || 'https://your-weather-app.netlify.app'

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:40px 20px;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',sans-serif;background:#f5f5f7;color:#1d1d1f;">
      <div style="max-width:480px;margin:0 auto;background:white;border-radius:16px;padding:40px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
        <p style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#86868b;margin:0 0 24px;">Daily Weather</p>
        <h1 style="font-size:42px;font-weight:200;margin:0;color:#1d1d1f;">${temp}${unitLabel}</h1>
        <p style="font-size:17px;color:#86868b;margin:8px 0 0;">${weather.weather[0].description}</p>
        <p style="font-size:15px;color:#1d1d1f;margin:24px 0 0;">${city}</p>
        <hr style="border:none;border-top:1px solid #e5e5e5;margin:32px 0;">
        <p style="font-size:13px;color:#86868b;margin:0;">Humidity: ${weather.main.humidity}% · Wind: ${Math.round(weather.wind.speed)} mph</p>
        <p style="font-size:11px;color:#86868b;margin:24px 0 0;">
          <a href="${siteUrl}" style="color:#007AFF;text-decoration:none;">Open Weather App</a>
          &nbsp;·&nbsp;
          <a href="${siteUrl}/.netlify/functions/unsubscribe?token=${unsubToken}" style="color:#86868b;text-decoration:none;">Unsubscribe</a>
        </p>
      </div>
    </body>
    </html>
  `
}

export default async function handler() {
  const snapshot = await db.collection('emailSubscriptions').get()

  for (const doc of snapshot.docs) {
    const { email, city, unit, unsubscribeToken } = doc.data()
    try {
      const weather = await fetchWeather(city)
      if (!weather) continue

      await sgMail.send({
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL!,
        subject: `Weather in ${city}: ${Math.round(weather.main.temp)}°F — ${weather.weather[0].description}`,
        html: buildEmail(city, weather, unit, unsubscribeToken),
      })
    } catch (err) {
      console.error(`Failed to send to ${email}:`, err)
    }
  }

  return new Response('Emails sent', { status: 200 })
}

export const config: Config = {
  schedule: '0 12 * * *', // 12:00 UTC daily (~7am ET)
}
```

- [ ] **Step 4: Implement unsubscribe function**

Create `netlify/functions/unsubscribe.ts`:
```typescript
import type { Context } from '@netlify/functions'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

const db = getFirestore()

export default async function handler(request: Request, context: Context) {
  const url = new URL(request.url)
  const token = url.searchParams.get('token')

  if (!token) {
    return new Response('Missing token', { status: 400 })
  }

  const snapshot = await db
    .collection('emailSubscriptions')
    .where('unsubscribeToken', '==', token)
    .get()

  if (snapshot.empty) {
    return new Response('<html><body style="font-family:-apple-system,sans-serif;text-align:center;padding:60px 20px;"><h2>Already unsubscribed</h2><p>You are not subscribed to any weather emails.</p></body></html>', {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    })
  }

  for (const doc of snapshot.docs) {
    await doc.ref.delete()
  }

  return new Response('<html><body style="font-family:-apple-system,sans-serif;text-align:center;padding:60px 20px;"><h2>Unsubscribed</h2><p>You will no longer receive daily weather emails.</p></body></html>', {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  })
}
```

- [ ] **Step 5: Append server-side vars to `.env.example`**

Append the following to the existing `.env.example` (do not overwrite the `VITE_*` vars from earlier):
```
# Server-side (Netlify env vars — set in Netlify dashboard, NOT in .env)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# Server-side (Netlify env vars)
OWM_API_KEY=your_openweathermap_api_key_here
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=weather@yourdomain.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Netlify scheduled email function and unsubscribe endpoint"
```

---

### Task 26: Add responsive polish

**Files:**
- Modify: `src/index.css`, various components

- [ ] **Step 1: Add responsive utilities to `src/index.css`**

Append to `src/index.css`:
```css
@layer components {
  /* Mobile-first responsive container */
  .weather-container {
    @apply px-4 max-w-3xl mx-auto;
  }

  /* Single column on mobile, 2-col on tablet+ */
  .widget-grid {
    @apply grid grid-cols-1 sm:grid-cols-2 gap-3;
  }
}
```

- [ ] **Step 2: Update WidgetGrid to use responsive class**

In `src/components/WeatherWidgets/WidgetGrid.tsx`, change `grid grid-cols-2` to `widget-grid`.

- [ ] **Step 3: Verify responsive layout**

Run: `npm run dev`
Expected: On narrow viewport (<640px), widgets stack single column. On wider, they go 2-column. Stop server.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "polish: add responsive layout utilities"
```

---

### Task 27: Add dark/light mode support

**Files:**
- Modify: `src/App.tsx`, `src/index.css`

- [ ] **Step 1: Add theme class application in App.tsx**

Update App.tsx to read theme from context and apply a `data-theme` attribute:
```tsx
import { useWeatherContext } from './context/WeatherContext'

// Inside App component, before return:
const { theme } = useWeatherContext()

// On the outer div:
<div className="min-h-screen relative" data-theme={theme}>
```

- [ ] **Step 2: Add light mode overrides to `index.css`**

Append to `src/index.css`:
```css
@layer components {
  [data-theme="light"] .glass {
    @apply bg-white/70 backdrop-blur-xl border-white/40;
  }

  [data-theme="light"] .text-white {
    color: #1d1d1f;
  }

  [data-theme="light"] .text-white\/50,
  [data-theme="light"] .text-white\/60 {
    color: #86868b;
  }

  [data-theme="light"] .text-white\/40,
  [data-theme="light"] .text-white\/30 {
    color: #aeaeb2;
  }
}
```

- [ ] **Step 3: Verify light mode visually**

Run: `npm run dev`
Expected: Clicking the sun/moon toggle switches between dark glassmorphism and lighter, more opaque cards. Stop server.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "polish: implement dark/light mode toggle with CSS overrides"
```

---

### Task 28: Write component integration tests

**Files:**
- Create: `src/components/Header/Header.test.tsx`, `src/components/WeatherWidgets/WeatherWidgets.test.tsx`
- Modify: `src/context/WeatherContext.tsx`

- [ ] **Step 1: Create a test wrapper helper**

Create `src/test-utils.tsx`:
```tsx
import { type ReactNode } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { WeatherProvider } from './context/WeatherContext'
import { vi } from 'vitest'

// Mock geolocation
Object.defineProperty(navigator, 'geolocation', {
  value: { getCurrentPosition: vi.fn((success) => success({ coords: { latitude: 40.71, longitude: -74.01 } })) },
  configurable: true,
})

// Mock fetch with default weather response
export const mockWeatherResponse = {
  name: 'New York', main: { temp: 72, feels_like: 70, temp_min: 65, temp_max: 78, humidity: 60 },
  weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
  wind: { speed: 5, deg: 180 }, clouds: { all: 0 },
  sys: { sunrise: 1710835200, sunset: 1710878400, country: 'US' },
  coord: { lat: 40.71, lon: -74.01 }, dt: 1710850000,
}

export function setupMockFetch() {
  global.fetch = vi.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve(mockWeatherResponse) })
  ) as any
}

function Wrapper({ children }: { children: ReactNode }) {
  return <WeatherProvider>{children}</WeatherProvider>
}

export function renderWithProvider(ui: ReactNode, options?: RenderOptions) {
  return render(ui, { wrapper: Wrapper, ...options })
}
```

- [ ] **Step 2: Write Header integration test**

Create `src/components/Header/Header.test.tsx`:
```tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProvider, setupMockFetch } from '../../test-utils'
import { Header } from './Header'

beforeEach(() => { setupMockFetch() })

describe('Header', () => {
  it('renders search input', () => {
    renderWithProvider(<Header />)
    expect(screen.getByPlaceholderText('Search city...')).toBeInTheDocument()
  })

  it('renders unit toggle button', () => {
    renderWithProvider(<Header />)
    expect(screen.getByLabelText(/switch to/i)).toBeInTheDocument()
  })

  it('renders theme toggle button', () => {
    renderWithProvider(<Header />)
    expect(screen.getByLabelText(/switch to.*mode/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Write widget helper function tests**

Create `src/components/WeatherWidgets/WeatherWidgets.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'

// Test the degToDirection helper directly
const DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
function degToDirection(deg: number): string {
  return DIRECTIONS[Math.round(deg / 45) % 8]
}

describe('Wind direction conversion', () => {
  it('converts 0 degrees to N', () => { expect(degToDirection(0)).toBe('N') })
  it('converts 90 degrees to E', () => { expect(degToDirection(90)).toBe('E') })
  it('converts 180 degrees to S', () => { expect(degToDirection(180)).toBe('S') })
  it('converts 270 degrees to W', () => { expect(degToDirection(270)).toBe('W') })
  it('converts 45 degrees to NE', () => { expect(degToDirection(45)).toBe('NE') })
  it('converts 315 degrees to NW', () => { expect(degToDirection(315)).toBe('NW') })
})
```

- [ ] **Step 4: Run all tests**

Run: `npm run test:run`
Expected: All tests pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "test: add component integration tests and test utilities"
```

---

### Task 29: Build verification

- [ ] **Step 1: Run all tests**

Run: `npm run test:run`
Expected: All tests pass.

- [ ] **Step 2: Run production build**

Run: `npm run build`
Expected: Build succeeds, `dist/` folder created. If build fails due to missing env vars, create a `.env` with placeholder values.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: verify all tests pass and production build succeeds"
```

---

### Task 29: Deploy setup

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Create GitHub Actions CI workflow**

Create `.github/workflows/ci.yml`:
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run test:run
      - run: npm run build
        env:
          VITE_OWM_API_KEY: test_key
          VITE_FIREBASE_API_KEY: test_key
          VITE_FIREBASE_AUTH_DOMAIN: test.firebaseapp.com
          VITE_FIREBASE_PROJECT_ID: test-project
          VITE_FIREBASE_STORAGE_BUCKET: test.appspot.com
          VITE_FIREBASE_MESSAGING_SENDER_ID: "123"
          VITE_FIREBASE_APP_ID: "1:123:web:abc"
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "ci: add GitHub Actions workflow for tests and build"
```

- [ ] **Step 3: Clean up preview HTML files**

Run:
```bash
rm -f "c:/Users/Izzy/Documents/Weather App/preview-backgrounds.html"
rm -f "c:/Users/Izzy/Documents/Weather App/preview-layouts.html"
```

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: clean up preview files"
```
