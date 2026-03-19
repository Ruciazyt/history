'use client';

import * as React from 'react';
import {
  getBattleCountByRegion,
  getGeographicInsights,
  type BattleCountByRegion,
  type GeographicInsight,
} from '@/lib/history/battles';
import { GEO_INSIGHT_COLORS, WIN_RATE_COLORS, REGION_BAR_COLORS, BATTLE_GEOGRAPHY_COLORS, BATTLE_GEOGRAPHY_DIVIDER_COLORS } from '@/lib/history/constants';

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
    <div className={`${BATTLE_GEOGRAPHY_COLORS.container.bg} rounded-xl border ${BATTLE_GEOGRAPHY_COLORS.container.border} p-4`}>
      <h3 className={`text-lg font-semibold ${BATTLE_GEOGRAPHY_COLORS.title} mb-4`}>战役地理分布</h3>
      
      {/* Insights */}
      {insights.length > 0 && (
        <div className={`mb-4 p-3 ${GEO_INSIGHT_COLORS.container} rounded-lg border ${GEO_INSIGHT_COLORS.containerBorder}`}>
          {insights.map((insight, idx) => (
            <div key={idx} className="text-sm">
              <span className={`font-medium ${GEO_INSIGHT_COLORS.title}`}>{insight.title}:</span>{' '}
              <span className={GEO_INSIGHT_COLORS.description}>{insight.description}</span>
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
          <div className={`pt-2 border-t ${BATTLE_GEOGRAPHY_DIVIDER_COLORS.border}`}>
            <div className={`text-xs ${BATTLE_GEOGRAPHY_COLORS.unknown.text}`}>
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
const RegionBar = React.memo(function RegionBar({ region }: { region: BattleCountByRegion }) {
  // Determine win rate badge color based on attacker's win rate
  const winRateBadgeClass = React.useMemo(() => {
    if (region.attackerWinRate > 55) return WIN_RATE_COLORS.attacker.high;
    if (region.attackerWinRate < 45) return WIN_RATE_COLORS.attacker.low;
    return WIN_RATE_COLORS.attacker.balanced;
  }, [region.attackerWinRate]);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className={`font-medium ${BATTLE_GEOGRAPHY_COLORS.regionName}`}>{region.regionName}</span>
        <div className="flex items-center gap-2">
          <span className={BATTLE_GEOGRAPHY_COLORS.count}>{region.count} 场</span>
          <span className={`text-xs px-1.5 py-0.5 rounded ${winRateBadgeClass}`}>
            攻{region.attackerWinRate}% vs 防{100 - region.attackerWinRate}%
          </span>
        </div>
      </div>
      <div className={`h-3 ${REGION_BAR_COLORS.track} rounded-full overflow-hidden flex`}>
        {/* Attacker wins */}
        <div 
          className={`h-full bg-gradient-to-r ${REGION_BAR_COLORS.attacker} transition-all duration-300`}
          style={{ width: `${(region.attackerWins / Math.max(region.count, 1)) * 100}%` }}
          title={`进攻方胜利: ${region.attackerWins}`}
        />
        {/* Defender wins */}
        <div 
          className={`h-full bg-gradient-to-r ${REGION_BAR_COLORS.defender} transition-all duration-300`}
          style={{ width: `${(region.defenderWins / Math.max(region.count, 1)) * 100}%` }}
          title={`防守方胜利: ${region.defenderWins}`}
        />
        {/* Other (draws, inconclusive) */}
        <div 
          className={`h-full ${REGION_BAR_COLORS.other} transition-all duration-300`}
          style={{ width: `${Math.max(0, (region.count - region.attackerWins - region.defenderWins) / Math.max(region.count, 1)) * 100}%` }}
          title={`其他: ${region.count - region.attackerWins - region.defenderWins}`}
        />
      </div>
    </div>
  );
});

export { getBattleCountByRegion, getGeographicInsights };
export type { BattleCountByRegion, GeographicInsight };
