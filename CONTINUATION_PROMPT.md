# Weather App — Continuation Prompt

> **Copy everything below the line into a new Claude Code conversation to pick up exactly where you left off.**

---

## Context

I'm building a weather web app. The full implementation is complete (33 commits on `main`), all tests pass (35 tests, 7 files), TypeScript build is clean, and it's pushed to GitHub at https://github.com/isoto002/weather-app. I need to continue working on it.

### What's been built

A single-page React + TypeScript weather app with:

- **Stack:** React 19, TypeScript 5.9, Vite 8, Tailwind CSS v4, Recharts, Leaflet + react-leaflet, Firebase Firestore (Spark/free), Vitest + React Testing Library
- **Hosting plan:** Netlify (with Scheduled Functions for daily emails, SendGrid for delivery)
- **APIs:** OpenWeatherMap (free tier) for weather/forecast/geocoding/AQI/map tiles; NWS API (free, US-only) for severe weather alerts

### Features implemented

1. Auto-detect geolocation (falls back to New York)
2. City search with 300ms debounced autocomplete (OWM geocoding)
3. Recent cities (last 5, LocalStorage)
4. Current weather display (Hero component) with loading skeleton + retry button on error
5. 5-day forecast (horizontal cards with emoji icons)
6. °C/°F toggle with LocalStorage persistence
7. Temperature trend line chart (Recharts — high solid blue, low dashed white)
8. Animated weather backgrounds — canvas particle engine (rain, snow, clouds, sun, lightning, fog, stars) with day/night gradient variants for all 7 weather conditions
9. Dark/light mode (LocalStorage + prefers-color-scheme default)
10. 5 weather widgets in responsive grid: Humidity, Wind (with compass direction), Sunrise/Sunset (SVG sun arc + golden hour), AQI (color-coded gauge), Outfit suggestion
11. NWS severe weather alerts (dismissable banner, color-coded by severity)
12. "Best day this week" scoring (equally-weighted: max temp, lowest precip, lowest wind)
13. City comparison (side-by-side with green "winner" highlighting, resets when primary city changes)
14. Weather map (Leaflet with OWM precipitation + temperature tile layers, aria-pressed toggles)
15. Daily email signup (Firebase Firestore + Netlify Scheduled Function + SendGrid) with client-side email validation
16. Glassmorphism UI (frosted glass cards, backdrop-blur)
17. Responsive layout (single column mobile, 2-col widgets)
18. Accessibility: skip-to-content link, aria-labels on icon buttons, aria-live on Hero/Forecast/WidgetGrid/CityComparison, aria-hidden on canvas, aria-pressed on map toggles
19. GitHub Actions CI (test + build)

### Key architecture decisions

- **State:** React Context (WeatherContext) — holds city, weatherData, unit, theme, recentCities
- **Caching:** 10-min TTL in-memory cache via useRef in useWeather hook
- **API layer:** `src/lib/api.ts` (OWM) and `src/lib/nws-api.ts` (NWS) — shared `fetchJSON<T>` helper, `units=imperial` (client-side conversion for °C)
- **Particle engine:** `src/lib/particles.ts` — requestAnimationFrame loop, pauses on tab hidden (Page Visibility API)
- **Firebase:** Lazy initialization — only inits when `subscribeToEmail()` is called, won't crash if env vars are missing
- **Netlify functions:** `send-daily-email.ts` (scheduled, groups subscribers by city, parallel weather fetches + email sends) and `unsubscribe.ts` (token-based)
- **Light mode:** CSS custom properties (`--weather-text`, `--weather-text-muted`, `--weather-text-faint`) with compatibility overrides for Tailwind `text-white/*` utilities

### File structure

```
src/
├── types/weather.ts          — All TypeScript interfaces
├── lib/
│   ├── api.ts                — OWM API (fetchCurrentWeather, fetchForecast, fetchAirQuality, searchCities)
│   ├── api.test.ts           — 7 tests
│   ├── nws-api.ts            — NWS alerts API
│   ├── nws-api.test.ts       — 3 tests
│   ├── weather-utils.ts      — convertTemp, formatTemp, getWeatherCondition, getOutfitSuggestion, getBestDay, getAqiLabel, getGoldenHour
│   ├── weather-utils.test.ts — 12 tests
│   ├── weather-backgrounds.ts — Day/night gradient configs + particle type per condition
│   ├── particles.ts          — ParticleEngine class (canvas)
│   └── firebase.ts           — Lazy Firebase init + subscribeToEmail()
├── hooks/
│   ├── useLocalStorage.ts    — Generic localStorage hook
│   ├── useGeolocation.ts     — Browser geolocation with NYC fallback
│   ├── useWeather.ts         — Orchestrates all API calls, 10-min cache, processForecast()
│   └── hooks.test.ts         — 3 tests
├── context/WeatherContext.tsx — Global state provider
├── components/
│   ├── Header/               — Search bar, autocomplete, toggles, recent cities
│   ├── Hero/                 — Current weather display with retry button
│   ├── Forecast/             — 5-day forecast row
│   ├── TempChart/            — Recharts line chart
│   ├── Background/           — Animated gradient + canvas particles
│   ├── AlertBanner/          — NWS severe weather alerts
│   ├── WeatherWidgets/       — Humidity, Wind (exported degToDirection), Sun, AQI, Outfit widgets + WidgetGrid
│   ├── BestDay/              — Best outdoor day scoring
│   ├── CityComparison/       — Side-by-side city compare (resets on city change)
│   ├── WeatherMap/           — Leaflet map with OWM tiles (aria-pressed toggles)
│   └── EmailSignup/          — Firebase email subscription form (with email validation)
├── App.tsx                   — Full layout composition
├── App.test.tsx              — Smoke test (1 test)
├── main.tsx                  — Entry point
├── index.css                 — Tailwind imports, glassmorphism classes, CSS custom properties for theming
├── test-setup.ts             — jest-dom import
└── test-utils.tsx            — Test wrapper with WeatherProvider + mocks
netlify/
├── functions/send-daily-email.ts — Scheduled daily email (groups by city, parallel sends)
└── functions/unsubscribe.ts     — Token-based unsubscribe
```

### Remaining known issues (nice-to-have)

| # | Issue | File |
|---|-------|------|
| 1 | No reusable SkeletonCard — skeleton markup duplicated across Hero, Forecast, TempChart, CityComparison | Multiple |
| 2 | Golden Hour is merged into SunWidget instead of being its own widget (spec says standalone) | `src/components/WeatherWidgets/` |
| 3 | `getBestDay` scoring biases toward high temps when temp varies widely | `src/lib/weather-utils.ts` |

### Docs

- **Design spec:** `docs/superpowers/specs/2026-03-18-weather-app-design.md`
- **Implementation plan:** `docs/superpowers/plans/2026-03-18-weather-app.md`
- **Env vars:** `.env.example` lists all required vars (client-side VITE_* and server-side for Netlify)

### Current state

- 33 git commits on `main` branch
- Remote: https://github.com/isoto002/weather-app
- 35 tests passing (vitest run)
- TypeScript build clean (tsc -b --noEmit)
- No `.env` file yet (needs real API keys to test locally)

### What I want to do next

[REPLACE THIS with what you want to do — examples:]
- Set up my .env and test locally
- Deploy to Netlify
- Add a new feature
- Fix the remaining nice-to-have issues
- Something else
