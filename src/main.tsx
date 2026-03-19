import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WeatherProvider } from './context/WeatherContext'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WeatherProvider>
      <App />
    </WeatherProvider>
  </StrictMode>,
)
