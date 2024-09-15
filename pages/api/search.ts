import type { NextApiRequest, NextApiResponse } from 'next'

type SearchResponse = {
  coordinates: [number, number] | null
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchResponse>
) {
  if (req.method === 'GET') {
    const { q } = req.query

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ coordinates: null, error: 'Invalid search query' })
    }

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`)
      const data = await response.json()

      if (data && data.length > 0) {
        const { lon, lat } = data[0]
        res.status(200).json({ coordinates: [parseFloat(lon), parseFloat(lat)] })
      } else {
        res.status(404).json({ coordinates: null, error: 'Location not found' })
      }
    } catch (error) {
      console.error('Error searching for location:', error)
      res.status(500).json({ coordinates: null, error: 'Error searching for location' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}