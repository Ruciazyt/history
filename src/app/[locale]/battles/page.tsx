import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';

import { CHINA_ERAS } from '@/lib/history/data/chinaEras';
import { CHINA_EVENTS } from '@/lib/history/data/chinaEvents';
import { BattlesClient } from '@/components/battles/BattlesClient';
import { locales, type Locale } from '@/i18n/routing';

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

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <BattlesClient eras={CHINA_ERAS} events={CHINA_EVENTS} locale={locale} />
    </NextIntlClientProvider>
  );
}
