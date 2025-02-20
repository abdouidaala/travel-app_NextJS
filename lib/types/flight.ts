export interface FlightSearchParams {
  origin: string
  destination: string
  date: string
  returnDate?: string
  adults?: number
  currency?: string
}

export interface FlightOption {
  id: string
  price: {
    amount: number
    currency: string
  }
  legs: FlightLeg[]
  provider: {
    name: string
    logo?: string
  }
  deepLink: string
}

export interface FlightLeg {
  departureAirport: {
    code: string
    name: string
    city: string
  }
  arrivalAirport: {
    code: string
    name: string
    city: string
  }
  departureTime: string
  arrivalTime: string
  duration: number
  stops: number
  airline: {
    code: string
    name: string
    logo?: string
  }
  flightNumber: string
}

export interface FlightSearchResponse {
  flights: FlightOption[]
  meta: {
    currency: string
    total: number
    lowestPrice: number
    highestPrice: number
  }
}

