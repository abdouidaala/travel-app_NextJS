export interface Activity {
  id: string
  title: string
  time?: string
  location?: string
  notes?: string
}

export interface DayPlan {
  date: string
  activities: Activity[]
}

