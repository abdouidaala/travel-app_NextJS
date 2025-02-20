import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { Navigation } from "@/components/navigation"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TravelPlanner - Plan Your Perfect Trip",
  description: "Plan and book your perfect trip with our all-in-one travel planning platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>
            <AuthProvider>
              <div className="min-h-screen flex flex-col">
                <Navigation />
                <main className="flex-1">{children}</main>
              </div>
            </AuthProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'