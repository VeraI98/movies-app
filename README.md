# 🎬 Movie Search

Find your next movie and keep track of the films you rate.

A responsive frontend application built with **Next.js, React, TypeScript, and Ant Design**, powered by the **TMDB API**.

[🌐 Live Demo](https://movies-app-sa4b.vercel.app/) · [💻 GitHub](https://github.com/VeraI98/movies-app)


---

## ✨ Features

- **Movie search** with a 500 ms debounce.
- **Movie cards** with posters, release dates, genres, descriptions, and community scores.
- **Personal ratings** from 0.5 to 10, with the option to remove a rating.
- **My ratings** tab for movies rated through the current guest session.
- **Pagination** with 20 movies per page.
- **Responsive layout** for desktop and mobile.
- **Fallback images** for missing or broken posters.
- **Loading, empty, offline, and error states**, including a retry button.

## 🛠 Tech Stack

| Category | Technologies |
| :--- | :--- |
| Framework | Next.js 16 · App Router |
| UI | React 19 · Ant Design 6 · CSS |
| Language | TypeScript |
| API | TMDB REST API · Fetch API |
| State | React Hooks · Context API |
| Utilities | date-fns |
| Code Quality | ESLint · Prettier · Husky · lint-staged |
| Testing | Node.js Test Runner |
| Hosting | Vercel |

## 💡 Implementation Highlights

- Cancelled outdated requests with `AbortController` to prevent stale search results.
- Reset pagination when the query or selected tab changes.
- Kept movie search available when guest-session creation or genre loading fails.
- Shared rating updates across tabs through React Context.
- Added pending states during rating submission.
- Implemented rating removal through a `DELETE` request.
- Stored guest-session information in local storage, with an in-memory fallback.
- Separated API functions, shared state, and UI components.

## 🚀 Getting Started

### Requirements

- **Node.js 22.22.1+**
- **npm**
- A [TMDB API key](https://www.themoviedb.org/settings/api)

### 1. Clone and install

```bash
git clone https://github.com/VeraI98/movies-app.git
cd movies-app
npm ci
```

### 2. Configure environment variables

Copy the environment template:

```bash
cp .env.example .env.local
```

Add your TMDB API key to `.env.local`:

```dotenv
NEXT_PUBLIC_MOVIEDB_API_KEY=your_tmdb_api_key
```

Use the **API Key**, rather than the **API Read Access Token**.

### 3. Start the app

```bash
npm run dev
```

Open **[localhost:3000](http://localhost:3000)**.

## 📋 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Run the production build |
| `npm run lint` | Check code with ESLint |
| `npm run lint:fix` | Fix supported lint issues |
| `npm run typecheck` | Check TypeScript types |
| `npm test` | Run API regression tests |
| `npm run format` | Format files with Prettier |
| `npm run format:check` | Check formatting |

## 📁 Project Structure

| Path | Responsibility |
| :--- | :--- |
| `app/page.tsx` | Page layout, search query, and selected tab |
| `app/components/Header.tsx` | Search input, debounce, and tabs |
| `app/components/MovieList.tsx` | Requests, pagination, and result states |
| `app/components/MovieCard.tsx` | Movie details, poster fallback, and ratings |
| `app/context/SessionContext.tsx` | Guest session and shared rating updates |
| `app/context/GenreContext.tsx` | Shared genre dictionary |
| `app/lib/moviedb.ts` | TMDB API functions |
| `app/types/movie.ts` | Movie and API response types |
| `tests/moviedb.test.mjs` | API regression tests |

## ✅ Validation

- ESLint and TypeScript checks passed.
- Production build completed successfully.
- **Six API regression tests** cover requests, ratings, session expiry, and error handling.
- Search, rating submission, the rated list, and rating removal were manually checked locally.

API tests use mocked responses and do not require credentials.

## ☁️ Deployment

Import the repository into **Vercel** and configure:

```dotenv
NEXT_PUBLIC_MOVIEDB_API_KEY=your_tmdb_api_key
```

Deploy again after changing the environment variable.

> The app calls TMDB from the browser, so the `NEXT_PUBLIC_` API key is included in the client bundle. Private server credentials require a server-side integration.

## 📝 Guest Sessions

Ratings belong to a **temporary TMDB guest session**.

- Ratings are not synchronized across browsers.
- An expired or invalidated session may require a new session.
- Existing ratings appear when **My ratings** is loaded.
- Changes made during the current app session also appear in search results.

---

## 👩‍💻 Author

**Vera Ilyasova** · [VeraI98](https://github.com/VeraI98)

Created as a frontend learning project and refined for a developer portfolio.

## Attribution

Movie data and images are provided by [TMDB](https://www.themoviedb.org/).

This product uses the TMDB API but is not endorsed or certified by TMDB.