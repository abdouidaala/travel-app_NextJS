"use client"

import { useQuery } from "@tanstack/react-query"
import { TripCard } from "@/components/trips/trip-card"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { ITrip } from "@/lib/models/types"
import { TripListSkeleton } from "@/components/trips/trip-list-skeleton"

async function getTrips(): Promise<ITrip[]> {
  const response = await fetch("/api/trips")
  if (!response.ok) {
    throw new Error("Failed to fetch trips")
  }
  return response.json()
}

export function TripList() {
  const {
    data: trips,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["trips"],
    queryFn: getTrips,
  })

  if (isLoading) {
    return <TripListSkeleton />
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load trips. Please try again later.</AlertDescription>
      </Alert>
    )
  }

  if (!trips?.length) {
    return (
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="plane" />
        <EmptyPlaceholder.Title>No trips created</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          You haven&apos;t created any trips yet. Start planning your next adventure.
        </EmptyPlaceholder.Description>
        <EmptyPlaceholder.Action href="/trips/new">Create your first trip</EmptyPlaceholder.Action>
      </EmptyPlaceholder>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {trips.map((trip) => (
        <TripCard key={trip._id.toString()} trip={trip} />
      ))}
    </div>
  )
}

