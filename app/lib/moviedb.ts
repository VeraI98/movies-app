import type { MoviesResponse } from '@/app/types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const IMAGE_PLACEHOLDER = '/no-poster.png';

export async function fetchMovies(
  query: string = 'return',
  page: number = 1,
): Promise<MoviesResponse> {
  const API_KEY = process.env.NEXT_PUBLIC_MOVIEDB_API_KEY ?? '';
  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`MovieDB API error: ${res.status}`);
  }

  return res.json();
}

export async function addRating(movieId: number, rating: number): Promise<void> {
  const API_KEY = process.env.NEXT_PUBLIC_MOVIEDB_API_KEY ?? '';

  // гостевая сессия
  const sessionRes = await fetch(
    `${BASE_URL}/authentication/guest_session/new?api_key=${API_KEY}`,
  );
  const sessionData = await sessionRes.json();
  const guestSessionId = sessionData.guest_session_id;

  // потом рейтинг
  const res = await fetch(
    `${BASE_URL}/movie/${movieId}/rating?api_key=${API_KEY}&guest_session_id=${guestSessionId}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({ value: rating }),
    },
  );

  if (!res.ok) {
    throw new Error(`Failed to add rating: ${res.status}`);
  }
}