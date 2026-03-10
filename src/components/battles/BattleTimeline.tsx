'use client';

import * as React from 'react';
import type { Event } from '@/lib/history/types';
import { formatYear } from '@/lib/history/utils';
import { getBattleResultLabel, getEraColor } from '@/lib/history/battles';
import { useTranslations } from 'next-intl';

interface BattleTimelineProps {
  battles: Event[];
  eras: { id: string; nameKey: string }[];
  tEra: (key: string) => string;
  onBattleClick: (battle: Event) => void;
}

export function BattleTimeline({ battles, eras, tEra, onBattleClick }: BattleTimelineProps) {
  const t = useTranslations();
  
  // Sort battles by year
  const sortedBattles = React.useMemo(() => {
    return [...battles].sort((a, b) => a.year - b.year);
  }, [battles]);
  
  // Get era info for each battle
  const battlesWithEra = React.useMemo(() => {
    return sortedBattles.map(battle => {
      const era = eras.find(e => e.id === battle.entityId);
      return {
        battle,
        eraName: era ? tEra(era.nameKey) : battle.entityId,
        eraColor: getEraColor(battle.entityId),
      };
    });
  }, [sortedBattles, eras, tEra]);
  
  if (battlesWithEra.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
        <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p>暂无战役数据</p>
      </div>
    );
  }
  
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 bg-zinc-200" />
      
      {/* Timeline entries */}
      <div className="space-y-0">
        {battlesWithEra.map(({ battle, eraName, eraColor }, index) => {
          const result = battle.battle?.result;
          const resultColor = 
            result === 'attacker_win' ? 'bg-green-500' :
            result === 'defender_win' ? 'bg-blue-500' :
            result === 'draw' ? 'bg-yellow-500' :
            'bg-zinc-400';
          
          return (
            <div 
              key={battle.id}
              className="relative flex gap-3 sm:gap-4 py-3 pl-10 sm:pl-12 pr-4 hover:bg-zinc-50 transition-colors cursor-pointer group"
              onClick={() => onBattleClick(battle)}
            >
              {/* Timeline dot */}
              <div 
                className="absolute left-2 sm:left-3 top-6 w-4 h-4 rounded-full border-2 border-white shadow-sm z-10"
                style={{ backgroundColor: eraColor }}
              />
              
              {/* Year label */}
              <div className="absolute left-10 sm:left-14 top-6 text-xs font-medium text-zinc-500 whitespace-nowrap">
                {formatYear(battle.year)}
              </div>
              
              {/* Content card */}
              <div className="flex-1 ml-8 sm:ml-10 mt-4">
                <div className="bg-white rounded-lg border border-zinc-200 p-3 shadow-sm group-hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-zinc-900 text-sm leading-tight">
                      {t(battle.titleKey)}
                    </h3>
                    {result && (
                      <span className={`shrink-0 px-2 py-0.5 rounded text-xs font-medium ${resultColor} text-white`}>
                        {getBattleResultLabel({ result })}
                      </span>
                    )}
                  </div>
                  
                  {/* Belligerents */}
                  {battle.battle?.belligerents && (
                    <div className="flex items-center gap-2 text-xs text-zinc-600 mb-2">
                      <span className="font-medium text-red-600">{battle.battle.belligerents.attacker}</span>
                      <span className="text-zinc-400">⚔️</span>
                      <span className="font-medium text-blue-600">{battle.battle.belligerents.defender}</span>
                    </div>
                  )}
                  
                  {/* Meta info */}
                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <span 
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: `${eraColor}20`, color: eraColor }}
                    >
                      {eraName}
                    </span>
                    {battle.location?.label && (
                      <span className="flex items-center gap-0.5">
                        📍 {battle.location.label}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
