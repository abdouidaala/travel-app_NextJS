import type { ObjectId } from "mongodb"

export interface User {
  _id: ObjectId
  name: string
  email: string
  password?: string
  image?: string
  role: "user" | "admin"
  createdAt: Date
  updatedAt: Date
}

export interface Session {
  user: {
    id: string
    name: string
    email: string
    image?: string
    role: string
  }
  expires: string
}

