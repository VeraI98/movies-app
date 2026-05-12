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
}

const GenreContext = createContext<GenreContextType>({
  genres: [],
  getGenreName: () => 'Unknown',
});

export function GenreProvider({ children }: { children: React.ReactNode }) {
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    fetchGenres().then(setGenres).catch(console.error);
  }, []);

  function getGenreName(id: number): string {
    return genres.find((g) => g.id === id)?.name ?? 'Unknown';
  }

  return <GenreContext.Provider value={{ genres, getGenreName }}>{children}</GenreContext.Provider>;
}

export function useGenres() {
  return useContext(GenreContext);
}
