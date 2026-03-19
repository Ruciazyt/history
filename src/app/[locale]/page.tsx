import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';

import { CHINA_ERAS } from '@/lib/history/data/chinaEras';
import { CHINA_EVENTS } from '@/lib/history/data/chinaEvents';
import { CHINA_RULERS } from '@/lib/history/data/chinaRulers';
import { HistoryApp } from '@/components/HistoryApp';
import { ThemeProvider } from '@/components/common/ThemeContext';
import { locales, type Locale } from '@/i18n/routing';

const localeNames: Record<string, string> = {
  zh: '中国史年表',
  en: 'History Atlas',
  ja: '歴史アトラス',
};

const localeDescriptions: Record<string, string> = {
  zh: '中国历史年表地图 - 探索朝代更替、重大事件与历史人物',
  en: 'History learning atlas - Explore dynastic changes, major events and historical figures',
  ja: '歴史学習アトラス - 朝代交代、主な出来事、歴史的人物を探求',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const name = localeNames[locale] || 'History Atlas';
  const description = localeDescriptions[locale] || localeDescriptions.zh;
  
  return {
    title: name,
    description,
    openGraph: {
      title: name,
      description,
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : locale === 'ja' ? 'ja_JP' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: name,
      description,
    },
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
      <ThemeProvider>
        <HistoryApp eras={CHINA_ERAS} events={CHINA_EVENTS} rulers={CHINA_RULERS} locale={locale} />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
