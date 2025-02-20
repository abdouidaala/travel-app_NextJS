"use client"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

interface HotelPromoProps {
  className?: string
}

const images = [
  "/placeholder.svg?height=400&width=800",
  "/placeholder.svg?height=400&width=800",
  "/placeholder.svg?height=400&width=800",
]

export function HotelPromo({ className }: HotelPromoProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-lg", className)}>
      <Carousel className="w-full">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative aspect-[2/1]">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Hotel promotion ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-navy/80 to-navy/40" />
                <div className="absolute inset-0 z-10 p-8 sm:p-12">
                  <h2 className="mb-4 text-4xl font-bold text-white">Go on, get closer</h2>
                  <p className="mb-6 max-w-md text-lg text-white">
                    Get away from a romantic hotel stay with prizes to make you happy.
                  </p>
                  <button className="rounded-lg bg-white px-6 py-3 font-semibold text-navy hover:bg-pale-blue transition-colors">
                    Find your room
                  </button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </div>
  )
}

