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
import { BATTLES_CLIENT_COLORS, ERA_COLORS } from '@/lib/history/constants';
import { useBattleFavorites } from '@/lib/history/useBattleHooks';
import { getCasualtyStats } from '@/lib/history/battleCasualties';

export function BattlesClient({
  eras,
  events,
  locale,
}: {
  eras: Era[];
  events: Event[];
  locale?: string;
}) {
  const t = useTranslations();
  const { favoritesCount } = useBattleFavorites();
  
  const battles = React.useMemo(() => getBattles(events), [events]);
  
  // Battle statistics
  const stats = React.useMemo(() => getBattleStats(battles), [battles]);
  
  // Casualty statistics
  const casualtyStats = React.useMemo(() => getCasualtyStats(events), [events]);
  
  // Battle count by era
  const battleCountByEra = React.useMemo(() => 
    getBattleCountByEra(battles, eras, t), 
  [battles, eras, t]);
  
  // Group battles by era ID (not localized name — locale-independent keying)
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

  // Build locale-independent era options (id → localized name)
  const eraOptions = React.useMemo(() => {
    return Array.from(battlesByEra.keys()).map((eraId) => {
      const era = eras.find((e) => e.id === eraId);
      return {
        id: eraId,
        name: era ? t(era.nameKey) : eraId,
      };
    });
  }, [battlesByEra, eras, t]);

  const [selectedEraId, setSelectedEraId] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = React.useState<'grid' | 'timeline'>('grid');
  const [selectedBattle, setSelectedBattle] = React.useState<Event | null>(null);

  // Comparison mode state
  const [compareMode, setCompareMode] = React.useState(false);
  const [selectedBattles, setSelectedBattles] = React.useState<Event[]>([]);
  const [compareBattle, setCompareBattle] = React.useState<{ battle1: Event; battle2: Event } | null>(null);

  const displayedBattles = selectedEraId
    ? battlesByEra.get(selectedEraId) || []
    : battles;

  
  // Handler for selecting battles in compare mode
  const handleBattleSelect = React.useCallback((battle: Event) => {
    setSelectedBattles(prev => {
      const isSelected = prev.some(b => b.id === battle.id);
      if (isSelected) {
        return prev.filter(b => b.id !== battle.id);
      }
      if (prev.length >= 2) {
        // Replace the first one if already 2 selected
        const second = prev[1];
        return second ? [second, battle] : [battle];
      }
      return [...prev, battle];
    });
  }, []);
  
  // Auto-open compare modal when 2 battles are selected
  React.useEffect(() => {
    if (selectedBattles.length === 2) {
      const battle1 = selectedBattles[0];
      const battle2 = selectedBattles[1];
      if (battle1 && battle2) {
        setCompareBattle({ battle1, battle2 });
        setSelectedBattles([]); // Clear selection after opening
      }
    }
  }, [selectedBattles]);
  
  return (
    <div className={`min-h-screen ${BATTLES_CLIENT_COLORS.page.background}`}>
      {/* Header */}
      <header className={`sticky top-0 z-10 border-b ${BATTLES_CLIENT_COLORS.header.border} ${BATTLES_CLIENT_COLORS.header.background} ${BATTLES_CLIENT_COLORS.header.backdrop}`}>
        <div className="flex w-full items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link 
              href={`/${locale || 'zh'}`} 
              className={`flex items-center gap-1 text-sm font-medium ${BATTLES_CLIENT_COLORS.backButton.text} ${BATTLES_CLIENT_COLORS.backButton.hover} transition-colors`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t('ui.back')}
            </Link>
            <div className={`w-px h-5 ${BATTLES_CLIENT_COLORS.divider}`}></div>
            <h1 className={`text-lg font-bold ${BATTLES_CLIENT_COLORS.title}`}>⚔️ {t('nav.battles')}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs ${BATTLES_CLIENT_COLORS.badge.text} ${BATTLES_CLIENT_COLORS.badge.background} px-2 py-1 rounded-full`}>
              {battles.length} 场战役
            </span>
            {/* Compare mode toggle */}
            <button
              onClick={() => {
                setCompareMode(!compareMode);
                setSelectedBattles([]);
              }}
              className={`p-1.5 rounded-lg transition-all ${
                compareMode 
                  ? `${BATTLES_CLIENT_COLORS.compareButton.activeBg} ${BATTLES_CLIENT_COLORS.compareButton.activeText}` 
                  : `${BATTLES_CLIENT_COLORS.compareButton.inactiveText} ${BATTLES_CLIENT_COLORS.compareButton.inactiveHover}`
              }`}
              title="对比模式"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </button>
            {/* Favorites link */}
            <Link
              href={`/${locale || 'zh'}/favorites`}
              className={`p-1.5 rounded-lg transition-all ${BATTLES_CLIENT_COLORS.compareButton.inactiveText} ${BATTLES_CLIENT_COLORS.compareButton.inactiveHover}`}
              title="收藏夹"
            >
              <span className="text-sm">{favoritesCount > 0 ? '❤️' : '🤍'}</span>
            </Link>
            {/* View toggle */}
            <div className={`flex items-center ${BATTLES_CLIENT_COLORS.viewToggle.container} rounded-lg p-0.5`}>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'grid' 
                    ? `${BATTLES_CLIENT_COLORS.viewToggle.activeBg} ${BATTLES_CLIENT_COLORS.viewToggle.activeText} ${BATTLES_CLIENT_COLORS.viewToggle.activeShadow}` 
                    : `${BATTLES_CLIENT_COLORS.viewToggle.inactiveText} ${BATTLES_CLIENT_COLORS.viewToggle.inactiveHover}`
                }`}
                title="网格视图"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'timeline' 
                    ? `${BATTLES_CLIENT_COLORS.viewToggle.activeBg} ${BATTLES_CLIENT_COLORS.viewToggle.activeText} ${BATTLES_CLIENT_COLORS.viewToggle.activeShadow}` 
                    : `${BATTLES_CLIENT_COLORS.viewToggle.inactiveText} ${BATTLES_CLIENT_COLORS.viewToggle.inactiveHover}`
                }`}
                title="时间线视图"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </button>
            </div>
            <LocaleSwitcher />
          </div>
        </div>
        
        {/* Era filter - scrollable on mobile */}
        <div className="px-4 pb-3 overflow-x-auto flex gap-2 scrollbar-hide -mb-3">
          <button
            onClick={() => setSelectedEraId(null)}
            className={`shrink-0 px-4 py-1.5 text-sm font-medium rounded-full border transition-all ${
              selectedEraId === null
                ? `${BATTLES_CLIENT_COLORS.eraFilter.active.bg} ${BATTLES_CLIENT_COLORS.eraFilter.active.text} ${BATTLES_CLIENT_COLORS.eraFilter.active.border} ${BATTLES_CLIENT_COLORS.eraFilter.active.shadow}`
                : `${BATTLES_CLIENT_COLORS.eraFilter.inactive.bg} ${BATTLES_CLIENT_COLORS.eraFilter.inactive.text} ${BATTLES_CLIENT_COLORS.eraFilter.inactive.border} ${BATTLES_CLIENT_COLORS.eraFilter.inactive.hover}`
            }`}
          >
            全部
          </button>
          {eraOptions.map(({ id, name }) => {
            const era = eras.find(e => e.id === id);
            const dotColor = era && ERA_COLORS[id] ? ERA_COLORS[id].dot : BATTLES_CLIENT_COLORS.battleDot.default;

            return (
              <button
                key={id}
                onClick={() => setSelectedEraId(id)}
                className={`shrink-0 px-4 py-1.5 text-sm font-medium rounded-full border transition-all flex items-center gap-1.5 ${
                  selectedEraId === id
                    ? `${BATTLES_CLIENT_COLORS.eraFilter.active.bg} ${BATTLES_CLIENT_COLORS.eraFilter.active.text} ${BATTLES_CLIENT_COLORS.eraFilter.active.border} ${BATTLES_CLIENT_COLORS.eraFilter.active.shadow}`
                    : `${BATTLES_CLIENT_COLORS.eraFilter.inactive.bg} ${BATTLES_CLIENT_COLORS.eraFilter.inactive.text} ${BATTLES_CLIENT_COLORS.eraFilter.inactive.border} ${BATTLES_CLIENT_COLORS.eraFilter.inactive.hover}`
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
                {name}
              </button>
            );
          })}
        </div>
      </header>
      
      {/* Stats Panel */}
      {selectedEraId === null && (
        <div className={`${BATTLES_CLIENT_COLORS.section.bg} ${BATTLES_CLIENT_COLORS.section.border} ${BATTLES_CLIENT_COLORS.section.padding}`}>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className={`bg-gradient-to-br ${BATTLES_CLIENT_COLORS.statCards.attackerWins.gradient} rounded-xl p-3 border ${BATTLES_CLIENT_COLORS.statCards.attackerWins.border}`}>
                <div className={`text-2xl font-bold ${BATTLES_CLIENT_COLORS.statCards.attackerWins.value}`}>{stats.attackerWins}</div>
                <div className={`text-xs ${BATTLES_CLIENT_COLORS.statCards.attackerWins.label}`}>进攻方胜利</div>
              </div>
              <div className={`bg-gradient-to-br ${BATTLES_CLIENT_COLORS.statCards.defenderWins.gradient} rounded-xl p-3 border ${BATTLES_CLIENT_COLORS.statCards.defenderWins.border}`}>
                <div className={`text-2xl font-bold ${BATTLES_CLIENT_COLORS.statCards.defenderWins.value}`}>{stats.defenderWins}</div>
                <div className={`text-xs ${BATTLES_CLIENT_COLORS.statCards.defenderWins.label}`}>防守方胜利</div>
              </div>
              <div className={`bg-gradient-to-br ${BATTLES_CLIENT_COLORS.statCards.draws.gradient} rounded-xl p-3 border ${BATTLES_CLIENT_COLORS.statCards.draws.border}`}>
                <div className={`text-2xl font-bold ${BATTLES_CLIENT_COLORS.statCards.draws.value}`}>{stats.draws}</div>
                <div className={`text-xs ${BATTLES_CLIENT_COLORS.statCards.draws.label}`}>平局</div>
              </div>
              <div className={`bg-gradient-to-br ${BATTLES_CLIENT_COLORS.statCards.inconclusive.gradient} rounded-xl p-3 border ${BATTLES_CLIENT_COLORS.statCards.inconclusive.border}`}>
                <div className={`text-2xl font-bold ${BATTLES_CLIENT_COLORS.statCards.inconclusive.value}`}>{stats.inconclusive}</div>
                <div className={`text-xs ${BATTLES_CLIENT_COLORS.statCards.inconclusive.label}`}>胜负未明</div>
              </div>
            </div>

            {/* Casualties stats */}
            {casualtyStats.battlesWithCasualties > 0 && (
              <div className="mt-3">
                <div className={`text-xs ${BATTLES_CLIENT_COLORS.eraDistribution.label} mb-2`}>💀 伤亡统计</div>
                <div className={`bg-gradient-to-br ${BATTLES_CLIENT_COLORS.statCards.casualties.gradient} rounded-xl p-3 border ${BATTLES_CLIENT_COLORS.statCards.casualties.border}`}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 text-center">
                      <div className={`text-xl font-bold ${BATTLES_CLIENT_COLORS.statCards.casualties.value}`}>
                        {casualtyStats.totalCasualties.toLocaleString()}
                      </div>
                      <div className={`text-xs ${BATTLES_CLIENT_COLORS.statCards.casualties.label}`}>总伤亡</div>
                    </div>
                    <div className="flex-1 text-center">
                      <div className={`text-xl font-bold ${BATTLES_CLIENT_COLORS.statCards.casualties.value}`}>
                        {casualtyStats.battlesWithCasualties}
                      </div>
                      <div className={`text-xs ${BATTLES_CLIENT_COLORS.statCards.casualties.label}`}>有伤亡记录</div>
                    </div>
                    <div className="flex-1 text-center">
                      <div className={`text-xl font-bold ${BATTLES_CLIENT_COLORS.statCards.casualties.value}`}>
                        {Math.round(casualtyStats.averageCasualties).toLocaleString()}
                      </div>
                      <div className={`text-xs ${BATTLES_CLIENT_COLORS.statCards.casualties.label}`}>场均伤亡</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Era distribution */}
            {battleCountByEra.length > 0 && (
              <div className="mt-3">
                <div className={`text-xs ${BATTLES_CLIENT_COLORS.eraDistribution.label} mb-2`}>各时期战役分布</div>
                <div className="flex flex-wrap gap-2">
                  {battleCountByEra.map(({ eraId, eraName, count }) => {
                    const dotColor = ERA_COLORS[eraId]?.dot ?? BATTLES_CLIENT_COLORS.battleDot.default;
                    return (
                      <span
                        key={eraId}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 ${BATTLES_CLIENT_COLORS.eraDistribution.tag.bg} rounded-full text-sm`}
                      >
                        <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
                        <span className="font-medium">{eraName}</span>
                        <span className={BATTLES_CLIENT_COLORS.eraDistribution.tag.count}>{count}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Geographic distribution */}
            <div className={`${BATTLES_CLIENT_COLORS.geoSection.padding} ${BATTLES_CLIENT_COLORS.geoSection.divider}`}>
              <BattleGeography battles={battles} />
            </div>
          </div>
        </div>
      )}
      
      {/* Selection indicator when in compare mode */}
      {compareMode && selectedBattles.length > 0 && (
        <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-20 ${BATTLES_CLIENT_COLORS.compareIndicator.bg} ${BATTLES_CLIENT_COLORS.compareIndicator.text} px-4 py-2 rounded-full shadow-lg flex items-center gap-2`}>
          <span>已选择 {selectedBattles.length}/2 场战役</span>
          <button 
            onClick={() => setSelectedBattles([])}
            className={`${BATTLES_CLIENT_COLORS.compareIndicator.hover} rounded-full p-1`}
          >
            ✕
          </button>
        </div>
      )}
      
      {/* Stats */}
      <div className={`${BATTLES_CLIENT_COLORS.statsBar.container.bg} ${BATTLES_CLIENT_COLORS.statsBar.container.border} ${BATTLES_CLIENT_COLORS.statsBar.container.padding}`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between text-sm">
          <span className={BATTLES_CLIENT_COLORS.statsBar.selectedText}>
            {selectedEraId ? `${eraOptions.find(e => e.id === selectedEraId)?.name ?? selectedEraId}时期` : '全部时期'}
          </span>
          <span className={BATTLES_CLIENT_COLORS.statsBar.countText}>
            {displayedBattles.length} 场战役
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
          <ThisDayInHistoryCard events={events} />
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
          <div className={`flex flex-col items-center justify-center py-16 ${BATTLES_CLIENT_COLORS.emptyState.text}`}>
            <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>暂无战役数据</p>
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
