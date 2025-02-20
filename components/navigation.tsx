"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Plane, User } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Plane className="h-6 w-6" />
          <span className="font-bold">TravelPlanner</span>
        </Link>
        <nav className="flex items-center space-x-6">
          {session ? (
            <>
              <Link
                href="/dashboard"
                className={`text-sm font-medium ${
                  pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/trips"
                className={`text-sm font-medium ${pathname === "/trips" ? "text-primary" : "text-muted-foreground"}`}
              >
                My Trips
              </Link>
              <Button variant="ghost" size="icon" onClick={() => signOut()}>
                <User className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button onClick={() => signIn()}>Sign In</Button>
          )}
        </nav>
      </div>
    </header>
  )
}

