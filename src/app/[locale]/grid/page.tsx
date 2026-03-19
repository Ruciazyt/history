import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';

import { EurasianGrid } from '@/components/world/EurasianGrid';
import { locales, type Locale } from '@/i18n/routing';

const localeNames: Record<string, string> = {
  zh: '欧亚对比网格',
  en: 'Eurasian Grid',
  ja: 'ユーラシアグリッド',
};

const localeDescriptions: Record<string, string> = {
  zh: '欧亚大陆各政权时空对比网格视图',
  en: 'Spatiotemporal comparison grid of Eurasian polities',
  ja: 'ユーラシア大陸の政体の時空比較グリッド',
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

export default async function GridPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) notFound();

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <EurasianGrid initialMode="eurasian" />
    </NextIntlClientProvider>
  );
}
