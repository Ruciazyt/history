'use client';

import * as React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

import { locales, type Locale } from '@/i18n/routing';

function stripLocale(pathname: string) {
  // localePrefix is "always". If pathname starts with /en|/ja|/zh, strip it.
  for (const l of locales) {
    const prefix = `/${l}`;
    if (pathname === prefix) return '/';
    if (pathname.startsWith(prefix + '/')) return pathname.slice(prefix.length);
  }
  return pathname;
}

export function LocaleSwitcher() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const value = locale;

  return (
    <label className="inline-flex items-center gap-2 text-sm text-zinc-600">
      <span className="sr-only">Language</span>
      <select
        value={value}
        onChange={(e) => {
          const next = e.target.value as Locale;
          const rest = stripLocale(pathname);
          const nextPath = `/${next}${rest}`;
          router.push(nextPath);
        }}
        className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-sm"
      >
        <option value="zh">{t('locale.zh')}</option>
        <option value="en">{t('locale.en')}</option>
        <option value="ja">{t('locale.ja')}</option>
      </select>
    </label>
  );
}
