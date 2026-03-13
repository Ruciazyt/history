import type { Metadata } from 'next';
import './globals.css';

// Use system fonts to avoid Google Fonts fetch issues
// import { Geist, Geist_Mono } from 'next/font/google';

export const metadata: Metadata = {
  title: 'History Atlas',
  description: 'History learning atlas MVP',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
