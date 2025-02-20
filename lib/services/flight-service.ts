import { cache } from "react"
import type { FlightSearchParams, FlightSearchResponse } from "@/lib/types/flight"

const SKYSCANNER_API_KEY = process.env.SKYSCANNER_API_KEY
const SKYSCANNER_API_HOST = "skyscanner-api.p.rapidapi.com"

export const searchFlights = cache(async (params: FlightSearchParams): Promise<FlightSearchResponse> => {
  if (!SKYSCANNER_API_KEY) {
    throw new Error("SKYSCANNER_API_KEY is not configured")
  }

  try {
    // First, get location IDs for origin and destination
    const [originPlace, destinationPlace] = await Promise.all([
      getLocationId(params.origin),
      getLocationId(params.destination),
    ])

    // Create search request
    const searchResponse = await fetch("https://skyscanner-api.p.rapidapi.com/v3/flights/live/search/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": SKYSCANNER_API_KEY,
        "X-RapidAPI-Host": SKYSCANNER_API_HOST,
      },
      body: JSON.stringify({
        query: {
          market: "UK",
          locale: "en-GB",
          currency: params.currency || "GBP",
          queryLegs: [
            {
              originPlaceId: originPlace.id,
              destinationPlaceId: destinationPlace.id,
              date: params.date,
            },
          ],
          cabinClass: "CABIN_CLASS_ECONOMY",
          adults: params.adults || 1,
        },
      }),
    })

    if (!searchResponse.ok) {
      throw new Error(`Search request failed: ${searchResponse.statusText}`)
    }

    const searchData = await searchResponse.json()
    const sessionToken = searchData.sessionToken

    // Poll for results
    const results = await pollSearchResults(sessionToken)

    // Transform and format the response
    return formatSearchResults(results)
  } catch (error) {
    console.error("Flight search error:", error)
    throw new Error("Failed to search flights")
  }
})

async function getLocationId(query: string): Promise<{ id: string; name: string }> {
  const response = await fetch(
    `https://skyscanner-api.p.rapidapi.com/v3/autosuggest/flights?query=${encodeURIComponent(query)}`,
    {
      headers: {
        "X-RapidAPI-Key": SKYSCANNER_API_KEY!,
        "X-RapidAPI-Host": SKYSCANNER_API_HOST,
      },
    },
  )

  if (!response.ok) {
    throw new Error(`Location search failed: ${response.statusText}`)
  }

  const data = await response.json()
  const place = data.places[0]

  if (!place) {
    throw new Error(`No location found for query: ${query}`)
  }

  return {
    id: place.entityId,
    name: place.name,
  }
}

async function pollSearchResults(sessionToken: string, maxAttempts = 3): Promise<any> {
  let attempts = 0

  while (attempts < maxAttempts) {
    const response = await fetch(`https://skyscanner-api.p.rapidapi.com/v3/flights/live/search/poll/${sessionToken}`, {
      headers: {
        "X-RapidAPI-Key": SKYSCANNER_API_KEY!,
        "X-RapidAPI-Host": SKYSCANNER_API_HOST,
      },
    })

    if (!response.ok) {
      throw new Error(`Polling failed: ${response.statusText}`)
    }

    const data = await response.json()

    if (data.status === "COMPLETE" || data.content) {
      return data
    }

    attempts++
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  throw new Error("Search polling timed out")
}

function formatSearchResults(rawResults: any): FlightSearchResponse {
  const flights = rawResults.content.results.itineraries.map((itinerary: any) => ({
    id: itinerary.id,
    price: {
      amount: itinerary.pricing_options[0].price.amount,
      currency: itinerary.pricing_options[0].price.currency,
    },
    legs: itinerary.legs.map((leg: any) => ({
      departureAirport: {
        code: leg.origin.flightPlaceId,
        name: leg.origin.name,
        city: leg.origin.city,
      },
      arrivalAirport: {
        code: leg.destination.flightPlaceId,
        name: leg.destination.name,
        city: leg.destination.city,
      },
      departureTime: leg.departure,
      arrivalTime: leg.arrival,
      duration: leg.durationInMinutes,
      stops: leg.stopCount,
      airline: {
        code: leg.carriers[0].code,
        name: leg.carriers[0].name,
        logo: leg.carriers[0].imageUrl,
      },
      flightNumber: leg.segments[0].flightNumber,
    })),
    provider: {
      name: itinerary.pricing_options[0].agent.name,
      logo: itinerary.pricing_options[0].agent.imageUrl,
    },
    deepLink: itinerary.pricing_options[0].items[0].deepLink,
  }))

  const prices = flights.map((f) => f.price.amount)

  return {
    flights,
    meta: {
      currency: flights[0]?.price.currency || "GBP",
      total: flights.length,
      lowestPrice: Math.min(...prices),
      highestPrice: Math.max(...prices),
    },
  }
}

