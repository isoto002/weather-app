# Weather App — Design Specification

## Overview

A publicly-facing weather web app with an Apple-inspired glassmorphism visual style, fully animated weather backgrounds, and a rich feature set including forecasts, weather maps, city comparison, outfit suggestions, and daily email alerts.

**Architecture:** Single-page React application (scroll to explore)
**Visual Style:** Hybrid Apple + Glass — clean SF Pro-inspired typography, glassmorphism cards (frosted glass, blur, subtle borders) on animated gradient backgrounds
**Target:** Desktop + mobile responsive

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | React 18 + TypeScript | UI framework with type safety |
| Styling | Tailwind CSS + Shadcn/UI | Utility-first CSS + accessible component primitives |
| Build | Vite | Fast dev server and build tool |
| Charts | Recharts | Temperature trend line chart |
| Maps | Leaflet + react-leaflet | Embedded weather map |
| Weather API | OpenWeatherMap (free tier) | Current weather, 5-day forecast, geocoding, AQI |
| Backend | Firebase Firestore + Netlify Scheduled Functions | Email subscriptions (Firestore) + daily cron email sender (Netlify) |
| Email | SendGrid (free tier) | Apple-styled daily weather emails |
| Hosting | Netlify | Static site hosting with auto-deploy from GitHub |
| VCS | GitHub | Version control |

---

## Page Layout

The app is one scrollable page. All sections stack vertically. Every card uses glassmorphism styling on top of a full-page animated weather background.

```
┌─────────────────────────────────────────┐
│  Header Bar                             │
│  [Search input] [°C/°F toggle] [☀/🌙]  │
│  [Recent cities chips]                  │
├─────────────────────────────────────────┤
│  Hero Section                           │
│  City name · Current temp · Condition   │
│  High/Low · "Feels like"               │
├─────────────────────────────────────────┤
│  Severe Weather Alert Banner (if any)   │
├─────────────────────────────────────────┤
│  5-Day Forecast Row                     │
│  [Mon] [Tue] [Wed] [Thu] [Fri]          │
│  icon · high/low per day                │
├─────────────────────────────────────────┤
│  Temperature Trend Chart                │
│  Line chart: highs + lows over 5 days   │
├─────────────────────────────────────────┤
│  Widget Grid (2 columns)                │
│  Humidity | Wind                        │
│  Sunrise/Sunset | AQI                   │
│  Golden Hour | Outfit Suggestion        │
├─────────────────────────────────────────┤
│  "Best Day This Week" Card (full width) │
├─────────────────────────────────────────┤
│  City Comparison (full width)           │
├─────────────────────────────────────────┤
│  Weather Map (full width)               │
├─────────────────────────────────────────┤
│  Email Signup (full width)              │
├─────────────────────────────────────────┤
│  Footer                                 │
└─────────────────────────────────────────┘
```

---

## Animated Weather Backgrounds

The entire page background changes based on current weather conditions. Implemented with a CSS gradient wrapper + `<canvas>` particle engine.

| Condition | Gradient | Particles |
|-----------|----------|-----------|
| Clear/Sunny | Warm sky blue → light cyan | Floating sun rays, gentle warm glow |
| Partly Cloudy | Blue → soft gray blend | Slow-drifting translucent clouds |
| Cloudy/Overcast | Muted gray → slate | Dense slow clouds, no sun |
| Rain | Dark navy → steel blue | Falling rain streaks, ripple effects |
| Thunderstorm | Very dark navy → charcoal | Rain + periodic lightning flashes |
| Snow | Dark teal → cool blue-gray | Floating snowflakes, gentle drift |
| Fog/Mist | Pale gray → white-gray | Slowly moving fog layers |
| Night (any) | Deep dark → near black | Stars twinkling, moon glow |

**Implementation details:**
- Custom particle engine (~200 lines), no heavy library
- `requestAnimationFrame` loop, particle count capped at ~50-80
- Paused when browser tab not visible (Page Visibility API)
- Smooth crossfade transitions when city/condition changes
- Night detection via sunrise/sunset times from API — shifts all palettes darker

---

## Data Flow

```
┌──────────────┐     ┌─────────────────────┐     ┌──────────────┐
│   Browser     │────▶│  OpenWeatherMap API  │────▶│  React State │
│  Geolocation  │     │                     │     │  (Context)   │
└──────────────┘     │  • Current Weather   │     └──────┬───────┘
                     │  • 5-Day Forecast    │            │
┌──────────────┐     │  • Geocoding         │            ▼
│  Search Bar   │────▶│  • Air Quality       │     ┌──────────────┐
│  (city name)  │     └─────────────────────┘     │  All UI       │
└──────────────┘                                  │  Components   │
                     ┌─────────────────────┐      └──────────────┘
                     │  Leaflet + OWM Tiles │
                     │  (Weather Map Layer) │
                     └─────────────────────┘
```

**State management:** React Context (WeatherContext) — holds selected city, weather data, forecast, AQI, unit preference, and theme. Simple enough that Redux/Zustand would be overkill.

**API calls:** Client-side. API key stored in `.env` and embedded in the build. Note: OWM does not support HTTP referrer restrictions, so the key is visible in network requests. This is acceptable for a portfolio project — the free tier has built-in rate limits. For production, a serverless proxy would be recommended.

**Local Storage persistence:**
- Last 5 searched cities
- °C/°F preference
- Dark/light mode preference

**Firebase (backend, email feature only):**
- Firestore: email subscription documents `{ email, city, unit, createdAt, unsubscribeToken }`
- Daily email cron via Netlify Scheduled Function (avoids Firebase Blaze plan requirement): fetch weather → render Apple-styled HTML email → send via SendGrid
- Unsubscribe: each email includes a link with a unique token → hits a Netlify Function that deletes the Firestore subscription document

---

## Feature Specifications

### Core Features (from exercise spec)

#### Search & Geolocation
- Search bar in header with debounced (300ms) autocomplete via OWM Geocoding API
- On first load, `navigator.geolocation` prompts for location
- If geolocation denied, defaults to New York with a gentle prompt to search manually
- Last 5 searched cities stored in LocalStorage, shown as clickable chips below search bar

#### Current Weather Display
- City name, current temperature, weather condition text
- High/low for today, "feels like" temperature
- Weather condition icon

#### 5-Day Forecast
- Horizontal row of 5 day cards
- Each card: day name, weather icon, high/low temperatures
- Glassmorphism card styling

#### °C/°F Toggle
- Single toggle button in header
- Applies globally to every temperature displayed
- Saved in LocalStorage
- Client-side conversion, no re-fetch needed

#### Temperature Trend Chart
- Recharts line chart
- Two lines: daily highs (solid) and daily lows (dashed)
- 5 data points (one per forecast day)
- Glassmorphism card container
- Tooltips on hover

#### Recent Cities
- Last 5 unique cities stored in LocalStorage
- Displayed as horizontal chips below search bar
- Click to instantly load that city's weather
- New search pushes to front, oldest drops off

### Polish Features (from exercise spec)

#### Responsive Layout
- Mobile (<640px): single column, stacked widgets, compact hero
- Tablet (640-1024px): 2-column widget grid
- Desktop (>1024px): wider layout, weather map gets more height, comparison side-by-side

#### Loading & Error States
- Skeleton loaders on glass cards while fetching
- "City not found" error with suggestion to try again
- Network failure state with retry button
- Empty search input validation

#### Dynamic Backgrounds
- Full animated weather backgrounds as described in the Animated Weather Backgrounds section above

#### Dark Mode
- Toggle in header (sun/moon icon)
- Dark mode = default (dark gradients + glassmorphism)
- Light mode = lighter gradients, glass cards get more opaque white backgrounds
- Saved in LocalStorage
- Respects `prefers-color-scheme` on first visit

#### Accessibility
- All interactive elements keyboard-navigable
- `aria-label` on icon-only buttons (dark mode toggle, °C/°F)
- `aria-live="polite"` on weather data regions
- Color contrast meets WCAG AA on all text against glass backgrounds
- Skip-to-content link

### Stretch Features

#### Weather Map
- Leaflet.js embedded map, centered on selected city
- OpenWeatherMap tile layers with toggle between precipitation and temperature overlays
- Zoom/pan enabled
- Glass-styled map controls
- Full-width card

#### Daily Alert Email
- Simple signup form at page bottom: email input + city selector + subscribe button
- Firestore document: `{ email, city, unit, createdAt, unsubscribeToken }`
- Netlify Scheduled Function triggered daily (cron schedule)
- Fetches current + forecast from OWM for each subscriber's city
- Renders Apple-styled minimal HTML email (clean typography, weather icons, white background, subtle layout)
- Sends via SendGrid (free tier: 100 emails/day)
- Every email includes an unsubscribe link (unique token → Netlify Function deletes Firestore doc)

#### Outfit Suggestion
- Lookup table mapping temperature range + condition → clothing icons + short text
- Thresholds defined in Fahrenheit internally, converted when displaying in °C
- Examples: <50°F + rain → jacket + umbrella + boots; >80°F + sunny → shorts + sunglasses + sunscreen
- No AI — fast, predictable, deterministic
- Glassmorphism widget card

#### Severe Weather Alerts
- Uses the free NWS (National Weather Service) API for US locations — provides active alerts by lat/lon at no cost
- For non-US locations, alerts section is hidden (NWS is US-only; OWM alerts require paid One Call API)
- If alerts present, a red/orange banner slides in below the hero section
- Dismissable but re-appears on new alerts
- Shows alert type, severity, description

#### Sunrise/Sunset + Golden Hour
- Visual sun arc showing position through the day
- Sunrise and sunset times displayed
- Golden hour highlighted in warm gold (~30 min after sunrise, ~30 min before sunset) — this is a simplified approximation; actual golden hour varies by latitude/season
- Glassmorphism widget card

#### Air Quality Index (AQI)
- OWM Air Pollution API (free)
- Color-coded gauge: green → yellow → orange → red → purple
- Numeric AQI value + one-line health recommendation
- Glassmorphism widget card

#### City Comparison
- "Add a city" button opens a second search input
- Two weather cards shown side-by-side with matching data rows
- Visual highlights showing which city "wins" each metric (warmer, less humid, less wind)
- "X" button to remove the comparison city and return to single-city view
- Limited to 2 cities (primary + comparison) for simplicity
- Full-width section

#### Best Day This Week
- Algorithm scans 5-day forecast
- Scores each day using equally-weighted factors: highest max temp, lowest precipitation volume (from OWM `pop` field), lowest wind speed
- Full-width card: "Best day for outdoor plans: Thursday — 75°, sunny, light breeze"
- Glassmorphism styling

#### Animated Weather Backgrounds
- Full particle animation system as described in the Animated Weather Backgrounds section
- Rain drops, snow flakes, lightning, clouds, sun rays, stars, fog

---

## Project Structure

```
weather-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header/            # Search, toggles, recent cities
│   │   ├── Hero/              # Current weather display
│   │   ├── AlertBanner/       # Severe weather alerts
│   │   ├── Forecast/          # 5-day forecast row
│   │   ├── TempChart/         # Temperature trend line chart
│   │   ├── WeatherWidgets/    # Humidity, Wind, Sunrise, AQI, Golden Hour, Outfit
│   │   ├── BestDay/           # Best day this week card
│   │   ├── CityComparison/    # Side-by-side city compare
│   │   ├── WeatherMap/        # Leaflet embedded map
│   │   ├── EmailSignup/       # Daily email subscription form
│   │   ├── Background/        # Canvas particle engine + gradient wrapper
│   │   └── ui/                # Shadcn/UI components
│   ├── context/
│   │   └── WeatherContext.tsx  # Global state
│   ├── hooks/
│   │   ├── useWeather.ts      # Fetch current + forecast + AQI
│   │   ├── useGeolocation.ts  # Browser geolocation
│   │   └── useLocalStorage.ts # Persist preferences + recent cities
│   ├── lib/
│   │   ├── api.ts             # OWM API calls
│   │   ├── particles.ts       # Canvas particle engine
│   │   ├── weather-utils.ts   # Temp conversion, outfit logic, best-day calc
│   │   └── firebase.ts        # Firebase config + Firestore helpers
│   ├── types/
│   │   └── weather.ts         # TypeScript interfaces
│   ├── App.tsx                # Main layout
│   ├── main.tsx               # Entry point
│   └── index.css              # Tailwind imports + global styles
├── netlify/
│   └── functions/
│       ├── send-daily-email.ts  # Scheduled function: cron → fetch → email
│       └── unsubscribe.ts       # Unsubscribe endpoint: token → delete Firestore doc
├── .env                       # API keys (gitignored)
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── firebase.json
└── netlify.toml
```

---

## Responsive Breakpoints

| Breakpoint | Layout Changes |
|-----------|----------------|
| Mobile (<640px) | Single column, stacked widgets, compact hero, toggles (°C/°F + dark mode) move into a collapsible header row |
| Tablet (640-1024px) | 2-column widget grid, side-by-side forecast |
| Desktop (>1024px) | Wider layout, taller weather map, full comparison side-by-side |

---

## External Services

| Service | Purpose | Tier |
|---------|---------|------|
| OpenWeatherMap | Weather data, geocoding, AQI, map tiles | Free (1,000 calls/day) |
| NWS API | Severe weather alerts (US only) | Free (no key required) |
| Firebase Firestore | Email subscription storage | Free (Spark plan) |
| Netlify Scheduled Functions | Daily email cron job | Free tier (included with Netlify) |
| SendGrid | Email delivery | Free (100 emails/day) |
| Netlify | Static hosting + auto-deploy + serverless functions | Free tier |
| GitHub | Version control | Free |

---

## API Caching & Rate Limiting

- Weather data cached in React state — no re-fetch until city changes or user manually refreshes
- Search autocomplete debounced at 300ms to limit geocoding calls
- OWM responses cached in memory with 10-minute TTL (weather doesn't change faster than that)
- If OWM rate limit is hit (unlikely for single-user sessions), show a friendly "try again in a moment" message
- Typical session uses ~5-10 API calls (geocode + current + forecast + AQI per city searched)

---

## Testing Strategy

| Layer | Tool | Scope |
|-------|------|-------|
| Unit tests | Vitest + React Testing Library | Utility functions (temp conversion, outfit logic, best-day scoring), component rendering |
| Integration tests | Vitest | API hook behavior with mocked fetch, context state updates |
| Smoke tests | Vitest | App loads, search renders, hero displays data with mock API |

- Test files co-located with components (e.g., `Header/Header.test.tsx`)
- API responses mocked in tests — no live API calls
- CI: tests run on every push via GitHub Actions
