import { Schema, models, model } from "mongoose"

const FavoriteSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  posterPath: {
    type: String,
    default: null,
  },
  voteAverage: {
    type: Number,
    default: 0,
  },
  releaseDate: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

FavoriteSchema.index({ userId: 1, movieId: 1 }, { unique: true })

export default models.Favorite || model("Favorite", FavoriteSchema)

