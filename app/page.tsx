import { SearchForm } from "@/components/search-form"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { HotelPromo } from "@/components/hotel-promo"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-navy text-white">
      <header className="container py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">TravelSearch</h1>
            <Tabs defaultValue="flights" className="search-tabs">
              <TabsList>
                <TabsTrigger value="flights">Flights</TabsTrigger>
                <TabsTrigger value="hotels">Hotels</TabsTrigger>
                <TabsTrigger value="cars">Car rental</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-white hover:text-pale-blue">
              Sign in
            </Button>
            <Button variant="ghost" className="text-white hover:text-pale-blue">
              Menu
            </Button>
          </div>
        </nav>
      </header>

      <main className="container py-12">
        <div className="max-w-4xl">
          <h2 className="mb-8 text-4xl font-bold">Millions of cheap flights. A search.</h2>
          <SearchForm />
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          <Button variant="secondary" className="h-auto flex-col items-start p-6 bg-blue/10 hover:bg-blue/20">
            <h3 className="mb-2 text-xl font-semibold">Hotels</h3>
            <p className="text-sm text-left text-pale-blue">Find the perfect place to stay</p>
          </Button>
          <Button variant="secondary" className="h-auto flex-col items-start p-6 bg-blue/10 hover:bg-blue/20">
            <h3 className="mb-2 text-xl font-semibold">Car rental</h3>
            <p className="text-sm text-left text-pale-blue">Explore with freedom</p>
          </Button>
          <Button variant="secondary" className="h-auto flex-col items-start p-6 bg-blue/10 hover:bg-blue/20">
            <h3 className="mb-2 text-xl font-semibold">Explore</h3>
            <p className="text-sm text-left text-pale-blue">Discover destinations</p>
          </Button>
        </div>

        <HotelPromo className="mt-16" />
      </main>

      <Footer />
    </div>
  )
}

