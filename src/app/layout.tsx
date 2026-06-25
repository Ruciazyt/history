import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

// Google Fonts: Inter (figmaSans substitute) + JetBrains Mono (figmaMono substitute)
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'History Atlas',
  description: 'History learning atlas - Explore Chinese dynasties, historical events and figures',
  keywords: ['history', 'atlas', 'China', 'dynasty', 'timeline', 'map'],
  authors: [{ name: 'History Atlas Team' }],
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'History Atlas',
    description: 'History learning atlas - Explore Chinese dynasties, historical events and figures',
    type: 'website',
  },
  other: {
    // Theme color for mobile browser chrome (light mode)
    'theme-color': '#ffffff',
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
    <html className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* Theme color for dark mode - added inline to support prefers-color-scheme */}
        <meta name="theme-color" content="#09090b" media="(prefers-color-scheme: dark)" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
