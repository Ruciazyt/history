'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { BOTTOM_NAV_COLORS } from '@/lib/history/constants';

interface BottomNavProps {
  locale?: string;
}

const NAV_ITEMS = [
  { key: 'home', href: (locale: string) => `/${locale}`, icon: '🏠', labelKey: 'app.title' },
  { key: 'timeline', href: (locale: string) => `/${locale}/timeline`, icon: '📜', labelKey: 'event.viewTimeline' },
  { key: 'battles', href: (locale: string) => `/${locale}/battles`, icon: '⚔️', labelKey: 'nav.battles' },
  { key: 'favorites', href: (locale: string) => `/${locale}/favorites`, icon: '❤️', labelKey: 'nav.favorites' },
  { key: 'commanders', href: (locale: string) => `/${locale}/commanders`, icon: '👑', labelKey: 'nav.commanders' },
  { key: 'world', href: (locale: string) => `/${locale}/world`, icon: '🌍', labelKey: 'world.title' },
];

export const BottomNav = React.memo(function BottomNav({ locale = 'zh' }: BottomNavProps) {
  const t = useTranslations();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === `/${locale}`) {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={`bottom-nav fixed bottom-0 left-0 right-0 z-50 flex items-center border-t lg:hidden ${BOTTOM_NAV_COLORS.container.border} ${BOTTOM_NAV_COLORS.container.bg} ${BOTTOM_NAV_COLORS.container.text} ${BOTTOM_NAV_COLORS.containerDark.bg} ${BOTTOM_NAV_COLORS.containerDark.text}`}
      style={{ height: '60px', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.href(locale));
        return (
          <Link
            key={item.key}
            href={item.href(locale)}
            className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 py-1 transition-all ${
              active
                ? `${BOTTOM_NAV_COLORS.item.active} ${BOTTOM_NAV_COLORS.item.activeDark}`
                : `${BOTTOM_NAV_COLORS.item.inactive} ${BOTTOM_NAV_COLORS.item.inactiveHover} ${BOTTOM_NAV_COLORS.item.inactiveHoverDark}`
            }`}
            style={{ minWidth: '44px' }}
            aria-current={active ? 'page' : undefined}
          >
            {/* Active indicator dot */}
            {active && (
              <span className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500 dark:bg-blue-400" />
            )}
            <span className="text-base leading-none mt-0.5">{item.icon}</span>
            <span
              className={`text-[10px] leading-tight text-center px-0.5 transition-colors ${
                active
                  ? 'font-medium text-blue-600 dark:text-blue-400'
                  : 'text-zinc-400 dark:text-zinc-500'
              }`}
            >
              {t(item.labelKey)}
            </span>
          </Link>
        );
      })}
    </nav>
  );
});