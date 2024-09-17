'use client';

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Sidebar from './Sidebar'
import SearchBar from './SearchBar'
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from '../lib/firebase'
import { getSessionData, deleteSession } from '../lib/session'

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
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    const loadSession = async () => {
      const id = localStorage.getItem('sessionId')
      if (id) {
        setSessionId(id)
        const data = await getSessionData(id)
        if (data) {
          setStartPort(data.startPort || null)
          setEndPort(data.endPort || null)
          setSelectedRoute(data.optimizedRoute || null)
        }
      }
    }
    loadSession()
  }, [])

  useEffect(() => {
    return () => {
      if (sessionId) {
        deleteSession(sessionId)
      }
    }
  }, [sessionId])

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