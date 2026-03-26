import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { locales, type Locale } from '@/i18n/routing';
import { Shell } from '@/components/Shell';

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

  return <Shell messages={messages} />;
}
