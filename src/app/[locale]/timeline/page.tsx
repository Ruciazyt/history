import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { locales, type Locale } from '@/i18n/routing';
import { Shell } from '@/components/Shell';

function TimelineLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
    </div>
  );
}

const localeNames: Record<string, string> = {
  zh: '历史时间线',
  en: 'Historical Timeline',
  ja: '歴史年表',
};

const localeDescriptions: Record<string, string> = {
  zh: '中国历史时间线 - 按朝代和年份浏览历史事件',
  en: 'Chinese historical timeline - Browse historical events by dynasty and year',
  ja: '中国歴史年表 - 朝代別、年別で歴史的出来事を閲覧',
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

export default async function TimelinePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) notFound();

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <Suspense fallback={<TimelineLoading />}>
      <Shell messages={messages} />
    </Suspense>
  );
}
