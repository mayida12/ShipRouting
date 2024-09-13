import { useState } from 'react'
import { motion } from 'framer-motion'
import { Ship, Droplet, Waves, Clock, Anchor, Navigation } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Slider } from './ui/slider'

interface RouteFormProps {
  setSelectedRoute: (route: [number, number][]) => void
  isNavOpen: boolean
}

export default function RouteForm({ setSelectedRoute, isNavOpen }: RouteFormProps) {
  const [shipType, setShipType] = useState('')
  const [fuelEfficiency, setFuelEfficiency] = useState(50)
  const [safety, setSafety] = useState(50)
  const [time, setTime] = useState(50)
  const [startPort, setStartPort] = useState('')
  const [endPort, setEndPort] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate route calculation
    const newRoute: [number, number][] = [
      [20.5937, 78.9629],
      [22.3193, 80.1234],
      [24.8607, 82.5678],
    ]
    setSelectedRoute(newRoute)
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
        <Label htmlFor="fuelEfficiency" className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center">
          <Droplet className="mr-2" /> Fuel Efficiency
        </Label>
        <Slider
          id="fuelEfficiency"
          min={0}
          max={100}
          step={1}
          value={[fuelEfficiency]}
          onValueChange={(value) => setFuelEfficiency(value[0])}
          className="mt-2"
        />
        <span className="text-sm text-gray-500 dark:text-gray-400">{fuelEfficiency}%</span>
      </motion.div>
      <motion.div animate={{ opacity: isNavOpen ? 1 : 0 }}>
        <Label htmlFor="safety" className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center">
          <Waves className="mr-2" /> Safety
        </Label>
        <Slider
          id="safety"
          min={0}
          max={100}
          step={1}
          value={[safety]}
          onValueChange={(value) => setSafety(value[0])}
          className="mt-2"
        />
        <span className="text-sm text-gray-500 dark:text-gray-400">{safety}%</span>
      </motion.div>
      <motion.div animate={{ opacity: isNavOpen ? 1 : 0 }}>
        <Label htmlFor="time" className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center">
          <Clock className="mr-2" /> Time
        </Label>
        <Slider
          id="time"
          min={0}
          max={100}
          step={1}
          value={[time]}
          onValueChange={(value) => setTime(value[0])}
          className="mt-2"
        />
        <span className="text-sm text-gray-500 dark:text-gray-400">{time}%</span>
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
        <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
          Calculate Route
        </Button>
      </motion.div>
    </form>
  )
}
