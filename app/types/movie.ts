export interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  poster_path: string | null;
  genre_ids: number[];
}

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}
