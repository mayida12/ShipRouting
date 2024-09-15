import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface MapComponentProps {
  route: [number, number][] | null
  startPort: [number, number] | null
  endPort: [number, number] | null
  isSelectingLocation: 'start' | 'end' | null
  onLocationSelect: (location: [number, number]) => void
  showWeather: boolean
  zoomToLocation: [number, number] | null
}

const LeafletMap = dynamic<MapComponentProps>(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => <p>Loading map...</p>
})

function MapEvents({ onLocationSelect }: { onLocationSelect: (location: [number, number]) => void }) {
  const map = useMapEvents({
    click(e) {
      onLocationSelect([e.latlng.lng, e.latlng.lat])
    },
  })

  return null
}

function ShipMarker({ position }: { position: [number, number] }) {
  const map = useMap()
  const markerRef = useRef<L.Marker>(null)
  const shipRef = useRef<THREE.Group>()

  useEffect(() => {
    if (!markerRef.current) return

    const loader = new GLTFLoader()
    loader.load('/ship_model.glb', (gltf) => {
      const ship = gltf.scene
      ship.scale.set(0.1, 0.1, 0.1)
      shipRef.current = ship

      const scene = new THREE.Scene()
      scene.add(ship)

      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
      camera.position.set(0, 5, 10)
      camera.lookAt(0, 0, 0)

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(50, 50)

      const animate = () => {
        requestAnimationFrame(animate)
        ship.rotation.y += 0.01
        renderer.render(scene, camera)
      }
      animate()

      const icon = L.divIcon({
        className: 'custom-icon',
        html: renderer.domElement,
      })

      if (markerRef.current) {
        markerRef.current.setIcon(icon)
      }
    })
  }, [])

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLatLng(L.latLng(position[1], position[0]))
    }
  }, [position])

  return <Marker position={[position[1], position[0]]} ref={markerRef} />
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  route, 
  startPort, 
  endPort, 
  isSelectingLocation, 
  onLocationSelect, 
  showWeather,
  zoomToLocation 
}) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className="h-full w-full">
      <LeafletMap
        route={route}
        startPort={startPort}
        endPort={endPort}
        isSelectingLocation={isSelectingLocation}
        onLocationSelect={onLocationSelect}
        showWeather={showWeather}
        zoomToLocation={zoomToLocation}
      />
    </div>
  )
}

export default MapComponent