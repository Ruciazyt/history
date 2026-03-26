import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { locales, type Locale } from '@/i18n/routing';
import { Shell } from '@/components/Shell';

const localeNames: Record<string, string> = {
  zh: '历史上的今天',
  en: 'On This Day',
  ja: '歴史上の今日',
};

const localeDescriptions: Record<string, string> = {
  zh: '探索中国历史上今天发生的战役与事件',
  en: 'Explore battles and events that happened on this day in Chinese history',
  ja: '中国史上今日の出来事を探索',
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

export default async function OnThisDayPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) notFound();

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return <Shell messages={messages} />;
}
