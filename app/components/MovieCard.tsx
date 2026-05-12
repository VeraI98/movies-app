'use client';

import Image from 'next/image';
import { format } from 'date-fns';
import { Tag, Rate, message } from 'antd';
import type { Movie } from '@/app/types/movie';
import { IMAGE_BASE_URL, IMAGE_PLACEHOLDER, addRating } from '@/app/lib/moviedb';
import { truncateText } from '@/app/lib/truncateText';
import { getRatingColor } from '@/app/lib/getRatingColor';
import { useGenres } from '@/app/context/GenreContext';
import { useSession } from '@/app/context/SessionContext';

interface MovieCardProps {
  movie: Movie;
  userRating?: number;
  onRate?: (movieId: number, rating: number) => void;
}

function RatingCircle({ rating }: { rating: number }) {
  const color = getRatingColor(rating);

  return (
    <div
      style={{
        width: 37,
        height: 37,
        borderRadius: '50%',
        border: `3px solid ${color}`,
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <span style={{ color: '#000', fontSize: 12, fontWeight: 700 }}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

export function MovieCard({ movie, userRating = 0, onRate }: MovieCardProps) {
  const { getGenreName } = useGenres();
  const { guestSessionId } = useSession();
  const [messageApi, contextHolder] = message.useMessage();

  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : IMAGE_PLACEHOLDER;

  const releaseDate = movie.release_date
    ? format(new Date(movie.release_date), 'MMMM d, yyyy')
    : 'Unknown date';

  const description = truncateText(movie.overview || 'No description available.', 200);

  async function handleRating(value: number) {
    if (!guestSessionId) return;
    try {
      await addRating(movie.id, value, guestSessionId);
      onRate?.(movie.id, value);
      messageApi.success('Rating saved!');
    } catch {
      messageApi.error('Failed to save rating');
    }
  }

  return (
    <>
      {contextHolder}
      <div
        style={{
          display: 'flex',
          backgroundColor: '#fff',
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          minHeight: 279,
        }}
      >
        <div style={{ position: 'relative', width: 183, flexShrink: 0 }}>
          <Image
            src={posterUrl}
            alt={movie.title}
            fill
            style={{ objectFit: 'cover' }}
            sizes="183px"
            unoptimized={!movie.poster_path}
          />
        </div>

        <div
          style={{
            padding: '16px 16px 12px',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 8,
              marginBottom: 4,
            }}
          >
            <h2
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: '#000000D9',
                margin: 0,
                lineHeight: '22px',
              }}
            >
              {movie.title}
            </h2>
            <RatingCircle rating={movie.vote_average} />
          </div>

          <p style={{ color: '#827E7E', fontSize: 12, margin: '0 0 8px' }}>
            {releaseDate}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
            {movie.genre_ids.map((id) => (
              <Tag key={id} style={{ margin: 0, borderRadius: 2, fontSize: 12 }}>
                {getGenreName(id)}
              </Tag>
            ))}
          </div>

          <p
            style={{
              fontSize: 14,
              color: '#000000D9',
              lineHeight: '22px',
              margin: '0 0 12px',
              flex: 1,
            }}
          >
            {description}
          </p>

          <Rate
            allowHalf
            value={userRating}
            count={10}
            onChange={handleRating}
            style={{ fontSize: 16, color: '#F5A623' }}
          />
        </div>
      </div>
    </>
  );
}