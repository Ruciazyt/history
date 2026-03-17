import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import type { Metadata } from 'next';

import { CHINA_ERAS } from '@/lib/history/data/chinaEras';
import { CHINA_EVENTS } from '@/lib/history/data/chinaEvents';
import { CHINA_RULERS } from '@/lib/history/data/chinaRulers';
import { BattlesClient } from '@/components/battles/BattlesClient';
import { locales, type Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    zh: '历史战役 - 中国战争地图',
    en: 'Historical Battles - Chinese War Maps',
  };
  const descriptions: Record<string, string> = {
    zh: '探索中国历史上的经典战役，包括长平之战、马陵之战、城濮之战等。分析战役战略、指挥官、胜负因素。',
    en: 'Explore classic battles in Chinese history including Changping, Maling, and Chengpu. Analyze battle strategies and outcomes.',
  };
  
  return {
    title: titles[locale] || titles.zh,
    description: descriptions[locale] || descriptions.zh,
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
      <BattlesClient eras={CHINA_ERAS} events={CHINA_EVENTS} rulers={CHINA_RULERS} locale={locale} />
    </NextIntlClientProvider>
  );
}
