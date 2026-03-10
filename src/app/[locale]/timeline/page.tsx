import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';

import { locales, type Locale } from '@/i18n/routing';
import { TimelineClient } from '@/components/TimelineClient';

export default async function TimelinePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) notFound();

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <TimelineClient locale={locale} />
    </NextIntlClientProvider>
  );
}
