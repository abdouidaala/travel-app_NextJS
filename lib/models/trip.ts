import { Schema, model, models } from "mongoose"
import type { ITrip, IDestination, IActivity } from "./types"

const ActivitySchema = new Schema<IActivity>(
  {
    title: { type: String, required: true },
    description: String,
    startTime: Date,
    endTime: Date,
    location: String,
    cost: Number,
    notes: String,
    category: {
      type: String,
      enum: ["sightseeing", "food", "transportation", "accommodation", "other"],
      default: "other",
    },
    status: {
      type: String,
      enum: ["planned", "booked", "completed"],
      default: "planned",
    },
    bookingReference: String,
  },
  {
    _id: true,
    timestamps: true,
  },
)

const DestinationSchema = new Schema<IDestination>(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    activities: [ActivitySchema],
    notes: String,
    accommodation: {
      name: String,
      address: String,
      bookingReference: String,
      checkIn: { type: Date, required: true },
      checkOut: { type: Date, required: true },
    },
  },
  {
    _id: true,
    timestamps: true,
  },
)

const TripSchema = new Schema<ITrip>(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    description: String,
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    destinations: [DestinationSchema],
    status: {
      type: String,
      enum: ["planning", "upcoming", "ongoing", "completed", "cancelled"],
      default: "planning",
      required: true,
    },
    budget: Number,
    currency: {
      type: String,
      default: "USD",
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    tags: [String],
    coverImage: String,
  },
  {
    timestamps: true,
  },
)

// Add indexes for common queries
TripSchema.index({ userId: 1, status: 1 })
TripSchema.index({ startDate: 1 })
TripSchema.index({ isPublic: 1 })

// Add validation for date ranges
TripSchema.pre("save", function (next) {
  if (this.endDate < this.startDate) {
    next(new Error("End date must be after start date"))
  }

  // Validate destination dates are within trip dates
  for (const destination of this.destinations) {
    if (destination.startDate < this.startDate || destination.endDate > this.endDate) {
      next(new Error("Destination dates must be within trip dates"))
    }

    // Validate accommodation dates are within destination dates
    if (destination.accommodation) {
      if (
        destination.accommodation.checkIn < destination.startDate ||
        destination.accommodation.checkOut > destination.endDate
      ) {
        next(new Error("Accommodation dates must be within destination dates"))
      }
    }
  }

  next()
})

// Helper method to calculate total trip cost
TripSchema.methods.calculateTotalCost = function (): number {
  return this.destinations.reduce((total, destination) => {
    return (
      total +
      destination.activities.reduce((actTotal, activity) => {
        return actTotal + (activity.cost || 0)
      }, 0)
    )
  }, 0)
}

// Helper method to get upcoming activities
TripSchema.methods.getUpcomingActivities = function (): IActivity[] {
  const now = new Date()
  const activities: IActivity[] = []

  this.destinations.forEach((destination) => {
    destination.activities.forEach((activity) => {
      if (activity.startTime && activity.startTime > now) {
        activities.push(activity)
      }
    })
  })

  return activities.sort((a, b) => (a.startTime?.getTime() || 0) - (b.startTime?.getTime() || 0))
}

// Create or get the model
export const Trip = models.Trip || model<ITrip>("Trip", TripSchema)

