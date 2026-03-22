import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/routing';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const LOCALE_TO_HTML_LANG: Record<string, string> = {
  zh: 'zh-CN',
  en: 'en-US',
  ja: 'ja-JP',
};

export async function generateHtmlAttrs({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const htmlLang = LOCALE_TO_HTML_LANG[locale] ?? locale;
  return { lang: htmlLang };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  return children;
}
