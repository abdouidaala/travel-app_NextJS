"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Initialize Mapbox
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

interface Destination {
  id: string
  name: string
  location: string
  coordinates: {
    latitude: number
    longitude: number
  }
}

interface MapViewProps {
  destinations: Destination[]
  className?: string
  initialZoom?: number
  interactive?: boolean
}

export function MapView({ destinations, className, initialZoom = 1, interactive = true }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markers = useRef<mapboxgl.Marker[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    try {
      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        zoom: initialZoom,
        center: [0, 20], // Default center
        interactive,
      })

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl())

      // Cleanup function
      return () => {
        markers.current.forEach((marker) => marker.remove())
        map.current?.remove()
      }
    } catch (err) {
      setError("Failed to load map")
      console.error("Map initialization error:", err)
    }
  }, [initialZoom, interactive])

  // Update markers when destinations change
  useEffect(() => {
    if (!map.current) return

    try {
      // Remove existing markers
      markers.current.forEach((marker) => marker.remove())
      markers.current = []

      if (destinations.length === 0) return

      // Add new markers
      const bounds = new mapboxgl.LngLatBounds()

      destinations.forEach((destination) => {
        const { longitude, latitude } = destination.coordinates

        // Create marker element
        const el = document.createElement("div")
        el.className = "map-marker"
        el.innerHTML = `
          <div class="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg transform -translate-x-1/2 -translate-y-1/2">
            <div class="w-2 h-2 bg-background rounded-full"></div>
          </div>
        `

        // Create and add marker
        const marker = new mapboxgl.Marker(el)
          .setLngLat([longitude, latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(`
                <div class="p-2">
                  <h3 class="font-semibold">${destination.name}</h3>
                  <p class="text-sm text-muted-foreground">${destination.location}</p>
                </div>
              `),
          )
          .addTo(map.current)

        markers.current.push(marker)
        bounds.extend([longitude, latitude])
      })

      // Fit map to bounds with padding
      if (!bounds.isEmpty()) {
        map.current.fitBounds(bounds, {
          padding: 50,
          maxZoom: 15,
        })
      }
    } catch (err) {
      setError("Failed to update map markers")
      console.error("Marker update error:", err)
    }
  }, [destinations])

  if (error) {
    return <Card className={cn("p-4 text-center text-muted-foreground", className)}>{error}</Card>
  }

  return (
    <Card className={cn("relative", className)}>
      <div ref={mapContainer} className="h-[400px] w-full rounded-lg" />
      <style jsx global>{`
        .mapboxgl-popup-content {
          @apply rounded-lg shadow-lg border border-border bg-background text-foreground;
        }
        .mapboxgl-popup-close-button {
          @apply text-muted-foreground hover:text-foreground focus:outline-none;
        }
        .mapboxgl-ctrl-group {
          @apply border-border bg-background;
        }
        .mapboxgl-ctrl-group button {
          @apply border-border text-foreground hover:bg-muted;
        }
      `}</style>
    </Card>
  )
}

