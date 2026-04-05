import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { locales, type Locale } from '@/i18n/routing';
import { Shell } from '@/components/Shell';

const localeNames: Record<string, string> = {
  zh: '策略知识库',
  en: 'Strategy Encyclopedia',
  ja: '戦略データベース',
};

const localeDescriptions: Record<string, string> = {
  zh: '中国古代战术策略分析 - 伏击、火攻、水攻等战术的使用统计与代表战役',
  en: 'Ancient Chinese battle tactics analysis - usage statistics and representative battles for ambush, fire attack, water attack and more',
  ja: '中国古代の戦闘戦術分析 - 伏撃、火攻、水攻などの使用統計と代表战役',
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

export default async function StrategiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) notFound();

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return <Shell messages={messages} />;
}
