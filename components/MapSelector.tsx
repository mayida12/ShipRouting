import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import { LatLng } from 'leaflet'
import { Button } from './ui/button'

interface MapSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (coordinates: [number, number]) => void
}

function MapEvents({ onSelect }: { onSelect: (coordinates: [number, number]) => void }) {
  const [position, setPosition] = useState<LatLng | null>(null)
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng)
    },
  })

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom())
    }
  }, [position, map])

  return position === null ? null : (
    <Marker
      position={position}
      interactive={false}
    />
  )
}

export default function MapSelector({ isOpen, onClose, onSelect }: MapSelectorProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg w-3/4 h-3/4">
        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '90%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapEvents onSelect={onSelect} />
          <ConfirmButton onSelect={onSelect} onClose={onClose} />
        </MapContainer>
      </div>
    </div>
  )
}

function ConfirmButton({ onSelect, onClose }: { onSelect: (coordinates: [number, number]) => void, onClose: () => void }) {
  const map = useMap()

  return (
    <div className="leaflet-bottom leaflet-right">
      <div className="leaflet-control leaflet-bar">
        <Button onClick={() => {
          const center = map.getCenter()
          onSelect([center.lng, center.lat])
          onClose()
        }} className="bg-emerald-500 hover:bg-emerald-600 text-white">
          Confirm Selection
        </Button>
      </div>
    </div>
  )
}