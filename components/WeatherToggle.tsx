import { motion } from 'framer-motion'
import { Cloud } from 'lucide-react'
import { Label } from './ui/label'
import { Switch } from './ui/switch'

interface WeatherToggleProps {
  showWeather: boolean
  setShowWeather: (show: boolean) => void
  isNavOpen: boolean
}

export default function WeatherToggle({ showWeather, setShowWeather, isNavOpen }: WeatherToggleProps) {
  return (
    <motion.div animate={{ opacity: isNavOpen ? 1 : 0 }} className="mt-6">
      <div className="flex items-center justify-between">
        <Label htmlFor="weather-toggle" className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center">
          <Cloud className="mr-2" /> Show Weather
        </Label>
        <Switch
          id="weather-toggle"
          checked={showWeather}
          onCheckedChange={setShowWeather}
        />
      </div>
    </motion.div>
  )
}
