import type { Metadata } from 'next';
import './globals.css';

// Use system fonts to avoid Google Fonts fetch issues
// import { Geist, Geist_Mono } from 'next/font/google';

export const metadata: Metadata = {
  title: 'History Atlas - 中国历史地图集',
  description: '探索中国历史帝王关系、战役地图、时间线可视化。了解春秋战国、秦汉等历史时期的政治格局与战争。',
  keywords: ['中国历史', '历史地图', '战役', '帝王', '春秋战国', '秦汉', '历史学习'],
  authors: [{ name: 'History Atlas' }],
  openGraph: {
    title: 'History Atlas - 中国历史地图集',
    description: '探索中国历史帝王关系、战役地图、时间线可视化',
    type: 'website',
    locale: 'zh_CN',
  },
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
