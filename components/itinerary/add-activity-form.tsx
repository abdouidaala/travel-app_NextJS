"use client"

import { DialogTitle } from "@/components/ui/dialog"

import { DialogHeader } from "@/components/ui/dialog"

import type React from "react"

import { useState } from "react"
import { DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Activity } from "@/lib/types/itinerary"

interface AddActivityFormProps {
  onSubmit: (activity: Activity) => void
}

export function AddActivityForm({ onSubmit }: AddActivityFormProps) {
  const [activity, setActivity] = useState<Partial<Activity>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      id: crypto.randomUUID(),
      title: activity.title || "",
      time: activity.time,
      location: activity.location,
      notes: activity.notes,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>Add Activity</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Activity Title</Label>
          <Input
            id="title"
            value={activity.title || ""}
            onChange={(e) => setActivity({ ...activity, title: e.target.value })}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="time">Time</Label>
          <Input
            id="time"
            type="time"
            value={activity.time || ""}
            onChange={(e) => setActivity({ ...activity, time: e.target.value })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={activity.location || ""}
            onChange={(e) => setActivity({ ...activity, location: e.target.value })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={activity.notes || ""}
            onChange={(e) => setActivity({ ...activity, notes: e.target.value })}
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">Add Activity</Button>
      </DialogFooter>
    </form>
  )
}

