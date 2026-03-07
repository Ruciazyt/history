import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';

import { CHINA_ERAS } from '@/lib/history/data/chinaEras';
import { CHINA_EVENTS } from '@/lib/history/data/chinaEvents';
import { CHINA_RULERS } from '@/lib/history/data/chinaRulers';
import { HistoryApp } from '@/components/HistoryApp';
import { locales, type Locale } from '@/i18n/routing';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) notFound();

  const messages = (await import(`../../messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider
      messages={messages}
      locale={locale}
      onError={() => {
        // Avoid hard crashes in the UI for missing keys during iteration.
      }}
      getMessageFallback={({ key }) => key}
    >
      <HistoryApp eras={CHINA_ERAS} events={CHINA_EVENTS} rulers={CHINA_RULERS} />
    </NextIntlClientProvider>
  );
}
