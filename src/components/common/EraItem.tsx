import * as React from 'react';
import type { Era, Ruler } from '@/lib/history/types';
import { formatYear } from '@/lib/history/utils';
import { ERA_COLORS, ERA_ITEM_COLORS, ERA_ITEM_EXTRA_COLORS, ERA_ITEM_ARROW_COLORS, ERA_ITEM_EXPANDED_COLORS } from '@/lib/history/constants';

// Extract minimal color properties from ERA_COLORS (which includes gradient and border)
const getEraColor = (eraId: string) => {
  const colors = ERA_COLORS[eraId];
  if (!colors) return { bg: 'bg-zinc-50', text: 'text-zinc-700', dot: 'bg-zinc-400' };
  return { bg: colors.bg, text: colors.text, dot: colors.dot };
};

interface EraItemProps {
  era: Era;
  rulers: Ruler[];
  isOpen: boolean;
  isSelected: boolean;
  selectedRulerId: string | null;
  onToggle: (id: string) => void;
  onSelectRuler: (id: string) => void;
  t: (key: string) => string;
}

export const EraItem = React.memo(function EraItem({
  era,
  rulers,
  isOpen,
  isSelected: isSelectedProp, // eslint-disable-line @typescript-eslint/no-unused-vars -- reserved for future use
  selectedRulerId,
  onToggle,
  onSelectRuler,
  t,
}: EraItemProps) {
  const eraColor = getEraColor(era.id);
  
  return (
    <div className={`border-b ${ERA_ITEM_EXTRA_COLORS.divider} last:border-0 ${isOpen ? eraColor.bg : ''}`}>
      <button
        type="button"
        onClick={() => onToggle(era.id)}
        className={`flex w-full items-center gap-2 px-2 py-2.5 text-left ${ERA_ITEM_COLORS.button.hover} sm:px-3 transition-colors`}
      >
        <span className={`w-2 h-2 rounded-full shrink-0 ${eraColor.dot}`}></span>
        <span className={`flex-1 font-semibold ${eraColor.text} text-sm sm:text-base`}>
          {t(era.nameKey)}
        </span>
        <span className={`text-xs ${ERA_ITEM_COLORS.default.text} hidden sm:inline`}>
          {formatYear(era.startYear)}–{formatYear(era.endYear)}
        </span>
        <span className={`text-xs ${ERA_ITEM_ARROW_COLORS.text}`}>{isOpen ? '▼' : '▶'}</span>
      </button>
      
      {isOpen && (
        <div className={`${ERA_ITEM_EXPANDED_COLORS.bg} px-2 py-1 sm:px-3 sm:py-2`}>
          {rulers.map((r) => {
            const isActive = selectedRulerId === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => onSelectRuler(r.id)}
                className={`flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-xs sm:text-sm transition-colors ${
                  isActive 
                    ? ERA_ITEM_COLORS.list.active
                    : ERA_ITEM_COLORS.list.inactive
                }`}
              >
                <span className="truncate">
                  {r.isDynastyBlock ? (
                    <span className="font-semibold">{t(r.nameKey)}</span>
                  ) : (
                    t(r.nameKey)
                  )}
                </span>
                <span className={`shrink-0 ${ERA_ITEM_EXTRA_COLORS.rulerList.year}`}>
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
