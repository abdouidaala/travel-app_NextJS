import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { dbConnect, Trip } from "@/lib/models/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession()

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await dbConnect()
    const trip = await Trip.findOne({
      _id: params.id,
      $or: [{ userId: session.user.email }, { isPublic: true }],
    })

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 })
    }

    return NextResponse.json(trip)
  } catch (error) {
    console.error("Error fetching trip:", error)
    return NextResponse.json({ error: "Failed to fetch trip" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession()

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await dbConnect()
    const tripData = await request.json()

    const trip = await Trip.findOneAndUpdate({ _id: params.id, userId: session.user.email }, tripData, {
      new: true,
      runValidators: true,
    })

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 })
    }

    return NextResponse.json(trip)
  } catch (error: any) {
    console.error("Error updating trip:", error)
    return NextResponse.json({ error: error.message || "Failed to update trip" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession()

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await dbConnect()
    const trip = await Trip.findOneAndDelete({
      _id: params.id,
      userId: session.user.email,
    })

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Trip deleted successfully" })
  } catch (error) {
    console.error("Error deleting trip:", error)
    return NextResponse.json({ error: "Failed to delete trip" }, { status: 500 })
  }
}

