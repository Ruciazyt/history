import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';

import { CHINA_ERAS } from '@/lib/history/data/chinaEras';
import { CHINA_RULERS } from '@/lib/history/data/chinaRulers';
import { CHINA_EVENTS } from '@/lib/history/data/chinaEvents';
import { MatrixClient } from '@/components/matrix/MatrixClient';
import { locales, type Locale } from '@/i18n/routing';

const localeNames: Record<string, string> = {
  zh: '多国并立',
  en: 'Parallel Polities',
  ja: '多国並立',
};

const localeDescriptions: Record<string, string> = {
  zh: '中国历史上多国并立时期 - 春秋战国、三国等',
  en: 'Parallel polities in Chinese history - Spring and Autumn, Warring States, Three Kingdoms',
  ja: '中国歴史における多国並立時代 - 春秋戦国時代、三国時代など',
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

export default async function MatrixPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) notFound();

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  // Filter parallel polities eras for the matrix view
  const parallelPolitiesEras = CHINA_ERAS.filter((era) => era.isParallelPolities);

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <MatrixClient
        locale={locale}
        eras={parallelPolitiesEras}
        rulers={CHINA_RULERS}
        events={CHINA_EVENTS}
      />
    </NextIntlClientProvider>
  );
}
