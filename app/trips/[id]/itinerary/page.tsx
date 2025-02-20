import { notFound } from "next/navigation"
import { format } from "date-fns"
import { ItineraryPlanner } from "@/components/itinerary/itinerary-planner"
import { getTripById } from "@/lib/trips"

interface ItineraryPageProps {
  params: {
    id: string
  }
}

export default async function ItineraryPage({ params }: ItineraryPageProps) {
  const trip = await getTripById(params.id)

  if (!trip) {
    notFound()
  }

  // Create day plans for the entire trip duration
  const startDate = new Date(trip.startDate)
  const endDate = new Date(trip.endDate)
  const dayCount = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

  const days = Array.from({ length: dayCount }, (_, i) => {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)

    return {
      date: date.toISOString(),
      activities: trip.itinerary?.[i]?.activities || [],
    }
  })

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{trip.name} - Itinerary</h1>
        <p className="text-muted-foreground">
          {format(new Date(trip.startDate), "MMM d")} - {format(new Date(trip.endDate), "MMM d, yyyy")}
        </p>
      </div>
      <ItineraryPlanner tripId={params.id} initialDays={days} />
    </div>
  )
}

