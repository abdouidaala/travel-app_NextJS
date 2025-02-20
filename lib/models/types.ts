import type { Types } from "mongoose"

export interface IActivity {
  title: string
  description?: string
  startTime?: Date
  endTime?: Date
  location?: string
  cost?: number
  notes?: string
  category?: "sightseeing" | "food" | "transportation" | "accommodation" | "other"
  status?: "planned" | "booked" | "completed"
  bookingReference?: string
}

export interface IDestination {
  name: string
  location: string
  coordinates: {
    latitude: number
    longitude: number
  }
  startDate: Date
  endDate: Date
  activities: IActivity[]
  notes?: string
  accommodation?: {
    name: string
    address: string
    bookingReference?: string
    checkIn: Date
    checkOut: Date
  }
}

export interface ITrip {
  _id: Types.ObjectId
  userId: string
  name: string
  description?: string
  startDate: Date
  endDate: Date
  destinations: IDestination[]
  status: "planning" | "upcoming" | "ongoing" | "completed" | "cancelled"
  budget?: number
  currency?: string
  createdAt: Date
  updatedAt: Date
  isPublic: boolean
  tags?: string[]
  coverImage?: string
}

