# Movie Explorer App

## 📌 Overview

The **Movie Explorer App** is a web application built using **Next.js 15** that allows users to browse movies, search for specific ones, and view detailed information. Users can also add movies to their favorites and manage their collection.

## 🚀 Features

### 🔐 Authentication

- User login and registration using **NextAuth.js**
- Authentication state stored in **cookies**.
- Main features accessible only to logged-in users.

### 🎬 Movie Listing Page

- Fetches and displays movies from the **TMDB API**.
- Shows **poster, title, and rating** for each movie.
- Supports **pagination**.

### 🔍 Search Functionality

- Includes a search bar for dynamic movie search.
- Fetches search results from the API and displays them.

### 📃 Movie Detail Page

- Clicking a movie navigates to a detailed page **(/movie/[id])**.
- Displays **title, description, rating, release date, and more**.

### ❤️ Favorite Movies Feature

- Users can **add/remove movies** from their favorites.
- Favorite movies are stored in **MONGODB**.
- Includes a "My Favorites" page to view saved movies.

### 🎨 UI & Performance Considerations

- **Responsive design** using **Tailwind CSS**.
- **Next.js Image Optimization** for faster image loading.
- **Loading skeletons** for better user experience.


## Preview 🖼️
Home Page
![Home Page](https://res.cloudinary.com/dztzgqzjp/image/upload/v1743170686/Screenshot_2025-03-28_193051_z1uyre.png)
Login Page
![Login Page](https://res.cloudinary.com/dztzgqzjp/image/upload/v1743172582/Screenshot_2025-03-28_200534_nwwwc1.png)
Register Page
![Register Page](https://res.cloudinary.com/dztzgqzjp/image/upload/v1743172582/Screenshot_2025-03-28_200552_juyn1u.png)
Query Search Page
![query search page](https://res.cloudinary.com/dztzgqzjp/image/upload/v1743170686/Screenshot_2025-03-28_193221_sj742a.png)
Movie Details Page
![movie details page](https://res.cloudinary.com/dztzgqzjp/image/upload/v1743170686/Screenshot_2025-03-28_193129_m2rfdp.png)
Added Favourite movie
![Favourite Page](https://res.cloudinary.com/dztzgqzjp/image/upload/v1743170686/Screenshot_2025-03-28_193148_g7bzmv.png)
Pagination
![pagination](https://res.cloudinary.com/dztzgqzjp/image/upload/v1743170686/Screenshot_2025-03-28_193307_zsetuv.png)


## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** NextAuth.js
- **API:** TMDB API
- **Deployment:** Vercel

## 🔧 Installation & Setup

```sh
# Clone the repository
git clone https://github.com/SARVESHYOGI/movie-explorer-app.git


# Install dependencies
npm install

# Set up environment variables
# Create a `.env.local` file in the root directory and add:
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
API_ACCESS_TOKEN=your_tmdb_api_access_token
MONGODB_URI=mongodb_uri

# Run the development server
npm run dev

# Open in your browser
http://localhost:3000
```

## 🎉 Credits

- **API:** The Movie Database (TMDB) API.
- **Framework:** Next.js
- **Styling:** Tailwind CSS

## 📩 Contact

For any queries, reach out via [sarveshyogi2005@gmail.com] or open an issue on GitHub.

---

**Happy Coding! 🚀**
