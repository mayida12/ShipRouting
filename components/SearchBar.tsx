import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'

interface SearchBarProps {
  onLocationSelect: (location: [number, number]) => void
}

export default function SearchBar({ onLocationSelect }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      if (data && data.length > 0) {
        const { lon, lat } = data[0]
        onLocationSelect([parseFloat(lon), parseFloat(lat)])
      }
    } catch (error) {
      console.error('Error searching for location:', error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-96"
    >
      <form onSubmit={handleSearch} className="flex">
        <Input
          type="text"
          placeholder="Search for a location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow"
        />
        <Button type="submit" className="ml-2">
          <Search size={20} />
        </Button>
      </form>
    </motion.div>
  )
}