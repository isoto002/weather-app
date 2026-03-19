import type {
  DayForecast,
  WeatherCondition,
  TemperatureUnit,
  OutfitSuggestion,
} from '../types/weather'

export function convertTemp(tempF: number, unit: TemperatureUnit): number {
  if (unit === 'F') return tempF
  return (tempF - 32) * (5 / 9)
}

export function formatTemp(temp: number, unit: TemperatureUnit): string {
  return `${Math.round(temp)}\u00B0${unit}`
}

export function getWeatherCondition(owmWeatherId: number): WeatherCondition {
  if (owmWeatherId >= 200 && owmWeatherId < 300) return 'thunderstorm'
  if (owmWeatherId >= 300 && owmWeatherId < 600) return 'rain'
  if (owmWeatherId >= 600 && owmWeatherId < 700) return 'snow'
  if (owmWeatherId >= 700 && owmWeatherId < 800) return 'fog'
  if (owmWeatherId === 800) return 'clear'
  if (owmWeatherId === 801 || owmWeatherId === 802) return 'partly-cloudy'
  return 'cloudy'
}

export function getOutfitSuggestion(
  tempF: number,
  condition: WeatherCondition
): OutfitSuggestion {
  const isRainy = condition === 'rain' || condition === 'thunderstorm'
  const isSnowy = condition === 'snow'

  if (tempF < 32) {
    return {
      items: ['heavy coat', 'gloves', 'scarf', ...(isSnowy ? ['snow boots'] : ['warm boots'])],
      icons: ['\uD83E\uDDE5', '\uD83E\uDDE4', '\uD83E\uDDE3', '\uD83E\uDD7E'],
      summary: 'Bundle up \u2014 it\'s freezing out there',
    }
  }
  if (tempF < 50) {
    return {
      items: ['jacket', ...(isRainy ? ['umbrella', 'rain boots'] : ['warm layers'])],
      icons: ['\uD83E\uDDE5', ...(isRainy ? ['\u2602\uFE0F', '\uD83E\uDD7E'] : ['\uD83E\uDDF6'])],
      summary: isRainy ? 'Grab a jacket and umbrella' : 'Layer up \u2014 it\'s chilly',
    }
  }
  if (tempF < 65) {
    return {
      items: ['light jacket', ...(isRainy ? ['umbrella'] : [])],
      icons: ['\uD83E\uDDE5', ...(isRainy ? ['\u2602\uFE0F'] : [])],
      summary: isRainy ? 'Light jacket and umbrella' : 'A light layer should do',
    }
  }
  if (tempF < 80) {
    return {
      items: ['t-shirt', ...(isRainy ? ['umbrella'] : ['sunglasses'])],
      icons: ['\uD83D\uDC55', ...(isRainy ? ['\u2602\uFE0F'] : ['\uD83D\uDD76\uFE0F'])],
      summary: isRainy ? 'Comfortable but bring an umbrella' : 'Perfect weather \u2014 enjoy it',
    }
  }
  return {
    items: ['shorts', 'sunglasses', 'sunscreen'],
    icons: ['\uD83E\uDE73', '\uD83D\uDD76\uFE0F', '\uD83E\uDDF4'],
    summary: 'Stay cool and wear sunscreen',
  }
}

export function getBestDay(forecast: DayForecast[]): DayForecast {
  if (forecast.length === 0) throw new Error('Forecast cannot be empty')

  const maxTemp = Math.max(...forecast.map((d) => d.tempHigh))
  const maxPop = Math.max(...forecast.map((d) => d.pop))
  const maxWind = Math.max(...forecast.map((d) => d.windSpeed))

  let bestScore = -Infinity
  let bestDay = forecast[0]

  for (const day of forecast) {
    const tempScore = maxTemp > 0 ? day.tempHigh / maxTemp : 0
    const popScore = maxPop > 0 ? 1 - day.pop / maxPop : 1
    const windScore = maxWind > 0 ? 1 - day.windSpeed / maxWind : 1
    const score = (tempScore + popScore + windScore) / 3

    if (score > bestScore) {
      bestScore = score
      bestDay = day
    }
  }

  return bestDay
}

export function getAqiLabel(aqi: number): { label: string; color: string } {
  const labels: Record<number, { label: string; color: string }> = {
    1: { label: 'Good', color: 'green' },
    2: { label: 'Fair', color: 'yellow' },
    3: { label: 'Moderate', color: 'orange' },
    4: { label: 'Poor', color: 'red' },
    5: { label: 'Very Poor', color: 'purple' },
  }
  return labels[aqi] ?? { label: 'Unknown', color: 'gray' }
}

export function getGoldenHour(
  sunriseUnix: number,
  sunsetUnix: number
): {
  morning: { start: number; end: number }
  evening: { start: number; end: number }
} {
  return {
    morning: {
      start: sunriseUnix,
      end: sunriseUnix + 30 * 60,
    },
    evening: {
      start: sunsetUnix - 30 * 60,
      end: sunsetUnix,
    },
  }
}
