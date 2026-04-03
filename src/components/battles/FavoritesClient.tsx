'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();
  const { favorites, clearFavorites, favoritesCount, addFavorite } = useBattleFavorites();
  const [copied, setCopied] = React.useState(false);
  const [imported, setImported] = React.useState<number | null>(null);
  
  // Import favorites from URL params on mount
  React.useEffect(() => {
    const shareParam = searchParams.get('f');
    if (!shareParam) return;
    
    try {
      const sharedIds = shareParam.split(',').filter(Boolean);
      if (sharedIds.length === 0) return;
      
      // Only import IDs that exist in our battles data
      const validIds = sharedIds.filter(id => battles.some(b => b.id === id));
      let importCount = 0;
      
      for (const id of validIds) {
        if (!favorites.includes(id)) {
          addFavorite(id);
          importCount++;
        }
      }
      
      if (importCount > 0) {
        setImported(importCount);
        // Clear URL param after import
        router.replace(`/${locale}/favorites`);
      }
    } catch {
      // Invalid share param, ignore
    }
  }, [searchParams, battles, favorites, addFavorite, router, locale]);
  
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
  
  // Share favorites as URL
  const handleShare = React.useCallback(() => {
    if (favorites.length === 0) return;
    const url = `${window.location.origin}/${locale}/favorites?f=${favorites.join(',')}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [favorites, locale]);
  
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
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
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
        {/* Import notification */}
        {imported !== null && (
          <div className="mb-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3 text-sm text-green-700 dark:text-green-300">
            ✅ {t('favorites.imported', { count: imported })}
          </div>
        )}
        
        {favoriteBattles.length > 0 ? (
          <>
            {/* Action buttons */}
            {favoritesCount > 0 && (
              <div className="flex justify-end gap-2 mb-4">
                <button
                  onClick={handleShare}
                  className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${
                    copied
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300'
                      : 'border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {copied ? '✅ ' + t('favorites.linkCopied') : '🔗 ' + t('favorites.shareFavorites')}
                </button>
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
                <p className="text-sm mb-4 text-zinc-500">
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
