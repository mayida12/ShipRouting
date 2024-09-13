import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download } from 'lucide-react'
import { Button } from './ui/button'

interface RouteInfoProps {
  isNavOpen: boolean
}

export default function RouteInfo({ isNavOpen }: RouteInfoProps) {
  const [fuelConsumption, setFuelConsumption] = useState(0)
  const [eta, setEta] = useState('')
  const [safetyAlerts, setSafetyAlerts] = useState<string[]>([])

  useEffect(() => {
    // Simulating data fetch or calculation
    setFuelConsumption(Math.random() * 1000 + 500)
    setEta(new Date(Date.now() + Math.random() * 5 * 24 * 60 * 60 * 1000).toLocaleString())
    setSafetyAlerts(['Storm warning near waypoint 2', 'High waves expected in region'])
  }, [])

  const handleExport = () => {
    const data = JSON.stringify({ fuelConsumption, eta, safetyAlerts })
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'route_data.json'
    a.click()
  }

  return (
    <motion.div animate={{ opacity: isNavOpen ? 1 : 0 }} className="mt-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Route Information</h2>
        <p>Fuel Consumption: {fuelConsumption.toFixed(2)} liters</p>
        <p>ETA: {eta}</p>
        <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mt-2 mb-1">Safety Alerts:</h3>
        <ul className="list-disc list-inside">
          {safetyAlerts.map((alert, index) => (
            <li key={index} className="text-red-500">{alert}</li>
          ))}
        </ul>
      </div>
      <Button onClick={handleExport} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center">
        <Download className="mr-2" /> Export Route Data
      </Button>
    </motion.div>
  )
}
