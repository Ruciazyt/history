import type { BattleTerrain, Event } from './types';
import { getBattles } from './battles';

/**
 * Get terrain label in Chinese
 */
export function getTerrainLabel(terrain?: BattleTerrain): string {
  if (!terrain) return '';
  const keys: Record<string, string> = {
    plains: 'battle.terrain.plains',
    mountains: 'battle.terrain.mountains',
    hills: 'battle.terrain.hills',
    water: 'battle.terrain.water',
    desert: 'battle.terrain.desert',
    plateau: 'battle.terrain.plateau',
    forest: 'battle.terrain.forest',
    marsh: 'battle.terrain.marsh',
    coastal: 'battle.terrain.coastal',
    urban: 'battle.terrain.urban',
    pass: 'battle.terrain.pass',
    unknown: 'battle.terrain.unknown',
  };
  return keys[terrain] || '';
}

/**
 * Get all unique terrains from battles
 */
export function getUniqueTerrains(events: Event[]): BattleTerrain[] {
  const battles = getBattles(events);
  const terrains = new Set<BattleTerrain>();
  
  for (const battle of battles) {
    const battleTerrains = battle.battle?.terrain;
    if (battleTerrains) {
      battleTerrains.forEach(t => terrains.add(t));
    }
  }
  
  return Array.from(terrains).sort();
}

/**
 * Check if there is terrain data available
 */
export function hasTerrainData(events: Event[]): boolean {
  const battles = getBattles(events);
  return battles.some(b => b.battle?.terrain && b.battle.terrain.length > 0);
}

/**
 * Terrain statistics
 */
export type TerrainStats = {
  terrain: BattleTerrain;
  label: string;
  totalBattles: number;
  attackerWins: number;
  defenderWins: number;
  draws: number;
  inconclusive: number;
  attackerWinRate: number;
  defenderWinRate: number;
};

/**
 * Get terrain statistics for a specific terrain type
 */
export function getTerrainStats(events: Event[], terrain: BattleTerrain): TerrainStats {
  const battles = getBattles(events);
  const filteredBattles = battles.filter(b => 
    b.battle?.terrain?.includes(terrain)
  );
  
  let attackerWins = 0;
  let defenderWins = 0;
  let draws = 0;
  let inconclusive = 0;
  
  for (const battle of filteredBattles) {
    const result = battle.battle?.result;
    switch (result) {
      case 'attacker_win':
        attackerWins++;
        break;
      case 'defender_win':
        defenderWins++;
        break;
      case 'draw':
        draws++;
        break;
      case 'inconclusive':
        inconclusive++;
        break;
    }
  }
  
  const total = filteredBattles.length;
  const decided = attackerWins + defenderWins;
  
  return {
    terrain,
    label: getTerrainLabel(terrain),
    totalBattles: total,
    attackerWins,
    defenderWins,
    draws,
    inconclusive,
    attackerWinRate: decided > 0 ? (attackerWins / decided) * 100 : 0,
    defenderWinRate: decided > 0 ? (defenderWins / decided) * 100 : 0,
  };
}

/**
 * Get all terrain statistics
 */
export function getAllTerrainStats(events: Event[]): TerrainStats[] {
  const terrains = getUniqueTerrains(events);
  return terrains.map(t => getTerrainStats(events, t));
}

/**
 * Get battles by terrain type
 */
export function getBattlesByTerrain(events: Event[], terrain: BattleTerrain): Event[] {
  const battles = getBattles(events);
  return battles.filter(b => b.battle?.terrain?.includes(terrain));
}

/**
 * Get most common terrains (sorted by battle count)
 */
export function getMostCommonTerrains(events: Event[], limit = 5): TerrainStats[] {
  const stats = getAllTerrainStats(events);
  return stats
    .sort((a, b) => b.totalBattles - a.totalBattles)
    .slice(0, limit);
}

/**
 * Get most effective terrains for attackers
 */
export function getMostEffectiveTerrainsForAttackers(events: Event[], minBattles = 2): TerrainStats[] {
  const stats = getAllTerrainStats(events);
  return stats
    .filter(s => s.totalBattles >= minBattles)
    .sort((a, b) => b.attackerWinRate - a.attackerWinRate);
}

/**
 * Get most effective terrains for defenders
 */
export function getMostEffectiveTerrainsForDefenders(events: Event[], minBattles = 2): TerrainStats[] {
  const stats = getAllTerrainStats(events);
  return stats
    .filter(s => s.totalBattles >= minBattles)
    .sort((a, b) => b.defenderWinRate - a.defenderWinRate);
}

/**
 * Terrain advantage analysis
 */
export type TerrainAdvantage = {
  terrain: BattleTerrain;
  label: string;
  advantage: 'attacker' | 'defender' | 'balanced';
  winRateDiff: number;
  totalBattles: number;
};

/**
 * Analyze terrain advantage
 */
export function getTerrainAdvantage(events: Event[], minBattles = 2): TerrainAdvantage[] {
  const stats = getAllTerrainStats(events);
  
  return stats
    .filter(s => s.totalBattles >= minBattles)
    .map(s => {
      const diff = s.attackerWinRate - s.defenderWinRate;
      let advantage: 'attacker' | 'defender' | 'balanced';
      
      if (diff > 10) {
        advantage = 'attacker';
      } else if (diff < -10) {
        advantage = 'defender';
      } else {
        advantage = 'balanced';
      }
      
      return {
        terrain: s.terrain,
        label: s.label,
        advantage,
        winRateDiff: diff,
        totalBattles: s.totalBattles,
      };
    })
    .sort((a, b) => Math.abs(b.winRateDiff) - Math.abs(a.winRateDiff));
}

/**
 * Generate terrain-related historical insights
 */
export function getTerrainInsights(events: Event[]): string[] {
  const insights: string[] = [];
  const stats = getAllTerrainStats(events);
  const hasData = stats.some(s => s.totalBattles > 0);
  
  if (!hasData) {
    return ['暂无地形相关数据'];
  }
  
  // Most common terrain
  const mostCommon = [...stats].sort((a, b) => b.totalBattles - a.totalBattles)[0];
  if (mostCommon && mostCommon.totalBattles > 0) {
    insights.push(`历史上最常见的战场地形是${mostCommon.label}，共有${mostCommon.totalBattles}场战役在此地形发生。`);
  }
  
  // Best terrain for attackers
  const attackerBest = getMostEffectiveTerrainsForAttackers(events, 2)[0];
  if (attackerBest && attackerBest.attackerWinRate > 50) {
    insights.push(`在${attackerBest.label}作战对进攻方最为有利，进攻方胜率高达${attackerBest.attackerWinRate.toFixed(1)}%。`);
  }
  
  // Best terrain for defenders  
  const defenderBest = getMostEffectiveTerrainsForDefenders(events, 2)[0];
  if (defenderBest && defenderBest.defenderWinRate > 50) {
    insights.push(`防守方在${defenderBest.label}最容易取得胜利，防守方胜率达到${defenderBest.defenderWinRate.toFixed(1)}%。`);
  }
  
  // Terrain with most decisive results
  const decidedStats = stats.filter(s => s.totalBattles >= 3);
  if (decidedStats.length > 0) {
    const mostDecisive = [...decidedStats].sort((a, b) => {
      const aDecisive = a.attackerWins + a.defenderWins;
      const bDecisive = b.attackerWins + b.defenderWins;
      return bDecisive - aDecisive;
    })[0];
    
    if (mostDecisive) {
      insights.push(`${mostDecisive.label}的战役结果最为明确，较少出现平局或胜负未明的情况。`);
    }
  }
  
  return insights;
}

/**
 * Get terrain distribution by era
 */
export type TerrainByEra = {
  eraId: string;
  terrain: BattleTerrain;
  label: string;
  count: number;
  attackerWins: number;
  defenderWins: number;
};

/**
 * Analyze terrain distribution by era
 */
export function getTerrainDistributionByEra(events: Event[], eraId: string): TerrainByEra[] {
  const battles = getBattles(events).filter(b => b.entityId === eraId);
  const terrainMap = new Map<BattleTerrain, { count: number; attackerWins: number; defenderWins: number }>();
  
  for (const battle of battles) {
    const terrains = battle.battle?.terrain;
    if (!terrains) continue;
    
    for (const terrain of terrains) {
      const current = terrainMap.get(terrain) || { count: 0, attackerWins: 0, defenderWins: 0 };
      current.count++;
      
      if (battle.battle?.result === 'attacker_win') {
        current.attackerWins++;
      } else if (battle.battle?.result === 'defender_win') {
        current.defenderWins++;
      }
      
      terrainMap.set(terrain, current);
    }
  }
  
  return Array.from(terrainMap.entries()).map(([terrain, data]) => ({
    eraId,
    terrain,
    label: getTerrainLabel(terrain),
    ...data,
  }));
}

/**
 * Complete terrain summary
 */
export type TerrainSummary = {
  hasTerrainData: boolean;
  uniqueTerrains: number;
  totalBattlesWithTerrain: number;
  terrainStats: TerrainStats[];
  mostCommonTerrains: TerrainStats[];
  terrainAdvantage: TerrainAdvantage[];
  insights: string[];
};

/**
 * Get complete terrain analysis summary
 */
export function getTerrainSummary(events: Event[]): TerrainSummary {
  const battles = getBattles(events);
  const battlesWithTerrain = battles.filter(b => b.battle?.terrain && b.battle.terrain.length > 0);
  
  return {
    hasTerrainData: hasTerrainData(events),
    uniqueTerrains: getUniqueTerrains(events).length,
    totalBattlesWithTerrain: battlesWithTerrain.length,
    terrainStats: getAllTerrainStats(events),
    mostCommonTerrains: getMostCommonTerrains(events, 5),
    terrainAdvantage: getTerrainAdvantage(events, 2),
    insights: getTerrainInsights(events),
  };
}
