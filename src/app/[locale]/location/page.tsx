import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';

import { LocationClient } from '@/components/location/LocationClient';
import { locales, type Locale } from '@/i18n/routing';

export default async function LocationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) notFound();

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <LocationClient locale={locale} />
    </NextIntlClientProvider>
  );
}
