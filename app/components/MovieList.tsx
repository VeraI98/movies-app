'use client';

import { useEffect, useState } from 'react';
import { Spin, Alert, Pagination } from 'antd';
import { fetchMovies } from '@/app/lib/moviedb';
import { MovieCard } from './MovieCard';
import type { Movie } from '@/app/types/movie';

interface MovieListProps {
  query: string;
}

export function MovieList({ query }: MovieListProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

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
    setPage(1);
  }, [query]);

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
        const data = await fetchMovies(query || 'return', page);
        if (!cancelled) {
          setMovies(data.results);
          setTotalResults(data.total_results);
        }
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
  }, [query, page, isOffline]);

  if (isOffline) {
    return (
      <Alert
        type="warning"
        showIcon
        title="No internet connection"
        description="Please check your network connection and try again."
      />
    );
  }

  if (error) {
    return <Alert type="error" showIcon title="Failed to load movies" description={error} />;
  }

  if (!loading && movies.length === 0) {
    return (
      <Alert
        type="info"
        showIcon
        title="No movies found"
        description={`No results for "${query}". Try a different search term.`}
      />
    );
  }

  return (
    <div>
      <div style={{ position: 'relative', minHeight: 300 }}>
        {loading && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.7)',
              zIndex: 10,
            }}
          >
            <Spin size="large" />
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 32,
            opacity: loading ? 0.4 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>

      {!loading && totalResults > 20 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
          <Pagination
            current={page}
            total={totalResults}
            pageSize={20}
            onChange={(newPage) => {
              setPage(newPage);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
}