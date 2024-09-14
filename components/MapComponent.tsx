import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

interface MapComponentProps {
  route: [number, number][] | null
  showWeather: boolean
}

const LeafletMap = dynamic<MapComponentProps>(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => <p>Loading map...</p>
})

const MapComponent: React.FC<MapComponentProps> = ({ route, showWeather }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Import Leaflet CSS only on the client side
    import('leaflet/dist/leaflet.css');
  }, []);

  if (!isMounted) {
    return null; // or a loading indicator
  }

  return (
    <div className="h-full w-full">
      <LeafletMap route={route} showWeather={showWeather} />
    </div>
  )
}

export default MapComponent
