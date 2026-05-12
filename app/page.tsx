'use client';

import { useState } from 'react';
import { Header } from '@/app/components/Header';
import { MovieList } from '@/app/components/MovieList';

export default function HomePage() {
  const [query, setQuery] = useState('return');
  const [tab, setTab] = useState('search');

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
        <Header
          onSearch={setQuery}
          onTabChange={setTab}
          activeTab={tab}
        />
        <main style={{ padding: '32px 16px' }}>
          <MovieList query={query} tab={tab} />
        </main>
      </div>
    </div>
  );
}