import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getMovieDetails } from "@/lib/tmdb";
import MovieDetails from "@/components/movie-details";
import { Skeleton } from "@/components/ui/skeleton";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const movie = await getMovieDetails(params.id);

  if (!movie) {
    return {
      title: "Movie Not Found",
    };
  }

  return {
    title: `${movie.title} - Movie Explorer`,
    description: movie.overview,
  };
}

export default async function MoviePage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const movie = await getMovieDetails(params.id);

  if (!movie) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<MovieDetailsSkeleton />}>
        <MovieDetails movie={movie} />
      </Suspense>
    </div>
  );
}

function MovieDetailsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        <Skeleton className="h-[450px] w-[300px] rounded-lg" />
        <div className="flex-1 space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-4 w-1/3" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    </div>
  );
}
