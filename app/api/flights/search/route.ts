import { NextResponse } from "next/server"
import { searchFlights } from "@/lib/services/flight-service"
import { z } from "zod"

const searchParamsSchema = z.object({
  origin: z.string().min(1),
  destination: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  returnDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  adults: z.number().int().min(1).max(8).optional(),
  currency: z.string().length(3).optional(),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const params = {
      origin: searchParams.get("origin"),
      destination: searchParams.get("destination"),
      date: searchParams.get("date"),
      returnDate: searchParams.get("returnDate"),
      adults: searchParams.get("adults") ? Number.parseInt(searchParams.get("adults")!) : undefined,
      currency: searchParams.get("currency"),
    }

    // Validate search parameters
    const validatedParams = searchParamsSchema.parse(params)

    const results = await searchFlights(validatedParams)
    return NextResponse.json(results)
  } catch (error) {
    console.error("Flight search API error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid search parameters", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to search flights" }, { status: 500 })
  }
}

