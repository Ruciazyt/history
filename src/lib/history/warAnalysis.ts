import type { Event, BattleType } from './types';
import { getBattles } from './battles';

// ============ Types ============

/** A war/conflict containing multiple battles */
export type War = {
  id: string;
  name: string;
  nameKey?: string;
  startYear: number;
  endYear: number;
  battles: Event[];
  /** Primary battle type */
  battleType?: BattleType;
};

/** War statistics */
export type WarStats = {
  warId: string;
  warName: string;
  battleCount: number;
  duration: number; // years
  attackerWins: number;
  defenderWins: number;
  draws: number;
  inconclusive: number;
};

/** Era war activity */
export type EraWarActivity = {
  eraId: string;
  eraName: string;
  warCount: number;
  battleCount: number;
  totalWarDuration: number;
  averageWarDuration: number;
};

// ============ Helper Functions ============

/**
 * Get battle type label in Chinese
 */
export function getBattleTypeLabel(type?: BattleType): string {
  const labels: Record<BattleType, string> = {
    founding: '开国之战',
    unification: '统一战争',
    conquest: '征服战',
    defense: '防御战',
    rebellion: '叛乱/起义',
    'civil-war': '内战',
    frontier: '边疆战役',
    invasion: '入侵/外敌',
    unknown: '未知',
  };
  return type ? labels[type] : '未知';
}

/**
 * Get war name from a battle (using warNameKey or inferring from era)
 */
export function getWarName(battle: Event, t?: (key: string) => string): string {
  if (battle.battle?.warNameKey && t) {
    return t(battle.battle.warNameKey);
  }
  // Default to entity (era) name
  return battle.entityId;
}

/**
 * Group battles into wars based on:
 * 1. Explicit warNameKey if available
 * 2. Same era within a close time window (within 30 years)
 * 3. Same battle type
 */
export function groupBattlesIntoWars(battles: Event[]): War[] {
  const wars: War[] = [];
  const usedBattleIds = new Set<string>();

  // Sort battles by year
  const sortedBattles = [...battles].sort((a, b) => a.year - b.year);

  for (const battle of sortedBattles) {
    if (usedBattleIds.has(battle.id)) continue;

    // Check if there's an explicit war name
    if (battle.battle?.warNameKey) {
      const warBattles = battles.filter(
        b => b.battle?.warNameKey === battle.battle?.warNameKey
      );
      const warYears = warBattles.map(b => b.year);
      
      wars.push({
        id: battle.battle.warNameKey,
        name: battle.battle.warNameKey,
        nameKey: battle.battle.warNameKey,
        startYear: Math.min(...warYears),
        endYear: Math.max(...warYears),
        battles: warBattles,
        battleType: battle.battle.battleType,
      });

      warBattles.forEach(b => usedBattleIds.add(b.id));
      continue;
    }

    // Group by era and close years (within 30 years)
    const eraBattles = battles.filter(
      b => b.entityId === battle.entityId && 
           !usedBattleIds.has(b.id) &&
           Math.abs(b.year - battle.year) <= 30
    );

    if (eraBattles.length > 0) {
      const warYears = eraBattles.map(b => b.year);
      const battleTypes = [...new Set(eraBattles.map(b => b.battle?.battleType).filter(Boolean))];
      
      wars.push({
        id: `war-${battle.entityId}-${Math.floor(battle.year / 10)}`,
        name: `${battle.entityId} ${Math.floor(battle.year / 10)}s`,
        startYear: Math.min(...warYears),
        endYear: Math.max(...warYears),
        battles: eraBattles,
        battleType: battleTypes[0] as BattleType | undefined,
      });

      eraBattles.forEach(b => usedBattleIds.add(b.id));
    }
  }

  // Sort wars by start year
  wars.sort((a, b) => a.startYear - b.startYear);
  
  return wars;
}

/**
 * Get statistics for a single war
 */
export function getWarStats(war: War): WarStats {
  let attackerWins = 0;
  let defenderWins = 0;
  let draws = 0;
  let inconclusive = 0;

  for (const battle of war.battles) {
    switch (battle.battle?.result) {
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

  return {
    warId: war.id,
    warName: war.nameKey ? war.nameKey : war.name,
    battleCount: war.battles.length,
    duration: war.endYear - war.startYear,
    attackerWins,
    defenderWins,
    draws,
    inconclusive,
  };
}

/**
 * Get all wars with statistics
 */
export function getAllWarsWithStats(battles: Event[]): WarStats[] {
  const wars = groupBattlesIntoWars(battles);
  return wars.map(getWarStats);
}

/**
 * Get the most active war periods (by battle count)
 */
export function getMostActiveWarPeriods(
  battles: Event[],
  limit = 5
): WarStats[] {
  const allWars = getAllWarsWithStats(battles);
  return allWars
    .sort((a, b) => b.battleCount - a.battleCount)
    .slice(0, limit);
}

/**
 * Get longest wars by duration
 */
export function getLongestWars(battles: Event[], limit = 5): WarStats[] {
  const allWars = getAllWarsWithStats(battles);
  return allWars
    .sort((a, b) => b.duration - a.duration)
    .slice(0, limit);
}

/**
 * Get wars by era
 */
export function getWarsByEra(
  battles: Event[],
  eras: { id: string; nameKey: string }[],
  t?: (key: string) => string
): EraWarActivity[] {
  const wars = groupBattlesIntoWars(battles);
  const activity: EraWarActivity[] = [];

  for (const era of eras) {
    const eraWars = wars.filter(w => w.battles.some(b => b.entityId === era.id));
    
    if (eraWars.length > 0) {
      const totalDuration = eraWars.reduce((sum, w) => sum + (w.endYear - w.startYear), 0);
      const totalBattles = eraWars.reduce((sum, w) => sum + w.battles.length, 0);

      activity.push({
        eraId: era.id,
        eraName: t ? t(era.nameKey) : era.id,
        warCount: eraWars.length,
        battleCount: totalBattles,
        totalWarDuration: totalDuration,
        averageWarDuration: Math.round(totalDuration / eraWars.length),
      });
    }
  }

  return activity.sort((a, b) => b.warCount - a.warCount);
}

/**
 * Check if there are any wars with explicit warNameKey
 */
export function hasWarData(battles: Event[]): boolean {
  return battles.some(b => !!b.battle?.warNameKey);
}

/**
 * Get wars that have explicit names
 */
export function getNamedWars(battles: Event[]): War[] {
  const wars = groupBattlesIntoWars(battles);
  return wars.filter(w => !!w.nameKey);
}

/**
 * Analyze war outcome patterns
 */
export function getWarOutcomePatterns(battles: Event[]): {
  offensiveWarsWon: number;
  defensiveWarsWon: number;
  inconclusive: number;
  avgBattlesPerWar: number;
} {
  const wars = groupBattlesIntoWars(battles);
  
  let offensiveWarsWon = 0;
  let defensiveWarsWon = 0;
  let inconclusive = 0;
  let totalBattles = 0;

  for (const war of wars) {
    const stats = getWarStats(war);
    totalBattles += stats.battleCount;
    
    if (stats.attackerWins > stats.defenderWins) {
      offensiveWarsWon++;
    } else if (stats.defenderWins > stats.attackerWins) {
      defensiveWarsWon++;
    } else {
      inconclusive++;
    }
  }

  return {
    offensiveWarsWon,
    defensiveWarsWon,
    inconclusive,
    avgBattlesPerWar: wars.length > 0 ? Math.round(totalBattles / wars.length * 10) / 10 : 0,
  };
}

/**
 * Get war-related historical insights
 */
export function getWarInsights(battles: Event[]): string[] {
  const insights: string[] = [];
  const wars = groupBattlesIntoWars(battles);
  
  if (wars.length === 0) {
    return ['暂无战争数据'];
  }

  const patterns = getWarOutcomePatterns(battles);
  const activeWars = getMostActiveWarPeriods(battles, 3);
  const longestWars = getLongestWars(battles, 3);

  // Overall patterns
  if (patterns.offensiveWarsWon > patterns.defensiveWarsWon) {
    insights.push(`进攻方获胜的战争（${patterns.offensiveWarsWon}场）多于防守方（${patterns.defensiveWarsWon}场），表明历史上进攻方往往更能取得最终胜利`);
  } else if (patterns.defensiveWarsWon > patterns.offensiveWarsWon) {
    insights.push(`防守方获胜的战争（${patterns.defensiveWarsWon}场）多于进攻方（${patterns.offensiveWarsWon}场），表明防御策略在历史上往往更有效`);
  } else {
    insights.push('攻守双方在战争中的胜负分布较为均衡');
  }

  // Most active periods
  if (activeWars.length > 0) {
    const mostActive = activeWars[0];
    insights.push(`最激烈的战争时期包含${mostActive.battleCount}场战役`);
  }

  // Longest wars
  if (longestWars.length > 0 && longestWars[0].duration > 0) {
    insights.push(`持续时间最长的战争长达${longestWars[0].duration}年`);
  }

  // Average battles per war
  if (patterns.avgBattlesPerWar > 0) {
    insights.push(`平均每场战争包含${patterns.avgBattlesPerWar}场战役`);
  }

  return insights;
}
