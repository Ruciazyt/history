import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';

import { CHINA_ERAS } from '@/lib/history/data/chinaEras';
import { CHINA_RULERS } from '@/lib/history/data/chinaRulers';
import { CHINA_EVENTS } from '@/lib/history/data/chinaEvents';
import { MatrixClient } from '@/components/matrix/MatrixClient';
import { locales, type Locale } from '@/i18n/routing';

export default async function MatrixPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) notFound();

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  // Filter parallel polities eras for the matrix view
  const parallelPolitiesEras = CHINA_ERAS.filter((era) => era.isParallelPolities);

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <MatrixClient
        locale={locale}
        eras={parallelPolitiesEras}
        rulers={CHINA_RULERS}
        events={CHINA_EVENTS}
      />
    </NextIntlClientProvider>
  );
}
