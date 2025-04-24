import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'Handmade Store',
  description: 'Магазин рукодельных товаров',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#ffffff'
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="ru">
      <body className={inter.className}>{children}</body>
    </html>
  );
} 