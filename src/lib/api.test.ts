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

  it('throws on API error', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 })
    await expect(fetchForecast(0, 0)).rejects.toThrow()
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

  it('throws on API error', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 })
    await expect(fetchAirQuality(0, 0)).rejects.toThrow()
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
