'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Event } from '@/lib/history/types';
import { BattleCard } from '@/components/battles/BattleCard';
import { EmptyState } from '@/components/common/EmptyState';
import { LocaleSwitcher } from '@/components/common/LocaleSwitcher';
import { useBattleFavorites } from '@/lib/history/useBattleHooks';
import { BATTLES_CLIENT_COLORS, FAVORITES_LIST_COLORS } from '@/lib/history/constants';
import { useTranslations } from 'next-intl';
import { getSimilarBattles } from '@/lib/history/battles';

interface FavoritesClientProps {
  battles: Event[];
  locale?: string;
}

export function FavoritesClient({ battles, locale = 'zh' }: FavoritesClientProps) {
  const t = useTranslations();
  const router = useRouter();
  const { favorites, clearFavorites, favoritesCount } = useBattleFavorites();
  
  // Filter battles that are in favorites
  const favoriteBattles = React.useMemo(() => {
    return battles.filter(battle => favorites.includes(battle.id));
  }, [battles, favorites]);

  // Recommended battles based on favorites
  const recommendedBattles = React.useMemo(() => {
    if (favorites.length === 0) return [];
    return getSimilarBattles(battles, favorites, 6);
  }, [battles, favorites]);
  
  // Navigate to battles page
  const handleBrowseBattles = React.useCallback(() => {
    router.push(`/${locale}/battles`);
  }, [router, locale]);
  
  return (
    <div className={`min-h-screen ${BATTLES_CLIENT_COLORS.page.background}`}>
      {/* Header */}
      <header className={`sticky top-0 z-10 border-b ${BATTLES_CLIENT_COLORS.header.border} ${BATTLES_CLIENT_COLORS.header.background} ${BATTLES_CLIENT_COLORS.header.backdrop}`}>
        <div className="flex w-full items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link 
              href={`/${locale}/battles`}
              className={`flex items-center gap-1 text-sm font-medium ${BATTLES_CLIENT_COLORS.backButton.text} ${BATTLES_CLIENT_COLORS.backButton.hover} transition-colors`}
            >
              <span>←</span>
              <span>{t('favorites.backToBattles')}</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <h1 className={`text-lg font-bold ${BATTLES_CLIENT_COLORS.title}`}>
              ❤️ {t('favorites.title')} ({favoritesCount})
            </h1>
            <LocaleSwitcher />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-4">
        {favoriteBattles.length > 0 ? (
          <>
            {/* Clear all button */}
            {favoritesCount > 0 && (
              <div className="flex justify-end mb-4">
                <button
                  onClick={clearFavorites}
                  className={`text-sm px-3 py-1.5 rounded-lg ${FAVORITES_LIST_COLORS.clearButton.bg} ${FAVORITES_LIST_COLORS.clearButton.text} ${FAVORITES_LIST_COLORS.clearButton.hover} transition-colors`}
                >
                  🗑️ {t('favorites.clearAll')}
                </button>
              </div>
            )}
            
            {/* Favorites grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteBattles.map((battle) => (
                <BattleCard 
                  key={battle.id} 
                  battle={battle}
                />
              ))}
            </div>

            {/* Recommendations section */}
            {recommendedBattles.length > 0 && (
              <div className="mt-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">💡</span>
                  <h2 className={`text-lg font-bold ${BATTLES_CLIENT_COLORS.title}`}>
                    {t('favorites.recommendations')}
                  </h2>
                </div>
                <p className={`text-sm mb-4 ${BATTLES_CLIENT_COLORS.subtitle || 'text-zinc-500'}`}>
                  {t('favorites.recommendationsEmpty')}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendedBattles.map((battle) => (
                    <BattleCard 
                      key={battle.id} 
                      battle={battle}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            icon="❤️"
            title={t('favorites.noFavoritesTitle')}
            description={t('favorites.noFavoritesDesc')}
            action={{
              label: t('favorites.browseBattles'),
              onClick: handleBrowseBattles,
            }}
          />
        )}
      </main>
    </div>
  );
}
