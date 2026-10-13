import type { MoviesResponse } from '@/app/types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const IMAGE_PLACEHOLDER = '/no-poster.svg';

function getApiKey(): string {
  const key = process.env.NEXT_PUBLIC_MOVIEDB_API_KEY;
  if (!key) {
    throw new Error(
      'NEXT_PUBLIC_MOVIEDB_API_KEY is not defined. Please add it to your .env.local file.',
    );
  }
  return key;
}

export async function createGuestSession(): Promise<{ id: string; expiresAt: string }> {
  const API_KEY = getApiKey();
  const res = await fetch(`${BASE_URL}/authentication/guest_session/new?api_key=${API_KEY}`);

  if (!res.ok) {
    throw new Error(`Failed to create guest session: ${res.status}`);
  }

  const data = await res.json();
  return { id: data.guest_session_id, expiresAt: data.expires_at };
}

export async function fetchMovies(
  query: string = 'return',
  page: number = 1,
  signal?: AbortSignal,
): Promise<MoviesResponse> {
  const API_KEY = getApiKey();
  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`;

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`MovieDB API error: ${res.status}`);
  return res.json();
}

export async function fetchRatedMovies(
  guestSessionId: string,
  page: number = 1,
  signal?: AbortSignal,
): Promise<MoviesResponse> {
  const API_KEY = getApiKey();
  const url = `${BASE_URL}/guest_session/${guestSessionId}/rated/movies?api_key=${API_KEY}&page=${page}`;

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`MovieDB API error: ${res.status}`);
  return res.json();
}

export async function fetchGenres(): Promise<{ id: number; name: string }[]> {
  const API_KEY = getApiKey();
  const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en`);

  if (!res.ok) {
    throw new Error(`Failed to fetch genres: ${res.status}`);
  }

  const data = await res.json();
  return data.genres;
}

export async function addRating(
  movieId: number,
  rating: number,
  guestSessionId: string,
): Promise<void> {
  const API_KEY = getApiKey();
  const res = await fetch(
    `${BASE_URL}/movie/${movieId}/rating?api_key=${API_KEY}&guest_session_id=${guestSessionId}`,
    {
      method: rating === 0 ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: rating === 0 ? undefined : JSON.stringify({ value: rating }),
    },
  );
  if (!res.ok) throw new Error(`Failed to add rating: ${res.status}`);
}
