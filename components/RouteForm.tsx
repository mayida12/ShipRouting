import { useState } from 'react'
import { motion } from 'framer-motion'
import { Ship, Droplet, Waves, Clock, Anchor, Navigation, Calendar, Sliders } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { DatePicker } from "./ui/date-picker"

interface RouteFormProps {
  setSelectedRoute: (route: [number, number][]) => void
  isNavOpen: boolean
}

export default function RouteForm({ setSelectedRoute, isNavOpen }: RouteFormProps) {
  const [shipType, setShipType] = useState('')
  const [shipDimensions, setShipDimensions] = useState({ length: 0, width: 0, draft: 0 })
  const [optimizationPreference, setOptimizationPreference] = useState('fuel')
  const [startPort, setStartPort] = useState('')
  const [endPort, setEndPort] = useState('')
  const [departureDate, setDepartureDate] = useState<Date | undefined>(new Date())

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('https://gs://ship-routing-app.appspot.com/optimize_route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          shipType,
          shipDimensions,
          optimizationPreference,
          startPort,
          endPort,
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
          <Input
            type="number"
            placeholder="Length (m)"
            value={shipDimensions.length}
            onChange={(e) => setShipDimensions({ ...shipDimensions, length: Number(e.target.value) })}
          />
          <Input
            type="number"
            placeholder="Width (m)"
            value={shipDimensions.width}
            onChange={(e) => setShipDimensions({ ...shipDimensions, width: Number(e.target.value) })}
          />
          <Input
            type="number"
            placeholder="Draft (m)"
            value={shipDimensions.draft}
            onChange={(e) => setShipDimensions({ ...shipDimensions, draft: Number(e.target.value) })}
          />
        </div>
      </motion.div>

      <motion.div animate={{ opacity: isNavOpen ? 1 : 0 }}>
        <Label htmlFor="optimizationPreference" className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center">
          <Sliders className="mr-2" /> Optimization Preference
        </Label>
        <Select onValueChange={setOptimizationPreference} value={optimizationPreference}>
          <SelectTrigger id="optimizationPreference" className="w-full mt-1">
            <SelectValue placeholder="Select preference" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fuel">Fuel Efficiency</SelectItem>
            <SelectItem value="time">Travel Time</SelectItem>
            <SelectItem value="safety">Route Safety</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      <motion.div animate={{ opacity: isNavOpen ? 1 : 0 }}>
        <Label htmlFor="startPort" className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center">
          <Anchor className="mr-2" /> Start Port
        </Label>
        <Input
          id="startPort"
          value={startPort}
          onChange={(e) => setStartPort(e.target.value)}
          className="mt-1"
          placeholder="Enter start port"
        />
      </motion.div>

      <motion.div animate={{ opacity: isNavOpen ? 1 : 0 }}>
        <Label htmlFor="endPort" className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center">
          <Navigation className="mr-2" /> End Port
        </Label>
        <Input
          id="endPort"
          value={endPort}
          onChange={(e) => setEndPort(e.target.value)}
          className="mt-1"
          placeholder="Enter end port"
        />
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
    </form>
  )
}
