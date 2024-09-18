import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Ship, Anchor, Navigation, Calendar } from 'lucide-react'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { DateTimePicker } from "./ui/date-time-picker"
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from '../lib/firebase'
import { format } from 'date-fns'

interface RouteFormProps {
  setSelectedRoute: (route: [number, number][]) => void
  isNavOpen: boolean
  startPort: [number, number] | null
  endPort: [number, number] | null
  setIsSelectingLocation: (type: 'start' | 'end' | null) => void
}

export default function RouteForm({ setSelectedRoute, isNavOpen, startPort, endPort, setIsSelectingLocation }: RouteFormProps) {
  const [shipType, setShipType] = useState('')
  const [departureDate, setDepartureDate] = useState<Date | undefined>(new Date(2024, 7, 25))
  const [isLoading, setIsLoading] = useState(false)
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({})

  const isFormValid = () => {
    return shipType && startPort && endPort && departureDate
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid()) {
      const errors: {[key: string]: string} = {}
      if (!shipType) errors.shipType = "Ship type is required"
      if (!startPort) errors.startPort = "Start port is required"
      if (!endPort) errors.endPort = "End port is required"
      if (!departureDate) errors.departureDate = "Departure date is required"
      setFormErrors(errors)
      return
    }

    setIsLoading(true)
    try {
      const functions = getFunctions(app);
      const optimizeRoute = httpsCallable(functions, 'api-optimize_route');
      const result = await optimizeRoute({
        shipType,
        startPort,
        endPort,
        departureDate: departureDate ? format(departureDate, 'yyyy-MM-dd') : undefined,
      });
      const data = result.data as { optimized_route: [number, number][], distance: number, num_steps: number, avg_step_distance: number };
      setSelectedRoute(data.optimized_route);
    } catch (error: any) {
      console.error('Error optimizing route:', error.message, error.details);
      alert(`Error optimizing route: ${error.message}. Please try again.`);
    } finally {
      setIsLoading(false)
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
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? 'Optimizing...' : 'Calculate Optimal Route'}
        </Button>
      </motion.div>

      {Object.entries(formErrors).map(([field, error]) => (
        <p key={field} className="text-red-500 text-sm">{error}</p>
      ))}
    </form>
  )
}