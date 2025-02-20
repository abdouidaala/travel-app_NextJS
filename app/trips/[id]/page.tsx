import { Suspense } from "react"
import { notFound } from "next/navigation"
import { MapView } from "@/components/maps/map-view"
import { getTripById } from "@/lib/trips"

interface TripPageProps {
  params: {
    id: string
  }
}

export default async function TripPage({ params }: TripPageProps) {
  const trip = await getTripById(params.id)

  if (!trip) {
    notFound()
  }

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold">{trip.name}</h1>
      <div className="space-y-8">
        <Suspense fallback={<div className="h-[400px] animate-pulse bg-muted" />}>
          <MapView destinations={trip.destinations} className="h-[400px]" initialZoom={2} />
        </Suspense>
        {/* Additional trip details can be added here */}
      </div>
    </div>
  )
}

