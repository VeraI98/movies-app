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