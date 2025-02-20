import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { dbConnect, Trip } from "@/lib/models/db"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { days } = await request.json()

    await dbConnect()
    const trip = await Trip.findOneAndUpdate(
      {
        _id: params.id,
        userId: session.user.id,
      },
      {
        $set: { itinerary: days },
      },
      { new: true },
    )

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 })
    }

    return NextResponse.json({ itinerary: trip.itinerary })
  } catch (error) {
    console.error("Error updating itinerary:", error)
    return NextResponse.json({ error: "Failed to update itinerary" }, { status: 500 })
  }
}

