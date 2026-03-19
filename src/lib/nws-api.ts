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
