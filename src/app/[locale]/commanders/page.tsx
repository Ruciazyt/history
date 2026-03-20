import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';

import { CHINA_ERAS } from '@/lib/history/data/chinaEras';
import { CHINA_EVENTS } from '@/lib/history/data/chinaEvents';
import { CommandersClient } from '@/components/commanders/CommandersClient';
import { locales, type Locale } from '@/i18n/routing';

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

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <CommandersClient eras={CHINA_ERAS} events={CHINA_EVENTS} locale={locale} />
    </NextIntlClientProvider>
  );
}
