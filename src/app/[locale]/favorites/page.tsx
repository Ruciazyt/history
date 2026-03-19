import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';

import { CHINA_EVENTS } from '@/lib/history/data/chinaEvents';
import { FavoritesClient } from '@/components/battles/FavoritesClient';
import { locales, type Locale } from '@/i18n/routing';

const localeNames: Record<string, string> = {
  zh: '收藏夹',
  en: 'Favorites',
  ja: 'お気に入り',
};

const localeDescriptions: Record<string, string> = {
  zh: '我的收藏 - 保存您感兴趣的历史事件和战役',
  en: 'My favorites - Save historical events and battles you are interested in',
  ja: 'お気に入り - 興味がある歴史的出来事や戦いを保存',
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

export default async function FavoritesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) notFound();

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <FavoritesClient battles={CHINA_EVENTS} locale={locale} />
    </NextIntlClientProvider>
  );
}
