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
