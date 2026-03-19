import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { useWeatherContext } from '../../context/WeatherContext'
import 'leaflet/dist/leaflet.css'

const API_KEY = import.meta.env.VITE_OWM_API_KEY

type MapLayer = 'precipitation' | 'temperature'

function MapUpdater({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView([lat, lon], map.getZoom())
  }, [map, lat, lon])
  return null
}

export function WeatherMap() {
  const { city } = useWeatherContext()
  const [layer, setLayer] = useState<MapLayer>('precipitation')

  if (!city) return null

  const layerUrl =
    layer === 'precipitation'
      ? `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`
      : `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`

  return (
    <section className="px-4 max-w-3xl mx-auto mt-4">
      <div className="glass p-4 overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <p className="section-label">
            Weather Map
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setLayer('precipitation')}
              aria-pressed={layer === 'precipitation'}
              className={`px-2 py-1 text-[10px] rounded-md transition-colors ${
                layer === 'precipitation'
                  ? 'bg-white/20 text-white'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              Rain
            </button>
            <button
              onClick={() => setLayer('temperature')}
              aria-pressed={layer === 'temperature'}
              className={`px-2 py-1 text-[10px] rounded-md transition-colors ${
                layer === 'temperature'
                  ? 'bg-white/20 text-white'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              Temp
            </button>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden h-[300px] lg:h-[400px]">
          <MapContainer
            center={[city.lat, city.lon]}
            zoom={8}
            className="h-full w-full"
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <TileLayer
              url={layerUrl}
              opacity={0.6}
            />
            <MapUpdater lat={city.lat} lon={city.lon} />
          </MapContainer>
        </div>
      </div>
    </section>
  )
}
