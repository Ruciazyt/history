'use client';

import * as React from 'react';
import { useLocale, useTranslations } from 'next-intl';
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

export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const tLocale = useTranslations('locale');
  const tUi = useTranslations('ui');
  const router = useRouter();
  const pathname = usePathname();

  // DESIGN.md: pill-shaped select with hairline border
  return (
    <label className="inline-flex items-center gap-2 text-body-sm text-[var(--text-secondary)]">
      <span className="sr-only">{tUi('language')}</span>
      <select
        value={locale}
        onChange={(e) => {
          const next = e.target.value as Locale;
          const rest = stripLocale(pathname);
          const nextPath = `/${next}${rest}`;
          router.push(nextPath);
        }}
        className="rounded-[var(--rounded-pill)] border border-[var(--color-hairline)] bg-[var(--color-canvas)] text-[var(--text-secondary)] px-3 py-1 text-body-sm cursor-pointer"
      >
        {locales.map((l) => (
          <option key={l} value={l}>
            {tLocale(l)}
          </option>
        ))}
      </select>
    </label>
  );
}
