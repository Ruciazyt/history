'use client';

import * as React from 'react';
import type { Event } from '@/lib/history/types';
import { getBattlesOnThisDay } from '@/lib/history/battles';
import { formatYear } from '@/lib/history/utils';
import { getBattleResultLabel, getBattleImpactLabel } from '@/lib/history/battles';
import { BATTLE_RESULT_COLORS, BATTLE_IMPACT_COLORS, ERA_COLORS, BATTLE_CARD_COLORS, THIS_DAY_IN_HISTORY_COLORS } from '@/lib/history/constants';
import { useTranslations } from 'next-intl';
import { BattleDetail } from './BattleDetail';

interface ThisDayInHistoryCardProps {
  events: Event[];
  /** Locale for year formatting (defaults to 'zh') */
  locale?: string;
}

function getEraStyles(entityId: string): { gradient: string; border: string; text: string } {
  const eraColor = ERA_COLORS[entityId];
  return {
    gradient: eraColor?.gradient || BATTLE_CARD_COLORS.fallback.gradient,
    border: eraColor?.border || BATTLE_CARD_COLORS.fallback.border,
    text: eraColor?.text || 'text-gray-800 dark:text-gray-100',
  };
}

export const ThisDayInHistoryCard = React.memo(function ThisDayInHistoryCard({ events, locale = 'zh' }: ThisDayInHistoryCardProps) {
  const t = useTranslations();
  const [expanded, setExpanded] = React.useState(false);
  const [selectedBattle, setSelectedBattle] = React.useState<Event | null>(null);

  const todayBattles = React.useMemo(() => getBattlesOnThisDay(events), [events]);

  if (todayBattles.length === 0) return null;

  const displayBattles = expanded ? todayBattles : todayBattles.slice(0, 1);

  return (
    <>
      <div className={`rounded-2xl border-2 ${THIS_DAY_IN_HISTORY_COLORS.container.border} ${THIS_DAY_IN_HISTORY_COLORS.container.bg} p-4 sm:p-5`}>
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${THIS_DAY_IN_HISTORY_COLORS.badge.bg} ${THIS_DAY_IN_HISTORY_COLORS.badge.text}`}>
            📜 {t('thisDayInHistory.title')}
          </span>
          <span className={`text-xs ${THIS_DAY_IN_HISTORY_COLORS.subtitle}`}>
            {todayBattles.length} {t('thisDayInHistory.battlesFound')}
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className={`ml-auto shrink-0 text-xs font-medium px-3 py-1 rounded-full transition-all ${THIS_DAY_IN_HISTORY_COLORS.toggle.btn} ${THIS_DAY_IN_HISTORY_COLORS.toggle.hover}`}
          >
            {expanded ? t('thisDayInHistory.collapse') : t('thisDayInHistory.expand')}
          </button>
        </div>

        {/* Battle list */}
        <div className="space-y-3">
          {displayBattles.map((battle) => {
            const { gradient, border, text } = getEraStyles(battle.entityId);
            const battleResult = battle.battle?.result;
            const resultBg = battleResult ? BATTLE_RESULT_COLORS[battleResult]?.bg : BATTLE_CARD_COLORS.result.default;
            const resultText = battleResult ? BATTLE_RESULT_COLORS[battleResult]?.text : 'text-zinc-700';

            return (
              <button
                key={battle.id}
                type="button"
                onClick={() => setSelectedBattle(battle)}
                className={`w-full text-left p-3 rounded-xl border bg-gradient-to-br ${gradient} ${border} hover:shadow-md transition-all duration-200`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <h4 className={`text-sm font-bold ${text} leading-tight`}>
                    ⚔️ {t(battle.titleKey)}
                  </h4>
                  {battleResult && (
                    <div className={`ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${resultBg} ${resultText}`}>
                      {battle.battle && t(getBattleResultLabel(battle.battle))}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 ${THIS_DAY_IN_HISTORY_COLORS.badgeItem.bg} rounded-full`}>
                    📅 {formatYear(battle.year, locale)}
                  </span>
                  {battle.location?.label && (
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 ${THIS_DAY_IN_HISTORY_COLORS.badgeItem.bg} rounded-full`}>
                      📍 {battle.location.label}
                    </span>
                  )}
                </div>

                {battle.battle?.belligerents && (
                  <div className={`flex items-center justify-center gap-3 py-1.5 mt-2 rounded-lg ${THIS_DAY_IN_HISTORY_COLORS.belligerents.container}`}>
                    <span className={`text-xs font-semibold ${THIS_DAY_IN_HISTORY_COLORS.belligerents.text}`}>
                      {battle.battle.belligerents.attacker}
                    </span>
                    <span className={`text-sm ${THIS_DAY_IN_HISTORY_COLORS.belligerents.vs}`}>⚔️</span>
                    <span className={`text-xs font-semibold ${THIS_DAY_IN_HISTORY_COLORS.belligerents.text}`}>
                      {battle.battle.belligerents.defender}
                    </span>
                  </div>
                )}

                {battle.battle?.impact && battle.battle.impact !== 'unknown' && (
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold ${BATTLE_IMPACT_COLORS[battle.battle.impact]?.bg || 'bg-zinc-100'} ${BATTLE_IMPACT_COLORS[battle.battle.impact]?.text || 'text-zinc-600'}`}>
                      💎 {t(getBattleImpactLabel(battle.battle.impact))}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedBattle && (
        <BattleDetail battle={selectedBattle} onClose={() => setSelectedBattle(null)} allEvents={events} locale={locale} />
      )}
    </>
  );
});
