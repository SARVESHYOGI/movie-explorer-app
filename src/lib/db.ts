import clientPromise from "./mongodb"
import { ObjectId } from "mongodb"

export const db = {
  user: {
    async findUnique({ where }: { where: { email: string } | { id: string } }) {
      const client = await clientPromise
      const database = client.db("movie-explorer")
      const users = database.collection("users")

      if ("email" in where) {
        return users.findOne({ email: where.email })
      } else if ("id" in where) {
        return users.findOne({ _id: new ObjectId(where.id) })
      }

      return null
    },

    async create({ data }: { data: { name: string; email: string; password: string } }) {
      const client = await clientPromise
      const database = client.db("movie-explorer")
      const users = database.collection("users")

      const result = await users.insertOne({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      return {
        id: result.insertedId.toString(),
        ...data,
      }
    },
  },
}

