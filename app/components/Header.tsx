'use client';

import { useRef } from 'react';
import { Input, Tabs } from 'antd';
import debounce from 'lodash/debounce';

interface HeaderProps {
  onSearch: (query: string) => void;
  onTabChange: (tab: string) => void;
}

export function Header({ onSearch, onTabChange }: HeaderProps) {
  const debouncedSearch = useRef(
    debounce((value: string) => {
      onSearch(value);
    }, 500),
  ).current;

  return (
    <div style={{ padding: '0 16px' }}>
      <Tabs
        defaultActiveKey="search"
        centered
        onChange={onTabChange}
        items={[
          { key: 'search', label: 'Search' },
          { key: 'rated', label: 'Rated' },
        ]}
        style={{ marginBottom: 0 }}
      />

      <div style={{ paddingBottom: 16 }}>
        <Input
          placeholder="Type to search..."
          style={{ width: '100%' }}
          size="large"
          onChange={(e) => debouncedSearch(e.target.value)}
          allowClear
        />
      </div>
    </div>
  );
}