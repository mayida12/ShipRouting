import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Ship, Anchor, Navigation, Calendar } from 'lucide-react'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { DateTimePicker } from "./ui/date-time-picker"
import { createOrGetSession, saveSessionData, getSessionData } from '../lib/session'
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from '../lib/firebase'
import { addDays, format } from 'date-fns'

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
  const [departureDate, setDepartureDate] = useState<Date | undefined>(new Date(2024, 7, 25))

  // Wrap shipDimensions in useMemo
  const shipDimensions = useMemo(() => ({ length: 200, width: 32, draft: 13 }), [])

  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({})

  const isFormValid = () => {
    return shipType && startPort && endPort && departureDate
  }

  useEffect(() => {
    async function initSession() {
      const id = await createOrGetSession()
      setSessionId(id)
      const data = await getSessionData(id)
      if (data) {
        setShipType(data.shipType || '')
        setDepartureDate(data.departureDateTime ? new Date(data.departureDateTime) : new Date())
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
        departureDateTime: departureDate?.toISOString(),
      })
    }
  }, [sessionId, shipType, startPort, endPort, departureDate, shipDimensions])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid()) {
      const errors: {[key: string]: string} = {}
      if (!shipType) errors.shipType = "Ship type is required"
      if (!startPort) errors.startPort = "Start port is required"
      if (!endPort) errors.endPort = "End port is required"
      if (!departureDate) errors.departureDateTime = "Departure date and time is required"
      setFormErrors(errors)
      return
    }

    try {
      const functions = getFunctions(app);
      const optimizeRoute = httpsCallable(functions, 'optimize_route');
      const result = await optimizeRoute({
        shipType,
        shipDimensions,
        startPort,
        endPort,
        departureDateTime: departureDate ? departureDate.toISOString() : null,
      });
      const data = result.data as { optimal_path: [number, number][] };
      setSelectedRoute(data.optimal_path);
    } catch (error) {
      console.error('Error optimizing route:', error);
      alert('Error optimizing route. Please try again.');
    }
  }

  const minDate = new Date('2024-08-25')
  const maxDate = new Date('2024-08-29')

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
          {startPort ? `Selected: ${startPort[0].toFixed(4)}, ${startPort[1].toFixed(4)}` : 'Select on Map'}
        </Button>
      </motion.div>

      <motion.div animate={{ opacity: isNavOpen ? 1 : 0 }}>
        <Label htmlFor="endPort" className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center">
          <Navigation className="mr-2" /> End Port
        </Label>
        <Button onClick={() => setIsSelectingLocation('end')} className="mt-2 w-full">
          {endPort ? `Selected: ${endPort[0].toFixed(4)}, ${endPort[1].toFixed(4)}` : 'Select on Map'}
        </Button>
      </motion.div>

      <motion.div animate={{ opacity: isNavOpen ? 1 : 0 }}>
        <Label htmlFor="departureDate" className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center">
          <Calendar className="mr-2" /> Departure Date
        </Label>
        <DateTimePicker
          date={departureDate}
          setDate={(newDate) => setDepartureDate(newDate)}
        />
      </motion.div>

      <motion.div animate={{ opacity: isNavOpen ? 1 : 0 }}>
        <Button 
          type="submit" 
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
          disabled={!isFormValid()}
        >
          Calculate Optimal Route
        </Button>
      </motion.div>

      {Object.entries(formErrors).map(([field, error]) => (
        <p key={field} className="text-red-500 text-sm">{error}</p>
      ))}
    </form>
  )
}