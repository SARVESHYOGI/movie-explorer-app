"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface MovieDetailsProps {
  movie: {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    vote_count: number;
    release_date: string;
    runtime: number | null;
    genres: { id: number; name: string }[];
  };
}

export default function MovieDetails({ movie }: MovieDetailsProps) {
  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!session) return;

      try {
        const response = await fetch(`/api/favorites/${movie.id}`);
        if (response.ok) {
          const data = await response.json();
          setIsFavorite(data.isFavorite);
        }
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    checkFavoriteStatus();
  }, [movie.id, session]);

  const toggleFavorite = async () => {
    if (!session) {
      toast.error("Authentication required", {
        description: "Please log in to add favorites",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isFavorite) {
        const response = await fetch(`/api/favorites/${movie.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setIsFavorite(false);
          toast.success("Removed from favorites", {
            description: `${movie.title} has been removed from your favorites`,
          });
        }
      } else {
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            movieId: movie.id,
            title: movie.title,
            posterPath: movie.poster_path,
            voteAverage: movie.vote_average,
            releaseDate: movie.release_date,
          }),
        });

        if (response.ok) {
          setIsFavorite(true);
          toast.success("Added to favorites", {
            description: `${movie.title} has been added to your favorites`,
          });
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast("Error", {
        description: "Failed to update favorites",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatRuntime = (minutes: number | null) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";
  const formattedDate = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="space-y-8">
      {movie.backdrop_path && (
        <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden">
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        <div className="shrink-0">
          {movie.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={300}
              height={450}
              className="rounded-lg object-cover"
              priority
            />
          ) : (
            <div className="w-[300px] h-[450px] flex items-center justify-center bg-muted rounded-lg">
              <span className="text-muted-foreground">No Image</span>
            </div>
          )}
        </div>

        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{movie.title}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant="outline">{releaseYear}</Badge>
              {movie.runtime && (
                <Badge variant="outline">{formatRuntime(movie.runtime)}</Badge>
              )}
              <Badge variant="secondary">
                {(movie.vote_average * 10).toFixed(0)}% ({movie.vote_count}{" "}
                votes)
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {movie.genres.map((genre) => (
              <Badge key={genre.id} variant="outline">
                {genre.name}
              </Badge>
            ))}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Overview</h2>
            <p className="text-muted-foreground">
              {movie.overview || "No overview available."}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Details</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <dt className="text-sm text-muted-foreground">Release Date</dt>
                <dd>{formattedDate}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Runtime</dt>
                <dd>{formatRuntime(movie.runtime)}</dd>
              </div>
            </dl>
          </div>

          <Button
            onClick={toggleFavorite}
            variant={isFavorite ? "default" : "outline"}
            className={isFavorite ? "bg-red-500 hover:bg-red-600" : ""}
            disabled={isLoading}
          >
            <Heart
              className={`mr-2 h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
            />
            {isLoading
              ? "Processing..."
              : isFavorite
              ? "Remove from Favorites"
              : "Add to Favorites"}
          </Button>
        </div>
      </div>
    </div>
  );
}
