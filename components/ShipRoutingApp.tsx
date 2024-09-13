'use client';

import { useState } from 'react'
import Sidebar from './Sidebar'
import MapComponent from './MapComponent'

export default function ShipRoutingApp() {
  const [isNavOpen, setIsNavOpen] = useState(true)
  const [selectedRoute, setSelectedRoute] = useState<[number, number][] | null>(null)
  const [showWeather, setShowWeather] = useState(false)

  return (
    <div className="flex h-screen">
      <Sidebar
        isNavOpen={isNavOpen}
        setSelectedRoute={setSelectedRoute}
        showWeather={showWeather}
        setShowWeather={setShowWeather}
      />
      <main className="flex-1 relative">
        <button
          onClick={() => setIsNavOpen(!isNavOpen)}
          className="absolute top-4 left-4 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md"
        >
          {isNavOpen ? '←' : '→'}
        </button>
        <MapComponent route={selectedRoute} showWeather={showWeather} />
      </main>
    </div>
  )
}
