'use client';

import * as React from 'react';
import type { Event } from '@/lib/history/types';
import { formatYear } from '@/lib/history/utils';
import { getBattleResultLabel } from '@/lib/history/battles';
import { useTranslations } from 'next-intl';
import { BattleDetail } from './BattleDetail';

interface BattleCardProps {
  battle: Event;
  onClick?: () => void;
}

// 朝代颜色映射
const ERA_COLORS: Record<string, string> = {
  'wz-western-zhou': 'from-amber-50 to-orange-50 border-amber-200',
  'period-spring-autumn': 'from-blue-50 to-indigo-50 border-blue-200',
  'period-warring-states': 'from-purple-50 to-red-50 border-red-200',
  'qin': 'from-zinc-50 to-zinc-100 border-zinc-300',
  'han': 'from-red-50 to-orange-50 border-red-200',
};

function getEraColor(entityId: string): string {
  return ERA_COLORS[entityId] || 'from-gray-50 to-gray-100 border-gray-200';
}

export function BattleCard({ battle, onClick }: BattleCardProps) {
  const t = useTranslations();
  const hasLocation = !!battle.location;
  const [showDetail, setShowDetail] = React.useState(false);
  
  const eraColor = getEraColor(battle.entityId);
  const battleResult = battle.battle?.result;
  
  // 结果颜色
  const resultColors: Record<string, string> = {
    attacker_win: 'bg-red-500',
    defender_win: 'bg-blue-500', 
    draw: 'bg-gray-400',
    inconclusive: 'bg-yellow-500',
  };
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setShowDetail(true);
    }
  };
  
  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`w-full text-left p-4 rounded-xl border bg-gradient-to-br ${eraColor} hover:shadow-md transition-all duration-200 hover:scale-[1.01]`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-800">⚔️ {t(battle.titleKey)}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 bg-white/60 rounded-full">
                📅 {formatYear(battle.year)}
              </span>
              {battle.location?.label && (
                <span className="inline-flex items-center px-2 py-0.5 bg-white/60 rounded-full">
                  📍 {battle.location.label}
                </span>
              )}
            </div>
          </div>
          {battleResult && (
            <div className={`shrink-0 flex items-center gap-1.5 px-2 py-1 rounded-full text-white text-xs font-medium ${resultColors[battleResult] || 'bg-gray-400'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-white/80"></span>
              {battle.battle && getBattleResultLabel(battle.battle)}
            </div>
          )}
        </div>
        
        {battle.battle?.belligerents && (
          <div className="mt-3 flex items-center justify-center gap-3 py-2 bg-white/50 rounded-lg">
            <span className="text-sm font-semibold text-gray-700">{battle.battle.belligerents.attacker}</span>
            <span className="text-lg">⚔️</span>
            <span className="text-sm font-semibold text-gray-700">{battle.battle.belligerents.defender}</span>
          </div>
        )}
        
        {battle.summaryKey && (
          <div className="mt-2 text-xs text-gray-500 line-clamp-2">
            {t(battle.summaryKey)}
          </div>
        )}
      </button>
      
      {showDetail && (
        <BattleDetail 
          battle={battle} 
          onClose={() => setShowDetail(false)} 
        />
      )}
    </>
  );
}
