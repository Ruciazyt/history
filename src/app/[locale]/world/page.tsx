import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { locales, type Locale } from '@/i18n/routing';
import { Shell } from '@/components/Shell';
import { getWorldEraBounds } from '@/lib/history/data/worldBoundaries';

const localeNames: Record<string, string> = {
  zh: '世界帝国',
  en: 'World Empires',
  ja: '世界帝国',
};

const localeDescriptions: Record<string, string> = {
  zh: '欧亚大陆帝国兴衰对比 - 从罗马到蒙古',
  en: 'Eurasian empire rise and fall comparison - From Rome to Mongols',
  ja: 'ユーラシア大陸帝国の興亡比較 - ローマからモンゴルへ',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const name = localeNames[locale] || localeNames.zh;
  const description = localeDescriptions[locale] || localeDescriptions.zh;
  
  return {
    title: `${name} | History Atlas`,
    description,
    openGraph: {
      title: name,
      description,
      type: 'website',
    },
  };
}

export default async function WorldPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) notFound();

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  // 获取欧亚大陆的时间范围
  const { min, max } = getWorldEraBounds('eurasian');

  return <Shell messages={messages} minYear={min} maxYear={max} />;
}
