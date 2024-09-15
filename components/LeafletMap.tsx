import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet'

interface LeafletMapProps {
  route: [number, number][] | null
  showWeather: boolean
  startPort: [number, number] | null
  endPort: [number, number] | null
  isSelectingLocation: 'start' | 'end' | null
  onLocationSelect: (location: [number, number]) => void
  zoomToLocation: [number, number] | null
}

function ZoomHandler({ zoomToLocation }: { zoomToLocation: [number, number] | null }) {
  const map = useMap()

  useEffect(() => {
    if (zoomToLocation) {
      map.setView([zoomToLocation[1], zoomToLocation[0]], 13)
    }
  }, [zoomToLocation, map])

  return null
}

function MapEventHandler({ isSelectingLocation, onLocationSelect }: { isSelectingLocation: 'start' | 'end' | null, onLocationSelect: (location: [number, number]) => void }) {
  useMapEvents({
    click: (e) => {
      if (isSelectingLocation) {
        onLocationSelect([e.latlng.lng, e.latlng.lat])
      }
    },
  })
  return null
}

const LeafletMap: React.FC<LeafletMapProps> = ({ 
  route, 
  showWeather, 
  startPort, 
  endPort, 
  isSelectingLocation, 
  onLocationSelect,
  zoomToLocation
}) => {
  const mapRef = useRef<L.Map>(null)

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
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
      ref={mapRef}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {route && (
        <Polyline positions={route} color="emerald" />
      )}
      {startPort && (
        <Marker position={[startPort[1], startPort[0]]}>
          <Popup>Start Port</Popup>
        </Marker>
      )}
      {endPort && (
        <Marker position={[endPort[1], endPort[0]]}>
          <Popup>End Port</Popup>
        </Marker>
      )}
      {showWeather && (
        <TileLayer
          url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=91daf3fe2c055cd9201b0a6da9515ea6`}
          attribution='Weather data © OpenWeatherMap'
        />
      )}
      <ZoomHandler zoomToLocation={zoomToLocation} />
      <MapEventHandler isSelectingLocation={isSelectingLocation} onLocationSelect={onLocationSelect} />
    </MapContainer>
  )
}

export default LeafletMap