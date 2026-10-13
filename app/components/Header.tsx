'use client';

import { useEffect, useState } from 'react';
import { Input, Tabs } from 'antd';

interface HeaderProps {
  onSearch: (query: string) => void;
  onTabChange: (tab: string) => void;
  activeTab: string;
}

export function Header({ onSearch, onTabChange, activeTab }: HeaderProps) {
  const [value, setValue] = useState('return');
  useEffect(() => {
    const timer = setTimeout(() => onSearch(value.trim()), 500);
    return () => clearTimeout(timer);
  }, [value, onSearch]);
  return (
    <header className="app-header">
      <p className="eyebrow">YOUR NEXT MOVIE STARTS HERE</p>
      <h1>Movie Search</h1>
      <p className="subtitle">Find a story worth watching. Keep track of the films you rate.</p>
      <Tabs
        activeKey={activeTab}
        onChange={onTabChange}
        items={[
          { key: 'search', label: 'Search movies' },
          { key: 'rated', label: 'My ratings' },
        ]}
      />
      {activeTab === 'search' && (
        <Input
          aria-label="Search movies by title"
          placeholder="Search by movie title…"
          value={value}
          size="large"
          onChange={(e) => setValue(e.target.value)}
          allowClear
        />
      )}
    </header>
  );
}
