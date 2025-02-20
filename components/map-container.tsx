"use client"

import { useEffect, useRef } from "react"
import { Loader } from "@googlemaps/js-api-loader"

export function MapContainer() {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        version: "weekly",
      })

      const google = await loader.load()
      const map = new google.maps.Map(mapRef.current!, {
        center: { lat: 0, lng: 0 },
        zoom: 2,
      })
    }

    initMap()
  }, [])

  return <div ref={mapRef} className="h-full w-full" />
}

