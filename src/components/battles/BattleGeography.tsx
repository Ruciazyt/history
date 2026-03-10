'use client';

import * as React from 'react';
import {
  getBattleCountByRegion,
  getGeographicInsights,
  type BattleCountByRegion,
  type GeographicInsight,
} from '@/lib/history/battles';

/**
 * Battle Geographic Region Analysis Component
 * Shows battle distribution and win rates by geographic region
 */
export function BattleGeography({
  battles,
}: {
  battles: ReturnType<typeof import('@/lib/history/battles').getBattles>;
}) {
  const regionStats = React.useMemo(() => getBattleCountByRegion(battles), [battles]);
  const insights = React.useMemo(() => getGeographicInsights(battles), [battles]);

  if (regionStats.length === 0) {
    return null;
  }

  // Filter out unknown region for display
  const knownRegions = regionStats.filter(r => r.regionId !== 'unknown');
  const unknownRegion = regionStats.find(r => r.regionId === 'unknown');

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-4">
      <h3 className="text-lg font-semibold text-zinc-800 mb-4">战役地理分布</h3>
      
      {/* Insights */}
      {insights.length > 0 && (
        <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
          {insights.map((insight, idx) => (
            <div key={idx} className="text-sm">
              <span className="font-medium text-amber-700">{insight.title}:</span>{' '}
              <span className="text-amber-600">{insight.description}</span>
            </div>
          ))}
        </div>
      )}
      
      {/* Region bars */}
      <div className="space-y-3">
        {knownRegions.map((region) => (
          <RegionBar key={region.regionId} region={region} />
        ))}
        
        {unknownRegion && unknownRegion.count > 0 && (
          <div className="pt-2 border-t border-zinc-100">
            <div className="text-xs text-zinc-400">
              未知地点: {unknownRegion.count} 场战役
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Individual region bar showing battle count and win rate
 */
function RegionBar({ region }: { region: BattleCountByRegion }) {
  const maxCount = 15; // approximate max for scaling
  
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-zinc-700">{region.regionName}</span>
        <div className="flex items-center gap-2">
          <span className="text-zinc-500">{region.count} 场</span>
          <span className={`text-xs px-1.5 py-0.5 rounded ${
            region.attackerWinRate > 55 
              ? 'bg-red-100 text-red-600' 
              : region.attackerWinRate < 45
                ? 'bg-blue-100 text-blue-600'
                : 'bg-zinc-100 text-zinc-600'
          }`}>
            攻{region.attackerWinRate}% vs 防{100 - region.attackerWinRate}%
          </span>
        </div>
      </div>
      <div className="h-3 bg-zinc-100 rounded-full overflow-hidden flex">
        {/* Attacker wins */}
        <div 
          className="h-full bg-gradient-to-r from-red-400 to-red-500 transition-all duration-300"
          style={{ width: `${(region.attackerWins / Math.max(region.count, 1)) * 100}%` }}
          title={`进攻方胜利: ${region.attackerWins}`}
        />
        {/* Defender wins */}
        <div 
          className="h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-300"
          style={{ width: `${(region.defenderWins / Math.max(region.count, 1)) * 100}%` }}
          title={`防守方胜利: ${region.defenderWins}`}
        />
        {/* Other (draws, inconclusive) */}
        <div 
          className="h-full bg-zinc-300 transition-all duration-300"
          style={{ width: `${Math.max(0, (region.count - region.attackerWins - region.defenderWins) / Math.max(region.count, 1)) * 100}%` }}
          title={`其他: ${region.count - region.attackerWins - region.defenderWins}`}
        />
      </div>
    </div>
  );
}

export { getBattleCountByRegion, getGeographicInsights };
export type { BattleCountByRegion, GeographicInsight };
