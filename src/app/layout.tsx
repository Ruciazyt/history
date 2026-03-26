import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'History Atlas',
  description: 'History learning atlas MVP',
  keywords: ['history', 'atlas', 'China', 'dynasty', 'timeline', 'map'],
  authors: [{ name: 'History Atlas Team' }],
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'History Atlas',
    description: 'History learning atlas MVP',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
