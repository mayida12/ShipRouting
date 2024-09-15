'use client';

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Sidebar from './Sidebar'
import SearchBar from './SearchBar'
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from '../lib/firebase'

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
    try {
      const functions = getFunctions(app);
      const search = httpsCallable(functions, 'search');
      const result = await search({ query });
      const data = result.data as { coordinates: [number, number] };
      if (data.coordinates) {
        setZoomToLocation(data.coordinates);
      }
    } catch (error) {
      console.error('Error searching for location:', error);
    }
  }

  const handleConfirmLocation = () => {
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
          className="fixed bottom-6 left-6 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md"
        >
          {isNavOpen ? '←' : '→'}
        </button>
        {isSelectingLocation && (
          <SearchBar
            onLocationSelect={handleLocationSelect}
            onSearch={handleSearch}
            onConfirmLocation={handleConfirmLocation}
          />
        )}
        <MapComponent
          route={selectedRoute}
          startPort={startPort}
          endPort={endPort}
          isSelectingLocation={isSelectingLocation}
          onLocationSelect={handleLocationSelect}
          showWeather={showWeather}
          zoomToLocation={zoomToLocation}
        />
      </main>
    </div>
  )
}