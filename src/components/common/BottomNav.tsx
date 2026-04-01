'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useDarkMode } from '@/lib/history/hooks/useDarkMode';

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
  const isDark = useDarkMode();

  const isActive = (href: string) => {
    if (href === `/${locale}`) {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    return pathname.startsWith(href);
  };

  const containerClasses = isDark
    ? 'bg-zinc-900/90 border-zinc-700/50 text-zinc-400'
    : 'bg-white/80 border-zinc-200/50 text-zinc-600';

  return (
    <nav
      className={`bottom-nav fixed bottom-0 left-0 right-0 z-50 flex items-center border-t backdrop-blur-md lg:hidden ${containerClasses}`}
      style={{ height: '60px', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.href(locale));
        const labelColor = active
          ? isDark ? 'text-blue-400' : 'text-blue-600'
          : 'text-zinc-400';
        const indicatorColor = isDark ? 'bg-blue-400' : 'bg-blue-500';
        return (
          <Link
            key={item.key}
            href={item.href(locale)}
            className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 py-1 transition-all ${labelColor}`}
            style={{ minWidth: '44px' }}
            aria-current={active ? 'page' : undefined}
          >
            {/* Active indicator dot */}
            {active && (
              <span className={`absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${indicatorColor}`} />
            )}
            <span className="text-base leading-none mt-0.5" aria-hidden="true">{item.icon}</span>
            <span className="text-[10px] leading-tight text-center px-0.5 transition-colors font-medium">
              {t(item.labelKey)}
            </span>
          </Link>
        );
      })}
    </nav>
  );
});
