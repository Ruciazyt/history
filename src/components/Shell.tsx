'use client';

import * as React from 'react';
import { useParams, usePathname } from 'next/navigation';
import { NextIntlClientProvider, useTranslations } from 'next-intl';

import { HistoryApp } from '@/components/HistoryApp';
import { ThemeProvider } from '@/components/common/ThemeContext';
import { TimelineClient } from '@/components/timeline/TimelineClient';
import { BattlesClient } from '@/components/battles/BattlesClient';
import { CommandersClient } from '@/components/commanders/CommandersClient';
import { FavoritesClient } from '@/components/battles/FavoritesClient';
import { OnThisDayClient } from '@/components/battles/OnThisDayClient';
import { QuizClient } from '@/components/battles/QuizClient';
import { WorldClient } from '@/components/world/WorldClient';
import { MatrixClient } from '@/components/matrix/MatrixClient';
import { EurasianGrid } from '@/components/world/EurasianGrid';
import { PlaceNameEvolution } from '@/components/world/PlaceNameEvolution';
import { LocationClient } from '@/components/location/LocationClient';

import { CHINA_ERAS } from '@/lib/history/data/chinaEras';
import { CHINA_EVENTS } from '@/lib/history/data/chinaEvents';
import { CHINA_RULERS } from '@/lib/history/data/chinaRulers';
import { getWorldEraBounds } from '@/lib/history/data/worldBoundaries';

export interface ShellProps {
  messages: Record<string, unknown>;
  children?: React.ReactNode;
  // For world page
  minYear?: number;
  maxYear?: number;
  // For matrix page - pre-filtered eras
  eras?: typeof CHINA_ERAS;
}

export function Shell({ messages, children, minYear, maxYear, eras }: ShellProps) {
  const params = useParams();
  const pathname = usePathname();
  const locale = (params.locale as string) || 'zh';

  // If children are provided (e.g., from matrix page with pre-filtered eras), use them.
  // Otherwise fall back to pathname-based rendering for simpler pages.
  const pageContent = React.useMemo(() => {
    if (children) return children;

    if (pathname === `/${locale}` || pathname === `/${locale}/`) {
      return (
        <ThemeProvider>
          <HistoryApp
            eras={CHINA_ERAS}
            events={CHINA_EVENTS}
            rulers={CHINA_RULERS}
            locale={locale}
          />
        </ThemeProvider>
      );
    }

    if (pathname === `/${locale}/timeline`) {
      return <TimelineClient locale={locale} />;
    }

    if (pathname === `/${locale}/battles`) {
      return <BattlesClient eras={CHINA_ERAS} events={CHINA_EVENTS} locale={locale} />;
    }

    if (pathname === `/${locale}/commanders`) {
      return <CommandersClient eras={CHINA_ERAS} events={CHINA_EVENTS} locale={locale} />;
    }

    if (pathname === `/${locale}/favorites`) {
      return <FavoritesClient battles={CHINA_EVENTS} locale={locale} />;
    }

    if (pathname === `/${locale}/on-this-day`) {
      return <OnThisDayClient events={CHINA_EVENTS} locale={locale} />;
    }

    if (pathname === `/${locale}/quiz`) {
      return <QuizClient events={CHINA_EVENTS} locale={locale} />;
    }

    if (pathname === `/${locale}/world`) {
      const bounds = getWorldEraBounds('eurasian');
      return <WorldClient locale={locale} minYear={minYear ?? bounds.min} maxYear={maxYear ?? bounds.max} />;
    }

    if (pathname === `/${locale}/matrix`) {
      return (
        <MatrixClient
          eras={eras ?? CHINA_ERAS}
          rulers={CHINA_RULERS}
          events={CHINA_EVENTS}
          locale={locale}
        />
      );
    }

    if (pathname === `/${locale}/grid`) {
      return <EurasianGrid />;
    }

    if (pathname === `/${locale}/place-names`) {
      return <PlaceNameEvolution />;
    }

    if (pathname === `/${locale}/location`) {
      return <LocationClient locale={locale} />;
    }

    return null;
  }, [pathname, locale, children, minYear, maxYear, eras]);

  const NotFoundPage = () => {
    const t = useTranslations('ui');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-zinc-500">{t('pageNotFound')}</p>
      </div>
    );
  };

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      {pageContent ?? <NotFoundPage />}
    </NextIntlClientProvider>
  );
}
