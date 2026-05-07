'use client';

import { useEffect, useState } from 'react';
import { Spin, Alert } from 'antd';
import { fetchMovies } from '@/app/lib/moviedb';
import { MovieCard } from './MovieCard';
import type { Movie } from '@/app/types/movie';

interface MovieListProps {
  query?: string;
}

export function MovieList({ query = 'return' }: MovieListProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOffline) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadMovies() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchMovies(query);
        if (!cancelled) setMovies(data.results);
      } catch (err) {
        if (!cancelled) {
          if (!navigator.onLine) {
            setIsOffline(true);
          } else {
            setError(err instanceof Error ? err.message : 'Something went wrong');
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadMovies();
    return () => { cancelled = true; };
  }, [query, isOffline]);

  if (isOffline) {
    return (
      <Alert
        type="warning"
        showIcon
        message="No internet connection"
        description="Please check your network connection and try again."
      />
    );
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', minHeight: 300, alignItems: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        type="error"
        showIcon
        message="Failed to load movies"
        description={error}
      />
    );
  }

  if (movies.length === 0) {
    return (
      <Alert
        type="info"
        showIcon
        message="No movies found"
        description={`No results for "${query}". Try a different search term.`}
      />
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 32 }}>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}