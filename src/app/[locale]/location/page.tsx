import { notFound } from 'next/navigation';

import { locales, type Locale } from '@/i18n/routing';
import { Shell } from '@/components/Shell';

export default async function LocationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) notFound();

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return <Shell messages={messages} />;
}
