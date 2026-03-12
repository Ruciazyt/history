import type { Event, BattleForceComparison, ForceUnitType } from './types';
import { getBattles } from './battles';

/**
 * 获取军力单位类型的中文标签
 */
export function getForceUnitLabel(unitType?: ForceUnitType): string {
  const labels: Record<ForceUnitType, string> = {
    infantry: '步兵',
    cavalry: '骑兵',
    chariot: '战车',
    navy: '水军',
    archer: '弓箭手',
    mixed: '混合部队',
    unknown: '未知',
  };
  return unitType ? labels[unitType] || '未知' : '未知';
}

/**
 * 获取优势方的中文标签
 */
export function getAdvantageLabel(advantage?: 'attacker' | 'defender' | 'balanced' | 'unknown'): string {
  const labels: Record<string, string> = {
    attacker: '进攻方优势',
    defender: '防守方优势',
    balanced: '势均力敌',
    unknown: '未知',
  };
  return advantage ? labels[advantage] || '未知' : '未知';
}

/**
 * 检查是否有军力对比数据
 */
export function hasForceData(events: Event[]): boolean {
  const battles = getBattles(events);
  return battles.some((b) => b.battle?.forceComparison !== undefined);
}

/**
 * 获取有军力对比数据的战役
 */
export function getBattlesWithForceData(events: Event[]): Event[] {
  const battles = getBattles(events);
  return battles.filter((b) => b.battle?.forceComparison !== undefined);
}

/**
 * 获取军力对比统计
 */
export function getForceStats(events: Event[]): {
  total: number;
  withData: number;
  attackerAdvantage: number;
  defenderAdvantage: number;
  balanced: number;
  unknown: number;
} {
  const battles = getBattlesWithForceData(events);
  
  const stats = {
    total: battles.length,
    withData: battles.length,
    attackerAdvantage: 0,
    defenderAdvantage: 0,
    balanced: 0,
    unknown: 0,
  };

  for (const battle of battles) {
    const advantage = battle.battle?.forceComparison?.advantage;
    switch (advantage) {
      case 'attacker':
        stats.attackerAdvantage++;
        break;
      case 'defender':
        stats.defenderAdvantage++;
        break;
      case 'balanced':
        stats.balanced++;
        break;
      default:
        stats.unknown++;
    }
  }

  return stats;
}

/**
 * 按军力优势筛选战役
 */
export function getBattlesByForceAdvantage(
  events: Event[],
  advantage: 'attacker' | 'defender' | 'balanced' | 'unknown'
): Event[] {
  const battles = getBattles(events);
  return battles.filter((b) => b.battle?.forceComparison?.advantage === advantage);
}

/**
 * 获取以少胜多的战役
 */
export function getOutnumberedVictories(events: Event[]): Event[] {
  const battles = getBattlesWithForceData(events);
  return battles.filter((b) => {
    const force = b.battle?.forceComparison;
    if (!force) return false;
    
    const { attacker, defender } = force;
    const result = b.battle?.result;
    
    // 防守方胜利且防守方军力少于进攻方
    if (result === 'defender_win' && attacker && defender) {
      return defender.strength < attacker.strength;
    }
    
    // 进攻方胜利且进攻方军力少于防守方
    if (result === 'attacker_win' && attacker && defender) {
      return attacker.strength < defender.strength;
    }
    
    return false;
  });
}

/**
 * 获取以多胜少的战役
 */
export function getSuperiorForceVictories(events: Event[]): Event[] {
  const battles = getBattlesWithForceData(events);
  return battles.filter((b) => {
    const force = b.battle?.forceComparison;
    if (!force) return false;
    
    const { attacker, defender } = force;
    const result = b.battle?.result;
    
    // 防守方胜利且防守方军力多于进攻方
    if (result === 'defender_win' && attacker && defender) {
      return defender.strength > attacker.strength;
    }
    
    // 进攻方胜利且进攻方军力多于防守方
    if (result === 'attacker_win' && attacker && defender) {
      return attacker.strength > defender.strength;
    }
    
    return false;
  });
}

/**
 * 计算军力差距比例
 */
export function getForceRatio(force: BattleForceComparison): number | undefined {
  const { attacker, defender } = force;
  if (!attacker?.strength || !defender?.strength) return undefined;
  if (defender.strength === 0) return undefined;
  
  return attacker.strength / defender.strength;
}

/**
 * 获取军力差距分类
 */
export function getForceDifferenceCategory(ratio?: number): 'significant-attacker' | 'slight-attacker' | 'balanced' | 'slight-defender' | 'significant-defender' | 'unknown' {
  if (ratio === undefined) return 'unknown';
  
  if (ratio >= 2) return 'significant-attacker';
  if (ratio > 1) return 'slight-attacker';
  if (ratio === 1) return 'balanced';
  if (ratio > 0.5) return 'slight-defender';
  return 'significant-defender';
}

/**
 * 获取军力差距分类的中文标签
 */
export function getForceDifferenceLabel(category: ReturnType<typeof getForceDifferenceCategory>): string {
  const labels: Record<string, string> = {
    'significant-attacker': '进攻方大幅领先',
    'slight-attacker': '进攻方略占优势',
    'balanced': '势均力敌',
    'slight-defender': '防守方略占优势',
    'significant-defender': '防守方大幅领先',
    'unknown': '未知',
  };
  return labels[category] || '未知';
}

/**
 * 分析军力对比与战役结果的关联
 */
export function getForceOutcomeCorrelation(events: Event[]): {
  category: string;
  attackerWinRate: number;
  defenderWinRate: number;
  total: number;
}[] {
  const battles = getBattlesWithForceData(events);
  
  // 按军力差距分类统计
  const categories: Record<string, { attackerWins: number; defenderWins: number; total: number }> = {
    'significant-attacker': { attackerWins: 0, defenderWins: 0, total: 0 },
    'slight-attacker': { attackerWins: 0, defenderWins: 0, total: 0 },
    'balanced': { attackerWins: 0, defenderWins: 0, total: 0 },
    'slight-defender': { attackerWins: 0, defenderWins: 0, total: 0 },
    'significant-defender': { attackerWins: 0, defenderWins: 0, total: 0 },
  };

  for (const battle of battles) {
    const ratio = getForceRatio(battle.battle!.forceComparison!);
    const category = getForceDifferenceCategory(ratio);
    
    if (category === 'unknown') continue;
    
    categories[category].total++;
    
    const result = battle.battle?.result;
    if (result === 'attacker_win') {
      categories[category].attackerWins++;
    } else if (result === 'defender_win') {
      categories[category].defenderWins++;
    }
  }

  return Object.entries(categories).map(([category, data]) => ({
    category: getForceDifferenceLabel(category as ReturnType<typeof getForceDifferenceCategory>),
    attackerWinRate: data.total > 0 ? (data.attackerWins / data.total) * 100 : 0,
    defenderWinRate: data.total > 0 ? (data.defenderWins / data.total) * 100 : 0,
    total: data.total,
  }));
}

/**
 * 获取军力对比相关的历史洞察
 */
export function getForceInsights(events: Event[]): string[] {
  const insights: string[] = [];
  const battles = getBattlesWithForceData(events);
  
  if (battles.length === 0) {
    insights.push('暂无军力对比数据');
    return insights;
  }

  // 统计以少胜多
  const outnumbered = getOutnumberedVictories(events);
  if (outnumbered.length > 0) {
    insights.push(`历史上有 ${outnumbered.length} 场以少胜多的经典战役`);
  }

  // 统计军力优势方胜利比例
  const stats = getForceStats(events);
  if (stats.attackerAdvantage > 0 || stats.defenderAdvantage > 0) {
    const total = stats.attackerAdvantage + stats.defenderAdvantage + stats.balanced;
    if (total > 0) {
      const attackerWinPct = ((stats.attackerAdvantage + stats.balanced * 0.5) / total * 100).toFixed(1);
      insights.push(`进攻方军力优势时，胜率约 ${attackerWinPct}%`);
    }
  }

  // 军力与结果关联分析
  const correlation = getForceOutcomeCorrelation(events);
  const significantAttacker = correlation.find(c => c.category.includes('大幅领先') && c.category.includes('进攻方'));
  if (significantAttacker && significantAttacker.total >= 2) {
    if (significantAttacker.attackerWinRate > 70) {
      insights.push('当进攻方拥有压倒性军力优势时，胜利概率显著提高');
    }
  }

  const significantDefender = correlation.find(c => c.category.includes('大幅领先') && c.category.includes('防守方'));
  if (significantDefender && significantDefender.total >= 2) {
    if (significantDefender.defenderWinRate > 60) {
      insights.push('防守方拥有压倒性优势时，更容易取得胜利');
    }
  }

  return insights;
}

/**
 * 获取完整的军力分析摘要
 */
export function getForceSummary(events: Event[]): {
  overview: {
    totalBattles: number;
    battlesWithData: number;
  };
  advantage: {
    attacker: number;
    defender: number;
    balanced: number;
    unknown: number;
  };
  famousOutnumberedVictories: {
    battle: Event;
    ratio: number;
  }[];
  correlation: ReturnType<typeof getForceOutcomeCorrelation>;
  insights: string[];
} {
  const battles = getBattlesWithForceData(events);
  const stats = getForceStats(events);
  const outnumbered = getOutnumberedVictories(events);
  
  // 计算以少胜多的比例
  const outnumberedWithRatio = outnumbered.map(b => ({
    battle: b,
    ratio: getForceRatio(b.battle!.forceComparison!)!,
  })).sort((a, b) => a.ratio - b.ratio); // 按比例升序，最少胜最多

  return {
    overview: {
      totalBattles: getBattles(events).length,
      battlesWithData: battles.length,
    },
    advantage: {
      attacker: stats.attackerAdvantage,
      defender: stats.defenderAdvantage,
      balanced: stats.balanced,
      unknown: stats.unknown,
    },
    famousOutnumberedVictories: outnumberedWithRatio.slice(0, 5),
    correlation: getForceOutcomeCorrelation(events),
    insights: getForceInsights(events),
  };
}
