'use client';

import * as React from 'react';
import Link from 'next/link';
import type { Era, Event } from '@/lib/history/types';
import { getBattles, getBattleStats, getBattleCountByEra } from '@/lib/history/battles';
import { BattleCard } from '@/components/battles/BattleCard';
import { BattleTimeline } from '@/components/battles/BattleTimeline';
import { BattleDetail } from '@/components/battles/BattleDetail';
import { BattleCompare } from '@/components/battles/BattleCompare';
import { BattleGeography } from '@/components/battles/BattleGeography';
import { BattleOfTheDayCard } from '@/components/battles/BattleOfTheDayCard';
import { ThisDayInHistoryCard } from '@/components/battles/ThisDayInHistoryCard';
import { LocaleSwitcher } from '@/components/common/LocaleSwitcher';
import { useTranslations } from 'next-intl';
import { ERA_COLORS } from '@/lib/history/constants';
import { useBattleFavorites } from '@/lib/history/useBattleHooks';
import { getCasualtyStats, getBloodiestBattles, getTotalCasualties } from '@/lib/history/battleCasualties';

export function BattlesClient({
  eras,
  events,
  locale,
}: {
  eras: Era[];
  events: Event[];
  locale?: string;
}) {
  const t = useTranslations('battlesClient');
  const tRoot = useTranslations();
  const tUi = useTranslations('ui');
  const { favoritesCount } = useBattleFavorites();

  const battles = React.useMemo(() => getBattles(events), [events]);
  const stats = React.useMemo(() => getBattleStats(battles), [battles]);
  const casualtyStats = React.useMemo(() => getCasualtyStats(events), [events]);
  const bloodiestBattles = React.useMemo(() => getBloodiestBattles(events, 3), [events]);
  const battleCountByEra = React.useMemo(() =>
    getBattleCountByEra(battles, eras, tRoot),
  [battles, eras, tRoot]);

  const battlesByEra = React.useMemo(() => {
    const map = new Map<string, Event[]>();
    for (const battle of battles) {
      const eraId = battle.entityId;
      if (!map.has(eraId)) map.set(eraId, []);
      map.get(eraId)!.push(battle);
    }
    for (const [, evts] of map) {
      evts.sort((a, b) => a.year - b.year);
    }
    return map;
  }, [battles]);

  const eraOptions = React.useMemo(() => {
    return Array.from(battlesByEra.keys()).map((eraId) => {
      const era = eras.find((e) => e.id === eraId);
      return {
        id: eraId,
        name: era ? tRoot(era.nameKey) : eraId,
      };
    });
  }, [battlesByEra, eras, tRoot]);

  const [selectedEraId, setSelectedEraId] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = React.useState<'grid' | 'timeline'>('grid');
  const [selectedBattle, setSelectedBattle] = React.useState<Event | null>(null);

  const [compareMode, setCompareMode] = React.useState(false);
  const [selectedBattles, setSelectedBattles] = React.useState<Event[]>([]);
  const [compareBattle, setCompareBattle] = React.useState<{ battle1: Event; battle2: Event } | null>(null);

  const displayedBattles = selectedEraId
    ? battlesByEra.get(selectedEraId) || []
    : battles;

  const handleBattleSelect = React.useCallback((battle: Event) => {
    setSelectedBattles(prev => {
      const isSelected = prev.some(b => b.id === battle.id);
      if (isSelected) {
        return prev.filter(b => b.id !== battle.id);
      }
      if (prev.length >= 2) {
        const second = prev[1];
        return second ? [second, battle] : [battle];
      }
      return [...prev, battle];
    });
  }, []);

  React.useEffect(() => {
    if (selectedBattles.length === 2) {
      const battle1 = selectedBattles[0];
      const battle2 = selectedBattles[1];
      if (battle1 && battle2) {
        setCompareBattle({ battle1, battle2 });
        setSelectedBattles([]);
      }
    }
  }, [selectedBattles]);

  return (
    <div className="min-h-screen bg-[var(--color-canvas)]">
      {/* Header - DESIGN.md top-nav style */}
      <header className="sticky top-0 z-10 h-[56px] border-b border-[var(--color-hairline)] bg-[var(--color-canvas)]">
        <div className="flex h-full w-full items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale || 'zh'}`}
              className="text-body-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              ← {t('ui.back')}
            </Link>
            <div className="w-px h-5 bg-[var(--color-hairline)]"></div>
            <h1 className="text-body font-medium">⚔️ {t('nav.battles')}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-caption px-2 py-1 rounded-[var(--rounded-full)] bg-[var(--color-surface-soft)] text-[var(--text-muted)]">
              {t('battleCount', { count: battles.length })}
            </span>
            <button
              onClick={() => {
                setCompareMode(!compareMode);
                setSelectedBattles([]);
              }}
              className={`btn-circle ${compareMode ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]' : ''}`}
              title={tUi('compareMode')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </button>
            <Link
              href={`/${locale || 'zh'}/favorites`}
              className="btn-circle"
              title={tUi('favorites')}
            >
              <span className="text-sm">{favoritesCount > 0 ? '❤️' : '🤍'}</span>
            </Link>
            <div className="flex items-center bg-[var(--color-surface-soft)] rounded-[var(--rounded-pill)] p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-[var(--rounded-pill)] transition-all ${
                  viewMode === 'grid'
                    ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
                title={tUi('gridView')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`p-1.5 rounded-[var(--rounded-pill)] transition-all ${
                  viewMode === 'timeline'
                    ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
                title={tUi('timelineView')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </button>
            </div>
            <LocaleSwitcher />
          </div>
        </div>
      </header>

      {/* Era filter - pill toggle style */}
      <div className="px-4 py-3 overflow-x-auto flex gap-2 scrollbar-hide border-b border-[var(--color-hairline)]">
        <button
          onClick={() => setSelectedEraId(null)}
          className={`shrink-0 px-4 py-1.5 text-sm font-medium rounded-[var(--rounded-pill)] transition-all ${
            selectedEraId === null
              ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
              : 'bg-[var(--color-surface-soft)] text-[var(--text-secondary)] hover:bg-[var(--color-hairline)]'
          }`}
        >
          {t('allEras')}
        </button>
        {eraOptions.map(({ id, name }) => {
          const era = eras.find(e => e.id === id);
          const dotColor = era && ERA_COLORS[id] ? ERA_COLORS[id].dot : 'bg-gray-400';

          return (
            <button
              key={id}
              onClick={() => setSelectedEraId(id)}
              className={`shrink-0 px-4 py-1.5 text-sm font-medium rounded-[var(--rounded-pill)] transition-all flex items-center gap-1.5 ${
                selectedEraId === id
                  ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                  : 'bg-[var(--color-surface-soft)] text-[var(--text-secondary)] hover:bg-[var(--color-hairline)]'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
              {name}
            </button>
          );
        })}
      </div>

      {/* Stats Panel - DESIGN.md color-block section */}
      {selectedEraId === null && (
        <div className="color-block color-block-cream mx-4 mt-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="rounded-[var(--rounded-lg)] bg-[var(--color-canvas)] p-3 border border-[var(--color-hairline)]">
                <div className="text-display-lg font-bold text-[var(--text-primary)]">{stats.attackerWins}</div>
                <div className="text-caption text-[var(--text-muted)]">{t('statsBar.attackerWins')}</div>
              </div>
              <div className="rounded-[var(--rounded-lg)] bg-[var(--color-canvas)] p-3 border border-[var(--color-hairline)]">
                <div className="text-display-lg font-bold text-[var(--text-primary)]">{stats.defenderWins}</div>
                <div className="text-caption text-[var(--text-muted)]">{t('statsBar.defenderWins')}</div>
              </div>
              <div className="rounded-[var(--rounded-lg)] bg-[var(--color-canvas)] p-3 border border-[var(--color-hairline)]">
                <div className="text-display-lg font-bold text-[var(--text-primary)]">{stats.draws}</div>
                <div className="text-caption text-[var(--text-muted)]">{t('statsBar.draws')}</div>
              </div>
              <div className="rounded-[var(--rounded-lg)] bg-[var(--color-canvas)] p-3 border border-[var(--color-hairline)]">
                <div className="text-display-lg font-bold text-[var(--text-primary)]">{stats.inconclusive}</div>
                <div className="text-caption text-[var(--text-muted)]">{t('statsBar.inconclusive')}</div>
              </div>
            </div>

            {/* Casualties stats */}
            {casualtyStats.battlesWithCasualties > 0 && (
              <div className="mt-3">
                <div className="text-caption text-[var(--text-muted)] mb-2">💀 {t('battleDetail.casualtyStats')}</div>
                <div className="rounded-[var(--rounded-lg)] bg-[var(--color-canvas)] p-3 border border-[var(--color-hairline)]">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 text-center">
                      <div className="text-headline font-bold text-[var(--text-primary)]">
                        {casualtyStats.totalCasualties.toLocaleString()}
                      </div>
                      <div className="text-caption text-[var(--text-muted)]">{t('statsBar.totalCasualties')}</div>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="text-headline font-bold text-[var(--text-primary)]">
                        {casualtyStats.battlesWithCasualties}
                      </div>
                      <div className="text-caption text-[var(--text-muted)]">{t('statsBar.battlesWithCasualties')}</div>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="text-headline font-bold text-[var(--text-primary)]">
                        {Math.round(casualtyStats.averageCasualties).toLocaleString()}
                      </div>
                      <div className="text-caption text-[var(--text-muted)]">{t('statsBar.averageCasualties')}</div>
                    </div>
                  </div>
                </div>
                {bloodiestBattles.length > 0 && (
                  <div className="mt-2">
                    <div className="text-caption text-[var(--text-muted)] mb-1.5">🔝 {t('battleDetail.bloodiestBattlesTop', { n: 3 })}</div>
                    <div className="space-y-1">
                      {bloodiestBattles.map((battle, idx) => (
                        <div key={battle.id} className="flex items-center gap-2 px-3 py-1.5 rounded-[var(--rounded-md)] bg-[var(--color-surface-soft)]">
                          <span className={`w-5 h-5 flex items-center justify-center rounded-full text-caption font-bold ${
                            idx === 0 ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]' : 'bg-[var(--color-hairline)] text-[var(--text-secondary)]'
                          }`}>{idx + 1}</span>
                          <span className="flex-1 text-body-sm font-medium truncate">{t(battle.titleKey)}</span>
                          <span className="text-caption text-[var(--text-primary)]">
                            {getTotalCasualties(battle.battle?.casualties).toLocaleString()}
                          </span>
                          <span className="text-caption text-[var(--text-muted)]">{t('statsBar.people')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Era distribution */}
            {battleCountByEra.length > 0 && (
              <div className="mt-3">
                <div className="text-caption text-[var(--text-muted)] mb-2">{t('eraDistribution')}</div>
                <div className="flex flex-wrap gap-2">
                  {battleCountByEra.map(({ eraId, eraName, count }) => {
                    const dotColor = ERA_COLORS[eraId]?.dot ?? 'bg-gray-400';
                    return (
                      <span
                        key={eraId}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--color-canvas)] rounded-[var(--rounded-full)] text-body-sm border border-[var(--color-hairline)]"
                      >
                        <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
                        <span className="font-medium">{eraName}</span>
                        <span className="text-[var(--text-muted)]">{count}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Geographic distribution */}
            <div className="mt-4 pt-4 border-t border-[var(--color-hairline)]">
              <BattleGeography battles={battles} />
            </div>
          </div>
        </div>
      )}

      {/* Selection indicator when in compare mode */}
      {compareMode && selectedBattles.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 bg-[var(--color-primary)] text-[var(--color-on-primary)] px-4 py-2 rounded-[var(--rounded-pill)] shadow-lg flex items-center gap-2">
          <span>{t('compareModeSelected', { count: selectedBattles.length })}</span>
          <button
            onClick={() => setSelectedBattles([])}
            className="hover:opacity-80 rounded-full p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Stats bar */}
      <div className="bg-[var(--color-canvas)] border-b border-[var(--color-hairline)] px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-body-sm">
          <span className="text-[var(--text-secondary)]">
            {selectedEraId ? `${eraOptions.find(e => e.id === selectedEraId)?.name ?? selectedEraId}${t('statsBar.eraPeriod')}` : t('allErasPeriod')}
          </span>
          <span className="text-[var(--text-muted)]">
            {t('battleCount', { count: displayedBattles.length })}
          </span>
        </div>
      </div>

      {/* Battles list */}
      <main className="max-w-4xl mx-auto p-4">
        {/* Battle of the Day - featured card */}
        <div className="mb-6">
          <BattleOfTheDayCard events={events} />
        </div>

        {/* This Day in History */}
        <div className="mb-6">
          <ThisDayInHistoryCard events={events} locale={locale} />
        </div>

        {displayedBattles.length > 0 ? (
          viewMode === 'timeline' ? (
            <BattleTimeline
              battles={displayedBattles}
              eras={eras}
              onBattleClick={setSelectedBattle}
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {displayedBattles.map((battle) => (
                <BattleCard
                  key={battle.id}
                  battle={battle}
                  selectionMode={compareMode}
                  selected={selectedBattles.some(b => b.id === battle.id)}
                  onSelect={handleBattleSelect}
                  locale={locale}
                />
              ))}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-[var(--text-muted)]">
            <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>{t('noBattleData')}</p>
          </div>
        )}
      </main>

      {/* Battle Detail Modal */}
      {selectedBattle && (
        <BattleDetail
          battle={selectedBattle}
          onClose={() => setSelectedBattle(null)}
          allEvents={events}
          onBattleClick={(battle) => setSelectedBattle(battle)}
          locale={locale}
        />
      )}

      {/* Battle Compare Modal */}
      {compareBattle && (
        <BattleCompare
          battle1={compareBattle.battle1}
          battle2={compareBattle.battle2}
          onClose={() => setCompareBattle(null)}
        />
      )}
    </div>
  );
}
