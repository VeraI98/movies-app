'use client';

import { useEffect, useState } from 'react';
import { Spin, Alert, Pagination, Button } from 'antd';
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
  const { guestSessionId, sessionError, ratings, saveRating } = useSession();
  const { genreError } = useGenres();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    const timer = setTimeout(() => setIsOffline(!navigator.onLine), 0);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOffline || (tab === 'rated' && !guestSessionId) || (tab === 'search' && !query)) return;

    const controller = new AbortController();

    async function loadMovies() {
      setLoading(true);
      setError(null);

      try {
        let data;

        if (tab === 'rated') {
          data = await fetchRatedMovies(guestSessionId, page, controller.signal);
        } else {
          data = await fetchMovies(query, page, controller.signal);
        }

        if (controller.signal.aborted) return;
        setMovies(data.results);
        setTotalResults(data.total_results);
      } catch (err) {
        if (controller.signal.aborted) return;

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
  }, [query, page, tab, isOffline, guestSessionId, retry]);

  function handleRate(movieId: number, rating: number) {
    saveRating(movieId, rating);
    if (tab === 'rated') setRetry((value) => value + 1);
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

  if (tab === 'rated' && sessionError) {
    return <Alert type="warning" showIcon title="Ratings unavailable" description={sessionError} />;
  }

  if (tab === 'search' && !query) {
    return (
      <Alert
        type="info"
        showIcon
        title="Find your next movie"
        description="Enter a movie title in the search box above."
      />
    );
  }

  if (error) {
    return (
      <Alert
        type="error"
        showIcon
        title="Failed to load movies"
        description={error}
        action={<Button onClick={() => setRetry((value) => value + 1)}>Try again</Button>}
      />
    );
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
      {genreError && (
        <Alert
          type="warning"
          showIcon
          title="Genres unavailable"
          description="You can still search and rate movies."
        />
      )}
      {sessionError && (
        <Alert type="warning" showIcon title="Ratings unavailable" description={sessionError} />
      )}
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

        <div className="movie-grid" aria-busy={loading} style={{ opacity: loading ? 0.4 : 1 }}>
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              userRating={ratings[movie.id] ?? movie.rating ?? 0}
              onRate={handleRate}
            />
          ))}
        </div>
      </div>

      {!loading && totalResults > 20 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
          <Pagination
            current={page}
            total={Math.min(totalResults, 10000)}
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
