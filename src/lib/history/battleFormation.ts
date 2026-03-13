import type { Event, BattleFormation, FormationRole, BattleFormationData } from './types';

/**
 * 获取阵型中文标签
 */
export function getFormationLabel(formation: BattleFormation): string {
  const labels: Record<BattleFormation, string> = {
    'long-wedge': '锥形阵',
    'frontal-attack': '正面突击',
    'flanking': '侧翼攻击',
    'encirclement': '包围阵型',
    'defensive': '防御阵型',
    'retreating': '诱敌深入',
    'center-break': '中央突破',
    'skirmish': '散兵阵型',
    'cavalry-flank': '骑兵侧翼',
    'chariot-charge': '战车冲击',
    'mixed-formation': '混合阵型',
    'unknown': '未知阵型',
  };
  return labels[formation] || '未知';
}

/**
 * 获取阵型角色标签
 */
export function getFormationRoleLabel(role: FormationRole): string {
  const labels: Record<FormationRole, string> = {
    'attacker': '进攻方',
    'defender': '防守方',
    'both': '双方',
  };
  return labels[role] || '未知';
}

/**
 * 检查是否有阵型数据
 */
export function hasFormationData(events: Event[]): boolean {
  return events.some(e => e.battle?.formations && e.battle.formations.length > 0);
}

/**
 * 获取所有唯一阵型类型
 */
export function getUniqueFormationTypes(events: Event[]): BattleFormation[] {
  const types = new Set<BattleFormation>();
  events.forEach(e => {
    if (e.battle?.formations) {
      e.battle.formations.forEach(f => types.add(f.formation));
    }
  });
  return Array.from(types);
}

/**
 * 获取特定阵型类型的统计
 */
export function getFormationTypeStats(events: Event[], formation: BattleFormation): number {
  return events.filter(e => 
    e.battle?.formations?.some(f => f.formation === formation)
  ).length;
}

/**
 * 获取所有阵型类型统计
 */
export function getAllFormationTypeStats(events: Event[]): Record<BattleFormation, number> {
  const stats: Record<string, number> = {};
  const uniqueTypes = getUniqueFormationTypes(events);
  
  uniqueTypes.forEach(type => {
    stats[type] = getFormationTypeStats(events, type);
  });
  
  return stats as Record<BattleFormation, number>;
}

/**
 * 按阵型类型筛选战役
 */
export function getBattlesByFormation(events: Event[], formation: BattleFormation): Event[] {
  return events.filter(e => 
    e.battle?.formations?.some(f => f.formation === formation)
  );
}

/**
 * 获取最常用阵型
 */
export function getMostUsedFormations(
  events: Event[], 
  limit = 5
): Array<{ formation: BattleFormation; count: number }> {
  const stats = getAllFormationTypeStats(events);
  return Object.entries(stats)
    .map(([formation, count]) => ({ formation: formation as BattleFormation, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * 获取战役的阵型数据
 */
export function getBattleFormations(battle: Event): BattleFormationData[] {
  return battle.battle?.formations || [];
}

/**
 * 按阵营分析阵型使用情况
 */
export function getFormationBySide(
  events: Event[], 
  side: FormationRole
): Array<{ formation: BattleFormation; count: number }> {
  const stats: Record<string, number> = {};
  
  events.forEach(e => {
    if (e.battle?.formations) {
      e.battle.formations.forEach(f => {
        if (f.side === side || f.side === 'both') {
          stats[f.formation] = (stats[f.formation] || 0) + 1;
        }
      });
    }
  });
  
  return Object.entries(stats)
    .map(([formation, count]) => ({ formation: formation as BattleFormation, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * 阵型与胜负关联分析
 */
export function getFormationOutcomeCorrelation(
  events: Event[]
): Record<BattleFormation, { total: number; attacker_win: number; defender_win: number; draw: number }> {
  const correlation: Record<string, { total: number; attacker_win: number; defender_win: number; draw: number }> = {};
  
  events.forEach(e => {
    if (e.battle?.formations && e.battle.formations.length > 0 && e.battle.result) {
      e.battle.formations.forEach(f => {
        if (!correlation[f.formation]) {
          correlation[f.formation] = { total: 0, attacker_win: 0, defender_win: 0, draw: 0 };
        }
        correlation[f.formation].total++;
        const result = e.battle?.result;
        if (result === 'attacker_win') {
          correlation[f.formation].attacker_win++;
        } else if (result === 'defender_win') {
          correlation[f.formation].defender_win++;
        } else if (result === 'draw') {
          correlation[f.formation].draw++;
        }
      });
    }
  });
  
  return correlation as Record<BattleFormation, { total: number; attacker_win: number; defender_win: number; draw: number }>;
}

/**
 * 获取最成功阵型（按胜率）
 */
export function getMostEffectiveFormations(
  events: Event[], 
  minBattles = 2
): Array<{ formation: BattleFormation; winRate: number; total: number }> {
  const correlation = getFormationOutcomeCorrelation(events);
  
  return Object.entries(correlation)
    .filter(([_, data]) => data.total >= minBattles)
    .map(([formation, data]) => {
      const winRate = data.attacker_win / data.total * 100;
      return { formation: formation as BattleFormation, winRate: Math.round(winRate), total: data.total };
    })
    .sort((a, b) => b.winRate - a.winRate);
}

/**
 * 获取有阵型数据的战役数量
 */
export function getBattlesWithFormationCount(events: Event[]): number {
  return events.filter(e => 
    e.battle?.formations && e.battle.formations.length > 0
  ).length;
}

/**
 * 获取创新阵型使用的战役
 */
export function getInnovativeFormationBattles(events: Event[]): Event[] {
  return events.filter(e => 
    e.battle?.formations?.some(f => f.isInnovative === true)
  );
}

/**
 * 获取阵型特点统计
 */
export function getFormationCharacteristicsStats(events: Event[]): Record<string, number> {
  const stats: Record<string, number> = {};
  
  events.forEach(e => {
    if (e.battle?.formations) {
      e.battle.formations.forEach(f => {
        f.characteristics?.forEach(char => {
          stats[char] = (stats[char] || 0) + 1;
        });
      });
    }
  });
  
  return stats;
}

/**
 * 获取最常见的阵型特点
 */
export function getMostCommonFormationCharacteristics(
  events: Event[], 
  limit = 5
): Array<{ characteristic: string; count: number }> {
  const stats = getFormationCharacteristicsStats(events);
  return Object.entries(stats)
    .map(([char, count]) => ({ characteristic: char, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * 获取阵型分析摘要
 */
export function getFormationSummary(events: Event[]) {
  const battlesWithFormation = getBattlesWithFormationCount(events);
  const totalBattles = events.filter(e => e.tags?.includes('war')).length;
  const coverage = totalBattles > 0 ? (battlesWithFormation / totalBattles * 100).toFixed(1) : '0';
  const mostUsed = getMostUsedFormations(events, 3);
  const mostEffective = getMostEffectiveFormations(events, 1);
  const attackerFormations = getFormationBySide(events, 'attacker');
  const defenderFormations = getFormationBySide(events, 'defender');
  const innovativeCount = getInnovativeFormationBattles(events).length;
  
  return {
    totalBattles,
    battlesWithFormation,
    coverage: `${coverage}%`,
    formationTypes: getUniqueFormationTypes(events).length,
    mostUsedFormations: mostUsed.map(m => ({
      name: getFormationLabel(m.formation),
      count: m.count,
    })),
    mostEffectiveFormations: mostEffective.slice(0, 3).map(m => ({
      name: getFormationLabel(m.formation),
      winRate: `${m.winRate}%`,
      total: m.total,
    })),
    topAttackerFormations: attackerFormations.slice(0, 3).map(f => ({
      name: getFormationLabel(f.formation),
      count: f.count,
    })),
    topDefenderFormations: defenderFormations.slice(0, 3).map(f => ({
      name: getFormationLabel(f.formation),
      count: f.count,
    })),
    innovativeFormationCount: innovativeCount,
  };
}

/**
 * 生成阵型分析洞察
 */
export function getFormationInsights(events: Event[]): string[] {
  const insights: string[] = [];
  const summary = getFormationSummary(events);
  
  if (summary.battlesWithFormation === 0) {
    insights.push('暂无阵型数据');
    return insights;
  }
  
  // 覆盖率洞察
  if (parseFloat(summary.coverage) > 50) {
    insights.push(`超过${summary.coverage}的战役有阵型记录，战术分析价值较高`);
  } else if (parseFloat(summary.coverage) > 20) {
    insights.push(`约${summary.coverage}的战役有阵型记录，仍有改进空间`);
  } else {
    insights.push('阵型记录覆盖率较低，需更多史料补充');
  }
  
  // 最常用阵型
  if (summary.mostUsedFormations.length > 0) {
    const top = summary.mostUsedFormations[0];
    insights.push(`${top.name}是最常用的阵型，体现了古代战争的基本战术原则`);
  }
  
  // 进攻方 vs 防守方阵型
  if (summary.topAttackerFormations.length > 0 && summary.topDefenderFormations.length > 0) {
    const attackerTop = summary.topAttackerFormations[0];
    const defenderTop = summary.topDefenderFormations[0];
    if (attackerTop.name !== defenderTop.name) {
      insights.push(`进攻方偏好${attackerTop.name}，防守方偏好${defenderTop.name}`);
    }
  }
  
  // 最有效阵型
  if (summary.mostEffectiveFormations.length > 0) {
    const effective = summary.mostEffectiveFormations[0];
    if (effective.total >= 2) {
      insights.push(`${effective.name}阵型胜率最高，达到${effective.winRate}`);
    }
  }
  
  // 创新阵型
  if (summary.innovativeFormationCount > 0) {
    insights.push(`历史上有${summary.innovativeFormationCount}场战役使用了创新阵型`);
  }
  
  return insights;
}
