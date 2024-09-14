import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Ship, Anchor, Navigation, Calendar } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { DatePicker } from "./ui/date-picker"
import dynamic from 'next/dynamic'
import { createOrGetSession, saveSessionData, getSessionData } from '../lib/session'

const MapSelector = dynamic(() => import('./MapSelector'), { ssr: false })

interface RouteFormProps {
  setSelectedRoute: (route: [number, number][]) => void
  isNavOpen: boolean
}

export default function RouteForm({ setSelectedRoute, isNavOpen }: RouteFormProps) {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [shipType, setShipType] = useState('')
  const [shipDimensions, setShipDimensions] = useState({ length: 0, width: 0, draft: 0 })
  const [startPort, setStartPort] = useState({ name: '', coordinates: [0, 0] as [number, number] })
  const [endPort, setEndPort] = useState({ name: '', coordinates: [0, 0] as [number, number] })
  const [departureDate, setDepartureDate] = useState<Date | undefined>(new Date())
  const [isSelectingStart, setIsSelectingStart] = useState(false)
  const [isSelectingEnd, setIsSelectingEnd] = useState(false)

  useEffect(() => {
    async function initSession() {
      const id = await createOrGetSession()
      setSessionId(id)
      const data = await getSessionData(id)
      if (data) {
        setShipType(data.shipType || '')
        setShipDimensions(data.shipDimensions || { length: 0, width: 0, draft: 0 })
        setStartPort(data.startPort || { name: '', coordinates: [0, 0] })
        setEndPort(data.endPort || { name: '', coordinates: [0, 0] })
        setDepartureDate(data.departureDate ? new Date(data.departureDate) : new Date())
      }
    }
    initSession()
  }, [])

  useEffect(() => {
    if (sessionId) {
      saveSessionData(sessionId, {
        shipType,
        shipDimensions,
        startPort,
        endPort,
        departureDate: departureDate?.toISOString(),
      })
    }
  }, [sessionId, shipType, shipDimensions, startPort, endPort, departureDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/optimize_route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          shipType,
          shipDimensions,
          startPort: startPort.coordinates,
          endPort: endPort.coordinates,
          departureDate: departureDate?.toISOString(),
        })
      });
      const result = await response.json();
      setSelectedRoute(result.optimal_path);
    } catch (error) {
      console.error('Error calculating optimal route:', error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <motion.div animate={{ opacity: isNavOpen ? 1 : 0 }}>
        <Label htmlFor="shipType" className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center">
          <Ship className="mr-2" /> Ship Type
        </Label>
        <Select onValueChange={setShipType} value={shipType}>
          <SelectTrigger id="shipType" className="w-full mt-1">
            <SelectValue placeholder="Select ship type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cargo">Cargo Ship</SelectItem>
            <SelectItem value="tanker">Tanker</SelectItem>
            <SelectItem value="passenger">Passenger Ship</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      <motion.div animate={{ opacity: isNavOpen ? 1 : 0 }}>
        <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300">Ship Dimensions</Label>
        <div className="grid grid-cols-3 gap-2 mt-1">
          <div>
            <Label htmlFor="shipLength" className="text-sm">Length (m)</Label>
            <Input
              id="shipLength"
              type="number"
              value={shipDimensions.length}
              onChange={(e) => setShipDimensions({ ...shipDimensions, length: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="shipWidth" className="text-sm">Width (m)</Label>
            <Input
              id="shipWidth"
              type="number"
              value={shipDimensions.width}
              onChange={(e) => setShipDimensions({ ...shipDimensions, width: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="shipDraft" className="text-sm">Draft (m)</Label>
            <Input
              id="shipDraft"
              type="number"
              value={shipDimensions.draft}
              onChange={(e) => setShipDimensions({ ...shipDimensions, draft: Number(e.target.value) })}
            />
          </div>
        </div>
      </motion.div>

      <motion.div animate={{ opacity: isNavOpen ? 1 : 0 }}>
        <Label htmlFor="startPort" className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center">
          <Anchor className="mr-2" /> Start Port
        </Label>
        <Input
          id="startPort"
          value={startPort.name}
          onChange={(e) => setStartPort({ ...startPort, name: e.target.value })}
          className="mt-1"
          placeholder="Enter start port name"
        />
        <Button onClick={() => setIsSelectingStart(true)} className="mt-2">
          Select on Map
        </Button>
      </motion.div>

      <motion.div animate={{ opacity: isNavOpen ? 1 : 0 }}>
        <Label htmlFor="endPort" className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center">
          <Navigation className="mr-2" /> End Port
        </Label>
        <Input
          id="endPort"
          value={endPort.name}
          onChange={(e) => setEndPort({ ...endPort, name: e.target.value })}
          className="mt-1"
          placeholder="Enter end port name"
        />
        <Button onClick={() => setIsSelectingEnd(true)} className="mt-2">
          Select on Map
        </Button>
      </motion.div>

      <motion.div animate={{ opacity: isNavOpen ? 1 : 0 }}>
        <Label htmlFor="departureDate" className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center">
          <Calendar className="mr-2" /> Departure Date
        </Label>
        <DatePicker
          selected={departureDate}
          onSelect={setDepartureDate}
          className="w-full mt-1"
        />
      </motion.div>

      <motion.div animate={{ opacity: isNavOpen ? 1 : 0 }}>
        <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
          Calculate Optimal Route
        </Button>
      </motion.div>

      {(isSelectingStart || isSelectingEnd) && (
        <MapSelector
          isOpen={isSelectingStart || isSelectingEnd}
          onClose={() => {
            setIsSelectingStart(false)
            setIsSelectingEnd(false)
          }}
          onSelect={(coordinates) => {
            if (isSelectingStart) {
              setStartPort({ ...startPort, coordinates })
            } else {
              setEndPort({ ...endPort, coordinates })
            }
          }}
        />
      )}
    </form>
  )
}
