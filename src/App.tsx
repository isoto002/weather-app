import { Background } from './components/Background/Background'
import { Header } from './components/Header/Header'
import { Hero } from './components/Hero/Hero'
import { Forecast } from './components/Forecast/Forecast'
import { TempChart } from './components/TempChart/TempChart'

function App() {
  return (
    <div className="min-h-screen relative">
      <Background />
      <div className="relative z-10">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:glass focus:px-4 focus:py-2 focus:text-white">
          Skip to content
        </a>
        <Header />
        <main id="main-content" className="pb-16">
          <Hero />
          <div className="mt-6">
            <Forecast />
          </div>
          <TempChart />
        </main>
      </div>
    </div>
  )
}

export default App
