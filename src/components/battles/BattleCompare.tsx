'use client';

import * as React from 'react';
import type { Event } from '@/lib/history/types';
import { compareBattles, getComparisonSummary, getBattleResultLabel } from '@/lib/history/battles';
import { formatYear } from '@/lib/history/utils';
import { useTranslations } from 'next-intl';

interface BattleCompareProps {
  battle1: Event;
  battle2: Event;
  onClose: () => void;
}

export function BattleCompare({ battle1, battle2, onClose }: BattleCompareProps) {
  const t = useTranslations();
  
  const comparison = React.useMemo(() => compareBattles(battle1, battle2), [battle1, battle2]);
  const summary = React.useMemo(() => getComparisonSummary(comparison.comparison, t), [comparison, t]);
  
  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);
  
  const renderBattleSide = (battle: Event, side: 'left' | 'right') => {
    const eraColor = side === 'left' ? 'from-red-50 to-orange-50' : 'from-blue-50 to-indigo-50';
    const borderColor = side === 'left' ? 'border-red-200' : 'border-blue-200';
    const badgeColor = side === 'left' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700';
    
    return (
      <div className={`flex-1 bg-gradient-to-b ${eraColor} rounded-xl p-4 border ${borderColor}`}>
        {/* Header */}
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-zinc-800">{t(battle.titleKey)}</h3>
          <div className="text-sm text-zinc-500 mt-1">
            {formatYear(battle.year)}
          </div>
          {battle.location?.label && (
            <div className="text-xs text-zinc-400 mt-1 flex items-center justify-center gap-1">
              📍 {battle.location.label}
            </div>
          )}
        </div>
        
        {/* Result */}
        {battle.battle?.result && (
          <div className="mb-4">
            <div className="text-xs text-zinc-500 mb-1 text-center">结果</div>
            <div className={`text-center px-3 py-2 rounded-lg ${badgeColor}`}>
              {getBattleResultLabel(battle.battle)}
            </div>
          </div>
        )}
        
        {/* Belligerents */}
        {battle.battle?.belligerents && (
          <div className="space-y-2">
            <div className="text-xs text-zinc-500 mb-1 text-center">参战方</div>
            <div className={`flex items-center justify-between gap-2 p-2 rounded-lg ${side === 'left' ? 'bg-red-100' : 'bg-blue-100'}`}>
              <div className="flex-1 text-center">
                <div className="text-xs text-zinc-500">进攻方</div>
                <div className={`font-semibold ${side === 'left' ? 'text-red-700' : 'text-blue-700'}`}>
                  {battle.battle.belligerents.attacker}
                </div>
              </div>
              <div className="text-lg">⚔️</div>
              <div className="flex-1 text-center">
                <div className="text-xs text-zinc-500">防守方</div>
                <div className={`font-semibold ${side === 'left' ? 'text-blue-700' : 'text-red-700'}`}>
                  {battle.battle.belligerents.defender}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Summary */}
        <div className="mt-4 pt-4 border-t border-zinc-200">
          <div className="text-xs text-zinc-500 mb-2">战役概述</div>
          <p className="text-sm text-zinc-600 leading-relaxed">
            {t(battle.summaryKey)}
          </p>
        </div>
      </div>
    );
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-blue-600 text-white p-4 rounded-t-xl">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-xl font-bold">⚔️ 战役对比</h2>
            <button
              onClick={onClose}
              className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
        
        {/* Comparison summary */}
        <div className="bg-amber-50 px-4 py-3 border-b border-amber-100">
          <div className="flex flex-wrap gap-2 justify-center">
            {summary.map((item, i) => (
              <span 
                key={i}
                className="px-3 py-1 bg-amber-100 text-amber-700 text-sm rounded-full"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="flex flex-col sm:flex-row gap-4">
            {renderBattleSide(battle1, 'left')}
            {renderBattleSide(battle2, 'right')}
          </div>
        </div>
        
        {/* Footer */}
        <div className="sticky bottom-0 bg-zinc-50 p-4 rounded-b-xl border-t border-zinc-200">
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-zinc-600 text-white rounded-lg hover:bg-zinc-700 transition-colors"
            >
              关闭对比
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
