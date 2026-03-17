import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import type { Metadata } from 'next';

import { CHINA_ERAS } from '@/lib/history/data/chinaEras';
import { CHINA_EVENTS } from '@/lib/history/data/chinaEvents';
import { CHINA_RULERS } from '@/lib/history/data/chinaRulers';
import { HistoryApp } from '@/components/HistoryApp';
import { locales, type Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    zh: '中国历史地图集 - History Atlas',
    en: 'Chinese History Atlas - History Atlas',
  };
  const descriptions: Record<string, string> = {
    zh: '探索中国历史帝王关系、战役地图、时间线可视化。了解春秋战国、秦汉等历史时期。',
    en: 'Explore Chinese historical emperor relationships, battle maps, and timeline visualization.',
  };
  
  return {
    title: titles[locale] || titles.zh,
    description: descriptions[locale] || descriptions.zh,
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) notFound();

  const messages = (await import(`../../messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <HistoryApp eras={CHINA_ERAS} events={CHINA_EVENTS} rulers={CHINA_RULERS} locale={locale} />
    </NextIntlClientProvider>
  );
}
