import { describe, it, expect } from 'vitest'
import {
  convertTemp,
  formatTemp,
  getOutfitSuggestion,
  getBestDay,
  getWeatherCondition,
  getAqiLabel,
  getGoldenHour,
} from './weather-utils'
import type { DayForecast } from '../types/weather'

describe('convertTemp', () => {
  it('converts F to C', () => {
    expect(convertTemp(32, 'C')).toBe(0)
    expect(convertTemp(212, 'C')).toBe(100)
    expect(convertTemp(72, 'C')).toBeCloseTo(22.2, 1)
  })

  it('returns F unchanged when unit is F', () => {
    expect(convertTemp(72, 'F')).toBe(72)
  })
})

describe('formatTemp', () => {
  it('formats temperature with degree symbol and unit', () => {
    expect(formatTemp(72, 'F')).toBe('72\u00B0F')
    expect(formatTemp(22, 'C')).toBe('22\u00B0C')
  })

  it('rounds to nearest integer', () => {
    expect(formatTemp(72.6, 'F')).toBe('73\u00B0F')
  })
})

describe('getWeatherCondition', () => {
  it('maps OWM weather IDs to app conditions', () => {
    expect(getWeatherCondition(800)).toBe('clear')
    expect(getWeatherCondition(801)).toBe('partly-cloudy')
    expect(getWeatherCondition(804)).toBe('cloudy')
    expect(getWeatherCondition(500)).toBe('rain')
    expect(getWeatherCondition(200)).toBe('thunderstorm')
    expect(getWeatherCondition(600)).toBe('snow')
    expect(getWeatherCondition(741)).toBe('fog')
  })
})

describe('getOutfitSuggestion', () => {
  it('suggests warm clothes for cold + rain', () => {
    const result = getOutfitSuggestion(40, 'rain')
    expect(result.items).toContain('jacket')
    expect(result.items).toContain('umbrella')
  })

  it('suggests light clothes for hot + clear', () => {
    const result = getOutfitSuggestion(85, 'clear')
    expect(result.items).toContain('sunglasses')
  })
})

describe('getBestDay', () => {
  it('picks the day with highest score (high temp, low precip, low wind)', () => {
    const forecast: DayForecast[] = [
      { date: '2026-03-19', dayName: 'Thu', tempHigh: 70, tempLow: 55, condition: 'rain', conditionId: 500, icon: '10d', pop: 0.8, windSpeed: 15 },
      { date: '2026-03-20', dayName: 'Fri', tempHigh: 75, tempLow: 60, condition: 'clear', conditionId: 800, icon: '01d', pop: 0.1, windSpeed: 5 },
      { date: '2026-03-21', dayName: 'Sat', tempHigh: 65, tempLow: 50, condition: 'cloudy', conditionId: 804, icon: '04d', pop: 0.3, windSpeed: 10 },
    ]
    const best = getBestDay(forecast)
    expect(best.dayName).toBe('Fri')
  })

  it('returns first day if all equal', () => {
    const forecast: DayForecast[] = [
      { date: '2026-03-19', dayName: 'Thu', tempHigh: 70, tempLow: 55, condition: 'clear', conditionId: 800, icon: '01d', pop: 0, windSpeed: 5 },
    ]
    const best = getBestDay(forecast)
    expect(best.dayName).toBe('Thu')
  })
})

describe('getAqiLabel', () => {
  it('returns correct label and color for AQI levels', () => {
    expect(getAqiLabel(1)).toEqual({ label: 'Good', color: 'green' })
    expect(getAqiLabel(2)).toEqual({ label: 'Fair', color: 'yellow' })
    expect(getAqiLabel(3)).toEqual({ label: 'Moderate', color: 'orange' })
    expect(getAqiLabel(4)).toEqual({ label: 'Poor', color: 'red' })
    expect(getAqiLabel(5)).toEqual({ label: 'Very Poor', color: 'purple' })
  })
})

describe('getGoldenHour', () => {
  it('returns morning and evening golden hour times', () => {
    const sunrise = 1710835200 // unix timestamp
    const sunset = 1710878400
    const result = getGoldenHour(sunrise, sunset)
    expect(result.morning.start).toBe(sunrise)
    expect(result.morning.end).toBe(sunrise + 30 * 60)
    expect(result.evening.start).toBe(sunset - 30 * 60)
    expect(result.evening.end).toBe(sunset)
  })
})
