interface Movie {
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
}


const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const TMDB_BASE_URL = "https://api.themoviedb.org/3"

if (!TMDB_API_KEY) {
  console.warn("env not fount api kry")
}

async function fetchFromTMDB(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`)

  url.searchParams.append("api_key", TMDB_API_KEY || "")
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value)
  })

  try {
    const response = await fetch(url.toString(), { next: { revalidate: 3600 } })

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching from TMDB:", error)
    throw error
  }
}

export async function getPopularMovies(page = 1) {
  return fetchFromTMDB("/movie/popular", { page: page.toString() })
}

export async function getMovieDetails(id: string): Promise<Movie | null> {
  return fetchFromTMDB(`/movie/${id}`)
}

export async function searchMovies(query: string, page = 1) {
  return fetchFromTMDB("/search/movie", {
    query,
    page: page.toString(),
    include_adult: "false",
  })
}

export async function getMovieRecommendations(id: string) {
  return fetchFromTMDB(`/movie/${id}/recommendations`)
}

