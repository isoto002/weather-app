import { useState, useEffect } from 'react'
import { useWeatherContext } from './context/WeatherContext'
import { useAmbientSound } from './hooks/useAmbientSound'
import { getWeatherCondition } from './lib/weather-utils'
import { Background } from './components/Background/Background'
import { Header } from './components/Header/Header'
import { Hero } from './components/Hero/Hero'
import { AlertBanner } from './components/AlertBanner/AlertBanner'
import { Forecast } from './components/Forecast/Forecast'
import { TempChart } from './components/TempChart/TempChart'
import { WidgetGrid } from './components/WeatherWidgets/WidgetGrid'
import { BestDay } from './components/BestDay/BestDay'
import { CityComparison } from './components/CityComparison/CityComparison'
import { WeatherMap } from './components/WeatherMap/WeatherMap'
import { EmailSignup } from './components/EmailSignup/EmailSignup'
import { HourlyForecast } from './components/HourlyForecast/HourlyForecast'

function App() {
  const { theme, weatherData, soundMuted } = useWeatherContext()
  const { current } = weatherData

  const condition = current ? getWeatherCondition(current.weather[0].id) : null
  const isNight = current
    ? current.dt > current.sys.sunset || current.dt < current.sys.sunrise
    : false

  useAmbientSound(condition, isNight, soundMuted)

  const [pageVisible, setPageVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setPageVisible(true))
  }, [])

  return (
    <div className={`min-h-screen relative page-enter ${pageVisible ? 'page-visible' : ''}`} data-theme={theme}>
      <Background />
      <div className="relative z-10">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:glass focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main-content" className="pb-16">
          <Hero />
          <HourlyForecast />
          <AlertBanner />
          <div className="mt-6">
            <Forecast />
          </div>
          <TempChart />
          <WidgetGrid />
          <BestDay />
          <CityComparison />
          <WeatherMap />
          <EmailSignup />
        </main>
        <footer className="text-center py-6 text-white/20 text-xs">
          Weather data from OpenWeatherMap
        </footer>
      </div>
    </div>
  )
}

export default App
