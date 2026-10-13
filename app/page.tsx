'use client';

import { useState } from 'react';
import { Header } from '@/app/components/Header';
import { MovieList } from '@/app/components/MovieList';

export default function HomePage() {
  const [query, setQuery] = useState('return');
  const [tab, setTab] = useState('search');
  return (
    <div className="app-shell">
      <Header onSearch={setQuery} onTabChange={setTab} activeTab={tab} />
      <main>
        <MovieList key={`${tab}:${query}`} query={query} tab={tab} />
      </main>
      <footer>
        Movie data and images provided by TMDB. This product uses the TMDB API but is not endorsed
        or certified by TMDB.
      </footer>
    </div>
  );
}
