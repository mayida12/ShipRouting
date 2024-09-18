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

const DEFAULT_CENTER: [number, number] = [20.5937, 78.9629]
const DEFAULT_ZOOM = 5

export default function ShipRoutingApp() {
  const [isNavOpen, setIsNavOpen] = useState(true)
  const [selectedRoute, setSelectedRoute] = useState<[number, number][] | null>(null)
  const [startPort, setStartPort] = useState<[number, number] | null>(null)
  const [endPort, setEndPort] = useState<[number, number] | null>(null)
  const [isSelectingLocation, setIsSelectingLocation] = useState<'start' | 'end' | null>(null)
  const [showWeather, setShowWeather] = useState(false)
  const [zoomToLocation, setZoomToLocation] = useState<[number, number] | null>(null)
  const [searchResults, setSearchResults] = useState<[number, number][]>([])

  const handleLocationSelect = (location: [number, number]) => {
    if (isSelectingLocation === 'start') {
      setStartPort(location)
    } else if (isSelectingLocation === 'end') {
      setEndPort(location)
    }
    setZoomToLocation(location)
  }

  const handleSearch = async (query: string) => {
    // Simulated search results (replace with actual API call)
    const results: [number, number][] = [
      [78.9629, 20.5937], // Example coordinates
      [77.2090, 28.6139],
      [72.8777, 19.0760],
    ]
    setSearchResults(results)
    if (results.length > 0) {
      setZoomToLocation(results[0])
    }
  }

  const handleConfirmLocation = useCallback(() => {
    setIsSelectingLocation(null)
    setZoomToLocation(DEFAULT_CENTER)
    setSearchResults([])
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
          searchResults={searchResults}
          defaultCenter={DEFAULT_CENTER}
          defaultZoom={DEFAULT_ZOOM}
        />
      </main>
    </div>
  )
}