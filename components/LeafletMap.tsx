import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet'
import { Anchor, Navigation } from 'lucide-react'

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
    // Custom icon setup
    const createCustomIcon = (svgString: string) => {
      return L.divIcon({
        className: 'custom-icon',
        html: `<div style="color: #10B981;">${svgString}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
      })
    }

    const startIcon = createCustomIcon('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>')
    const endIcon = createCustomIcon('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>')

    // Update markers if they exist
    if (mapRef.current) {
      const map = mapRef.current
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          if (startPort && layer.getLatLng().equals(L.latLng(startPort[1], startPort[0]))) {
            layer.setIcon(startIcon)
          } else if (endPort && layer.getLatLng().equals(L.latLng(endPort[1], endPort[0]))) {
            layer.setIcon(endIcon)
          }
        }
      })
    }
  }, [startPort, endPort])

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
        <Marker 
          position={[startPort[1], startPort[0]]} 
          icon={L.divIcon({
            className: 'custom-icon',
            html: `<div style="color: #10B981;"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 24],
          })}
        >
          <Popup>Start Port</Popup>
        </Marker>
      )}
      {endPort && (
        <Marker 
          position={[endPort[1], endPort[0]]} 
          icon={L.divIcon({
            className: 'custom-icon',
            html: `<div style="color: #10B981;"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 24],
          })}
        >
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