import Image from 'next/image';
import { format } from 'date-fns';
import { Tag, Rate } from 'antd';
import type { Movie } from '@/app/types/movie';
import { IMAGE_BASE_URL, IMAGE_PLACEHOLDER } from '@/app/lib/moviedb';
import { truncateText } from '@/app/lib/truncateText';
import { getRatingColor } from '@/app/lib/getRatingColor';

const PLACEHOLDER_GENRES = ['Action', 'Drama'];

interface MovieCardProps {
  movie: Movie;
}

function RatingCircle({ rating }: { rating: number }) {
  const color = getRatingColor(rating);
  const display = rating.toFixed(1);

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
      <span style={{ color: '#000', fontSize: 12, fontWeight: 700 }}>{display}</span>
    </div>
  );
}

export function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : IMAGE_PLACEHOLDER;

  const releaseDate = movie.release_date
    ? format(new Date(movie.release_date), 'MMMM d, yyyy')
    : 'Unknown date';

  const description = truncateText(movie.overview || 'No description available.', 200);

  return (
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
          {PLACEHOLDER_GENRES.map((genre) => (
            <Tag key={genre} style={{ margin: 0, borderRadius: 2, fontSize: 12 }}>
              {genre}
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
          defaultValue={0}
          count={10}
          style={{ fontSize: 16, color: '#F5A623' }}
        />
      </div>
    </div>
  );
}