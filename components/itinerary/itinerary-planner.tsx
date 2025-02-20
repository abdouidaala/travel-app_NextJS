"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format, parseISO } from "date-fns"
import { Clock, GripVertical, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import type { Activity, DayPlan } from "@/lib/types/itinerary"

interface ItineraryPlannerProps {
  tripId: string
  initialDays: DayPlan[]
}

interface AddActivityFormProps {
  onSubmit: (activity: Activity) => void
}

function AddActivityForm({ onSubmit }: AddActivityFormProps) {
  const [title, setTitle] = useState("")
  const [time, setTime] = useState("")
  const [location, setLocation] = useState("")
  const [notes, setNotes] = useState("")

  const handleSubmit = () => {
    const newActivity: Activity = {
      id: Math.random().toString(36).substring(7),
      title,
      time,
      location,
      notes,
    }
    onSubmit(newActivity)
  }

  return (
    <div className="grid gap-4">
      <DialogHeader>
        <DialogTitle>Add Activity</DialogTitle>
      </DialogHeader>
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="time">Time</Label>
        <Input id="time" value={time} onChange={(e) => setTime(e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="location">Location</Label>
        <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="notes">Notes</Label>
        <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <Button onClick={handleSubmit}>Add</Button>
    </div>
  )
}

export function ItineraryPlanner({ tripId, initialDays }: ItineraryPlannerProps) {
  const [days, setDays] = useState<DayPlan[]>(initialDays)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const updateItinerary = useMutation({
    mutationFn: async (newDays: DayPlan[]) => {
      const response = await fetch(`/api/trips/${tripId}/itinerary`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days: newDays }),
      })

      if (!response.ok) {
        throw new Error("Failed to update itinerary")
      }

      return response.json()
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update itinerary. Please try again.",
      })
      // Revert to the last known good state
      setDays(initialDays)
    },
  })

  const onDragEnd = (result: any) => {
    const { source, destination } = result

    // Dropped outside a droppable
    if (!destination) return

    const sourceDay = Number.parseInt(source.droppableId)
    const destDay = Number.parseInt(destination.droppableId)

    const newDays = [...days]
    const [movedActivity] = newDays[sourceDay].activities.splice(source.index, 1)
    newDays[destDay].activities.splice(destination.index, 0, movedActivity)

    setDays(newDays)
    updateItinerary.mutate(newDays)
  }

  const addActivity = (dayIndex: number, activity: Activity) => {
    const newDays = [...days]
    newDays[dayIndex].activities.push(activity)
    setDays(newDays)
    updateItinerary.mutate(newDays)
    setSelectedDay(null)
  }

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    const newDays = [...days]
    newDays[dayIndex].activities.splice(activityIndex, 1)
    setDays(newDays)
    updateItinerary.mutate(newDays)
  }

  return (
    <div className="space-y-8">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid gap-6">
          {days.map((day, dayIndex) => (
            <Card key={dayIndex}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    Day {dayIndex + 1} - {format(parseISO(day.date), "EEEE, MMMM d")}
                  </CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedDay(dayIndex)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Activity
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <AddActivityForm onSubmit={(activity) => addActivity(dayIndex, activity)} />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Droppable droppableId={dayIndex.toString()}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn("space-y-2 rounded-lg p-2", snapshot.isDraggingOver && "bg-muted")}
                    >
                      {day.activities.map((activity, index) => (
                        <Draggable key={activity.id} draggableId={activity.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={cn("rounded-lg border bg-card p-3", snapshot.isDragging && "shadow-lg")}
                            >
                              <div className="flex items-start gap-2">
                                <div {...provided.dragHandleProps} className="mt-1 cursor-grab">
                                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="flex-1 space-y-1">
                                  <div className="flex items-start justify-between gap-2">
                                    <span className="font-medium">{activity.title}</span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                      onClick={() => removeActivity(dayIndex, index)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  {activity.time && (
                                    <div className="flex items-center text-sm text-muted-foreground">
                                      <Clock className="mr-1 h-4 w-4" />
                                      {activity.time}
                                    </div>
                                  )}
                                  {activity.location && (
                                    <div className="text-sm text-muted-foreground">📍 {activity.location}</div>
                                  )}
                                  {activity.notes && (
                                    <div className="text-sm text-muted-foreground">{activity.notes}</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {day.activities.length === 0 && (
                        <div className="py-8 text-center text-sm text-muted-foreground">
                          No activities planned for this day. Drag activities here or add a new one.
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            </Card>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}

