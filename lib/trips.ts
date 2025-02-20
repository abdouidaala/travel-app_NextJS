import { dbConnect, Trip } from "@/lib/models/db"

export async function getTripById(id: string) {
  try {
    await dbConnect()
    const trip = await Trip.findById(id).exec()
    return trip
  } catch (error) {
    console.error("Error fetching trip:", error)
    return null
  }
}

