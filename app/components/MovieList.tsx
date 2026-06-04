'use client';

import { useEffect, useState } from 'react';
import { Spin, Alert, Pagination } from 'antd';
import { fetchMovies, fetchRatedMovies } from '@/app/lib/moviedb';
import { useSession } from '@/app/context/SessionContext';
import { useGenres } from '@/app/context/GenreContext';
import { MovieCard } from './MovieCard';
import type { Movie } from '@/app/types/movie';

interface MovieListProps {
  query: string;
  tab: string;
}

export function MovieList({ query, tab }: MovieListProps) {
  const { guestSessionId } = useSession();
  const { genreError } = useGenres();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [userRatings, setUserRatings] = useState<Record<number, number>>({});

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
  }, [query, tab]);

  useEffect(() => {
    if (isOffline || !guestSessionId) return;

    const controller = new AbortController();

    async function loadMovies() {
      setLoading(true);
      setError(null);

      try {
        let data;

        if (tab === 'rated') {
          data = await fetchRatedMovies(guestSessionId, page);
          const ratings: Record<number, number> = {};
          data.results.forEach((m: Movie & { rating?: number }) => {
            if (m.rating) ratings[m.id] = m.rating;
          });
          setUserRatings((prev) => ({ ...prev, ...ratings }));
        } else {
          data = await fetchMovies(query || 'return', page);
        }

        setMovies(data.results);
        setTotalResults(data.total_results);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;

        if (!navigator.onLine) {
          setIsOffline(true);
        } else {
          setError(err instanceof Error ? err.message : 'Something went wrong');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadMovies();

    return () => {
      controller.abort();
    };
  }, [query, page, tab, isOffline, guestSessionId]);

  function handleRate(movieId: number, rating: number) {
    setUserRatings((prev) => ({ ...prev, [movieId]: rating }));
  }

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

  if (genreError) {
    return (
      <Alert
        type="warning"
        showIcon
        title="Failed to load genres"
        description={genreError}
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
        title={tab === 'rated' ? 'No rated movies yet' : 'No movies found'}
        description={
          tab === 'rated'
            ? 'Rate some movies in the Search tab and they will appear here.'
            : `No results for "${query}". Try a different search term.`
        }
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
            <MovieCard
              key={movie.id}
              movie={movie}
              userRating={userRatings[movie.id] ?? 0}
              onRate={handleRate}
            />
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