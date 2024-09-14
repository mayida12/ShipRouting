'use client';

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Sidebar from './Sidebar'
import SearchBar from './SearchBar'

const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <p>Loading map...</p>
})

export default function ShipRoutingApp() {
  const [isNavOpen, setIsNavOpen] = useState(true)
  const [selectedRoute, setSelectedRoute] = useState<[number, number][] | null>(null)
  const [startPort, setStartPort] = useState<[number, number] | null>(null)
  const [endPort, setEndPort] = useState<[number, number] | null>(null)
  const [isSelectingLocation, setIsSelectingLocation] = useState<'start' | 'end' | null>(null)

  const handleLocationSelect = (location: [number, number]) => {
    if (isSelectingLocation === 'start') {
      setStartPort(location)
    } else if (isSelectingLocation === 'end') {
      setEndPort(location)
    }
    setIsSelectingLocation(null)
  }

  return (
    <div className="flex h-screen">
      <Sidebar
        isNavOpen={isNavOpen}
        setSelectedRoute={setSelectedRoute}
        startPort={startPort}
        endPort={endPort}
        setIsSelectingLocation={setIsSelectingLocation}
      />
      <main className="flex-1 relative">
        <button
          onClick={() => setIsNavOpen(!isNavOpen)}
          className="absolute top-4 left-4 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md"
        >
          {isNavOpen ? '←' : '→'}
        </button>
        {isSelectingLocation && (
          <SearchBar onLocationSelect={handleLocationSelect} />
        )}
        <MapComponent
          route={selectedRoute}
          startPort={startPort}
          endPort={endPort}
          isSelectingLocation={isSelectingLocation}
          onLocationSelect={handleLocationSelect}
        />
      </main>
    </div>
  )
}