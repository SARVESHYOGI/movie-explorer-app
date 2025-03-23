const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = "https://api.themoviedb.org/3"

// Ensure API key is available
if (!TMDB_API_KEY) {
  console.warn("TMDB_API_KEY is not defined in environment variables")
}

// Helper function to make API requests
async function fetchFromTMDB(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`)

  // Add API key and other params
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

// Get popular movies
export async function getPopularMovies(page = 1) {
  return fetchFromTMDB("/movie/popular", { page: page.toString() })
}

// Get movie details
export async function getMovieDetails(id: string) {
  return fetchFromTMDB(`/movie/${id}`)
}

// Search movies
export async function searchMovies(query: string, page = 1) {
  return fetchFromTMDB("/search/movie", {
    query,
    page: page.toString(),
    include_adult: "false",
  })
}

// Get movie recommendations
export async function getMovieRecommendations(id: string) {
  return fetchFromTMDB(`/movie/${id}/recommendations`)
}

