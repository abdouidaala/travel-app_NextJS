import { Suspense } from "react"
import type { Metadata } from "next"
import { TripList } from "@/components/trips/trip-list"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { TripListSkeleton } from "@/components/trips/trip-list-skeleton"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your trips and travel plans",
}

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Trips" text="Create and manage your travel plans." />
      <Suspense fallback={<TripListSkeleton />}>
        <TripList />
      </Suspense>
    </DashboardShell>
  )
}

