import { Header } from '@/app/components/Header';
import { MovieList } from '@/app/components/MovieList';

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f4f4' }}>
      <div
        style={{
          maxWidth: 1010,
          margin: '0 auto',
          backgroundColor: '#fff',
          minHeight: '100vh',
        }}
      >
        <Header />
        <main style={{ padding: '32px 16px' }}>
          <MovieList />
        </main>
      </div>
    </div>
  );
}