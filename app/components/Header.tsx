'use client';

import { useRef } from 'react';
import { Input, Tabs } from 'antd';
import debounce from 'lodash/debounce';

interface HeaderProps {
  onSearch: (query: string) => void;
  onTabChange: (tab: string) => void;
  activeTab: string;
}

export function Header({ onSearch, onTabChange, activeTab }: HeaderProps) {
  const debouncedSearch = useRef(
    debounce((value: string) => {
      onSearch(value);
    }, 500),
  ).current;

  return (
    <div style={{ padding: '0 16px' }}>
      <Tabs
        activeKey={activeTab}
        centered
        onChange={onTabChange}
        items={[
          { key: 'search', label: 'Search' },
          { key: 'rated', label: 'Rated' },
        ]}
        style={{ marginBottom: 0 }}
      />

      {activeTab === 'search' && (
        <div style={{ paddingBottom: 16 }}>
          <Input
            placeholder="Type to search..."
            style={{ width: '100%' }}
            size="large"
            onChange={(e) => debouncedSearch(e.target.value)}
            allowClear
          />
        </div>
      )}
    </div>
  );
}