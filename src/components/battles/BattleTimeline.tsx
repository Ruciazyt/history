'use client';

import * as React from 'react';
import type { Event } from '@/lib/history/types';
import { formatYear } from '@/lib/history/utils';
import { getBattleResultLabel, getEraColor } from '@/lib/history/battles';
import { useTranslations } from 'next-intl';
import { BATTLE_RESULT_COLORS, BATTLE_TIMELINE_COLORS } from '@/lib/history/constants';

interface BattleTimelineProps {
  battles: Event[];
  eras: { id: string; nameKey: string }[];
  tEra: (key: string) => string;
  onBattleClick: (battle: Event) => void;
}

export const BattleTimeline = React.memo(function BattleTimeline({ battles, eras, tEra, onBattleClick }: BattleTimelineProps) {
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
      <div className={`flex flex-col items-center justify-center py-16 ${BATTLE_TIMELINE_COLORS.empty.text}`}>
        <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p>{t('battleTimeline.noData')}</p>
      </div>
    );
  }
  
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className={`absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 ${BATTLE_TIMELINE_COLORS.line}`} />
      
      {/* Timeline entries */}
      <div className="space-y-0">
        {battlesWithEra.map(({ battle, eraName, eraColor }) => {
          const result = battle.battle?.result;
          const resultColor = result && BATTLE_RESULT_COLORS[result]?.bg 
            ? BATTLE_RESULT_COLORS[result].bg 
            : BATTLE_RESULT_COLORS.unknown?.bg || 'bg-zinc-400';
          
          return (
            <div 
              key={battle.id}
              className={`relative flex gap-3 sm:gap-4 py-3 pl-10 sm:pl-12 pr-4 ${BATTLE_TIMELINE_COLORS.entry.hover} transition-colors cursor-pointer group`}
              onClick={() => onBattleClick(battle)}
            >
              {/* Timeline dot */}
              <div 
                className={`absolute left-2 sm:left-3 top-6 w-4 h-4 rounded-full border-2 ${BATTLE_TIMELINE_COLORS.dot.ring} shadow-sm z-10`}
                style={{ backgroundColor: eraColor }}
              />
              
              {/* Year label */}
              <div className={`absolute left-10 sm:left-14 top-6 text-xs font-medium ${BATTLE_TIMELINE_COLORS.year} whitespace-nowrap`}>
                {formatYear(battle.year)}
              </div>
              
              {/* Content card */}
              <div className="flex-1 ml-8 sm:ml-10 mt-4">
                <div className={`${BATTLE_TIMELINE_COLORS.card.bg} rounded-lg border ${BATTLE_TIMELINE_COLORS.card.border} p-3 ${BATTLE_TIMELINE_COLORS.card.shadow} ${BATTLE_TIMELINE_COLORS.card.hoverShadow} transition-shadow`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className={`font-semibold ${BATTLE_TIMELINE_COLORS.title} text-sm leading-tight`}>
                      {t(battle.titleKey)}
                    </h3>
                    {result && (
                      <span className={`shrink-0 px-2 py-0.5 rounded text-xs font-medium ${resultColor} text-white`}>
                        {t(getBattleResultLabel({ result }))}
                      </span>
                    )}
                  </div>
                  
                  {/* Belligerents */}
                  {battle.battle?.belligerents && (
                    <div className={`flex items-center gap-2 text-xs ${BATTLE_TIMELINE_COLORS.belligerents.text} mb-2`}>
                      <span className={`font-medium ${BATTLE_TIMELINE_COLORS.belligerents.attacker}`}>{battle.battle.belligerents.attacker}</span>
                      <span className={BATTLE_TIMELINE_COLORS.belligerents.separator}>⚔️</span>
                      <span className={`font-medium ${BATTLE_TIMELINE_COLORS.belligerents.defender}`}>{battle.battle.belligerents.defender}</span>
                    </div>
                  )}
                  
                  {/* Meta info */}
                  <div className={`flex items-center gap-3 text-xs ${BATTLE_TIMELINE_COLORS.meta.text}`}>
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
});
