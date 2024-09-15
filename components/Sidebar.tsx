'use client';

import { motion } from 'framer-motion'
import { HTMLMotionProps } from 'framer-motion'
import RouteForm from './RouteForm'

interface SidebarProps {
  isNavOpen: boolean
  setSelectedRoute: (route: [number, number][]) => void
  startPort: [number, number] | null
  endPort: [number, number] | null
  setIsSelectingLocation: (type: 'start' | 'end' | null) => void
}

export default function Sidebar({ isNavOpen, setSelectedRoute, startPort, endPort, setIsSelectingLocation }: SidebarProps) {
  return (
    <motion.div 
      {...({} as HTMLMotionProps<"div">)}
      className={`bg-white dark:bg-gray-800 shadow-lg overflow-y-auto transition-all duration-300 ease-in-out ${
        isNavOpen ? 'w-96' : 'w-20'
      }`}
      initial={false}
      animate={{ width: isNavOpen ? '24rem' : '5rem' }}
    >
      <div className="p-6">
        <motion.h1 
          className="text-3xl font-bold mb-6 text-emerald-600 dark:text-emerald-400 whitespace-nowrap"
          animate={{ opacity: isNavOpen ? 1 : 0 }}
        >
          {isNavOpen ? 'Optimal Ship Routing' : 'OSR'}
        </motion.h1>
        <RouteForm
          setSelectedRoute={setSelectedRoute}
          isNavOpen={isNavOpen}
          startPort={startPort}
          endPort={endPort}
          setIsSelectingLocation={setIsSelectingLocation}
        />
      </div>
    </motion.div>
  )
}