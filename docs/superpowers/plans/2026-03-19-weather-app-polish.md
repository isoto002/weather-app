# Weather App Polish Package — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate the weather app to portfolio-grade with micro-animations, ambient sound, hourly forecast ribbon, enhanced particle effects, and UX polish.

**Architecture:** CSS-first animations wherever possible (scroll reveal, hover, pulse, shimmer, emoji animations, aurora, lens flare). New hooks for IntersectionObserver, audio, elapsed time, and pull-to-refresh. CountUp is a small React component. Hourly forecast is a new section between Hero and 5-day Forecast. Sound files are lazy-loaded MP3s in `public/sounds/`.

**Tech Stack:** React 19, TypeScript 5.9, Tailwind CSS v4, Web Audio (HTMLAudioElement), IntersectionObserver API, Touch Events API

---

## File Structure

### New Files
| File | Responsibility |
|------|---------------|
| `src/hooks/useScrollReveal.ts` | IntersectionObserver hook, returns ref, adds CSS class on intersection |
| `src/components/CountUp/CountUp.tsx` | Animated number component (0 → target over 600ms) |
| `src/components/HourlyForecast/HourlyForecast.tsx` | Horizontal scrollable 24-hour forecast ribbon |
| `src/hooks/useAmbientSound.ts` | Audio playback, crossfade, lazy-loading |
| `src/hooks/useElapsedTime.ts` | "Updated X min ago" timer hook |
| `src/hooks/usePullToRefresh.ts` | Mobile swipe-down-to-refresh |
| `public/sounds/*.mp3` | 7 ambient audio files (CC0) |

### Modified Files
| File | Changes |
|------|---------|
| `src/index.css` | Shimmer keyframes, glass hover, scroll-reveal classes, emoji animation keyframes, aurora keyframes, lens flare keyframes, page-fade class |
| `src/lib/particles.ts` | Rain splash effect, particle opacity fade transitions |
| `src/components/Background/Background.tsx` | Aurora overlay, lens flare overlay, transition duration bump |
| `src/components/Hero/Hero.tsx` | Greeting, temperature pulse, CountUp usage, last-updated timestamp, scroll reveal |
| `src/components/Header/Header.tsx` | Sound toggle button |
| `src/context/WeatherContext.tsx` | `soundMuted`, `toggleSound`, `hourlyForecast`, `lastFetchedAt` |
| `src/hooks/useWeather.ts` | Extract hourly forecast items, expose `lastFetchedAt` timestamp |
| `src/App.tsx` | Page fade-in, pull-to-refresh, HourlyForecast import, scroll reveal on sections |
| `src/components/Forecast/Forecast.tsx` | Scroll reveal, CountUp on temps |
| `src/components/TempChart/TempChart.tsx` | Scroll reveal |
| `src/components/WeatherWidgets/WidgetGrid.tsx` | Scroll reveal |
| `src/components/WeatherWidgets/HumidityWidget.tsx` | CountUp on humidity |
| `src/components/WeatherWidgets/WindWidget.tsx` | CountUp on wind speed |
| `src/components/BestDay/BestDay.tsx` | Scroll reveal |
| `src/components/CityComparison/CityComparison.tsx` | Scroll reveal |
| `src/components/WeatherMap/WeatherMap.tsx` | Scroll reveal |
| `src/components/EmailSignup/EmailSignup.tsx` | Scroll reveal |

---

## Chunk 1: CSS Foundation & Scroll Reveal

### Task 1: CSS Animations Foundation

All the CSS keyframes and utility classes that later tasks depend on. Do this first so everything else can reference these classes.

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Add all CSS keyframes and utility classes to `src/index.css`**

Add the following inside the `@layer components` block, after the existing `.placeholder-white\\/30::placeholder` rule but before the closing `}`:

```css
  /* ==================== POLISH: Animations ==================== */

  /* Scroll reveal */
  .scroll-reveal {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.5s ease-out, transform 0.5s ease-out;
  }
  .scroll-reveal.revealed {
    opacity: 1;
    transform: translateY(0);
  }

  /* Shimmer loading skeleton */
  .skeleton-shimmer {
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.03) 25%,
      rgba(255, 255, 255, 0.08) 50%,
      rgba(255, 255, 255, 0.03) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  [data-theme="light"] .skeleton-shimmer {
    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.03) 25%,
      rgba(0, 0, 0, 0.08) 50%,
      rgba(0, 0, 0, 0.03) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* Glass hover lift — desktop only */
  @media (hover: hover) {
    .glass {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .glass:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }
  }

  /* Temperature breathing pulse */
  .temp-pulse {
    animation: breathe 4s ease-in-out infinite;
  }
  @keyframes breathe {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.92; }
  }

  /* Weather emoji idle animations */
  .emoji-spin { animation: emojiSpin 20s linear infinite; }
  .emoji-bob { animation: emojiBob 2s ease-in-out infinite; }
  .emoji-drift { animation: emojiDrift 3s ease-in-out infinite; }
  .emoji-float { animation: emojiFloat 6s ease-in-out infinite; }
  .emoji-shake { animation: emojiShake 4s ease-in-out infinite; }
  .emoji-fog-pulse { animation: emojiFogPulse 3s ease-in-out infinite; }

  @keyframes emojiSpin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes emojiBob {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-2px); }
  }
  @keyframes emojiDrift {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(3px); }
  }
  @keyframes emojiFloat {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(5px); }
  }
  @keyframes emojiShake {
    0%, 5% { transform: translateX(-1px) rotate(-1deg); }
    2.5% { transform: translateX(1px) rotate(1deg); }
    5%, 100% { transform: translateX(0) rotate(0); }
  }
  @keyframes emojiFogPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }

  /* Aurora borealis — clear nights */
  .aurora-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 30%;
    pointer-events: none;
    background:
      radial-gradient(ellipse 80% 50% at 20% 0%, rgba(0, 255, 128, 0.04) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 70% 10%, rgba(128, 0, 255, 0.03) 0%, transparent 50%),
      radial-gradient(ellipse 70% 45% at 50% 5%, rgba(0, 200, 200, 0.03) 0%, transparent 55%);
    animation: auroraDrift 35s ease-in-out infinite alternate;
  }
  @keyframes auroraDrift {
    0% { transform: translateX(-5%) scaleX(1); opacity: 0.6; }
    50% { transform: translateX(5%) scaleX(1.1); opacity: 1; }
    100% { transform: translateX(-3%) scaleX(0.95); opacity: 0.8; }
  }

  /* Sun lens flare — clear days */
  .lens-flare {
    position: absolute;
    top: 5%;
    right: 10%;
    width: 300px;
    height: 300px;
    pointer-events: none;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 223, 100, 0.07) 0%, rgba(255, 223, 100, 0) 70%);
    animation: flareDrift 20s ease-in-out infinite alternate;
  }
  @keyframes flareDrift {
    0% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(20px, 10px) scale(1.1); }
    100% { transform: translate(-10px, 5px) scale(0.95); }
  }

  /* Page fade-in */
  .page-enter {
    opacity: 0;
    transition: opacity 0.4s ease-out;
  }
  .page-enter.page-visible {
    opacity: 1;
  }

  /* Hidden scrollbar for horizontal scroll */
  .scrollbar-hide {
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
```

- [ ] **Step 2: Verify the CSS compiles**

Run: `npx tsc --noEmit`
Expected: No errors (CSS doesn't affect TS compilation, but ensures nothing broke)

Then visually verify: open the app in the browser, confirm existing styles still work, glass cards still look correct.

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "style: add CSS keyframes for scroll reveal, shimmer, hover, pulse, emoji, aurora, flare, and page fade"
```

---

### Task 2: useScrollReveal Hook

**Files:**
- Create: `src/hooks/useScrollReveal.ts`

- [ ] **Step 1: Create the hook**

```typescript
import { useRef, useEffect } from 'react'

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  delay: number = 0
): React.RefObject<T | null> {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Add the base class
    el.classList.add('scroll-reveal')
    if (delay > 0) {
      el.style.transitionDelay = `${delay}ms`
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed')
          observer.unobserve(el) // Only animate once
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)

    return () => observer.disconnect()
  }, [delay])

  return ref
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useScrollReveal.ts
git commit -m "feat: add useScrollReveal hook with IntersectionObserver"
```

---

### Task 3: Apply Scroll Reveal to All Sections

**Files:**
- Modify: `src/components/Forecast/Forecast.tsx`
- Modify: `src/components/TempChart/TempChart.tsx`
- Modify: `src/components/WeatherWidgets/WidgetGrid.tsx`
- Modify: `src/components/BestDay/BestDay.tsx`
- Modify: `src/components/CityComparison/CityComparison.tsx`
- Modify: `src/components/WeatherMap/WeatherMap.tsx`
- Modify: `src/components/EmailSignup/EmailSignup.tsx`

**Note:** The Hero and Header are above-the-fold and do NOT get scroll reveal refs. The root page fade-in (Task 12) handles their entrance animation. Scroll reveal is only for below-the-fold sections.

For each component, the pattern is identical:

1. Import `useScrollReveal`
2. Call it with a stagger delay (0ms, 75ms, 150ms, etc. based on DOM order)
3. Attach the ref to the outermost `<section>` or `<div>` wrapper

**Example for Forecast.tsx:**

Add to imports:
```typescript
import { useScrollReveal } from '../../hooks/useScrollReveal'
```

Inside the component function (before any early returns):
```typescript
const revealRef = useScrollReveal(0)
```

On the main `<section>` element (the non-loading return), add the ref:
```tsx
<section ref={revealRef} className="px-4 max-w-3xl mx-auto" aria-live="polite">
```

- [ ] **Step 1: Add scroll reveal to Forecast.tsx (delay: 0ms)**

- [ ] **Step 2: Add scroll reveal to TempChart.tsx (delay: 75ms)**

- [ ] **Step 3: Add scroll reveal to WidgetGrid.tsx (delay: 150ms)**

- [ ] **Step 4: Add scroll reveal to BestDay.tsx (delay: 225ms)**

- [ ] **Step 5: Add scroll reveal to CityComparison.tsx (delay: 300ms)**

- [ ] **Step 6: Add scroll reveal to WeatherMap.tsx (delay: 375ms)**

- [ ] **Step 7: Add scroll reveal to EmailSignup.tsx (delay: 450ms)**

- [ ] **Step 8: Verify it compiles and test visually**

Run: `npx tsc --noEmit`
Then scroll down in the browser — each section should fade up in a staggered cascade.

- [ ] **Step 9: Commit**

```bash
git add src/components/Forecast/Forecast.tsx src/components/TempChart/TempChart.tsx src/components/WeatherWidgets/WidgetGrid.tsx src/components/BestDay/BestDay.tsx src/components/CityComparison/CityComparison.tsx src/components/WeatherMap/WeatherMap.tsx src/components/EmailSignup/EmailSignup.tsx
git commit -m "feat: add scroll reveal animations to all below-the-fold sections"
```

---

## Chunk 2: CountUp, Hero Enhancements & Shimmer Skeletons

### Task 4: CountUp Component

**Files:**
- Create: `src/components/CountUp/CountUp.tsx`

- [ ] **Step 1: Create the CountUp component**

```typescript
import { useState, useEffect, useRef } from 'react'

interface CountUpProps {
  value: number
  duration?: number
  suffix?: string
  className?: string
}

export function CountUp({ value, duration = 600, suffix = '', className }: CountUpProps) {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)
  const fromRef = useRef(0)

  useEffect(() => {
    fromRef.current = display
    startRef.current = null

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
    }

    const animate = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp
      const elapsed = timestamp - startRef.current
      const progress = Math.min(elapsed / duration, 1)

      // Ease-out: 1 - (1 - t)^3
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(fromRef.current + (value - fromRef.current) * eased)

      setDisplay(current)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [value, duration])

  return <span className={className}>{display}{suffix}</span>
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/CountUp/CountUp.tsx
git commit -m "feat: add CountUp animated number component"
```

---

### Task 5: Hero Enhancements (Greeting, Pulse, CountUp, Last Updated)

**Files:**
- Modify: `src/components/Hero/Hero.tsx`
- Modify: `src/hooks/useWeather.ts` (add `lastFetchedAt`)
- Modify: `src/context/WeatherContext.tsx` (expose `lastFetchedAt`)
- Create: `src/hooks/useElapsedTime.ts`

- [ ] **Step 1: Create useElapsedTime hook**

Create `src/hooks/useElapsedTime.ts`:

```typescript
import { useState, useEffect } from 'react'

export function useElapsedTime(since: number | null): string {
  const [, setTick] = useState(0)

  useEffect(() => {
    if (since === null) return
    const id = setInterval(() => setTick((t) => t + 1), 30_000) // Update every 30s
    return () => clearInterval(id)
  }, [since])

  if (since === null) return ''

  const seconds = Math.floor((Date.now() - since) / 1000)
  if (seconds < 60) return 'Updated just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `Updated ${minutes} min ago`
  return `Updated ${Math.floor(minutes / 60)}h ago`
}
```

- [ ] **Step 2: Add `lastFetchedAt` to useWeather hook**

In `src/hooks/useWeather.ts`:

Add to state declarations (after `const [error, setError] = useState<string | null>(null)`):
```typescript
const [lastFetchedAt, setLastFetchedAt] = useState<number | null>(null)
```

Add to the `UseWeatherResult` interface:
```typescript
lastFetchedAt: number | null
```

In the try block of `fetchAll`, after `cacheRef.current = { key: cacheKey, time: Date.now() }`:
```typescript
setLastFetchedAt(Date.now())
```

Add `lastFetchedAt` to the return object.

Also, extract the raw hourly items for the HourlyForecast component. Add to `UseWeatherResult`:
```typescript
hourlyItems: OWMForecastItem[]
```

Add state:
```typescript
const [hourlyItems, setHourlyItems] = useState<OWMForecastItem[]>([])
```

In the try block, after `setForecast(processForecast(forecastData.list))`:
```typescript
// Keep first 8 items (next 24 hours at 3-hour intervals)
setHourlyItems(forecastData.list.slice(0, 8))
```

Add `hourlyItems` to the return object.

- [ ] **Step 3: Expose `lastFetchedAt` and `hourlyItems` in WeatherContext**

In `src/context/WeatherContext.tsx`:

Add to `WeatherContextType`:
```typescript
lastFetchedAt: number | null
```

In the provider's value prop, add:
```typescript
lastFetchedAt: weather.lastFetchedAt,
```

The `hourlyItems` are already accessible via `weatherData` since they're part of `useWeather`'s return.

- [ ] **Step 4: Add `timezone` to `OWMCurrentWeather` type**

In `src/types/weather.ts`, add to the `OWMCurrentWeather` interface (after the `dt: number` line):
```typescript
timezone?: number // Offset in seconds from UTC
```

- [ ] **Step 5: Rewrite Hero.tsx with all enhancements**

Replace the entire content of `src/components/Hero/Hero.tsx`:

```typescript
import { useWeatherContext } from '../../context/WeatherContext'
import { convertTemp, getWeatherCondition } from '../../lib/weather-utils'
import { useElapsedTime } from '../../hooks/useElapsedTime'
import { CountUp } from '../CountUp/CountUp'

const CONDITION_EMOJI: Record<string, { emoji: string; animation: string }> = {
  clear: { emoji: '☀️', animation: 'emoji-spin' },
  'partly-cloudy': { emoji: '⛅', animation: 'emoji-float' },
  cloudy: { emoji: '☁️', animation: 'emoji-float' },
  rain: { emoji: '🌧️', animation: 'emoji-bob' },
  thunderstorm: { emoji: '⛈️', animation: 'emoji-shake' },
  snow: { emoji: '🌨️', animation: 'emoji-drift' },
  fog: { emoji: '🌫️', animation: 'emoji-fog-pulse' },
}

function getGreeting(timezoneOffset: number): string {
  const utcMs = Date.now() + new Date().getTimezoneOffset() * 60_000
  const localHour = new Date(utcMs + timezoneOffset * 1000).getHours()
  if (localHour >= 5 && localHour < 12) return 'Good Morning'
  if (localHour >= 12 && localHour < 17) return 'Good Afternoon'
  if (localHour >= 17 && localHour < 21) return 'Good Evening'
  return 'Tonight'
}

export function Hero() {
  const { city, weatherData, unit, geoError, refresh, lastFetchedAt } = useWeatherContext()
  const { current, loading, error } = weatherData
  const elapsed = useElapsedTime(lastFetchedAt)

  if (loading) {
    return (
      <section className="text-center py-16 px-4" aria-live="polite">
        <div>
          <div className="h-4 w-32 skeleton-shimmer rounded mx-auto mb-4" />
          <div className="h-16 w-40 skeleton-shimmer rounded mx-auto mb-4" />
          <div className="h-4 w-24 skeleton-shimmer rounded mx-auto" />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="text-center py-16 px-4" aria-live="assertive">
        <p className="text-red-400 text-lg">{error}</p>
        <p className="text-white/40 text-sm mt-2">Try searching for a city above</p>
        <button
          onClick={refresh}
          className="mt-4 px-4 py-2 text-sm glass text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          Retry
        </button>
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

  const temp = Math.round(convertTemp(current.main.temp, unit))
  const feelsLike = Math.round(convertTemp(current.main.feels_like, unit))
  const high = Math.round(convertTemp(current.main.temp_max, unit))
  const low = Math.round(convertTemp(current.main.temp_min, unit))
  const condition = getWeatherCondition(current.weather[0].id)
  const emojiInfo = CONDITION_EMOJI[condition] ?? CONDITION_EMOJI.clear
  const greeting = getGreeting(current.timezone ?? 0)

  return (
    <section className="text-center py-12 px-4" aria-live="polite">
      <p className="section-label mb-1">{greeting}</p>
      <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-2">
        {city.name}{city.state ? `, ${city.state}` : ''}, {city.country}
      </p>

      <span className={`inline-block text-4xl mb-2 ${emojiInfo.animation}`}>
        {emojiInfo.emoji}
      </span>

      <p className="text-7xl font-extralight text-white leading-none temp-pulse">
        <CountUp value={temp} suffix={`°${unit}`} />
      </p>

      <p className="text-white/60 mt-3 text-base capitalize">
        {current.weather[0].description}
      </p>

      <div className="flex justify-center gap-6 mt-3">
        <span className="text-sm text-white/40">
          H: <CountUp value={high} suffix={`°${unit}`} />
        </span>
        <span className="text-sm text-white/40">
          L: <CountUp value={low} suffix={`°${unit}`} />
        </span>
      </div>

      <p className="text-xs text-white/30 mt-2">
        Feels like <CountUp value={feelsLike} suffix={`°${unit}`} />
      </p>

      {elapsed && (
        <button
          onClick={refresh}
          className="text-[10px] text-white/20 mt-3 hover:text-white/40 hover:underline transition-colors cursor-pointer"
          aria-label="Refresh weather data"
        >
          ↻ {elapsed}
        </button>
      )}
    </section>
  )
}
```

**Note:** The OWM current weather API response includes a `timezone` field (offset in seconds from UTC). We need to add this to the `OWMCurrentWeather` type.

- [ ] **Step 6: Verify everything compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 7: Test visually**

- The greeting should appear above the city name ("Good Morning", "Good Afternoon", etc.)
- The temperature should count up from 0 on load
- The weather emoji should animate (sun rotates, rain bobs, etc.)
- The main temperature should have a very subtle breathing pulse
- "Updated just now" should appear below "Feels like" and update over time
- Click "Updated X min ago" to trigger a refresh

- [ ] **Step 8: Commit**

```bash
git add src/hooks/useElapsedTime.ts src/hooks/useWeather.ts src/context/WeatherContext.tsx src/components/Hero/Hero.tsx src/types/weather.ts
git commit -m "feat: add Hero enhancements — greeting, CountUp, emoji animations, last-updated timestamp"
```

---

### Task 6: Replace animate-pulse with Shimmer Skeletons

**Files:**
- Modify: `src/components/Forecast/Forecast.tsx`
- Modify: `src/components/TempChart/TempChart.tsx`
- Modify: `src/components/CityComparison/CityComparison.tsx`

In each file, find all instances of `animate-pulse` and `bg-white/10` in skeleton/loading divs and replace:
- `animate-pulse` → remove from parent (shimmer is on individual elements)
- `bg-white/10` → `skeleton-shimmer`
- `bg-white/5` → `skeleton-shimmer`

- [ ] **Step 1: Update Forecast.tsx loading skeleton**

Replace the loading return in Forecast.tsx. Change:
```tsx
<div className="animate-pulse flex gap-4">
```
to:
```tsx
<div className="flex gap-4">
```

And change all `bg-white/10` in the skeleton to `skeleton-shimmer`:
```tsx
<div className="h-3 w-8 skeleton-shimmer rounded mx-auto mb-2" />
<div className="h-8 w-8 skeleton-shimmer rounded mx-auto mb-2" />
<div className="h-3 w-12 skeleton-shimmer rounded mx-auto" />
```

- [ ] **Step 2: Update CityComparison.tsx loading skeleton**

In `src/components/CityComparison/CityComparison.tsx`, find:
```tsx
<div className="animate-pulse h-24 bg-white/5 rounded-lg" />
```
Change to:
```tsx
<div className="h-24 skeleton-shimmer rounded-lg" />
```

- [ ] **Step 3: Update TempChart.tsx loading skeleton**

Change:
```tsx
<div className="animate-pulse h-[140px] bg-white/5 rounded-lg" />
```
to:
```tsx
<div className="h-[140px] skeleton-shimmer rounded-lg" />
```

- [ ] **Step 3: Verify and commit**

Run: `npx tsc --noEmit`
Visually test: loading states should show a sweeping shimmer gradient instead of a pulsing opacity.

```bash
git add src/components/Forecast/Forecast.tsx src/components/CityComparison/CityComparison.tsx src/components/TempChart/TempChart.tsx
git commit -m "style: replace animate-pulse skeletons with shimmer effect"
```

---

### Task 7: CountUp in Widgets

**Files:**
- Modify: `src/components/WeatherWidgets/HumidityWidget.tsx`
- Modify: `src/components/WeatherWidgets/WindWidget.tsx`

- [ ] **Step 1: Read the widget files to understand current structure**

Read `src/components/WeatherWidgets/HumidityWidget.tsx` and `src/components/WeatherWidgets/WindWidget.tsx`.

- [ ] **Step 2: Add CountUp to HumidityWidget**

Import `CountUp` and wrap the humidity number:
```tsx
import { CountUp } from '../CountUp/CountUp'
```

Replace the humidity display (the number showing `current.main.humidity`) with:
```tsx
<CountUp value={current.main.humidity} suffix="%" />
```

- [ ] **Step 3: Add CountUp to WindWidget**

Import `CountUp` and wrap the wind speed number. Replace the wind speed display with:
```tsx
<CountUp value={Math.round(current.wind.speed)} suffix=" mph" />
```

- [ ] **Step 4: Verify and commit**

Run: `npx tsc --noEmit`

```bash
git add src/components/WeatherWidgets/HumidityWidget.tsx src/components/WeatherWidgets/WindWidget.tsx
git commit -m "feat: add CountUp animation to humidity and wind widgets"
```

---

## Chunk 3: Hourly Forecast Ribbon

### Task 8: Hourly Forecast Component

**Files:**
- Create: `src/components/HourlyForecast/HourlyForecast.tsx`
- Modify: `src/App.tsx` (add to layout)

- [ ] **Step 1: Create the HourlyForecast component**

```typescript
import { useWeatherContext } from '../../context/WeatherContext'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { convertTemp } from '../../lib/weather-utils'

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

interface HourlyItem {
  time: string
  icon: string
  temp: number
  isNow: boolean
}

export function HourlyForecast() {
  const { weatherData, unit } = useWeatherContext()
  const { current, loading } = weatherData
  const hourlyItems = (weatherData as any).hourlyItems ?? []
  const revealRef = useScrollReveal(0)

  if (loading) {
    return (
      <section className="px-4 max-w-3xl mx-auto mt-4">
        <div className="glass p-4">
          <div className="flex gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[60px] text-center">
                <div className="h-3 w-8 skeleton-shimmer rounded mx-auto mb-2" />
                <div className="h-6 w-6 skeleton-shimmer rounded mx-auto mb-2" />
                <div className="h-3 w-8 skeleton-shimmer rounded mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!current || hourlyItems.length === 0) return null

  const items: HourlyItem[] = [
    // "Now" item from current weather
    {
      time: 'Now',
      icon: current.weather[0].icon,
      temp: Math.round(convertTemp(current.main.temp, unit)),
      isNow: true,
    },
    // Next 7 forecast slots
    ...hourlyItems.slice(0, 7).map((item: any) => ({
      time: new Date(item.dt * 1000).toLocaleTimeString('en-US', {
        hour: 'numeric',
        hour12: true,
      }),
      icon: item.weather[0].icon,
      temp: Math.round(convertTemp(item.main.temp, unit)),
      isNow: false,
    })),
  ]

  return (
    <section ref={revealRef} className="px-4 max-w-3xl mx-auto mt-4">
      <div className="glass p-4">
        <p className="section-label mb-3">Hourly Forecast</p>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide" style={{ scrollSnapType: 'x mandatory' }}>
          {items.map((item, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[60px] text-center"
              style={{ scrollSnapAlign: 'start' }}
            >
              <p className={`text-[10px] mb-1 ${item.isNow ? 'text-white/80 font-medium' : 'text-white/40'}`}>
                {item.time}
              </p>
              <p className="text-xl mb-1">
                {WEATHER_ICONS[item.icon] ?? '🌤️'}
              </p>
              <p className={`text-xs ${item.isNow ? 'text-white/80' : 'text-white/60'}`}>
                {item.temp}°
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add HourlyForecast to App.tsx**

Import at the top:
```typescript
import { HourlyForecast } from './components/HourlyForecast/HourlyForecast'
```

Add between `<Hero />` and `<AlertBanner />`:
```tsx
<Hero />
<HourlyForecast />
<AlertBanner />
```

- [ ] **Step 3: Fix the hourlyItems type access**

The `hourlyItems` is accessed via `(weatherData as any).hourlyItems` above which isn't ideal. To fix this properly, update `src/context/WeatherContext.tsx` to include `hourlyItems` in the `weatherData` spread, and update the `WeatherContextType` interface.

**Prerequisite:** Task 5 Step 2 must be complete — `hourlyItems` must already be in `useWeather`'s return type. Since `weatherData` is `Omit<ReturnType<typeof useWeather>, 'refresh'>`, `hourlyItems` is automatically included. Change the access in HourlyForecast.tsx to:

```typescript
const { current, loading, hourlyItems } = weatherData
```

And remove the `(weatherData as any)` cast.

- [ ] **Step 4: Verify and test**

Run: `npx tsc --noEmit`

Visually test:
- Horizontal ribbon should appear between Hero and AlertBanner
- "Now" should show current weather data
- Subsequent slots show 3-hour interval forecasts
- Scrollable on mobile

- [ ] **Step 5: Commit**

```bash
git add src/components/HourlyForecast/HourlyForecast.tsx src/App.tsx
git commit -m "feat: add hourly forecast ribbon between Hero and Forecast"
```

---

## Chunk 4: Enhanced Particle Effects & Background Visuals

### Task 9: Aurora Borealis & Sun Lens Flare in Background.tsx

**Files:**
- Modify: `src/components/Background/Background.tsx`

The CSS for aurora and lens flare was already added in Task 1. Now we just need to conditionally render the overlay divs.

- [ ] **Step 1: Add aurora and lens flare overlays to Background.tsx**

In `src/components/Background/Background.tsx`, update the return JSX. Change:

```tsx
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
```

to:

```tsx
return (
    <div
      className="fixed inset-0 transition-all duration-[1500ms]"
      style={{ background: gradient }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full transition-opacity duration-500"
        aria-hidden="true"
      />
      {condition === 'clear' && isNight && (
        <div className="aurora-overlay" aria-hidden="true" />
      )}
      {condition === 'clear' && !isNight && theme !== 'light' && (
        <div className="lens-flare" aria-hidden="true" />
      )}
    </div>
  )
```

Note: The lens flare is hidden in light mode since the background is already very bright.

- [ ] **Step 2: Verify and test**

Run: `npx tsc --noEmit`

Test: Switch to a city where it's nighttime and clear — you should see subtle green/purple aurora waves at the top of the screen. For daytime clear weather in dark mode, a soft golden glow should drift in the upper-right.

- [ ] **Step 3: Commit**

```bash
git add src/components/Background/Background.tsx
git commit -m "feat: add aurora borealis (clear nights) and lens flare (clear days) overlays"
```

---

### Task 10: Rain Splash Effect in Particle Engine

**Files:**
- Modify: `src/lib/particles.ts`

- [ ] **Step 1: Add splash particle type and logic**

In `src/lib/particles.ts`, add a `Splash` interface after the `ShootingStar` interface:

```typescript
interface Splash {
  x: number
  y: number
  radius: number
  maxRadius: number
  opacity: number
  life: number
}
```

Add to the class properties (after `private shootingStarTimer`):
```typescript
private splashes: Splash[] = []
```

In the `configure` method, add after `this.shootingStarTimer = 0`:
```typescript
this.splashes = []
```

In the `update` method, inside the existing particle reset section (where `if (p.y > h + 20)` is), add splash spawning logic for rain/lightning. Find this block:

```typescript
// Reset particles that go off screen
if (p.y > h + 20) {
  p.y = -20
  p.x = Math.random() * w
}
```

Replace with:

```typescript
// Reset particles that go off screen
if (p.y > h + 20) {
  // Spawn splash for rain/lightning at impact point
  if ((this.type === 'rain' || this.type === 'lightning') && this.splashes.length < 10) {
    this.splashes.push({
      x: p.x,
      y: h - 5 + Math.random() * 10,
      radius: 1,
      maxRadius: 3 + Math.random() * 2,
      opacity: 0.4,
      life: 0,
    })
  }
  p.y = -20
  p.x = Math.random() * w
}
```

After the shooting stars update block (after `this.shootingStars = this.shootingStars.filter(...)`), add:

```typescript
// Update splashes
for (const s of this.splashes) {
  s.life++
  s.radius += (s.maxRadius - 1) / 15 // Expand over ~15 frames
  s.opacity *= 0.9 // Fade out
}
this.splashes = this.splashes.filter((s) => s.opacity > 0.02)
```

- [ ] **Step 2: Draw the splashes**

In the `draw` method, before the shooting stars block (before `// Draw shooting stars`), add:

```typescript
// Draw rain splashes
if (this.type === 'rain' || this.type === 'lightning') {
  for (const s of this.splashes) {
    ctx.globalAlpha = s.opacity
    ctx.strokeStyle = 'rgba(174, 194, 224, 0.6)'
    ctx.lineWidth = 0.5
    ctx.beginPath()
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
    ctx.stroke()
  }
}
```

- [ ] **Step 3: Add particle opacity fade on weather transitions**

In the `configure` method of `ParticleEngine`, instead of immediately clearing particles, fade them out first. Replace:

```typescript
configure(type: ParticleType, count: number, speed: number) {
    this.type = type
    this.maxParticles = count
    this.speed = speed
    this.particles = []
    this.shootingStars = []
    this.shootingStarTimer = 0
    this.splashes = []
```

with:

```typescript
configure(type: ParticleType, count: number, speed: number) {
    // Fade out existing particles before switching
    if (this.particles.length > 0 && this.type !== type) {
      for (const p of this.particles) {
        p.opacity *= 0.5  // Start fading
      }
    }

    this.type = type
    this.maxParticles = count
    this.speed = speed
    this.particles = []
    this.shootingStars = []
    this.shootingStarTimer = 0
    this.splashes = []
```

Also add an opacity transition on the canvas element in Background.tsx (already handled in Task 9 Step 1 with `transition-opacity duration-500` on the canvas).

- [ ] **Step 4: Verify and test**

Run: `npx tsc --noEmit`

Test: Search for a city with rain — when rain particles hit the bottom of the screen, small expanding circles should appear and fade out. Switch between cities — particles should transition smoothly.

- [ ] **Step 5: Commit**

```bash
git add src/lib/particles.ts
git commit -m "feat: add rain splash effect and particle fade transitions"
```

---

## Chunk 5: Ambient Sound System

### Task 11: Ambient Sound Hook & Integration

**Files:**
- Create: `src/hooks/useAmbientSound.ts`
- Modify: `src/context/WeatherContext.tsx` (add sound state)
- Modify: `src/components/Header/Header.tsx` (add sound toggle)
- Create: `public/sounds/` directory with placeholder note

- [ ] **Step 1: Create useAmbientSound hook**

Create `src/hooks/useAmbientSound.ts`:

```typescript
import { useRef, useEffect, useCallback } from 'react'
import type { WeatherCondition } from '../types/weather'

const SOUND_MAP: Record<string, string> = {
  'clear-day': '/sounds/clear-day.mp3',
  'clear-night': '/sounds/clear-night.mp3',
  'rain': '/sounds/rain.mp3',
  'thunderstorm': '/sounds/thunder.mp3',
  'snow': '/sounds/snow.mp3',
  'cloudy': '/sounds/cloudy.mp3',
  'partly-cloudy': '/sounds/cloudy.mp3',
  'fog': '/sounds/fog.mp3',
}

function getSoundKey(condition: WeatherCondition, isNight: boolean): string {
  if (condition === 'clear' || condition === 'partly-cloudy') {
    if (condition === 'clear') return isNight ? 'clear-night' : 'clear-day'
  }
  return condition
}

export function useAmbientSound(
  condition: WeatherCondition | null,
  isNight: boolean,
  muted: boolean
) {
  const currentAudio = useRef<HTMLAudioElement | null>(null)
  const fadingAudio = useRef<HTMLAudioElement | null>(null)
  const fadeInterval = useRef<ReturnType<typeof setInterval> | null>(null)
  const loadedRef = useRef(false)

  const stopFade = useCallback(() => {
    if (fadeInterval.current) {
      clearInterval(fadeInterval.current)
      fadeInterval.current = null
    }
  }, [])

  const fadeIn = useCallback((audio: HTMLAudioElement, targetVolume: number, duration: number) => {
    audio.volume = 0
    audio.play().catch(() => {})
    const steps = 30
    const stepTime = duration / steps
    const volumeStep = targetVolume / steps
    let current = 0

    const id = setInterval(() => {
      current += volumeStep
      if (current >= targetVolume) {
        audio.volume = targetVolume
        clearInterval(id)
      } else {
        audio.volume = current
      }
    }, stepTime)

    return id
  }, [])

  const fadeOut = useCallback((audio: HTMLAudioElement, duration: number) => {
    const startVol = audio.volume
    const steps = 20
    const stepTime = duration / steps
    const volumeStep = startVol / steps

    fadeInterval.current = setInterval(() => {
      const newVol = audio.volume - volumeStep
      if (newVol <= 0) {
        audio.volume = 0
        audio.pause()
        stopFade()
      } else {
        audio.volume = newVol
      }
    }, stepTime)
  }, [stopFade])

  useEffect(() => {
    if (muted || !condition) {
      // Pause current audio
      if (currentAudio.current && !currentAudio.current.paused) {
        fadeOut(currentAudio.current, 500)
      }
      return
    }

    const soundKey = getSoundKey(condition, isNight)
    const soundUrl = SOUND_MAP[soundKey]
    if (!soundUrl) return

    const currentSrc = currentAudio.current?.src ?? ''

    // Same sound already playing
    if (currentAudio.current && !currentAudio.current.paused && currentSrc.endsWith(soundUrl)) {
      return
    }

    // Crossfade: fade out old, fade in new
    if (currentAudio.current && !currentAudio.current.paused) {
      fadingAudio.current = currentAudio.current
      fadeOut(fadingAudio.current, 1500)
    }

    const audio = new Audio(soundUrl)
    audio.loop = true
    currentAudio.current = audio

    // First unmute: simple fade in (500ms). Otherwise crossfade timing (1500ms).
    const isFirstLoad = !loadedRef.current
    loadedRef.current = true
    fadeIn(audio, 0.25, isFirstLoad ? 500 : 1500)

    return () => {
      stopFade()
    }
  }, [condition, isNight, muted, fadeIn, fadeOut, stopFade])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      currentAudio.current?.pause()
      fadingAudio.current?.pause()
      stopFade()
    }
  }, [stopFade])
}
```

- [ ] **Step 2: Add sound state to WeatherContext**

In `src/context/WeatherContext.tsx`:

Add to imports (from useLocalStorage):
Already imported.

Add state:
```typescript
const [soundMuted, setSoundMuted] = useLocalStorage<boolean>('weather-sound-muted', true)
```

Add toggle:
```typescript
const toggleSound = useCallback(() => {
  setSoundMuted((prev) => !prev)
}, [setSoundMuted])
```

Add to `WeatherContextType` interface:
```typescript
soundMuted: boolean
toggleSound: () => void
```

Add to provider value:
```typescript
soundMuted,
toggleSound,
```

- [ ] **Step 3: Wire up useAmbientSound in App.tsx or a dedicated component**

The best place is in `App.tsx` since it already has access to the context. Add after the `useWeatherContext()` call:

In `src/App.tsx`, add imports:
```typescript
import { useAmbientSound } from './hooks/useAmbientSound'
import { getWeatherCondition } from './lib/weather-utils'
```

Inside the `App` function, **replace** the existing `const { theme } = useWeatherContext()` with a single combined destructure that includes everything App.tsx will need (including `refresh` for Task 13's pull-to-refresh):
```typescript
const { theme, weatherData, soundMuted, refresh } = useWeatherContext()
const { current } = weatherData

const condition = current ? getWeatherCondition(current.weather[0].id) : null
const isNight = current
  ? current.dt > current.sys.sunset || current.dt < current.sys.sunrise
  : false

useAmbientSound(condition, isNight, soundMuted)
```

**Important:** This is the only `useWeatherContext()` call in App.tsx. Task 13 should use the already-destructured `refresh`, not add a second call.

- [ ] **Step 4: Add sound toggle to Header**

In `src/components/Header/Header.tsx`, add `soundMuted` and `toggleSound` to the destructured context:

```typescript
const { city, setCity, removeCity, recentCities, unit, toggleUnit, theme, toggleTheme, soundMuted, toggleSound } =
  useWeatherContext()
```

Add a sound toggle button after the theme toggle button:

```tsx
{/* Sound toggle */}
<button
  onClick={toggleSound}
  aria-label={soundMuted ? 'Unmute ambient sounds' : 'Mute ambient sounds'}
  className="glass px-3 py-2 text-sm transition-colors"
>
  {soundMuted ? '🔇' : '🔊'}
</button>
```

- [ ] **Step 5: Create sound files placeholder**

Create `public/sounds/README.md` with a note about sourcing the audio:

```
# Ambient Sound Files

Place CC0/public domain MP3 files here:
- clear-day.mp3 — soft wind with birds
- clear-night.mp3 — crickets and gentle wind
- rain.mp3 — rain patter
- thunder.mp3 — rain with distant thunder
- snow.mp3 — muffled quiet wind
- cloudy.mp3 — light breeze
- fog.mp3 — low ambient drone

Each file should be under 500KB, loopable.

Recommended sources:
- freesound.org (filter by CC0)
- pixabay.com/sound-effects (Pixabay License)
- mixkit.co/free-sound-effects
```

- [ ] **Step 6: Verify and test**

Run: `npx tsc --noEmit`

The sound system will work once MP3 files are placed in `public/sounds/`. Without the files, the toggle button will appear and the system will silently fail to load (no errors).

- [ ] **Step 7: Commit**

```bash
git add src/hooks/useAmbientSound.ts src/context/WeatherContext.tsx src/components/Header/Header.tsx src/App.tsx public/sounds/README.md
git commit -m "feat: add ambient weather sound system with crossfade and mute toggle"
```

---

## Chunk 6: Page Load, Pull-to-Refresh & Final Polish

### Task 12: Smooth Page Fade-In

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Add page fade-in to App.tsx**

Add `useEffect` and `useState` to the React import (if not already there):
```typescript
import { useState, useEffect } from 'react'
```

Inside the `App` function, add:
```typescript
const [pageVisible, setPageVisible] = useState(false)

useEffect(() => {
  // Small delay to ensure DOM is ready before triggering fade
  requestAnimationFrame(() => setPageVisible(true))
}, [])
```

Update the root div:
```tsx
<div className={`min-h-screen relative page-enter ${pageVisible ? 'page-visible' : ''}`} data-theme={theme}>
```

- [ ] **Step 2: Verify and test**

Refresh the page — the entire app should smoothly fade in over 400ms instead of popping in.

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: add smooth page fade-in on initial load"
```

---

### Task 13: Pull-to-Refresh (Mobile)

**Files:**
- Create: `src/hooks/usePullToRefresh.ts`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create usePullToRefresh hook**

Create `src/hooks/usePullToRefresh.ts`:

```typescript
import { useRef, useEffect, useState, useCallback } from 'react'

interface UsePullToRefreshOptions {
  onRefresh: () => void
  threshold?: number
}

export function usePullToRefresh({ onRefresh, threshold = 80 }: UsePullToRefreshOptions) {
  const [pulling, setPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const startY = useRef(0)
  const isPulling = useRef(false)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY
      isPulling.current = true
    }
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPulling.current) return

    const currentY = e.touches[0].clientY
    const distance = currentY - startY.current

    if (distance > 0 && window.scrollY === 0) {
      setPulling(true)
      setPullDistance(Math.min(distance * 0.4, threshold * 1.5)) // Dampen the pull
    }
  }, [threshold])

  const handleTouchEnd = useCallback(() => {
    if (pullDistance >= threshold) {
      onRefresh()
    }
    isPulling.current = false
    setPulling(false)
    setPullDistance(0)
  }, [pullDistance, threshold, onRefresh])

  useEffect(() => {
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  return { pulling, pullDistance }
}
```

- [ ] **Step 2: Add pull-to-refresh indicator to App.tsx**

Import the hook:
```typescript
import { usePullToRefresh } from './hooks/usePullToRefresh'
```

Inside `App`, add (after the existing hooks). Note: `refresh` was already added to the context destructure in Task 11 Step 3 — use it directly:
```typescript
const { pulling, pullDistance } = usePullToRefresh({ onRefresh: refresh })
```

Add the pull indicator before `<Header />`:
```tsx
{/* Pull-to-refresh indicator */}
{pulling && (
  <div
    className="fixed top-0 left-0 right-0 z-50 flex justify-center transition-transform"
    style={{ transform: `translateY(${pullDistance - 40}px)` }}
  >
    <div className={`w-8 h-8 rounded-full border-2 border-white/30 border-t-white/80 ${pullDistance >= 80 ? 'animate-spin' : ''}`} />
  </div>
)}
```

- [ ] **Step 3: Verify and test**

Run: `npx tsc --noEmit`

Test on mobile (or Chrome DevTools device emulation): swipe down from the top of the page to see the pull indicator and trigger a refresh.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/usePullToRefresh.ts src/App.tsx
git commit -m "feat: add pull-to-refresh for mobile devices"
```

---

### Task 14: Source & Add Ambient Sound Files

**Files:**
- Create: `public/sounds/clear-day.mp3`
- Create: `public/sounds/clear-night.mp3`
- Create: `public/sounds/rain.mp3`
- Create: `public/sounds/thunder.mp3`
- Create: `public/sounds/snow.mp3`
- Create: `public/sounds/cloudy.mp3`
- Create: `public/sounds/fog.mp3`

- [ ] **Step 1: Download CC0 ambient sound files**

Visit one of these sources and download short (10-30 second), loopable ambient clips:
- https://freesound.org (filter by CC0 license)
- https://pixabay.com/sound-effects/
- https://mixkit.co/free-sound-effects/

Search terms:
- "soft wind birds ambient" → `clear-day.mp3`
- "crickets night ambient" → `clear-night.mp3`
- "rain ambient loop" → `rain.mp3`
- "thunder rain distant" → `thunder.mp3`
- "wind snow muffled" → `snow.mp3`
- "light breeze ambient" → `cloudy.mp3`
- "ambient drone fog" → `fog.mp3`

Trim and compress each to under 500KB. Convert to MP3 if needed using ffmpeg:
```bash
ffmpeg -i input.wav -b:a 64k -ar 22050 output.mp3
```

- [ ] **Step 2: Place files in `public/sounds/`**

- [ ] **Step 3: Test the sound system**

Click the speaker icon in the header to unmute. You should hear ambient audio matching the weather condition. Switch cities — the audio should crossfade.

- [ ] **Step 4: Commit**

```bash
git add public/sounds/
git commit -m "feat: add ambient weather sound files (CC0)"
```

---

### Task 15: Final Integration Test & Cleanup

- [ ] **Step 1: Full type check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 2: Run existing tests**

Run: `npx vitest run`
Expected: All existing tests pass

- [ ] **Step 3: Visual integration test — Dark mode**

Open the app in the browser (dark mode). Verify:
- [ ] Page fades in smoothly on load
- [ ] Hero shows greeting, animated emoji, counting temperature, breathing pulse
- [ ] "Updated just now" appears and is clickable
- [ ] Hourly forecast ribbon scrolls horizontally
- [ ] Below-the-fold sections fade up as you scroll
- [ ] Glass cards lift slightly on hover (desktop)
- [ ] Loading states show shimmer instead of pulse
- [ ] Clear night shows aurora + shooting stars
- [ ] Clear day shows lens flare
- [ ] Rain shows splashes at bottom
- [ ] Sound toggle works (if audio files present)

- [ ] **Step 4: Visual integration test — Light mode**

Toggle to light mode. Verify:
- [ ] All text is readable
- [ ] Shimmer skeletons look correct in light mode
- [ ] Scroll reveal animations work
- [ ] No visual artifacts from aurora/lens flare

- [ ] **Step 5: Mobile test**

Open Chrome DevTools → device toolbar → iPhone 14 Pro. Verify:
- [ ] Pull-to-refresh works
- [ ] Hourly ribbon scrolls with snap
- [ ] No hover effects on touch
- [ ] Everything fits within viewport

- [ ] **Step 6: Final commit (if any fixes needed)**

```bash
git add -A
git commit -m "fix: integration test fixes for polish package"
```
