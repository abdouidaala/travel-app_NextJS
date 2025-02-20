import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import type { User } from "@/lib/types"

export async function getUserByEmail(email: string): Promise<User | null> {
  const client = await clientPromise
  const collection = client.db().collection("users")
  return collection.findOne({ email }) as Promise<User | null>
}

export async function getUserById(id: string): Promise<User | null> {
  const client = await clientPromise
  const collection = client.db().collection("users")
  return collection.findOne({ _id: new ObjectId(id) }) as Promise<User | null>
}

export async function updateUser(id: string, data: Partial<User>): Promise<User | null> {
  const client = await clientPromise
  const collection = client.db().collection("users")

  const { _id, ...updateData } = data

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateData },
    { returnDocument: "after" },
  )

  return result as User | null
}

export async function createUser(data: Partial<User>): Promise<User> {
  const client = await clientPromise
  const collection = client.db().collection("users")

  const result = await collection.insertOne({
    ...data,
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  return {
    _id: result.insertedId,
    ...data,
  } as User
}

