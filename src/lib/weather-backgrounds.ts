import type { WeatherCondition } from '../types/weather'

export interface BackgroundConfig {
  gradient: string[]
  particleType: 'rain' | 'snow' | 'clouds' | 'sun' | 'lightning' | 'fog' | 'stars' | 'none'
  particleCount: number
  particleSpeed: number
}

const dayConfigs: Record<WeatherCondition, BackgroundConfig> = {
  clear: {
    gradient: ['#4a90d9', '#87CEEB', '#B0E0E6'],
    particleType: 'sun',
    particleCount: 15,
    particleSpeed: 0.3,
  },
  'partly-cloudy': {
    gradient: ['#5a7fa5', '#8aacc8', '#b0c4d8'],
    particleType: 'clouds',
    particleCount: 8,
    particleSpeed: 0.5,
  },
  cloudy: {
    gradient: ['#5a6a7a', '#7a8a9a', '#9aa0a8'],
    particleType: 'clouds',
    particleCount: 15,
    particleSpeed: 0.3,
  },
  rain: {
    gradient: ['#1a1a2e', '#2d3a5c', '#4a5a7a'],
    particleType: 'rain',
    particleCount: 60,
    particleSpeed: 8,
  },
  thunderstorm: {
    gradient: ['#0d0d1a', '#1a1a2e', '#2d2d4a'],
    particleType: 'lightning',
    particleCount: 60,
    particleSpeed: 10,
  },
  snow: {
    gradient: ['#0f2027', '#203a43', '#2c5364'],
    particleType: 'snow',
    particleCount: 40,
    particleSpeed: 1.5,
  },
  fog: {
    gradient: ['#8a9aa8', '#a0b0b8', '#c0c8d0'],
    particleType: 'fog',
    particleCount: 10,
    particleSpeed: 0.2,
  },
}

const nightConfigs: Record<WeatherCondition, BackgroundConfig> = {
  clear: {
    gradient: ['#0a0a1a', '#0f0f2e', '#1a1a3a'],
    particleType: 'stars',
    particleCount: 50,
    particleSpeed: 0.1,
  },
  'partly-cloudy': {
    gradient: ['#0d0d20', '#151530', '#1d1d3a'],
    particleType: 'stars',
    particleCount: 30,
    particleSpeed: 0.1,
  },
  cloudy: {
    gradient: ['#151520', '#1d1d2a', '#252535'],
    particleType: 'clouds',
    particleCount: 10,
    particleSpeed: 0.2,
  },
  rain: {
    gradient: ['#0a0a15', '#151525', '#1d1d35'],
    particleType: 'rain',
    particleCount: 60,
    particleSpeed: 8,
  },
  thunderstorm: {
    gradient: ['#050510', '#0a0a1a', '#151525'],
    particleType: 'lightning',
    particleCount: 60,
    particleSpeed: 10,
  },
  snow: {
    gradient: ['#0a1520', '#152030', '#1d2a3a'],
    particleType: 'snow',
    particleCount: 40,
    particleSpeed: 1.2,
  },
  fog: {
    gradient: ['#1a1a25', '#252530', '#30303a'],
    particleType: 'fog',
    particleCount: 10,
    particleSpeed: 0.15,
  },
}

export function getBackgroundConfig(
  condition: WeatherCondition,
  isNight: boolean
): BackgroundConfig {
  return isNight ? nightConfigs[condition] : dayConfigs[condition]
}

export function buildGradientCSS(colors: string[]): string {
  return `linear-gradient(180deg, ${colors.join(', ')})`
}
