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
      className={`bottom-nav fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t ${BOTTOM_NAV_COLORS.container.border} ${BOTTOM_NAV_COLORS.container.bg} ${BOTTOM_NAV_COLORS.container.text} ${BOTTOM_NAV_COLORS.containerDark.bg} ${BOTTOM_NAV_COLORS.containerDark.text} lg:hidden`}
      style={{ height: '56px', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.href(locale));
        return (
          <Link
            key={item.key}
            href={item.href(locale)}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-colors ${
              active
                ? `${BOTTOM_NAV_COLORS.item.active} ${BOTTOM_NAV_COLORS.item.activeDark}`
                : `${BOTTOM_NAV_COLORS.item.inactive} ${BOTTOM_NAV_COLORS.item.inactiveHover} ${BOTTOM_NAV_COLORS.item.inactiveHoverDark}`
            }`}
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <span className="text-lg">{item.icon}</span>
            {active && (
              <span className="text-[10px] font-medium leading-none">{t(item.labelKey)}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
});