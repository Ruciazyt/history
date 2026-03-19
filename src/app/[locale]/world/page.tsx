import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';

import { WorldClient } from '@/components/world/WorldClient';
import { locales, type Locale } from '@/i18n/routing';
import { getWorldEraBounds } from '@/lib/history/data/worldBoundaries';

export default async function WorldPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) notFound();

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  // 获取欧亚大陆的时间范围
  const { min, max } = getWorldEraBounds('eurasian');

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <WorldClient
        locale={locale}
        minYear={min}
        maxYear={max}
      />
    </NextIntlClientProvider>
  );
}
