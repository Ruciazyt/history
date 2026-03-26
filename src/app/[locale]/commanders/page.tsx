import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { locales, type Locale } from '@/i18n/routing';
import { Shell } from '@/components/Shell';

const localeNames: Record<string, string> = {
  zh: '指挥官关系网络',
  en: 'Commander Network',
  ja: '指揮官ネットワーク',
};

const localeDescriptions: Record<string, string> = {
  zh: '中国历史指挥官关系网络 - 分析指挥官之间的合作与对立关系',
  en: 'Chinese history commander network - Analyze cooperation and rivalry between commanders',
  ja: '中国歴史の指揮官ネットワーク - 指揮官間の協力と対立関係を分析',
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

export default async function CommandersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) notFound();

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return <Shell messages={messages} />;
}
