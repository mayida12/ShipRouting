'use client';

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Sidebar from './Sidebar'
import SearchBar from './SearchBar'
import type { LeafletMapProps } from './LeafletMap'

const LeafletMap = dynamic<LeafletMapProps>(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => <p>Loading map...</p>
})

export default function ShipRoutingApp() {
  const [isNavOpen, setIsNavOpen] = useState(true)
  const [selectedRoute, setSelectedRoute] = useState<[number, number][] | null>(null)
  const [startPort, setStartPort] = useState<[number, number] | null>(null)
  const [endPort, setEndPort] = useState<[number, number] | null>(null)
  const [isSelectingLocation, setIsSelectingLocation] = useState<'start' | 'end' | null>(null)
  const [showWeather, setShowWeather] = useState(false)
  const [zoomToLocation, setZoomToLocation] = useState<[number, number] | null>(null)

  const handleLocationSelect = (location: [number, number]) => {
    if (isSelectingLocation === 'start') {
      setStartPort(location)
    } else if (isSelectingLocation === 'end') {
      setEndPort(location)
    }
    setZoomToLocation(location)
  }

  const handleSearch = async (query: string) => {
    // ... (keep existing search logic)
  }

  const handleConfirmLocation = useCallback(() => {
    setIsSelectingLocation(null)
    setZoomToLocation([20.5937, 78.9629]) // Default view coordinates
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoomToLocation(null)
  }, [])

  return (
    <div className="flex h-screen">
      <Sidebar
        isNavOpen={isNavOpen}
        setIsNavOpen={setIsNavOpen}
        setSelectedRoute={setSelectedRoute}
        startPort={startPort}
        endPort={endPort}
        setIsSelectingLocation={setIsSelectingLocation}
      />
      <main className="flex-1 relative">
        {isSelectingLocation && (
          <SearchBar
            onLocationSelect={handleLocationSelect}
            onSearch={handleSearch}
            onConfirmLocation={handleConfirmLocation}
          />
        )}
        <LeafletMap
          route={selectedRoute}
          showWeather={showWeather}
          startPort={startPort}
          endPort={endPort}
          isSelectingLocation={isSelectingLocation}
          onLocationSelect={handleLocationSelect}
          zoomToLocation={zoomToLocation}
        />
      </main>
    </div>
  )
}