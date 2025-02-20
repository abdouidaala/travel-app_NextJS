import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plane } from "lucide-react"

interface EmptyPlaceholderProps {
  children: React.ReactNode
}

export function EmptyPlaceholder({ children }: EmptyPlaceholderProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">{children}</div>
    </div>
  )
}

interface EmptyPlaceholderIconProps {
  name: "plane"
}

EmptyPlaceholder.Icon = function EmptyPlaceHolderIcon({ name }: EmptyPlaceholderIconProps) {
  const Icon = {
    plane: Plane,
  }[name]

  return <Icon className="h-12 w-12 text-muted-foreground" />
}

interface EmptyPlaceholderTitleProps {
  children: React.ReactNode
}

EmptyPlaceholder.Title = function EmptyPlaceholderTitle({ children }: EmptyPlaceholderTitleProps) {
  return <h2 className="mt-6 text-xl font-semibold">{children}</h2>
}

interface EmptyPlaceholderDescriptionProps {
  children: React.ReactNode
}

EmptyPlaceholder.Description = function EmptyPlaceholderDescription({ children }: EmptyPlaceholderDescriptionProps) {
  return <p className="mt-3 mb-8 text-center text-sm font-normal leading-6 text-muted-foreground">{children}</p>
}

interface EmptyPlaceholderActionProps {
  children: React.ReactNode
  href: string
}

EmptyPlaceholder.Action = function EmptyPlaceholderAction({ children, href }: EmptyPlaceholderActionProps) {
  return (
    <Button asChild>
      <Link href={href}>{children}</Link>
    </Button>
  )
}

