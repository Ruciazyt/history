'use client';

import * as React from 'react';
import Link from 'next/link';
import type { Era, Event, Ruler } from '@/lib/history/types';
import { getBattles, getBattleStats, getBattleCountByEra } from '@/lib/history/battles';
import { BattleCard } from '@/components/battles/BattleCard';
import { BattleTimeline } from '@/components/battles/BattleTimeline';
import { BattleDetail } from '@/components/battles/BattleDetail';
import { BattleCompare } from '@/components/battles/BattleCompare';
import { LocaleSwitcher } from '@/components/common/LocaleSwitcher';
import { useTranslations } from 'next-intl';

// 朝代数据映射
const ERA_INFO: Record<string, { name: string; color: string }> = {
  'wz-western-zhou': { name: '西周', color: 'bg-amber-500' },
  'period-spring-autumn': { name: '春秋', color: 'bg-blue-500' },
  'period-warring-states': { name: '战国', color: 'bg-purple-500' },
  'qin': { name: '秦', color: 'bg-zinc-600' },
  'han': { name: '汉', color: 'bg-red-600' },
};

export function BattlesClient({
  eras,
  events,
  rulers,
  locale,
}: {
  eras: Era[];
  events: Event[];
  rulers: Ruler[];
  locale?: string;
}) {
  const t = useTranslations();
  const tEra = useTranslations('rulerEraName');
  
  const battles = React.useMemo(() => getBattles(events), [events]);
  
  // Battle statistics
  const stats = React.useMemo(() => getBattleStats(battles), [battles]);
  
  // Battle count by era
  const battleCountByEra = React.useMemo(() => 
    getBattleCountByEra(battles, eras, tEra), 
  [battles, eras, tEra]);
  
  // Group battles by era
  const battlesByEra = React.useMemo(() => {
    const map = new Map<string, Event[]>();
    for (const battle of battles) {
      const era = eras.find(e => e.id === battle.entityId);
      const eraName = era ? tEra(era.nameKey) : battle.entityId;
      if (!map.has(eraName)) map.set(eraName, []);
      map.get(eraName)!.push(battle);
    }
    // Sort battles within each era by year
    for (const [, evts] of map) {
      evts.sort((a, b) => a.year - b.year);
    }
    return map;
  }, [battles, eras, tEra]);
  
  const [selectedEra, setSelectedEra] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = React.useState<'grid' | 'timeline'>('grid');
  const [selectedBattle, setSelectedBattle] = React.useState<Event | null>(null);
  
  const displayedBattles = selectedEra 
    ? battlesByEra.get(selectedEra) || []
    : battles;
    
  const eraOptions = Array.from(battlesByEra.keys());
  
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/95 backdrop-blur-sm">
        <div className="flex w-full items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link 
              href={`/${locale || 'zh'}`} 
              className="flex items-center gap-1 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t('ui.back')}
            </Link>
            <div className="w-px h-5 bg-zinc-200"></div>
            <h1 className="text-lg font-bold text-zinc-900">⚔️ {t('nav.battles') || '战役'}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 bg-zinc-100 px-2 py-1 rounded-full">
              {battles.length} 场战役
            </span>
            {/* View toggle */}
            <div className="flex items-center bg-zinc-100 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-white text-zinc-900 shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-700'
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
                    ? 'bg-white text-zinc-900 shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-700'
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
            onClick={() => setSelectedEra(null)}
            className={`shrink-0 px-4 py-1.5 text-sm font-medium rounded-full border transition-all ${
              selectedEra === null
                ? 'bg-red-600 text-white border-red-600 shadow-sm'
                : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300'
            }`}
          >
            全部
          </button>
          {eraOptions.map((eraName) => {
            const eraInfo = Object.entries(ERA_INFO).find(([_, info]) => info.name === eraName);
            const dotColor = eraInfo ? eraInfo[1] : 'bg-gray-400';
            
            return (
              <button
                key={eraName}
                onClick={() => setSelectedEra(eraName)}
                className={`shrink-0 px-4 py-1.5 text-sm font-medium rounded-full border transition-all flex items-center gap-1.5 ${
                  selectedEra === eraName
                    ? 'bg-red-600 text-white border-red-600 shadow-sm'
                    : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
                {eraName}
              </button>
            );
          })}
        </div>
      </header>
      
      {/* Stats Panel */}
      {selectedEra === null && (
        <div className="bg-white border-b border-zinc-100 px-4 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-3 border border-red-100">
                <div className="text-2xl font-bold text-red-600">{stats.attackerWins}</div>
                <div className="text-xs text-red-500">进攻方胜利</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100">
                <div className="text-2xl font-bold text-blue-600">{stats.defenderWins}</div>
                <div className="text-xs text-blue-500">防守方胜利</div>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-zinc-50 rounded-xl p-3 border border-zinc-200">
                <div className="text-2xl font-bold text-zinc-600">{stats.draws}</div>
                <div className="text-xs text-zinc-500">平局</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-3 border border-yellow-100">
                <div className="text-2xl font-bold text-yellow-600">{stats.inconclusive}</div>
                <div className="text-xs text-yellow-500">胜负未明</div>
              </div>
            </div>
            
            {/* Era distribution */}
            {battleCountByEra.length > 0 && (
              <div className="mt-3">
                <div className="text-xs text-zinc-500 mb-2">各时期战役分布</div>
                <div className="flex flex-wrap gap-2">
                  {battleCountByEra.map(({ eraName, count }) => {
                    const eraInfo = Object.entries(ERA_INFO).find(([_, info]) => info.name === eraName);
                    const dotColor = eraInfo ? eraInfo[1] : 'bg-gray-400';
                    return (
                      <span 
                        key={eraName}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-50 rounded-full text-sm"
                      >
                        <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
                        <span className="font-medium">{eraName}</span>
                        <span className="text-zinc-400">{count}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Stats */}
      <div className="bg-white border-b border-zinc-100 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-sm">
          <span className="text-zinc-500">
            {selectedEra ? `${selectedEra}时期` : '全部时期'}
          </span>
          <span className="text-zinc-400">
            {displayedBattles.length} 场战役
          </span>
        </div>
      </div>
      
      {/* Battles list */}
      <main className="max-w-4xl mx-auto p-4">
        {displayedBattles.length > 0 ? (
          viewMode === 'timeline' ? (
            <BattleTimeline 
              battles={displayedBattles}
              eras={eras}
              tEra={tEra}
              onBattleClick={setSelectedBattle}
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {displayedBattles.map((battle) => (
                <BattleCard
                  key={battle.id}
                  battle={battle}
                />
              ))}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
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
        />
      )}
    </div>
  );
}
