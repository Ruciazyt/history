'use client';

import * as React from 'react';
import type { Event } from '@/lib/history/types';
import { formatYear } from '@/lib/history/utils';
import { getBattleResultLabel } from '@/lib/history/battles';
import { useTranslations } from 'next-intl';

interface BattleCardProps {
  battle: Event;
  onClick?: () => void;
}

export function BattleCard({ battle, onClick }: BattleCardProps) {
  const t = useTranslations();
  const hasLocation = !!battle.location;
  
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left p-3 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-xs text-red-600 font-medium">⚔️ {t(battle.titleKey)}</div>
          <div className="text-xs text-red-500 mt-0.5">
            {formatYear(battle.year)}
            {battle.location?.label && ` · ${battle.location.label}`}
          </div>
        </div>
        {battle.battle?.result && (
          <span className="shrink-0 text-xs px-1.5 py-0.5 bg-red-200 text-red-700 rounded">
            {getBattleResultLabel(battle.battle.result)}
          </span>
        )}
      </div>
      {battle.battle?.belligerents && (
        <div className="mt-2 text-xs text-red-700">
          <span className="font-medium">{battle.battle.belligerents.attacker}</span>
          ⚔️ 
          <span className="font-medium">{battle.battle.belligerents.defender}</span>
        </div>
      )}
      {hasLocation && (
        <div className="mt-1 text-xs text-red-400">📍 {battle.location!.label}</div>
      )}
    </button>
  );
}
