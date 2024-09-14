import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Ship, Anchor, Navigation, Calendar } from 'lucide-react'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { DateTimePicker } from "./ui/date-time-picker"
import { createOrGetSession, saveSessionData, getSessionData } from '../lib/session'
import { Input } from './ui/input'

interface RouteFormProps {
  setSelectedRoute: (route: [number, number][]) => void
  isNavOpen: boolean
  startPort: [number, number] | null
  endPort: [number, number] | null
  setIsSelectingLocation: (type: 'start' | 'end' | null) => void
}

export default function RouteForm({ setSelectedRoute, isNavOpen, startPort, endPort, setIsSelectingLocation }: RouteFormProps) {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [shipType, setShipType] = useState('')
  const [shipDimensions, setShipDimensions] = useState({ length: 0, width: 0, draft: 0 })
  const [departureDateTime, setDepartureDateTime] = useState<Date | undefined>(new Date())

  useEffect(() => {
    async function initSession() {
      const id = await createOrGetSession()
      setSessionId(id)
      const data = await getSessionData(id)
      if (data) {
        setShipType(data.shipType || '')
        setShipDimensions(data.shipDimensions || { length: 0, width: 0, draft: 0 })
        setDepartureDateTime(data.departureDateTime ? new Date(data.departureDateTime) : new Date())
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
        departureDateTime: departureDateTime?.toISOString(),
      })
    }
  }, [sessionId, shipType, shipDimensions, startPort, endPort, departureDateTime])

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
          startPort,
          endPort,
          departureDateTime: departureDateTime?.toISOString(),
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
        <Button onClick={() => setIsSelectingLocation('start')} className="mt-2 w-full">
          {startPort ? `Selected: ${startPort[0].toFixed(2)}, ${startPort[1].toFixed(2)}` : 'Select on Map'}
        </Button>
      </motion.div>

      <motion.div animate={{ opacity: isNavOpen ? 1 : 0 }}>
        <Label htmlFor="endPort" className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center">
          <Navigation className="mr-2" /> End Port
        </Label>
        <Button onClick={() => setIsSelectingLocation('end')} className="mt-2 w-full">
          {endPort ? `Selected: ${endPort[0].toFixed(2)}, ${endPort[1].toFixed(2)}` : 'Select on Map'}
        </Button>
      </motion.div>

      <motion.div animate={{ opacity: isNavOpen ? 1 : 0 }}>
        <Label htmlFor="departureDateTime" className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center">
          <Calendar className="mr-2" /> Departure Date & Time
        </Label>
        <DateTimePicker
          selected={departureDateTime}
          onSelect={setDepartureDateTime}
          className="w-full mt-1"
        />
      </motion.div>

      <motion.div animate={{ opacity: isNavOpen ? 1 : 0 }}>
        <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
          Calculate Optimal Route
        </Button>
      </motion.div>
    </form>
  )
}