import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { locales, type Locale } from '@/i18n/routing';
import { Shell } from '@/components/Shell';

const localeNames: Record<string, string> = {
  zh: '战役地图',
  en: 'Battle Maps',
  ja: '戦いのマップ',
};

const localeDescriptions: Record<string, string> = {
  zh: '中国历史战役地图 - 查看战役详情、地理位置与历史影响',
  en: 'Chinese history battle maps - View battle details, geographic locations and historical impact',
  ja: '中国歴史の戦いのマップ - 戦の詳細、地理的位置、历史的影响を表示',
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

export default async function BattlesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) notFound();

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return <Shell messages={messages} />;
}
