import { useRef, useEffect } from 'react'
import { useWeatherContext } from '../../context/WeatherContext'
import { getWeatherCondition } from '../../lib/weather-utils'
import { getBackgroundConfig, buildGradientCSS } from '../../lib/weather-backgrounds'
import { ParticleEngine } from '../../lib/particles'

export function Background() {
  const { weatherData, theme } = useWeatherContext()
  const { current } = weatherData
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<ParticleEngine | null>(null)

  const condition = current
    ? getWeatherCondition(current.weather[0].id)
    : 'clear'

  const isNight = current
    ? current.dt > current.sys.sunset || current.dt < current.sys.sunrise
    : false

  const config = getBackgroundConfig(condition, isNight)

  // Adjust gradient for light mode — blend toward white for softer pastel backgrounds
  const gradient = theme === 'light'
    ? buildGradientCSS(config.gradient.map((c) => {
        return c.replace(/^#/, '')
          .match(/.{2}/g)!
          .map((hex) => {
            const v = parseInt(hex, 16)
            return Math.round(v + (255 - v) * 0.55).toString(16).padStart(2, '0')
          })
          .join('')
          .replace(/^/, '#')
      }))
    : buildGradientCSS(config.gradient)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const engine = new ParticleEngine(canvas)
    engineRef.current = engine
    engine.configure(config.particleType, config.particleCount, config.particleSpeed)
    engine.start()

    const handleResize = () => engine.resize()
    window.addEventListener('resize', handleResize)

    // Pause when tab not visible
    const handleVisibility = () => {
      if (document.hidden) {
        engine.stop()
      } else {
        engine.start()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      engine.destroy()
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [config.particleType, config.particleCount, config.particleSpeed])

  return (
    <div
      className="fixed inset-0 transition-all duration-1000"
      style={{ background: gradient }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />
    </div>
  )
}
