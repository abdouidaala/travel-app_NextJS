import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-navy/50 py-12">
      <div className="container">
        <div className="grid gap-8 sm:grid-cols-4">
          <div>
            <h3 className="mb-4 text-sm font-semibold text-pale-blue">Help</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Button variant="link" className="h-auto p-0 text-white/80 hover:text-pale-blue">
                  Support
                </Button>
              </li>
              <li>
                <Button variant="link" className="h-auto p-0 text-white/80 hover:text-pale-blue">
                  FAQ
                </Button>
              </li>
              <li>
                <Button variant="link" className="h-auto p-0 text-white/80 hover:text-pale-blue">
                  Privacy Policy
                </Button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-pale-blue">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Button variant="link" className="h-auto p-0 text-white/80 hover:text-pale-blue">
                  About us
                </Button>
              </li>
              <li>
                <Button variant="link" className="h-auto p-0 text-white/80 hover:text-pale-blue">
                  Careers
                </Button>
              </li>
              <li>
                <Button variant="link" className="h-auto p-0 text-white/80 hover:text-pale-blue">
                  Partners
                </Button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-pale-blue">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Button variant="link" className="h-auto p-0 text-white/80 hover:text-pale-blue">
                  Countries
                </Button>
              </li>
              <li>
                <Button variant="link" className="h-auto p-0 text-white/80 hover:text-pale-blue">
                  Cities
                </Button>
              </li>
              <li>
                <Button variant="link" className="h-auto p-0 text-white/80 hover:text-pale-blue">
                  Airports
                </Button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-pale-blue">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Button variant="link" className="h-auto p-0 text-white/80 hover:text-pale-blue">
                  Terms & Conditions
                </Button>
              </li>
              <li>
                <Button variant="link" className="h-auto p-0 text-white/80 hover:text-pale-blue">
                  Cookie Policy
                </Button>
              </li>
              <li>
                <Button variant="link" className="h-auto p-0 text-white/80 hover:text-pale-blue">
                  Licenses
                </Button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-white/60">
          <p>Compare and book cheap flights from anywhere to anywhere</p>
          <p className="mt-1">© TravelSearch Ltd 2024 – 2025</p>
        </div>
      </div>
    </footer>
  )
}

