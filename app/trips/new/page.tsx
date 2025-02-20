"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { MapContainer } from "@/components/map-container"

export default function NewTrip() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Add trip creation logic here
    setLoading(false)
    router.push("/trips")
  }

  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>Plan a New Trip</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="destination">Destination</Label>
                <Input id="destination" placeholder="Where do you want to go?" required />
              </div>
              <div className="grid gap-2">
                <Label>Dates</Label>
                <DatePickerWithRange />
              </div>
            </div>
            <div className="h-[400px] w-full rounded-lg border">
              <MapContainer />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Trip"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

