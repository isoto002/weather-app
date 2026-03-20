import { render } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import App from './App'
import { WeatherProvider } from './context/WeatherContext'

// Mock IntersectionObserver for useScrollReveal
class MockIntersectionObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}
global.IntersectionObserver = MockIntersectionObserver as any

HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  createRadialGradient: vi.fn(() => ({
    addColorStop: vi.fn(),
  })),
  globalAlpha: 1,
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 1,
})) as any

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
