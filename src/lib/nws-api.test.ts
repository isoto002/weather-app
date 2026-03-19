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
