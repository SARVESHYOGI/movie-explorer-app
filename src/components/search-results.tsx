import Link from "next/link";
import MovieCard from "@/components/movie-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
}

interface SearchResultsProps {
  results: Movie[];
  currentPage: number;
  totalPages: number;
  query: string;
}

export default function SearchResults({
  results,
  currentPage,
  totalPages,
  query,
}: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-muted-foreground">
          No results found. Try a different search term.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {results.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <Link
            href={`/search?query=${encodeURIComponent(query)}&page=${Math.max(
              1,
              currentPage - 1
            )}`}
            aria-disabled={currentPage <= 1}
            tabIndex={currentPage <= 1 ? -1 : undefined}
            className={`${
              currentPage <= 1 ? "pointer-events-none opacity-50" : ""
            }`}
          >
            <Button variant="outline" disabled={currentPage <= 1}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
          </Link>

          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>

          <Link
            href={`/search?query=${encodeURIComponent(query)}&page=${Math.min(
              totalPages,
              currentPage + 1
            )}`}
            aria-disabled={currentPage >= totalPages}
            tabIndex={currentPage >= totalPages ? -1 : undefined}
            className={`${
              currentPage >= totalPages ? "pointer-events-none opacity-50" : ""
            }`}
          >
            <Button variant="outline" disabled={currentPage >= totalPages}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
