import type { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { GenreProvider } from '@/app/context/GenreContext';
import { SessionProvider } from '@/app/context/SessionContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Movie Search',
  description: 'Search movies using MovieDB API',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <SessionProvider>
            <GenreProvider>{children}</GenreProvider>
          </SessionProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
