import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Ship, Anchor, Navigation, Calendar } from 'lucide-react'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { DateTimePicker } from "./ui/date-time-picker"
import { createOrGetSession, saveSessionData, getSessionData } from '../lib/session'

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
  const [departureDateTime, setDepartureDateTime] = useState<Date | undefined>(new Date())

  // Set specific dimensions for a cargo ship
  const shipDimensions = { length: 200, width: 32, draft: 13 }

  useEffect(() => {
    async function initSession() {
      const id = await createOrGetSession()
      setSessionId(id)
      const data = await getSessionData(id)
      if (data) {
        setShipType(data.shipType || '')
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
  }, [sessionId, shipType, startPort, endPort, departureDateTime])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!shipType) {
      alert("Please select a ship type")
      return
    }
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
            <SelectValue placeholder="Select Ship Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cargo">Cargo Ship</SelectItem>
            <SelectItem value="tanker">Tanker</SelectItem>
            <SelectItem value="passenger">Passenger Ship</SelectItem>
          </SelectContent>
        </Select>
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
          date={departureDateTime}
          setDate={(newDate) => setDepartureDateTime(newDate)}
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