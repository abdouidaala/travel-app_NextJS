"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export function SearchForm() {
  const [dates, setDates] = useState<{
    departure?: Date
    return?: Date
  }>({})

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Button variant="link" className="text-white p-0 h-auto hover:text-pale-blue">
          Create a route with multiple destinations
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <input type="text" placeholder="From" className="destination-input" />
          <div className="mt-2">
            <Checkbox
              id="nearby-departure"
              className="border-white/50 data-[state=checked]:bg-cyan data-[state=checked]:border-cyan"
            >
              <span className="text-sm text-white/80 ml-2">Add nearby airports</span>
            </Checkbox>
          </div>
        </div>

        <div>
          <input type="text" placeholder="To" className="destination-input" />
          <div className="mt-2">
            <Checkbox
              id="nearby-arrival"
              className="border-white/50 data-[state=checked]:bg-cyan data-[state=checked]:border-cyan"
            >
              <span className="text-sm text-white/80 ml-2">Add nearby airports</span>
            </Checkbox>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-full justify-start text-left font-normal", !dates.departure && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dates.departure ? format(dates.departure, "PPP") : "Departure date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dates.departure}
              onSelect={(date) => setDates((prev) => ({ ...prev, departure: date }))}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-full justify-start text-left font-normal", !dates.return && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dates.return ? format(dates.return, "PPP") : "Return date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dates.return}
              onSelect={(date) => setDates((prev) => ({ ...prev, return: date }))}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Button variant="outline" className="w-full justify-start text-left font-normal text-muted-foreground">
          1 adult, Economy
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="direct-flights"
          className="border-white/50 data-[state=checked]:bg-cyan data-[state=checked]:border-cyan"
        >
          <span className="text-sm text-white/80 ml-2">Direct flights only</span>
        </Checkbox>
      </div>

      <Button className="w-full sm:w-auto bg-cyan hover:bg-cyan/90 text-navy font-bold">Search</Button>
    </div>
  )
}

