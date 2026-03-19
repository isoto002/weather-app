// --- OpenWeatherMap Current Weather API response ---
export interface OWMCurrentWeather {
  coord: { lon: number; lat: number }
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    humidity: number
  }
  wind: { speed: number; deg: number }
  clouds: { all: number }
  sys: { sunrise: number; sunset: number; country: string }
  name: string
  dt: number
}

// --- OpenWeatherMap 5-Day Forecast API response ---
export interface OWMForecastItem {
  dt: number
  main: {
    temp: number
    temp_min: number
    temp_max: number
    humidity: number
  }
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
  wind: { speed: number; deg: number }
  pop: number // probability of precipitation (0-1)
  dt_txt: string
}

export interface OWMForecastResponse {
  list: OWMForecastItem[]
  city: {
    name: string
    coord: { lat: number; lon: number }
    country: string
    sunrise: number
    sunset: number
  }
}

// --- OpenWeatherMap Geocoding API response ---
export interface OWMGeoResult {
  name: string
  lat: number
  lon: number
  country: string
  state?: string
}

// --- OpenWeatherMap Air Quality API response ---
export interface OWMAirQuality {
  list: Array<{
    main: { aqi: number } // 1-5 scale
    components: {
      pm2_5: number
      pm10: number
      no2: number
      o3: number
    }
  }>
}

// --- NWS Alerts API response ---
export interface NWSAlert {
  id: string
  properties: {
    event: string
    severity: 'Extreme' | 'Severe' | 'Moderate' | 'Minor' | 'Unknown'
    headline: string
    description: string
    instruction: string | null
    expires: string
  }
}

export interface NWSAlertsResponse {
  features: NWSAlert[]
}

// --- App-level types ---
export interface City {
  name: string
  lat: number
  lon: number
  country: string
  state?: string
}

export interface DayForecast {
  date: string
  dayName: string
  tempHigh: number
  tempLow: number
  condition: string
  conditionId: number
  icon: string
  pop: number
  windSpeed: number
}

export interface WeatherData {
  current: OWMCurrentWeather
  forecast: DayForecast[]
  airQuality: OWMAirQuality | null
  alerts: NWSAlert[]
}

export type TemperatureUnit = 'F' | 'C'
export type ThemeMode = 'dark' | 'light'

export type WeatherCondition =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'rain'
  | 'thunderstorm'
  | 'snow'
  | 'fog'

export interface OutfitSuggestion {
  items: string[]    // e.g., ['jacket', 'umbrella', 'boots']
  icons: string[]    // e.g., ['🧥', '☂️', '🥾']
  summary: string    // e.g., 'Bundle up and bring an umbrella'
}
