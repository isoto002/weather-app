import { type ReactNode } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { WeatherProvider } from './context/WeatherContext'
import { vi } from 'vitest'

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

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
