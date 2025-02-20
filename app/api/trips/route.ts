import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { dbConnect, Trip } from "@/lib/models/db"

export async function POST(request: Request) {
  const session = await getServerSession()

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await dbConnect()
    const tripData = await request.json()

    const trip = new Trip({
      ...tripData,
      userId: session.user.email,
    })

    await trip.save()
    return NextResponse.json(trip)
  } catch (error: any) {
    console.error("Error creating trip:", error)
    return NextResponse.json({ error: error.message || "Failed to create trip" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const session = await getServerSession()

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await dbConnect()
    const trips = await Trip.find({ userId: session.user.email }).sort({ startDate: 1 }).exec()

    return NextResponse.json(trips)
  } catch (error) {
    console.error("Error fetching trips:", error)
    return NextResponse.json({ error: "Failed to fetch trips" }, { status: 500 })
  }
}

