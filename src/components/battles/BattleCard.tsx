'use client';

import * as React from 'react';
import type { Event } from '@/lib/history/types';
import { formatYear } from '@/lib/history/utils';
import { getBattleResultLabel, getBattleImpactLabel, getBattleTypeName } from '@/lib/history/battles';
import { BATTLE_RESULT_COLORS, BATTLE_IMPACT_COLORS, BATTLE_SCALE_COLORS, BATTLE_TYPE_COLORS, ERA_COLORS, ERA_COLORS_DARK, BATTLE_CARD_COLORS, PACING_BADGE_COLORS, TIME_OF_DAY_COLORS } from '@/lib/history/constants';
import { getPacingLabel, getTimeOfDayLabel } from '@/lib/history/battlePacing';
import { useTranslations } from 'next-intl';
import { BattleDetail } from './BattleDetail';
import { useBattleFavorites } from '@/lib/history/useBattleHooks';
import { useDarkMode } from '@/lib/history/hooks/useDarkMode';

interface BattleCardProps {
  battle: Event;
  onClick?: () => void;
  selected?: boolean;
  selectionMode?: boolean;
  onSelect?: (battle: Event) => void;
  locale?: string;
}

function getEraStyles(entityId: string, isDark: boolean): { gradient: string; border: string } {
  if (isDark) {
    const darkColor = ERA_COLORS_DARK[entityId];
    if (darkColor) return darkColor;
    return {
      gradient: 'from-zinc-800 to-zinc-900',
      border: 'border-zinc-600',
    };
  }
  const eraColor = ERA_COLORS[entityId];
  return {
    gradient: eraColor?.gradient || BATTLE_CARD_COLORS.fallback.gradient,
    border: eraColor?.border || BATTLE_CARD_COLORS.fallback.border,
  };
}

export const BattleCard = React.memo(function BattleCard({ battle, onClick, selected, selectionMode, onSelect, locale = 'zh' }: BattleCardProps) {
  const t = useTranslations();
  const [showDetail, setShowDetail] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const isDark = useDarkMode();

  const { toggleFavorite, isFavorite } = useBattleFavorites();
  const isFavorited = isFavorite(battle.id);

  const { gradient: eraGradient, border: eraBorder } = getEraStyles(battle.entityId, isDark);
  const battleResult = battle.battle?.result;

  const commanderBadge = React.useMemo(() => ({
    attacker: {
      bg: isDark ? 'bg-red-900/60' : 'bg-[var(--color-block-pink)]',
      text: isDark ? 'text-red-300' : 'text-[var(--color-ink)]',
    },
    defender: {
      bg: isDark ? 'bg-blue-900/60' : 'bg-[var(--color-block-lilac)]',
      text: isDark ? 'text-blue-300' : 'text-[var(--color-ink)]',
    },
  }), [isDark]);

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (selectionMode && onSelect) {
        onSelect(battle);
      } else if (onClick) {
        onClick();
      } else {
        setShowDetail(true);
      }
    }
  }, [battle, selectionMode, onSelect, onClick]);

  const handleClick = () => {
    if (selectionMode && onSelect) {
      onSelect(battle);
    } else if (onClick) {
      onClick();
    } else {
      setShowDetail(true);
    }
  };

  const handleFavoriteClick = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(battle.id);
  }, [battle.id, toggleFavorite]);

  return (
    <>
      <div className="relative">
        {/* Card - DESIGN.md style: rounded-lg, hairline border */}
        <div
          role="button"
          tabIndex={0}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label={`${t(battle.titleKey)} - ${formatYear(battle.year, locale)}`}
          className={`w-full text-left p-4 rounded-[var(--rounded-lg)] border bg-gradient-to-br ${eraGradient} ${eraBorder} transition-all duration-200 pr-12 sm:pr-14 ${
            isHovered ? 'shadow-lg' : ''
          } ${selected ? 'ring-2 ring-[var(--color-primary)] ring-offset-2' : ''} ${
            selectionMode ? 'cursor-pointer' : ''
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {selectionMode && (
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    selected ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'border-[var(--color-hairline)]'
                  }`}>
                    {selected && <span className="text-[var(--color-on-primary)] text-xs">✓</span>}
                  </span>
                )}
                <span className="text-body-sm font-bold text-[var(--text-primary)] truncate">⚔️ {t(battle.titleKey)}</span>
              </div>
              <div className="text-caption text-[var(--text-muted)] mt-1 flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-[var(--rounded-full)] bg-[var(--color-surface-soft)] whitespace-nowrap">
                  📅 {formatYear(battle.year, locale)}
                </span>
                {battle.location?.label && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-[var(--rounded-full)] bg-[var(--color-surface-soft)] whitespace-nowrap">
                    📍 {battle.location.label}
                  </span>
                )}
              </div>
            </div>
            {battleResult && (
              <div className={`shrink-0 flex items-center gap-1.5 px-2 py-1 rounded-[var(--rounded-pill)] text-[var(--color-on-primary)] text-caption font-medium ${BATTLE_RESULT_COLORS[battleResult]?.bg || 'bg-gray-400'} self-start sm:self-center`}>
                <span className="w-1.5 h-1.5 rounded-full bg-white/80"></span>
                {battle.battle && t(getBattleResultLabel(battle.battle))}
              </div>
            )}
          </div>

          {battle.battle?.belligerents && (
            <div className="mt-3 flex items-center justify-center gap-3 py-2 rounded-[var(--rounded-md)] bg-[var(--color-surface-soft)]">
              <span className="text-body-sm font-semibold text-[var(--text-primary)]">{battle.battle.belligerents.attacker}</span>
              <span className="text-lg">⚔️</span>
              <span className="text-body-sm font-semibold text-[var(--text-primary)]">{battle.battle.belligerents.defender}</span>
            </div>
          )}

          {/* Commanders */}
          {battle.battle?.commanders && (
            <div className="mt-2 flex flex-wrap gap-1">
              {battle.battle.commanders.attacker?.slice(0, 2).map((cmd, i) => (
                <span key={`att-${i}`} className={`inline-flex items-center px-2 py-0.5 ${commanderBadge.attacker.bg} ${commanderBadge.attacker.text} text-caption rounded-[var(--rounded-full)]`}>
                  👤 {cmd}
                </span>
              ))}
              {battle.battle.commanders.defender?.slice(0, 2).map((cmd, i) => (
                <span key={`def-${i}`} className={`inline-flex items-center px-2 py-0.5 ${commanderBadge.defender.bg} ${commanderBadge.defender.text} text-caption rounded-[var(--rounded-full)]`}>
                  👤 {cmd}
                </span>
              ))}
            </div>
          )}

          {/* Impact badge - pill shape */}
          {battle.battle?.impact && battle.battle.impact !== 'unknown' && (
            <div className="mt-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-[var(--rounded-pill)] text-caption font-medium ${BATTLE_IMPACT_COLORS[battle.battle.impact]?.bg || 'bg-[var(--color-surface-soft)]'} ${BATTLE_IMPACT_COLORS[battle.battle.impact]?.text || 'text-[var(--text-muted)]'}`}>
                💎 {t(getBattleImpactLabel(battle.battle.impact))}
              </span>
            </div>
          )}

          {/* Scale badge - pill shape */}
          {battle.battle?.scale && battle.battle.scale !== 'unknown' && (
            <div className="mt-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-[var(--rounded-pill)] text-caption font-medium ${BATTLE_SCALE_COLORS[battle.battle.scale]?.bg ?? BATTLE_SCALE_COLORS.unknown!.bg} ${BATTLE_SCALE_COLORS[battle.battle.scale]?.text ?? BATTLE_SCALE_COLORS.unknown!.text}`}>
                📊 {t('battle.scale.' + battle.battle.scale)}
              </span>
            </div>
          )}

          {/* Battle type badge - pill shape */}
          {battle.battle?.battleType && battle.battle.battleType !== 'unknown' && (
            <div className="mt-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-[var(--rounded-pill)] text-caption font-medium ${BATTLE_TYPE_COLORS.bg} ${BATTLE_TYPE_COLORS.text}`}>
                🎯 {t(getBattleTypeName(battle.battle.battleType))}
              </span>
            </div>
          )}

          {/* Pacing badge - pill shape */}
          {battle.battle?.pacing && battle.battle.pacing !== 'unknown' && (
            <div className="mt-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-[var(--rounded-pill)] text-caption font-medium ${PACING_BADGE_COLORS.bg} ${PACING_BADGE_COLORS.text}`}>
                ⚡ {t(getPacingLabel(battle.battle.pacing))}
              </span>
            </div>
          )}

          {/* Time of day badge - pill shape */}
          {battle.battle?.timeOfDay && battle.battle.timeOfDay !== 'unknown' && (
            <div className="mt-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-[var(--rounded-pill)] text-caption font-medium ${TIME_OF_DAY_COLORS.bg} ${TIME_OF_DAY_COLORS.text}`}>
                🌅 {t(getTimeOfDayLabel(battle.battle.timeOfDay))}
              </span>
            </div>
          )}

          {battle.summaryKey && (
            <div className="mt-2 text-caption text-[var(--text-muted)] line-clamp-2">
              {t(battle.summaryKey)}
            </div>
          )}
        </div>

        {/* Favorite button - circular */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          onKeyDown={(e) => e.stopPropagation()}
          aria-label={isFavorited ? t('favorites.removeFavorite') : t('favorites.addFavorite')}
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 shrink-0 w-8 h-8 rounded-[var(--rounded-full)] flex items-center justify-center transition-colors ${
            isFavorited
              ? 'bg-[var(--color-block-pink)] text-[var(--color-ink)]'
              : 'bg-[var(--color-surface-soft)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <span className="text-sm">
            {isFavorited ? '❤️' : '🤍'}
          </span>
        </button>
      </div>

      {showDetail && (
        <BattleDetail
          battle={battle}
          onClose={() => setShowDetail(false)}
          locale={locale}
        />
      )}
    </>
  );
});
