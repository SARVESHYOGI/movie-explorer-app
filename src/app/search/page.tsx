import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { searchMovies } from "@/lib/tmdb";
import SearchResults from "@/components/search-results";
import SearchForm from "@/components/search-form";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { query?: string; page?: string };
}) {
  const session = await getServerSession(authOptions);
  console.log("session in search ", session);
  if (!session) {
    redirect("/login");
  }

  const query = searchParams.query || "";
  const page = Number.parseInt(searchParams.page || "1");

  let results = null;
  let totalPages = 0;

  if (query) {
    const data = await searchMovies(query, page);
    console.log(data);
    results = data.results;
    totalPages = data.total_pages > 500 ? 500 : data.total_pages;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Movies</h1>
      <SearchForm initialQuery={query} />

      {query && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            {results?.length
              ? `Results for "${query}"`
              : `No results found for "${query}"`}
          </h2>

          <SearchResults
            results={results || []}
            currentPage={page}
            totalPages={totalPages}
            query={query}
          />
        </div>
      )}
    </div>
  );
}
