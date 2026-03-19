'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import type { Event } from '@/lib/history/types';
import { formatYear } from '@/lib/history/utils';
import { getBattleResultLabel, getBattleImpactLabel } from '@/lib/history/battles';
import { STRATEGY_LABELS, TERRAIN_LABELS, TURNING_POINT_LABELS, Z_INDEX, BATTLE_RESULT_STYLES, BATTLE_IMPACT_COLORS, BATTLE_DETAIL_COLORS, BATTLE_DETAIL_TEXT_COLORS, COMMANDER_COLORS, STRATEGY_BADGE_COLORS, TERRAIN_BADGE_COLORS, BATTLE_TYPE_COLORS, PACING_BADGE_COLORS, TIME_OF_DAY_COLORS, TURNING_POINT_COLORS, MODAL_BACKDROP_COLORS } from '@/lib/history/constants';
import { getBattleTypeName } from '@/lib/history/battles';
import { getPacingLabel, getTimeOfDayLabel } from '@/lib/history/battlePacing';
import { useEscapeKey } from '@/lib/history/useBattleHooks';

interface BattleDetailProps {
  battle: Event;
  onClose: () => void;
}

export const BattleDetail = React.memo(function BattleDetail({ battle, onClose }: BattleDetailProps) {
  const t = useTranslations();
  
  // Use existing useEscapeKey hook for escape key handling
  useEscapeKey(onClose);
  
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-0 sm:p-4"
      style={{ zIndex: Z_INDEX.modal }}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 ${MODAL_BACKDROP_COLORS.bg} ${MODAL_BACKDROP_COLORS.blur}`}
        onClick={onClose}
      />
      
      {/* Modal - full screen on mobile */}
      <div className="relative w-full h-full sm:w-full sm:max-w-lg sm:h-auto sm:rounded-xl bg-white shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className={`shrink-0 ${BATTLE_DETAIL_COLORS.header.bg} ${BATTLE_DETAIL_COLORS.header.text} p-3 sm:p-4 rounded-t-xl`}>
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-base sm:text-lg font-bold line-clamp-2">{t(battle.titleKey)}</h2>
            <button
              onClick={onClose}
              className={`shrink-0 w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-full ${BATTLE_DETAIL_COLORS.header.close} transition-colors text-lg sm:text-base`}
              aria-label={t('battleDetail.close')}
            >
              ✕
            </button>
          </div>
          <div className={`mt-1 ${BATTLE_DETAIL_COLORS.header.yearLocation} text-xs sm:text-sm`}>
            {formatYear(battle.year)}
            {battle.location?.label && ` · ${battle.location.label}`}
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
          {/* Result badge */}
          {battle.battle?.result && (
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${BATTLE_DETAIL_TEXT_COLORS.label}`}>{t('battleDetail.result')}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                BATTLE_RESULT_STYLES[battle.battle.result]?.badge || BATTLE_RESULT_STYLES.unknown?.badge || 'bg-zinc-100 text-zinc-700'
              }`}>
                {getBattleResultLabel(battle.battle)}
              </span>
            </div>
          )}
          
          {/* Belligerents */}
          {battle.battle?.belligerents && (
            <div className={`${BATTLE_DETAIL_COLORS.section.bg} rounded-lg p-4`}>
              <h3 className={`text-sm font-semibold ${BATTLE_DETAIL_TEXT_COLORS.sectionTitle} mb-3`}>{t('battleDetail.belligerents')}</h3>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 text-center">
                  <div className={`text-xs ${BATTLE_DETAIL_TEXT_COLORS.labelSmall} mb-1`}>{t('battleDetail.attacker')}</div>
                  <div className={`font-semibold ${BATTLE_DETAIL_COLORS.belligerents.attacker}`}>
                    {battle.battle.belligerents.attacker}
                  </div>
                </div>
                <div className="text-2xl">⚔️</div>
                <div className="flex-1 text-center">
                  <div className={`text-xs ${BATTLE_DETAIL_TEXT_COLORS.labelSmall} mb-1`}>{t('battleDetail.defender')}</div>
                  <div className={`font-semibold ${BATTLE_DETAIL_COLORS.belligerents.defender}`}>
                    {battle.battle.belligerents.defender}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Summary */}
          <div>
            <h3 className={`text-sm font-semibold ${BATTLE_DETAIL_TEXT_COLORS.sectionTitle} mb-2`}>{t('battleDetail.summary')}</h3>
            <p className={`${BATTLE_DETAIL_TEXT_COLORS.content} text-sm leading-relaxed`}>
              {t(battle.summaryKey)}
            </p>
          </div>
          
          {/* Location */}
          {battle.location && (
            <div className="flex items-start gap-2">
              <span className="text-lg">📍</span>
              <div>
                <div className={`text-sm font-medium ${BATTLE_DETAIL_TEXT_COLORS.content}`}>{t('battleDetail.location')}</div>
                <div className={`text-sm ${BATTLE_DETAIL_TEXT_COLORS.contentLight}`}>
                  {battle.location.label}
                  {battle.location.lat && battle.location.lon && (
                    <span className="text-xs ml-1">
                      ({battle.location.lat.toFixed(2)}, {battle.location.lon.toFixed(2)})
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Impact - new field */}
          {battle.battle?.impact && battle.battle.impact !== 'unknown' && (
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${BATTLE_DETAIL_TEXT_COLORS.label}`}>{t('battleDetail.impact')}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                BATTLE_IMPACT_COLORS[battle.battle.impact]?.bg || 'bg-zinc-100'
              } ${BATTLE_IMPACT_COLORS[battle.battle.impact]?.text || 'text-zinc-700'}`}>
                {getBattleImpactLabel(battle.battle.impact)}
              </span>
            </div>
          )}
          
          {/* Commanders */}
          {(battle.battle?.commanders?.attacker?.length || battle.battle?.commanders?.defender?.length) && (
            <div className={`${BATTLE_DETAIL_COLORS.section.bg} rounded-lg p-4`}>
              <h3 className={`text-sm font-semibold ${BATTLE_DETAIL_TEXT_COLORS.sectionTitle} mb-3`}>{t('battleDetail.commanders')}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className={`text-xs ${COMMANDER_COLORS.attacker.label} mb-1`}>{t('battleDetail.attacker')}</div>
                  {battle.battle?.commanders?.attacker?.map((cmd, i) => (
                    <div key={i} className={`text-sm font-medium ${BATTLE_DETAIL_TEXT_COLORS.content}`}>👤 {cmd}</div>
                  ))}
                  {!battle.battle?.commanders?.attacker?.length && (
                    <div className={`text-xs ${BATTLE_DETAIL_TEXT_COLORS.unknown}`}>{t('battleDetail.unknown')}</div>
                  )}
                </div>
                <div>
                  <div className={`text-xs ${COMMANDER_COLORS.defender.label} mb-1`}>{t('battleDetail.defender')}</div>
                  {battle.battle?.commanders?.defender?.map((cmd, i) => (
                    <div key={i} className={`text-sm font-medium ${BATTLE_DETAIL_TEXT_COLORS.content}`}>👤 {cmd}</div>
                  ))}
                  {!battle.battle?.commanders?.defender?.length && (
                    <div className={`text-xs ${BATTLE_DETAIL_TEXT_COLORS.unknown}`}>{t('battleDetail.unknown')}</div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Strategy */}
          {battle.battle?.strategy && battle.battle.strategy.length > 0 && (
            <div className="flex items-start gap-2">
              <span className={`text-sm font-medium ${BATTLE_DETAIL_TEXT_COLORS.label}`}>{t('battleDetail.strategy')}</span>
              <div className="flex flex-wrap gap-1">
                {battle.battle.strategy.filter(s => s !== 'unknown').map((s, i) => (
                  <span key={i} className={`px-2 py-0.5 ${STRATEGY_BADGE_COLORS.bg} ${STRATEGY_BADGE_COLORS.text} text-xs rounded`}>
                    {STRATEGY_LABELS[s] || s}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Terrain */}
          {battle.battle?.terrain && battle.battle.terrain.length > 0 && (
            <div className="flex items-start gap-2">
              <span className={`text-sm font-medium ${BATTLE_DETAIL_TEXT_COLORS.label}`}>{t('battleDetail.terrain')}</span>
              <div className="flex flex-wrap gap-1">
                {battle.battle.terrain.filter(t => t !== 'unknown').map((t, i) => (
                  <span key={i} className={`px-2 py-0.5 ${TERRAIN_BADGE_COLORS.bg} ${TERRAIN_BADGE_COLORS.text} text-xs rounded`}>
                    {TERRAIN_LABELS[t] || t}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Battle Type */}
          {battle.battle?.battleType && battle.battle.battleType !== 'unknown' && (
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${BATTLE_DETAIL_TEXT_COLORS.label}`}>{t('battleDetail.battleType')}</span>
              <span className={`px-3 py-1 ${BATTLE_TYPE_COLORS.bg} ${BATTLE_TYPE_COLORS.text} text-xs rounded-full`}>
                {getBattleTypeName(battle.battle.battleType)}
              </span>
            </div>
          )}
          
          {/* Pacing & Time of Day */}
          {(battle.battle?.pacing || battle.battle?.timeOfDay) && (
            <div className="flex flex-wrap gap-3">
              {battle.battle?.pacing && battle.battle.pacing !== 'unknown' && (
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${BATTLE_DETAIL_TEXT_COLORS.label}`}>{t('battleDetail.pacing')}</span>
                  <span className={`px-2 py-0.5 ${PACING_BADGE_COLORS.bg} ${PACING_BADGE_COLORS.text} text-xs rounded`}>
                    {getPacingLabel(battle.battle.pacing)}
                  </span>
                </div>
              )}
              {battle.battle?.timeOfDay && battle.battle.timeOfDay !== 'unknown' && (
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${BATTLE_DETAIL_TEXT_COLORS.label}`}>{t('battleDetail.timeOfDay')}</span>
                  <span className={`px-2 py-0.5 ${TIME_OF_DAY_COLORS.bg} ${TIME_OF_DAY_COLORS.text} text-xs rounded`}>
                    {getTimeOfDayLabel(battle.battle.timeOfDay)}
                  </span>
                </div>
              )}
            </div>
          )}
          
          {/* Turning Points */}
          {battle.battle?.turningPoints && battle.battle.turningPoints.length > 0 && (
            <div className={`${TURNING_POINT_COLORS.container} rounded-lg p-4`}>
              <h3 className={`text-sm font-semibold ${BATTLE_DETAIL_TEXT_COLORS.sectionTitle} mb-3`}>{t('battleDetail.turningPoints')}</h3>
              <div className="space-y-2">
                {battle.battle.turningPoints.filter(tp => tp.type !== 'unknown').map((tp, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className={`shrink-0 w-2 h-2 rounded-full mt-1.5 ${
                      tp.impact === 'positive' ? TURNING_POINT_COLORS.positive :
                      tp.impact === 'negative' ? TURNING_POINT_COLORS.negative : TURNING_POINT_COLORS.neutral
                    }`} />
                    <div>
                      <span className={`px-1.5 py-0.5 bg-white ${BATTLE_DETAIL_TEXT_COLORS.label} text-xs rounded border ${TURNING_POINT_COLORS.containerBorder}`}>
                        {TURNING_POINT_LABELS[tp.type] || tp.type}
                      </span>
                      <span className={`ml-2 ${BATTLE_DETAIL_TEXT_COLORS.label}`}>{tp.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Tags */}
          {battle.tags && battle.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {battle.tags.filter(tag => tag !== 'war').map(tag => (
                <span 
                  key={tag}
                  className={`px-2 py-0.5 bg-zinc-100 ${BATTLE_DETAIL_TEXT_COLORS.labelSmall} text-xs rounded`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Sources */}
          {battle.sources && battle.sources.length > 0 && (
            <div>
              <h3 className={`text-sm font-semibold ${BATTLE_DETAIL_TEXT_COLORS.sectionTitle} mb-2`}>{t('battleDetail.sources')}</h3>
              <ul className="space-y-1">
                {battle.sources.map((source, i) => (
                  <li key={i}>
                    <a 
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`text-xs ${BATTLE_DETAIL_TEXT_COLORS.link}`}
                    >
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
