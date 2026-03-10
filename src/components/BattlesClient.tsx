'use client';

import * as React from 'react';
import Link from 'next/link';
import type { Era, Event, Ruler } from '@/lib/history/types';
import { getBattles } from '@/lib/history/battles';
import { BattleCard } from '@/components/BattleCard';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { useTranslations } from 'next-intl';

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
  
  const displayedBattles = selectedEra 
    ? battlesByEra.get(selectedEra) || []
    : battles;
  
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white">
        <div className="flex w-full flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/${locale || 'zh'}`} className="text-lg font-semibold text-zinc-900 hover:text-zinc-700">
              ← {t('ui.back')}
            </Link>
            <h1 className="text-lg font-semibold text-zinc-900">⚔️ {t('nav.battles') || '战役列表'}</h1>
          </div>
          <LocaleSwitcher />
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto p-4">
        {/* Era filter */}
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedEra(null)}
            className={`px-3 py-1 text-sm rounded-full border transition-colors ${
              selectedEra === null
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300'
            }`}
          >
            全部 ({battles.length})
          </button>
          {Array.from(battlesByEra.keys()).map((eraName) => (
            <button
              key={eraName}
              onClick={() => setSelectedEra(eraName)}
              className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                selectedEra === eraName
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300'
              }`}
            >
              {eraName} ({battlesByEra.get(eraName)?.length})
            </button>
          ))}
        </div>
        
        {/* Battles list */}
        <div className="space-y-3">
          {displayedBattles.map((battle) => (
            <BattleCard
              key={battle.id}
              battle={battle}
            />
          ))}
        </div>
        
        {displayedBattles.length === 0 && (
          <div className="text-center py-12 text-zinc-500">
            暂无战役数据
          </div>
        )}
      </main>
    </div>
  );
}
