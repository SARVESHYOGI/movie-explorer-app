"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface MovieProps {
  movie: {
    id: number;
    title: string;
    poster_path: string | null;
    vote_average: number;
    release_date: string;
  };
}

export default function MovieCard({ movie }: MovieProps) {
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

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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
      toast.error("Error", {
        description: "Failed to update favorites",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";
  const rating = movie.vote_average
    ? ((movie.vote_average / 10) * 100).toFixed(0) + "%"
    : "N/A";

  return (
    <Card className="overflow-hidden group">
      <Link href={`/movie/${movie.id}`}>
        <div className="relative aspect-[2/3] overflow-hidden">
          {movie.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform group-hover:scale-105"
              priority={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <span className="text-muted-foreground">No Image</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 rounded-full bg-background/80 backdrop-blur-sm ${
              isFavorite ? "text-red-500" : "text-muted-foreground"
            }`}
            onClick={toggleFavorite}
            disabled={isLoading}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
            <span className="sr-only">
              {isFavorite ? "Remove from favorites" : "Add to favorites"}
            </span>
          </Button>
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/movie/${movie.id}`} className="hover:underline">
          <h3 className="font-medium line-clamp-1">{movie.title}</h3>
        </Link>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Badge variant="outline">{releaseYear}</Badge>
        <Badge variant="secondary">{rating}</Badge>
      </CardFooter>
    </Card>
  );
}
