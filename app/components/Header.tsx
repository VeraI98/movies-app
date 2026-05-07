'use client';

import { Input, Tabs } from 'antd';

export function Header() {
  return (
    <div style={{ padding: '0 16px' }}>
      <Tabs
        defaultActiveKey="search"
        centered
        items={[
          { key: 'search', label: 'Search' },
          { key: 'rated', label: 'Rated' },
        ]}
        style={{ marginBottom: 0 }}
      />

      <div style={{ paddingBottom: 16 }}>
        <Input.Search
          placeholder="Type to search..."
          style={{ width: '100%' }}
          size="large"
          disabled
        />
      </div>
    </div>
  );
}