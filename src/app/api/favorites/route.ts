import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongoose"
import Favorite from "@/models/Favorite"
import mongoose from "mongoose"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const favorites = await Favorite.find({
      userId: new mongoose.Types.ObjectId(session.user.id),
    }).sort({ createdAt: -1 })
    console.log(favorites)

    return NextResponse.json(favorites)
  } catch (error) {
    console.error("Error fetching favorites:", error)
    return NextResponse.json({ message: "Failed to fetch favorites" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { movieId, title, posterPath, voteAverage, releaseDate } = await request.json()

    if (!movieId || !title) {
      return NextResponse.json({ message: "Movie ID and title are required" }, { status: 400 })
    }

    await dbConnect()

    const existingFavorite = await Favorite.findOne({
      userId: new mongoose.Types.ObjectId(session.user.id),
      movieId,
    })

    if (existingFavorite) {
      return NextResponse.json({ message: "Movie already in favorites" }, { status: 409 })
    }

    const favorite = await Favorite.create({
      userId: new mongoose.Types.ObjectId(session.user.id),
      movieId,
      title,
      posterPath,
      voteAverage,
      releaseDate,
    })

    return NextResponse.json(favorite, { status: 201 })
  } catch (error) {
    console.error("Error adding favorite:", error)
    return NextResponse.json({ message: "Failed to add favorite" }, { status: 500 })
  }
}

