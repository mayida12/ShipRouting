import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from '../lib/firebase'

interface SearchBarProps {
  onLocationSelect: (location: [number, number]) => void
  onSearch: (query: string) => void
  onConfirmLocation: () => void
}

export default function SearchBar({ onLocationSelect, onSearch, onConfirmLocation }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])

  const handleSearch = async () => {
    try {
      const functions = getFunctions(app);
      const search = httpsCallable(functions, 'search');
      const result = await search({ query: searchQuery });
      const data = result.data as { coordinates: [number, number] };
      if (data.coordinates) {
        onLocationSelect(data.coordinates);
        setSearchQuery('');
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error searching for location:', error);
    }
  }

  const handleSelect = (lon: number, lat: number) => {
    onLocationSelect([lon, lat]);
    setSearchQuery('');
    setSuggestions([]);
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-1/2 transform -translate-x-1/2 -ml-5 z-10 w-96"
      >
        <div className="relative flex">
          <Input
            type="text"
            placeholder="Search for a location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          <Button onClick={handleSearch} className="ml-2">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        {suggestions.length > 0 && (
          <ul className="absolute w-full bg-white dark:bg-gray-800 mt-1 rounded-md shadow-lg max-h-60 overflow-auto">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => handleSelect(parseFloat(suggestion.lon), parseFloat(suggestion.lat))}
              >
                {suggestion.display_name}
              </li>
            ))}
          </ul>
        )}
      </motion.div>
      <Button 
        onClick={onConfirmLocation} 
        className="fixed bottom-6 right-6 z-10 bg-emerald-500 hover:bg-emerald-600 text-white"
      >
        Confirm Location
      </Button>
    </>
  )
}