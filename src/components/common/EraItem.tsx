import * as React from 'react';
import type { Era, Ruler } from '@/lib/history/types';
import { formatYear } from '@/lib/history/utils';

// 朝代颜色映射
const ERA_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  'wz-western-zhou': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  'period-spring-autumn': { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  'period-warring-states': { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500' },
  'qin': { bg: 'bg-zinc-100', text: 'text-zinc-700', dot: 'bg-zinc-600' },
  'han': { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  'xin': { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
  'eastern-han': { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
  'three-kingdoms': { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
};

interface EraItemProps {
  era: Era;
  rulers: Ruler[];
  isOpen: boolean;
  selectedRulerId: string | null;
  onToggle: (id: string) => void;
  onSelectRuler: (id: string) => void;
  t: (key: string) => string;
}

export const EraItem = React.memo(function EraItem({
  era,
  rulers,
  isOpen,
  selectedRulerId,
  onToggle,
  onSelectRuler,
  t,
}: EraItemProps) {
  const eraColor = ERA_COLORS[era.id] || { bg: 'bg-zinc-50', text: 'text-zinc-700', dot: 'bg-zinc-400' };
  
  return (
    <div className={`border-b border-zinc-100 last:border-0 ${isOpen ? eraColor.bg : ''}`}>
      <button
        type="button"
        onClick={() => onToggle(era.id)}
        className="flex w-full items-center gap-2 px-2 py-2.5 text-left hover:bg-zinc-100/50 sm:px-3 transition-colors"
      >
        <span className={`w-2 h-2 rounded-full shrink-0 ${eraColor.dot}`}></span>
        <span className={`flex-1 font-semibold ${eraColor.text} text-sm sm:text-base`}>
          {t(era.nameKey)}
        </span>
        <span className="text-xs text-zinc-400 hidden sm:inline">
          {formatYear(era.startYear)}–{formatYear(era.endYear)}
        </span>
        <span className="text-xs text-zinc-300">{isOpen ? '▼' : '▶'}</span>
      </button>
      
      {isOpen && (
        <div className="bg-zinc-50/50 px-2 py-1 sm:px-3 sm:py-2">
          {rulers.map((r) => {
            const isActive = selectedRulerId === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => onSelectRuler(r.id)}
                className={`flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-xs sm:text-sm transition-colors ${
                  isActive 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'hover:bg-zinc-100 text-zinc-600'
                }`}
              >
                <span className="truncate">
                  {r.isDynastyBlock ? (
                    <span className="font-semibold">{t(r.nameKey)}</span>
                  ) : (
                    t(r.nameKey)
                  )}
                </span>
                <span className="shrink-0 text-zinc-400">
                  {formatYear(r.startYear)}–{formatYear(r.endYear)}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
});
