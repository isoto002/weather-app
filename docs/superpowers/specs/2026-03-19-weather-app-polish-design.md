# Weather App Polish Package — Design Spec

**Goal:** Elevate the weather app from functional to portfolio-grade with micro-animations, ambient sound, an hourly forecast ribbon, enhanced particle effects, and UX polish touches.

**Audience:** Portfolio piece, daily driver, and learning exercise. The user wants Apple-level polish with personality (like the shooting stars already implemented).

**Existing Stack:** React 19, TypeScript 5.9, Vite 8, Tailwind CSS v4, Recharts, Leaflet, OWM API, Netlify (upgraded from React 18 during initial build)

**Constraint:** All additions build on top of the existing layout — no restructuring. Polish what's there.

---

## 1. Scroll Animations & Micro-interactions

### 1.1 Scroll Reveal

- Every widget/section fades up and slides in (translateY 20px to 0, opacity 0 to 1) as it enters the viewport
- Staggered timing — each successive element delays ~75ms so they cascade like dominoes
- Uses IntersectionObserver with a threshold of ~0.1 (trigger when 10% visible)
- Animation duration: ~500ms with ease-out
- Only animates on first appearance — no re-triggering on scroll back up
- Elements already visible on initial page load (Hero, Header) trigger their reveal animation immediately on mount rather than waiting for scroll
- Implementation: a reusable `useScrollReveal` hook that returns a ref. Attach the ref to any container element. The hook adds/removes a CSS class. If the element is already intersecting at time of observation, the animation fires immediately.

### 1.2 Number Counting

- When a numeric value first renders (temperature, humidity %, wind speed, AQI), it counts up from 0 to the real number over ~600ms
- Uses an easing curve (ease-out) so it decelerates toward the final value
- Only triggers on initial mount or when the value changes (city switch, refresh). If a new value arrives while an animation is in progress, cancel the current animation and restart from the current displayed value to the new target (not from 0).
- Implementation: a `CountUp` component that takes `value`, `duration`, and optional `suffix` (like "°F" or "%")
- All animated values are rounded to the nearest integer before passing to CountUp. Display precision (e.g., one decimal in °C) is handled in the parent component, not inside CountUp. CountUp always animates between whole numbers.

### 1.3 Widget Hover

- Glass cards lift on hover: translateY(-2px) with a slight box-shadow increase
- Transition duration: 200ms ease
- Pure CSS — add to the existing `.glass` class in index.css
- No hover effect on mobile (use `@media (hover: hover)`)

### 1.4 Temperature Pulse

- The main hero temperature has a very slow opacity oscillation: 0.95 to 1.0 on a 4-second infinite loop
- CSS keyframe animation on the temperature element in Hero.tsx
- Barely perceptible — "breathing" not "blinking"

### 1.5 Weather Emoji Idle Animations

- The condition emoji in the Hero section gets a CSS keyframe animation based on condition:
  - Sun/clear: slow rotation (360deg over 20s)
  - Rain: gentle vertical bob (2px up/down over 2s)
  - Snow: slow horizontal drift (3px left/right over 3s)
  - Cloud: slow float (5px horizontal drift over 6s)
  - Thunder: occasional subtle shake (4-second keyframe cycle: shake fires from 0%-5% of the animation, idle for the remaining 95%. Not continuous — brief burst then still.)
  - Fog: slow fade pulse (opacity 0.7 to 1.0 over 3s)
- Pure CSS, no JS. Class applied based on condition string.

---

## 2. Ambient Weather Sounds

### 2.1 Sound Mapping

| Condition     | Time  | Sound                        |
|---------------|-------|------------------------------|
| Clear         | Day   | Soft wind with distant birds |
| Clear         | Night | Crickets, gentle wind        |
| Rain          | Any   | Rain patter                  |
| Thunderstorm  | Any   | Rain + distant thunder       |
| Snow          | Any   | Muffled quiet wind           |
| Cloudy        | Any   | Light breeze                 |
| Fog           | Any   | Low ambient drone            |

### 2.2 Audio Files

- Format: MP3, each file under 500KB for fast loading
- Source: Public domain / CC0 licensed ambient sounds
- Stored in `public/sounds/` directory
- Files: `clear-day.mp3`, `clear-night.mp3`, `rain.mp3`, `thunder.mp3`, `snow.mp3`, `cloudy.mp3`, `fog.mp3`

### 2.3 Controls & Behavior

- Speaker icon button in the Header, next to the theme toggle
- Click toggles mute/unmute
- Mute state persisted in localStorage (`weather-sound-muted`, defaults to `true` — muted)
- Sound only plays when user explicitly unmutes
- Volume: 20-30% (background texture, not a soundtrack)
- Crossfade between sounds over ~1.5s when weather condition or city changes. The crossfade triggers when new weather data arrives (not on city input change), so the audio always matches the actual fetched condition.
- Audio lazy-loaded — not fetched until user unmutes for the first time

### 2.4 Implementation

- `useAmbientSound` hook manages audio playback, crossfading, and mute state
- Takes `condition`, `isNight`, and `muted` as inputs
- Uses two `Audio` elements for crossfading (fade one out while fading the other in)
- On initial load or first unmute, skip the crossfade and simply fade the new track in from silence over 500ms
- Once loaded, audio elements remain in memory for the session. Muting pauses playback but does not discard the loaded audio.
- Hook handles cleanup (pause/dispose) on unmount
- `soundMuted` and `toggleSound` added to WeatherContext

---

## 3. Hourly Forecast Ribbon

### 3.1 Data

- OWM 5-day API already returns 3-hour interval forecasts (40 items)
- Filter to the next 24 hours (8 items) from the raw forecast data
- No additional API calls needed
- Data extracted in `useWeather.ts` alongside the existing `processForecast`

### 3.2 Display

- The first item uses current weather data (already fetched via `current`) as the "Now" entry, then the next 7 forecast slots follow it. This avoids labeling a future forecast as "Now."
- Each item shows:
  - Time label: "Now" for the first item, then "3 PM", "6 PM", etc.
  - Weather condition emoji (same mapping as Forecast.tsx)
  - Temperature (converted with current unit)
- First item ("Now") visually highlighted with slightly brighter text/opacity

### 3.3 Layout

- Glass card container matching existing style
- Horizontal scroll with `overflow-x: auto` and hidden scrollbar (CSS `scrollbar-width: none` + `::-webkit-scrollbar { display: none }`)
- `scroll-snap-type: x mandatory` on the container, `scroll-snap-align: start` on each item
- Each item: fixed width (~60px), centered content, vertical stack
- Section label: "Hourly Forecast"
- Positioned between Hero and 5-day Forecast sections

### 3.4 Component

- New file: `src/components/HourlyForecast/HourlyForecast.tsx`
- Skeleton loading state matching existing patterns (animate-pulse)

---

## 4. Enhanced Particle Effects & Visuals

### 4.1 Aurora Borealis (Clear Nights Only)

- Slow-moving translucent green/purple color waves across the top 30% of the screen
- Implementation: 2-3 overlapping CSS gradient layers with slow animation (30-45s loop)
- Colors: `rgba(0, 255, 128, 0.04)` and `rgba(128, 0, 255, 0.03)` — very subtle
- Applied as an additional overlay div in Background.tsx, conditionally rendered when `condition === 'clear' && isNight`
- Pure CSS animation — no canvas overhead

### 4.2 Rain Splash Effect

- When a rain particle reaches the bottom ~5% of the screen, spawn a small splash
- Splash: a circle that expands from r=1 to r=4 while fading out over ~300ms
- Max 10 active splashes at a time (performance cap)
- Added to the ParticleEngine, only active when type is 'rain' or 'lightning'

### 4.3 Sun Lens Flare (Clear Days Only)

- Soft radial gradient glow in the upper-right area of the screen
- Slowly drifts position over a 20s loop (slight translateX/Y oscillation)
- Colors: warm gold/white, very low opacity (0.05-0.08)
- CSS-only: a positioned div with radial-gradient background and CSS animation
- Conditionally rendered when `condition === 'clear' && !isNight`

### 4.4 Smooth Weather Transitions

- When weather condition or city changes, the background gradient crossfades over ~1.5s
- Already partially implemented via `transition-all duration-1000` on the background div
- Extend duration to 1500ms
- Particle engine: fade out old particles (reduce opacity over 500ms), then configure new type and fade in
- Add an `opacity` transition to the canvas element

---

## 5. Final Touches

### 5.1 Shimmer Loading Skeletons

- Replace existing `animate-pulse` with a shimmer effect: a diagonal gradient that sweeps left-to-right
- CSS keyframe: `@keyframes shimmer` — a gradient of `transparent → rgba(255,255,255,0.05) → transparent` moving across the element
- Applied via a `.skeleton-shimmer` CSS class in index.css
- Update all existing skeleton divs to use this class

### 5.2 "Last Updated" Timestamp

- Small text below the Hero city/country line: "Updated just now" / "Updated 2 min ago" / "Updated 10 min ago"
- Ticks up in real-time using a `useElapsedTime` hook (updates every 30 seconds)
- Clickable — clicking triggers `refresh()` from WeatherContext
- Cursor: pointer, with a subtle hover underline
- Shows a small refresh icon (unicode ↻) next to the text

### 5.3 Pull-to-Refresh (Mobile)

- On touch devices, swiping down from the top triggers a refresh
- Shows a small spinner/arrow indicator during the pull gesture
- Implementation: `usePullToRefresh` hook using touch events (touchstart, touchmove, touchend)
- Threshold: 80px pull distance to trigger
- Only active when scrolled to top — checks `window.scrollY === 0`, not any nested scroll container. The hourly ribbon and map have their own scroll contexts and are not affected.
- Calls `refresh()` from WeatherContext

### 5.4 Time-of-Day Greeting

- Text above the city name in Hero.tsx:
  - 5am-12pm: "Good Morning"
  - 12pm-5pm: "Good Afternoon"
  - 5pm-9pm: "Good Evening"
  - 9pm-5am: "Tonight"
- Uses the weather location's local time (derived from OWM timezone offset), not the user's device time
- Styled with `section-label` class for consistency
- During loading (before weather data is available), the greeting is hidden. It renders only after weather data arrives and the timezone offset is known.
- Fades in with the scroll reveal animation

### 5.5 Smooth Page Load

- The app's root container starts at opacity 0 and transitions to opacity 1 over 400ms on mount
- CSS transition triggered by adding a class after mount via useEffect
- Prevents the jarring "pop in" on first load
- The root fade-in replaces per-element scroll reveal for above-the-fold elements (Hero, Header) on first load. Scroll reveal animations only apply to elements that start below the fold. This avoids a double-animation stutter where both the root fade and individual reveals fire simultaneously.

---

## Files Changed (Summary)

### New Files
- `src/components/HourlyForecast/HourlyForecast.tsx` — Hourly ribbon component
- `src/hooks/useScrollReveal.ts` — IntersectionObserver scroll animation hook
- `src/hooks/useAmbientSound.ts` — Audio playback and crossfade hook
- `src/hooks/useElapsedTime.ts` — "Updated X min ago" timer hook
- `src/hooks/usePullToRefresh.ts` — Mobile pull-to-refresh hook
- `src/components/CountUp/CountUp.tsx` — Animated number component
- `public/sounds/*.mp3` — 7 ambient sound files

### Modified Files
- `src/index.css` — Shimmer keyframes, glass hover, emoji animations, scroll-reveal classes
- `src/lib/particles.ts` — Rain splash effect, particle fade transitions
- `src/components/Background/Background.tsx` — Aurora overlay, lens flare, longer transition duration
- `src/components/Hero/Hero.tsx` — Greeting, temperature pulse, CountUp, last-updated, scroll reveal
- `src/components/Header/Header.tsx` — Sound toggle button
- `src/context/WeatherContext.tsx` — Sound muted state, hourly data
- `src/hooks/useWeather.ts` — Extract hourly forecast data
- `src/App.tsx` — Page fade-in, pull-to-refresh
- All widget/section components — Scroll reveal refs, CountUp usage
