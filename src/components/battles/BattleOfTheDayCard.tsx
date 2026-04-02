'use client';

import * as React from 'react';
import Link from 'next/link';
import type { Event } from '@/lib/history/types';
import { getBattleOfTheDay, getSameEraBattles } from '@/lib/history/battles';
import { formatYear } from '@/lib/history/utils';
import { getBattleResultLabel, getBattleImpactLabel, getBattleTypeName } from '@/lib/history/battles';
import { getPacingLabel, getTimeOfDayLabel } from '@/lib/history/battlePacing';
import { BATTLE_RESULT_COLORS, BATTLE_IMPACT_COLORS, ERA_COLORS, BATTLE_CARD_COLORS, BATTLE_OF_THE_DAY_COLORS, COMMANDER_COLORS, BATTLE_TYPE_COLORS, BATTLE_SCALE_COLORS, PACING_BADGE_COLORS, TIME_OF_DAY_COLORS } from '@/lib/history/constants';
import { useTranslations, useLocale } from 'next-intl';
import { BattleDetail } from './BattleDetail';

interface BattleOfTheDayCardProps {
  events: Event[];
}

function getEraStyles(entityId: string): { gradient: string; border: string; text: string } {
  const eraColor = ERA_COLORS[entityId];
  return {
    gradient: eraColor?.gradient || BATTLE_CARD_COLORS.fallback.gradient,
    border: eraColor?.border || BATTLE_CARD_COLORS.fallback.border,
    text: eraColor?.text || 'text-gray-800',
  };
}

export const BattleOfTheDayCard = React.memo(function BattleOfTheDayCard({ events }: BattleOfTheDayCardProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [showDetail, setShowDetail] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const battle = React.useMemo(() => getBattleOfTheDay(events), [events]);
  const sameEraBattles = React.useMemo(
    () => (battle ? getSameEraBattles(events, battle) : []),
    [events, battle]
  );

  if (!battle) return null;

  const { gradient: eraGradient, border: eraBorder, text: eraText } = getEraStyles(battle.entityId);
  const battleResult = battle.battle?.result;
  const resultBg = battleResult ? BATTLE_RESULT_COLORS[battleResult]?.bg : BATTLE_CARD_COLORS.result.default;
  const resultText = battleResult ? BATTLE_RESULT_COLORS[battleResult]?.text : 'text-zinc-700';

  const scale = battle.battle?.scale;
  const scaleColors = scale ? BATTLE_SCALE_COLORS[scale] || BATTLE_SCALE_COLORS.unknown : null;

  const pacing = battle.battle?.pacing;
  const timeOfDay = battle.battle?.timeOfDay;

  return (
    <>
      <button
        type="button"
        onClick={() => setShowDetail(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={`${t('battleOfTheDay.title')} - ${t(battle.titleKey)}`}
        className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 bg-gradient-to-br ${eraGradient} ${eraBorder} transition-all duration-300 ${
          isHovered ? 'scale-[1.02] shadow-xl' : 'hover:scale-[1.01] hover:shadow-lg'
        }`}
      >
        {/* Header row */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${BATTLE_OF_THE_DAY_COLORS.badge.bg} ${BATTLE_OF_THE_DAY_COLORS.badge.text}`}>
            📅 {t('battleOfTheDay.badge')}
          </span>
          {battleResult && (
            <div className={`ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${resultBg} ${resultText}`}>
              {battle.battle && t(getBattleResultLabel(battle.battle))}
            </div>
          )}
        </div>

        {/* Title and year */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <h3 className={`text-lg sm:text-xl font-bold ${eraText} leading-tight`}>
              ⚔️ {t(battle.titleKey)}
            </h3>
            <div className={`text-sm ${BATTLE_OF_THE_DAY_COLORS.subtitle} mt-1 flex flex-wrap items-center gap-2`}>
              <span className={`inline-flex items-center px-2 py-0.5 ${BATTLE_OF_THE_DAY_COLORS.badgeItem.bg} rounded-full`}>
                📅 {formatYear(battle.year)}
              </span>
              {battle.location?.label && (
                <span className={`inline-flex items-center px-2 py-0.5 ${BATTLE_OF_THE_DAY_COLORS.badgeItem.bg} rounded-full`}>
                  📍 {battle.location.label}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Belligerents */}
        {battle.battle?.belligerents && (
          <div className={`flex items-center justify-center gap-4 py-2.5 mb-3 rounded-xl ${BATTLE_OF_THE_DAY_COLORS.belligerents.container}`}>
            <span className={`text-sm font-semibold ${BATTLE_OF_THE_DAY_COLORS.belligerents.text}`}>
              {battle.battle.belligerents.attacker}
            </span>
            <span className={`text-xl ${BATTLE_OF_THE_DAY_COLORS.belligerents.vs}`}>⚔️</span>
            <span className={`text-sm font-semibold ${BATTLE_OF_THE_DAY_COLORS.belligerents.text}`}>
              {battle.battle.belligerents.defender}
            </span>
          </div>
        )}

        {/* Commanders */}
        {battle.battle?.commanders && (
          <div className="flex flex-wrap gap-1 mb-3">
            {battle.battle.commanders.attacker?.slice(0, 2).map((cmd, i) => (
              <span key={`att-${i}`} className={`inline-flex items-center px-2 py-0.5 ${COMMANDER_COLORS.attacker.bg} ${COMMANDER_COLORS.attacker.text} text-xs rounded`}>
                👤 {cmd}
              </span>
            ))}
            {battle.battle.commanders.defender?.slice(0, 2).map((cmd, i) => (
              <span key={`def-${i}`} className={`inline-flex items-center px-2 py-0.5 ${COMMANDER_COLORS.defender.bg} ${COMMANDER_COLORS.defender.text} text-xs rounded`}>
                👤 {cmd}
              </span>
            ))}
          </div>
        )}

        {/* Impact and summary */}
        <div className="flex items-end justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {battle.battle?.impact && battle.battle.impact !== 'unknown' && (
              <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${BATTLE_IMPACT_COLORS[battle.battle.impact]?.bg || 'bg-zinc-100'} ${BATTLE_IMPACT_COLORS[battle.battle.impact]?.text || 'text-zinc-600'}`}>
                💎 {t(getBattleImpactLabel(battle.battle.impact))}
              </span>
            )}
            {scaleColors && (
              <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${scaleColors.bg} ${scaleColors.text}`}>
                ⚔️ {t('battle.scale.' + scale)}
              </span>
            )}
            {battle.battle?.battleType && battle.battle.battleType !== 'unknown' && (
              <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${BATTLE_TYPE_COLORS.bg} ${BATTLE_TYPE_COLORS.text}`}>
                🎯 {t(getBattleTypeName(battle.battle.battleType))}
              </span>
            )}
            {pacing && pacing !== 'unknown' && (
              <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${PACING_BADGE_COLORS.bg} ${PACING_BADGE_COLORS.text}`}>
                ⚡ {t(getPacingLabel(pacing))}
              </span>
            )}
            {timeOfDay && timeOfDay !== 'unknown' && (
              <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${TIME_OF_DAY_COLORS.bg} ${TIME_OF_DAY_COLORS.text}`}>
                🌅 {t(getTimeOfDayLabel(timeOfDay))}
              </span>
            )}
            {sameEraBattles.length > 0 && (
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${BATTLE_OF_THE_DAY_COLORS.badgeItem.bg}`}>
                📚 {t('battleOfTheDay.sameEraBattles', { n: sameEraBattles.length })}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={`/${locale}/on-this-day`}
              onClick={(e) => e.stopPropagation()}
              className={`shrink-0 text-xs font-medium ${BATTLE_OF_THE_DAY_COLORS.cta} hover:underline`}
            >
              📅 {t('onThisDay.title')} →
            </Link>
            <span className={`shrink-0 text-xs font-medium ${BATTLE_OF_THE_DAY_COLORS.cta}`}>
              {t('battleOfTheDay.viewDetail')} →
            </span>
          </div>
        </div>
      </button>

      {showDetail && (
        <BattleDetail battle={battle} onClose={() => setShowDetail(false)} allEvents={events} locale={locale} />
      )}
    </>
  );
});
