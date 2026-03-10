'use client';

import * as React from 'react';
import type { Event } from '@/lib/history/types';
import { formatYear } from '@/lib/history/utils';
import { getBattleResultLabel } from '@/lib/history/battles';
import { useTranslations } from 'next-intl';

interface BattleDetailProps {
  battle: Event;
  onClose: () => void;
}

export function BattleDetail({ battle, onClose }: BattleDetailProps) {
  const t = useTranslations();
  
  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);
  
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
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-red-600 text-white p-4 rounded-t-xl">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-lg font-bold">{t(battle.titleKey)}</h2>
            <button
              onClick={onClose}
              className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-red-700 hover:bg-red-800 transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="mt-1 text-red-100 text-sm">
            {formatYear(battle.year)}
            {battle.location?.label && ` · ${battle.location.label}`}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Result badge */}
          {battle.battle?.result && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-zinc-600">结果：</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                battle.battle.result === 'attacker_win' ? 'bg-green-100 text-green-700' :
                battle.battle.result === 'defender_win' ? 'bg-blue-100 text-blue-700' :
                battle.battle.result === 'draw' ? 'bg-yellow-100 text-yellow-700' :
                'bg-zinc-100 text-zinc-700'
              }`}>
                {getBattleResultLabel(battle.battle)}
              </span>
            </div>
          )}
          
          {/* Belligerents */}
          {battle.battle?.belligerents && (
            <div className="bg-zinc-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-zinc-700 mb-3">参战双方</h3>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 text-center">
                  <div className="text-xs text-zinc-500 mb-1">进攻方</div>
                  <div className="font-semibold text-red-700">
                    {battle.battle.belligerents.attacker}
                  </div>
                </div>
                <div className="text-2xl">⚔️</div>
                <div className="flex-1 text-center">
                  <div className="text-xs text-zinc-500 mb-1">防守方</div>
                  <div className="font-semibold text-blue-700">
                    {battle.battle.belligerents.defender}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Summary */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-700 mb-2">战役概述</h3>
            <p className="text-zinc-600 text-sm leading-relaxed">
              {t(battle.summaryKey)}
            </p>
          </div>
          
          {/* Location */}
          {battle.location && (
            <div className="flex items-start gap-2">
              <span className="text-lg">📍</span>
              <div>
                <div className="text-sm font-medium text-zinc-700">战场位置</div>
                <div className="text-sm text-zinc-500">
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
          
          {/* Tags */}
          {battle.tags && battle.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {battle.tags.filter(tag => tag !== 'war').map(tag => (
                <span 
                  key={tag}
                  className="px-2 py-0.5 bg-zinc-100 text-zinc-600 text-xs rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Sources */}
          {battle.sources && battle.sources.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-zinc-700 mb-2">参考资料</h3>
              <ul className="space-y-1">
                {battle.sources.map((source, i) => (
                  <li key={i}>
                    <a 
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
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
}
