import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongoose"
import Favorite from "@/models/Favorite"
import mongoose from "mongoose"

export async function DELETE(request: Request, { params }: { params: { movieId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { movieId } = await params

    if (!movieId) {
      return NextResponse.json({ message: "Movie ID is required" }, { status: 400 })
    }

    await dbConnect()

    const result = await Favorite.deleteOne({
      userId: new mongoose.Types.ObjectId(session.user.id),
      movieId: Number.parseInt(movieId),
    })
    console.log(result);

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Favorite not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing favorite:", error)
    return NextResponse.json({ message: "Failed to remove favorite" }, { status: 500 })
  }
}

export async function GET(request: Request, { params }: { params: { movieId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { movieId } = await params

    await dbConnect()

    const favorite = await Favorite.findOne({
      userId: new mongoose.Types.ObjectId(session.user.id),
      movieId: Number.parseInt(movieId),
    })
    console.log(favorite);

    return NextResponse.json({ isFavorite: !!favorite })
  } catch (error) {
    console.error("Error checking favorite status:", error)
    return NextResponse.json({ message: "Failed to check favorite status" }, { status: 500 })
  }
}

