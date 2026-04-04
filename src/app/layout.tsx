import type { Metadata } from 'next';
import Header from '@/components/Header/Header';
import './globals.css';

export const metadata: Metadata = {
  title: 'Star Wars Explorer',
  description: 'Browse the Star Wars universe using the SWAPI database',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
