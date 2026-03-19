'use client';

import * as React from 'react';
import type { Event } from '@/lib/history/types';
import { compareBattles, getComparisonSummary, getBattleResultLabel, getBattleImpactLabel } from '@/lib/history/battles';
import { formatYear } from '@/lib/history/utils';
import { STRATEGY_LABELS, Z_INDEX, PARTY_COLORS, BATTLE_IMPACT_COLORS, BATTLE_COMPARE_GRADIENTS, STRATEGY_BADGE_COLORS, COMPARISON_SUMMARY_COLORS, BATTLE_DETAIL_COLORS, BATTLE_COMPARE_COLORS, BATTLE_COMPARE_VIEW_COLORS } from '@/lib/history/constants';
import { useEscapeKey } from '@/lib/history/useBattleHooks';
import { useTranslations } from 'next-intl';

interface BattleCompareProps {
  battle1: Event;
  battle2: Event;
  onClose: () => void;
}

export function BattleCompare({ battle1, battle2, onClose }: BattleCompareProps) {
  const t = useTranslations();
  
  const comparison = React.useMemo(() => compareBattles(battle1, battle2), [battle1, battle2]);
  const summary = React.useMemo(() => getComparisonSummary(comparison.comparison), [comparison]);
  
  // Use existing hook for escape key handling
  useEscapeKey(onClose);
  
  const renderBattleSide = (battle: Event, side: 'left' | 'right') => {
    const partyColors = side === 'left' ? PARTY_COLORS.attacker : PARTY_COLORS.defender;
    const eraGradient = side === 'left' ? BATTLE_COMPARE_GRADIENTS.attacker : BATTLE_COMPARE_GRADIENTS.defender;
    
    return (
      <div className={`flex-1 bg-gradient-to-b ${eraGradient} rounded-xl p-4 border ${partyColors.border}`}>
        {/* Header */}
        <div className="text-center mb-4">
          <h3 className={`text-lg font-bold ${BATTLE_COMPARE_COLORS.header.title}`}>{t(battle.titleKey)}</h3>
          <div className={`text-sm ${BATTLE_COMPARE_COLORS.header.year} mt-1`}>
            {formatYear(battle.year)}
          </div>
          {battle.location?.label && (
            <div className={`text-xs ${BATTLE_COMPARE_COLORS.header.location} mt-1 flex items-center justify-center gap-1`}>
              📍 {battle.location.label}
            </div>
          )}
        </div>
        
        {/* Result */}
        {battle.battle?.result && (
          <div className="mb-4">
            <div className={`text-xs ${BATTLE_COMPARE_COLORS.label} mb-1 text-center`}>{t('battleCompare.result')}</div>
            <div className={`text-center px-3 py-2 rounded-lg ${partyColors.badge}`}>
              {getBattleResultLabel(battle.battle)}
            </div>
          </div>
        )}
        
        {/* Belligerents */}
        {battle.battle?.belligerents && (
          <div className="space-y-2">
            <div className={`text-xs ${BATTLE_COMPARE_COLORS.label} mb-1 text-center`}>{t('battleCompare.belligerents')}</div>
            <div className={`flex items-center justify-between gap-2 p-2 rounded-lg ${partyColors.bg}`}>
              <div className="flex-1 text-center">
                <div className={`text-xs ${BATTLE_COMPARE_COLORS.label}`}>{t('battleCompare.attacker')}</div>
                <div className={`font-semibold ${BATTLE_COMPARE_VIEW_COLORS.belligerents.attacker}`}>
                  {battle.battle.belligerents.attacker}
                </div>
              </div>
              <div className="text-lg">⚔️</div>
              <div className="flex-1 text-center">
                <div className={`text-xs ${BATTLE_COMPARE_COLORS.label}`}>{t('battleCompare.defender')}</div>
                <div className={`font-semibold ${BATTLE_COMPARE_VIEW_COLORS.belligerents.defender}`}>
                  {battle.battle.belligerents.defender}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Impact */}
        {battle.battle?.impact && battle.battle.impact !== 'unknown' && (
          <div className="mt-3 text-center">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${BATTLE_IMPACT_COLORS[battle.battle.impact]?.bg || 'bg-zinc-100'} ${BATTLE_IMPACT_COLORS[battle.battle.impact]?.text || 'text-zinc-500'}`}>
              💎 {getBattleImpactLabel(battle.battle.impact)}
            </span>
          </div>
        )}
        
        {/* Commanders */}
        {(battle.battle?.commanders?.attacker?.length || battle.battle?.commanders?.defender?.length) && (
          <div className={`mt-3 pt-3 border-t ${BATTLE_COMPARE_COLORS.section.divider}`}>
            <div className={`text-xs ${BATTLE_COMPARE_COLORS.commander.label} mb-2`}>指挥官</div>
            <div className="flex flex-wrap justify-center gap-1">
              {battle.battle?.commanders?.attacker?.map((cmd, i) => (
                <span key={`att-${i}`} className={`px-2 py-0.5 ${partyColors.badge} ${BATTLE_COMPARE_COLORS.commander.badge}`}>👤 {cmd}</span>
              ))}
              {battle.battle?.commanders?.defender?.map((cmd, i) => (
                <span key={`def-${i}`} className={`px-2 py-0.5 ${side === 'left' ? PARTY_COLORS.defender.badge : PARTY_COLORS.attacker.badge} ${BATTLE_COMPARE_COLORS.commander.badge}`}>👤 {cmd}</span>
              ))}
            </div>
          </div>
        )}
        
        {/* Strategy */}
        {battle.battle?.strategy && battle.battle.strategy.length > 0 && (
          <div className="mt-3 flex flex-wrap justify-center gap-1">
            {battle.battle.strategy.filter(s => s !== 'unknown').slice(0, 3).map((s, i) => (
              <span key={i} className={`px-2 py-0.5 ${STRATEGY_BADGE_COLORS.bg} ${STRATEGY_BADGE_COLORS.text} text-xs rounded`}>
                {STRATEGY_LABELS[s] || s}
              </span>
            ))}
          </div>
        )}
        
        {/* Summary */}
        <div className={`mt-4 pt-4 border-t ${BATTLE_COMPARE_COLORS.section.divider}`}>
          <div className={`text-xs ${BATTLE_COMPARE_COLORS.overview.label} mb-2`}>战役概述</div>
          <p className={`text-sm ${BATTLE_COMPARE_COLORS.overview.text} leading-relaxed`}>
            {t(battle.summaryKey)}
          </p>
        </div>
      </div>
    );
  };
  
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-0 sm:p-4"
      style={{ zIndex: Z_INDEX.modal }}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 ${BATTLE_COMPARE_VIEW_COLORS.overlay}`}
        onClick={onClose}
      />
      
      {/* Modal - full screen on mobile */}
      <div className={`relative w-full h-full sm:w-full sm:max-w-4xl sm:h-auto sm:rounded-xl ${BATTLE_COMPARE_VIEW_COLORS.modal} overflow-hidden flex flex-col`}>
        {/* Header */}
        <div className={`shrink-0 ${BATTLE_COMPARE_VIEW_COLORS.header} p-3 sm:p-4`}>
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg sm:text-xl font-bold">{t('battleCompare.title')}</h2>
            <button
              onClick={onClose}
              className={`shrink-0 w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-full ${BATTLE_COMPARE_VIEW_COLORS.closeButton.bg} ${BATTLE_COMPARE_VIEW_COLORS.closeButton.hover} transition-colors text-lg sm:text-base`}
              aria-label={t('battleCompare.close')}
            >
              ✕
            </button>
          </div>
        </div>
        
        {/* Comparison summary */}
        <div className={`shrink-0 ${COMPARISON_SUMMARY_COLORS.container} px-3 sm:px-4 py-2 sm:py-3 border-b ${COMPARISON_SUMMARY_COLORS.border}`}>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
            {summary.map((item, i) => (
              <span 
                key={i}
                className={`px-2 sm:px-3 py-0.5 sm:py-1 ${COMPARISON_SUMMARY_COLORS.badge} text-xs sm:text-sm rounded-full`}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {renderBattleSide(battle1, 'left')}
            {renderBattleSide(battle2, 'right')}
          </div>
        </div>
        
        {/* Footer */}
        <div className={`shrink-0 ${BATTLE_DETAIL_COLORS.section.bg} p-3 sm:p-4 border-t ${BATTLE_DETAIL_COLORS.section.border}`}>
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className={`w-full sm:w-auto px-6 py-2.5 sm:py-2 ${BATTLE_DETAIL_COLORS.closeButton} text-white rounded-lg transition-colors text-base sm:text-sm`}
            >
              关闭对比
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
