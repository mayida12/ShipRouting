import type { NextApiRequest, NextApiResponse } from 'next'

type OptimizeRouteRequest = {
  shipType: string
  shipDimensions: {
    length: number
    width: number
    draft: number
  }
  startPort: [number, number] | null
  endPort: [number, number] | null
  departureDateTime: string
}

type OptimizeRouteResponse = {
  optimal_path: [number, number][] | null
  error?: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<OptimizeRouteResponse>
) {
  if (req.method === 'POST') {
    const { shipType, shipDimensions, startPort, endPort, departureDateTime } = req.body as OptimizeRouteRequest

    if (!startPort || !endPort) {
      return res.status(400).json({ optimal_path: null, error: 'Start port and end port are required' })
    }

    try {
      // Here you would typically call your route optimization logic
      // For now, we'll just return a dummy route
      const dummyRoute: [number, number][] = [
        startPort,
        [(startPort[0] + endPort[0]) / 2, (startPort[1] + endPort[1]) / 2],
        endPort
      ]

      res.status(200).json({ optimal_path: dummyRoute })
    } catch (error) {
      console.error('Error calculating optimal route:', error)
      res.status(500).json({ optimal_path: null, error: 'Error calculating optimal route' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}