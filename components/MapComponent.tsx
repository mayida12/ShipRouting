import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

interface MapComponentProps {
  route: [number, number][] | null
  showWeather: boolean
}

export default function MapComponent({ route, showWeather }: MapComponentProps) {
  useEffect(() => {
    // Fix for Leaflet icon issue
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/marker-icon-2x.png',
      iconUrl: '/marker-icon.png',
      shadowUrl: '/marker-shadow.png',
    })
  }, [])

  return (
    <div className="h-full w-full">
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {route && (
          <Polyline positions={route} color="emerald" />
        )}
        {route && route.map((position, index) => (
          <Marker key={index} position={position}>
            <Popup>
              Waypoint {index + 1}
            </Popup>
          </Marker>
        ))}
        {showWeather && (
          <TileLayer
            url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=91daf3fe2c055cd9201b0a6da9515ea6`}
            attribution='Weather data © OpenWeatherMap'
          />
        )}
      </MapContainer>
    </div>
  )
}
