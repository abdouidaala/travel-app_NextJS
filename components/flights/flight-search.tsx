"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { FlightSearchResponse } from "@/lib/types/flight"

export function FlightSearch() {
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [date, setDate] = useState<Date>()
  const [isSearching, setIsSearching] = useState(false)

  const { data, error, isLoading, refetch } = useQuery<FlightSearchResponse>({
    queryKey: ["flights", origin, destination, date],
    queryFn: async () => {
      if (!origin || !destination || !date) return null

      const params = new URLSearchParams({
        origin,
        destination,
        date: format(date, "yyyy-MM-dd"),
      })

      const response = await fetch(`/api/flights/search?${params}`)
      if (!response.ok) {
        throw new Error("Failed to fetch flights")
      }
      return response.json()
    },
    enabled: false,
  })

  const handleSearch = async () => {
    if (!origin || !destination || !date) return
    setIsSearching(true)
    await refetch()
    setIsSearching(false)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-2">
          <Label htmlFor="origin">From</Label>
          <Input id="origin" placeholder="London (LHR)" value={origin} onChange={(e) => setOrigin(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="destination">To</Label>
          <Input
            id="destination"
            placeholder="New York (JFK)"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label>Departure Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <Button
        className="w-full sm:w-auto"
        onClick={handleSearch}
        disabled={!origin || !destination || !date || isSearching}
      >
        Search Flights
      </Button>
      {isLoading && <div>Searching for flights...</div>}
      {error && <div className="text-destructive">Failed to search flights. Please try again.</div>}
      {data?.flights && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Found {data.flights.length} flights</h3>
          <div className="grid gap-4">
            {data.flights.map((flight) => (
              <div key={flight.id} className="rounded-lg border p-4 hover:bg-muted/50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">
                      {flight.legs[0].departureAirport.code} → {flight.legs[0].arrivalAirport.code}
                    </div>
                    <div className="text-sm text-muted-foreground">{flight.legs[0].airline.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {flight.price.currency} {flight.price.amount}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {flight.legs[0].stops === 0
                        ? "Direct"
                        : `${flight.legs[0].stops} stop${flight.legs[0].stops > 1 ? "s" : ""}`}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

