'use client';

import * as React from 'react';
import type { Event } from '@/lib/history/types';
import { formatYear } from '@/lib/history/utils';
import { getBattleResultLabel, getBattleImpactLabel } from '@/lib/history/battles';
import { BATTLE_RESULT_COLORS, BATTLE_IMPACT_COLORS, ERA_COLORS, COMMANDER_COLORS, SELECTION_COLORS, BATTLE_CARD_COLORS, FAVORITE_BUTTON_COLORS } from '@/lib/history/constants';
import { useTranslations } from 'next-intl';
import { BattleDetail } from './BattleDetail';
import { useBattleFavorites } from '@/lib/history/useBattleHooks';

interface BattleCardProps {
  battle: Event;
  onClick?: () => void;
  selected?: boolean;
  selectionMode?: boolean;
  onSelect?: (battle: Event) => void;
}

// Get era styles using ERA_COLORS from constants
function getEraStyles(entityId: string): { gradient: string; border: string } {
  const eraColor = ERA_COLORS[entityId];
  return {
    gradient: eraColor?.gradient || BATTLE_CARD_COLORS.fallback.gradient,
    border: eraColor?.border || BATTLE_CARD_COLORS.fallback.border,
  };
}

export const BattleCard = React.memo(function BattleCard({ battle, onClick, selected, selectionMode, onSelect }: BattleCardProps) {
  const t = useTranslations();
  const [showDetail, setShowDetail] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  // Favorites functionality
  const { toggleFavorite, isFavorite } = useBattleFavorites();
  const isFavorited = isFavorite(battle.id);

  const { gradient: eraGradient, border: eraBorder } = getEraStyles(battle.entityId);
  const battleResult = battle.battle?.result;

  // 结果颜色 - use constants
  const resultBg = battleResult ? BATTLE_RESULT_COLORS[battleResult]?.bg : BATTLE_CARD_COLORS.result.default;

  // Handle keyboard navigation
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

  // Handle favorite button click - prevent event bubbling to avoid triggering card click
  const handleFavoriteClick = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(battle.id);
  }, [battle.id, toggleFavorite]);

  return (
    <>
      {/*
        Outer wrapper uses position:relative so the favorite button can be
        absolutely-positioned as a sibling rather than nested inside a button.
        This avoids the invalid HTML nesting of <button> inside <button>.
      */}
      <div className="relative">
        {/* Card content — role=button div so a real <button> (favorite) can be a sibling */}
        <div
          role="button"
          tabIndex={0}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-pressed={selected}
          aria-label={`${t(battle.titleKey)} - ${formatYear(battle.year)}`}
          className={`w-full text-left p-3 sm:p-4 rounded-xl border-2 bg-gradient-to-br ${eraGradient} ${eraBorder} hover:shadow-lg transition-all duration-200 pr-12 sm:pr-14 ${
            isHovered ? 'scale-[1.02] shadow-lg' : 'hover:scale-[1.01]'
          } ${selected ? 'ring-2 ring-red-500 ring-offset-2' : ''} ${
            selectionMode ? 'cursor-pointer' : ''
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {selectionMode && (
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    selected ? SELECTION_COLORS.selected.bg : SELECTION_COLORS.unselected.border
                  }`}>
                    {selected && <span className="text-white text-xs">✓</span>}
                  </span>
                )}
                <span className={`text-sm font-bold ${BATTLE_CARD_COLORS.container.title} truncate`}>⚔️ {t(battle.titleKey)}</span>
              </div>
              <div className={`text-xs ${BATTLE_CARD_COLORS.container.subtitle} mt-1 flex flex-wrap gap-1.5 sm:gap-2`}>
                <span className={`inline-flex items-center px-2 py-0.5 ${BATTLE_CARD_COLORS.container.badgeBg} rounded-full whitespace-nowrap`}>
                  📅 {formatYear(battle.year)}
                </span>
                {battle.location?.label && (
                  <span className={`inline-flex items-center px-2 py-0.5 ${BATTLE_CARD_COLORS.container.badgeBg} rounded-full whitespace-nowrap`}>
                    📍 {battle.location.label}
                  </span>
                )}
              </div>
            </div>
            {battleResult && (
              <div className={`shrink-0 flex items-center gap-1.5 px-2 py-1 rounded-full text-white text-xs font-medium ${resultBg} self-start sm:self-center`}>
                <span className={`w-1.5 h-1.5 rounded-full ${BATTLE_CARD_COLORS.commander.dot} ${BATTLE_CARD_COLORS.commander.pulse}`}></span>
                {battle.battle && t(getBattleResultLabel(battle.battle))}
              </div>
            )}
          </div>

          {battle.battle?.belligerents && (
            <div className={`mt-3 flex items-center justify-center gap-3 py-2 ${BATTLE_CARD_COLORS.belligerents.container} rounded-lg`}>
              <span className={`text-sm font-semibold ${BATTLE_CARD_COLORS.belligerents.text}`}>{battle.battle.belligerents.attacker}</span>
              <span className="text-lg">⚔️</span>
              <span className={`text-sm font-semibold ${BATTLE_CARD_COLORS.belligerents.text}`}>{battle.battle.belligerents.defender}</span>
            </div>
          )}

          {/* Commanders - show if available */}
          {battle.battle?.commanders && (
            <div className="mt-2 flex flex-wrap gap-1">
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

          {/* Impact badge */}
          {battle.battle?.impact && battle.battle.impact !== 'unknown' && (
            <div className="mt-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${BATTLE_IMPACT_COLORS[battle.battle.impact]?.bg || BATTLE_CARD_COLORS.impact.default} ${BATTLE_IMPACT_COLORS[battle.battle.impact]?.text || BATTLE_CARD_COLORS.impact.textDefault}`}>
                💎 {t(getBattleImpactLabel(battle.battle.impact))}
              </span>
            </div>
          )}

          {battle.summaryKey && (
            <div className={`mt-2 text-xs ${BATTLE_CARD_COLORS.container.subtitle} line-clamp-2`}>
              {t(battle.summaryKey)}
            </div>
          )}
        </div>

        {/* Favorite button — positioned absolutely as a sibling to the card button, avoiding invalid HTML nesting */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          onKeyDown={(e) => e.stopPropagation()}
          aria-label={isFavorited ? t('favorites.removeFavorite') : t('favorites.addFavorite')}
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 shrink-0 p-1 rounded-full transition-colors ${
            isFavorited
              ? FAVORITE_BUTTON_COLORS.favorited.bg
              : FAVORITE_BUTTON_COLORS.default.bg
          } ${isFavorited ? FAVORITE_BUTTON_COLORS.favorited.hover : FAVORITE_BUTTON_COLORS.default.hover}`}
        >
          <span className={`text-lg ${isFavorited ? FAVORITE_BUTTON_COLORS.favorited.text : FAVORITE_BUTTON_COLORS.default.text}`}>
            {isFavorited ? '❤️' : '🤍'}
          </span>
        </button>
      </div>

      {showDetail && (
        <BattleDetail
          battle={battle}
          onClose={() => setShowDetail(false)}
        />
      )}
    </>
  );
});
