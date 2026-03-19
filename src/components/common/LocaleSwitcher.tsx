'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

import { locales, type Locale } from '@/i18n/routing';

function stripLocale(pathname: string) {
  for (const l of locales) {
    const prefix = `/${l}`;
    if (pathname === prefix) return '/';
    if (pathname.startsWith(prefix + '/')) return pathname.slice(prefix.length);
  }
  return pathname;
}

const LABELS: Record<Locale, string> = {
  zh: '中文',
  en: 'English',
  ja: '日本語',
};

export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  return (
    <label className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
      <span className="sr-only">Language</span>
      <select
        value={locale}
        onChange={(e) => {
          const next = e.target.value as Locale;
          const rest = stripLocale(pathname);
          const nextPath = `/${next}${rest}`;
          router.push(nextPath);
        }}
        className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-2 py-1 text-sm cursor-pointer"
      >
        {locales.map((l) => (
          <option key={l} value={l}>
            {LABELS[l]}
          </option>
        ))}
      </select>
    </label>
  );
}
