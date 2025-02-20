import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

interface DashboardHeaderProps {
  heading: string
  text?: string
}

export function DashboardHeader({ heading, text }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="grid gap-1">
        <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
        {text && <p className="text-muted-foreground">{text}</p>}
      </div>
      <Button asChild>
        <Link href="/trips/new">
          <Plus className="mr-2 h-4 w-4" />
          New Trip
        </Link>
      </Button>
    </div>
  )
}

