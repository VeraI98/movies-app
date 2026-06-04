'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { fetchGenres } from '@/app/lib/moviedb';

interface Genre {
  id: number;
  name: string;
}

interface GenreContextType {
  genres: Genre[];
  getGenreName: (id: number) => string;
  genreError: string | null;
}

const GenreContext = createContext<GenreContextType>({
  genres: [],
  getGenreName: () => 'Unknown',
  genreError: null,
});

export function GenreProvider({ children }: { children: React.ReactNode }) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [genreError, setGenreError] = useState<string | null>(null);

  useEffect(() => {
    fetchGenres()
      .then(setGenres)
      .catch((err: Error) => {
        setGenreError(err.message);
      });
  }, []);

  function getGenreName(id: number): string {
    return genres.find((g) => g.id === id)?.name ?? 'Unknown';
  }

  return (
    <GenreContext.Provider value={{ genres, getGenreName, genreError }}>
      {children}
    </GenreContext.Provider>
  );
}

export function useGenres() {
  return useContext(GenreContext);
}