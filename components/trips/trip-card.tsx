import Link from "next/link"
import { format } from "date-fns"
import { Calendar, MapPin } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ITrip } from "@/lib/models/types"

interface TripCardProps {
  trip: ITrip
}

export function TripCard({ trip }: TripCardProps) {
  return (
    <Link href={`/trips/${trip._id}`}>
      <Card className="h-full overflow-hidden transition-colors hover:bg-muted/50">
        {trip.coverImage && (
          <div className="aspect-video w-full overflow-hidden">
            <img src={trip.coverImage || "/placeholder.svg"} alt={trip.name} className="h-full w-full object-cover" />
          </div>
        )}
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="line-clamp-1">{trip.name}</CardTitle>
            <Badge variant={getTripStatusVariant(trip.status)}>{trip.status}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span>
                {format(new Date(trip.startDate), "MMM d")} - {format(new Date(trip.endDate), "MMM d, yyyy")}
              </span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4" />
              <span>{trip.destinations.length} destinations</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex -space-x-2">
            {trip.destinations.slice(0, 3).map((destination, i) => (
              <Badge key={i} variant="outline" className="border-2 bg-background px-2 capitalize">
                {destination.name}
              </Badge>
            ))}
            {trip.destinations.length > 3 && (
              <Badge variant="outline" className="border-2 bg-background px-2">
                +{trip.destinations.length - 3} more
              </Badge>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}

function getTripStatusVariant(status: ITrip["status"]) {
  switch (status) {
    case "planning":
      return "secondary"
    case "upcoming":
      return "default"
    case "ongoing":
      return "default"
    case "completed":
      return "success"
    case "cancelled":
      return "destructive"
    default:
      return "secondary"
  }
}

