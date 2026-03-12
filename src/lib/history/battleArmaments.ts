import { Event, BattleStrategy } from './types';

/** 战役兵器/武器类型 */
export type BattleArmamentType =
  | 'sword'           // 剑
  | 'spear'          // 矛/枪
  | 'dagger-axe'     // 戈
  | 'halberd'        // 戟
  | 'bow'            // 弓
  | 'crossbow'       // 弩
  | 'chariot'        // 战车
  | 'cavalry'        // 骑兵
  | 'infantry'       // 步兵
  | 'navy'           // 水军
  | 'siege-weapon'   // 攻城器械
  | 'fire-weapon'    // 火攻器械
  | 'shield'         // 盾牌/防御
  | 'armor'          // 铠甲
  | 'horse'          // 战马
  | 'unknown';

/** 兵器使用方 */
export type ArmamentSide = 'attacker' | 'defender' | 'both' | 'unknown';

/** 战役兵器使用数据 */
export type BattleArmament = {
  /** 兵器类型 */
  type: BattleArmamentType;
  /** 兵器描述 */
  description?: string;
  /** 使用方 */
  side: ArmamentSide;
  /** 数量（可选） */
  count?: number;
  /** 是否为主要兵器 */
  isPrimary?: boolean;
  /** 备注 */
  notes?: string;
};

/**
 * 获取兵器类型的中文标签
 */
export function getArmamentTypeLabel(type: BattleArmamentType): string {
  const labels: Record<BattleArmamentType, string> = {
    'sword': '剑',
    'spear': '矛/枪',
    'dagger-axe': '戈',
    'halberd': '戟',
    'bow': '弓',
    'crossbow': '弩',
    'chariot': '战车',
    'cavalry': '骑兵',
    'infantry': '步兵',
    'navy': '水军',
    'siege-weapon': '攻城器械',
    'fire-weapon': '火攻器械',
    'shield': '盾牌/防御',
    'armor': '铠甲',
    'horse': '战马',
    'unknown': '未知',
  };
  return labels[type] || type;
}

/**
 * 获取所有唯一的兵器类型
 */
export function getUniqueArmamentTypes(events: Event[]): BattleArmamentType[] {
  const types = new Set<BattleArmamentType>();
  
  events.forEach(event => {
    if (event.battle?.armaments) {
      event.battle.armaments.forEach(armament => {
        types.add(armament.type);
      });
    }
  });
  
  return Array.from(types);
}

/**
 * 检查是否有兵器数据
 */
export function hasArmamentData(events: Event[]): boolean {
  return events.some(event => 
    event.battle?.armaments && event.battle.armaments.length > 0
  );
}

/**
 * 获取特定兵器类型的统计信息
 */
export function getArmamentTypeStats(
  events: Event[],
  armamentType: BattleArmamentType
): { count: number; battles: string[]; sides: ArmamentSide[] } {
  const battles: string[] = [];
  const sides: ArmamentSide[] = [];
  
  events.forEach(event => {
    if (event.battle?.armaments) {
      const matched = event.battle.armaments.find(a => a.type === armamentType);
      if (matched) {
        battles.push(event.titleKey);
        sides.push(matched.side);
      }
    }
  });
  
  return {
    count: battles.length,
    battles,
    sides,
  };
}

/**
 * 获取所有兵器类型的统计信息
 */
export function getAllArmamentTypeStats(
  events: Event[]
): Array<{
  type: BattleArmamentType;
  label: string;
  count: number;
  battles: string[];
  sides: ArmamentSide[];
}> {
  const allTypes: BattleArmamentType[] = [
    'sword', 'spear', 'dagger-axe', 'halberd', 'bow', 'crossbow',
    'chariot', 'cavalry', 'infantry', 'navy', 'siege-weapon',
    'fire-weapon', 'shield', 'armor', 'horse', 'unknown'
  ];
  
  return allTypes.map(type => {
    const stats = getArmamentTypeStats(events, type);
    return {
      type,
      label: getArmamentTypeLabel(type),
      ...stats,
    };
  });
}

/**
 * 按兵器类型筛选战役
 */
export function getBattlesByArmamentType(
  events: Event[],
  armamentType: BattleArmamentType
): Array<{ event: Event; armament: BattleArmament }> {
  const results: Array<{ event: Event; armament: BattleArmament }> = [];
  
  events.forEach(event => {
    if (event.battle?.armaments) {
      const matched = event.battle.armaments.find(a => a.type === armamentType);
      if (matched) {
        results.push({ event, armament: matched });
      }
    }
  });
  
  return results;
}

/**
 * 获取最常用的兵器类型
 */
export function getMostCommonArmamentTypes(
  events: Event[],
  limit: number = 5
): Array<{ type: BattleArmamentType; label: string; count: number }> {
  const stats = getAllArmamentTypeStats(events);
  
  return stats
    .filter(s => s.type !== 'unknown' && s.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map(s => ({
      type: s.type,
      label: s.label,
      count: s.count,
    }));
}

/**
 * 分析兵器使用与战役结果的关联
 */
export function getArmamentOutcomeCorrelation(
  events: Event[]
): Array<{
  armamentType: BattleArmamentType;
  label: string;
  attackerWin: number;
  defenderWin: number;
  draw: number;
  total: number;
  attackerWinRate: number;
}> {
  const correlations: Map<BattleArmamentType, {
    attackerWin: number;
    defenderWin: number;
    draw: number;
  }> = new Map();
  
  events.forEach(event => {
    if (event.battle?.armaments && event.battle.result) {
      const result = event.battle.result;
      
      event.battle.armaments.forEach(armament => {
        const existing = correlations.get(armament.type) || {
          attackerWin: 0,
          defenderWin: 0,
          draw: 0,
        };
        
        if (result === 'attacker_win') {
          existing.attackerWin++;
        } else if (result === 'defender_win') {
          existing.defenderWin++;
        } else if (result === 'draw') {
          existing.draw++;
        }
        
        correlations.set(armament.type, existing);
      });
    }
  });
  
  return Array.from(correlations.entries())
    .map(([type, stats]) => {
      const total = stats.attackerWin + stats.defenderWin + stats.draw;
      const attackerWinRate = total > 0 ? (stats.attackerWin / total) * 100 : 0;
      
      return {
        armamentType: type,
        label: getArmamentTypeLabel(type),
        ...stats,
        total,
        attackerWinRate: Math.round(attackerWinRate * 10) / 10,
      };
    })
    .sort((a, b) => b.total - a.total);
}

/**
 * 分析进攻方/防守方兵器使用差异
 */
export function getArmamentSideAnalysis(
  events: Event[]
): Array<{
  armamentType: BattleArmamentType;
  label: string;
  attacker: number;
  defender: number;
  both: number;
  primary: number;
}> {
  const analysis: Map<BattleArmamentType, {
    attacker: number;
    defender: number;
    both: number;
    primary: number;
  }> = new Map();
  
  events.forEach(event => {
    if (event.battle?.armaments) {
      event.battle.armaments.forEach(armament => {
        const existing = analysis.get(armament.type) || {
          attacker: 0,
          defender: 0,
          both: 0,
          primary: 0,
        };
        
        if (armament.side === 'attacker') {
          existing.attacker++;
        } else if (armament.side === 'defender') {
          existing.defender++;
        } else if (armament.side === 'both') {
          existing.both++;
        }
        
        if (armament.isPrimary) {
          existing.primary++;
        }
        
        analysis.set(armament.type, existing);
      });
    }
  });
  
  return Array.from(analysis.entries())
    .map(([type, stats]) => ({
      armamentType: type,
      label: getArmamentTypeLabel(type),
      ...stats,
    }))
    .sort((a, b) => (b.attacker + b.defender + b.both) - (a.attacker + a.defender + a.both));
}

/**
 * 按兵器类型分析战略/战术偏好
 */
export function getArmamentStrategyCorrelation(
  events: Event[]
): Array<{
  armament: BattleArmamentType;
  armamentLabel: string;
  strategy: BattleStrategy | null;
  strategyLabel: string;
  count: number;
}> {
  const correlations: Array<{
    armament: BattleArmamentType;
    strategy: BattleStrategy | null;
    count: number;
  }> = [];
  
  events.forEach(event => {
    if (event.battle?.armaments && event.battle.strategy) {
      const strategies = event.battle.strategy;
      
      event.battle.armaments.forEach(armament => {
        strategies.forEach(strategy => {
          correlations.push({
            armament: armament.type,
            strategy,
            count: 1,
          });
        });
      });
    }
  });
  
  // 聚合统计
  const aggregated = new Map<string, number>();
  correlations.forEach(c => {
    const key = `${c.armament}-${c.strategy}`;
    aggregated.set(key, (aggregated.get(key) || 0) + c.count);
  });
  
  return Array.from(aggregated.entries())
    .map(([key, count]) => {
      const [armament, strategy] = key.split('-') as [BattleArmamentType, string];
      const strategyValue = strategy as BattleStrategy | null;
      return {
        armament,
        armamentLabel: getArmamentTypeLabel(armament),
        strategy: strategyValue,
        strategyLabel: strategyValue ? getStrategyLabel(strategyValue) : '未知',
        count,
      };
    })
    .sort((a, b) => b.count - a.count);
}

/**
 * 辅助函数：获取战略类型标签
 */
function getStrategyLabel(strategy: BattleStrategy): string {
  const labels: Record<BattleStrategy, string> = {
    'ambush': '伏击',
    'fire': '火攻',
    'water': '水攻',
    'encirclement': '包围',
    'siege': '攻城',
    'pincer': '钳形攻势',
    'feigned-retreat': '诱敌深入',
    'alliance': '联盟作战',
    'defensive': '防御作战',
    'offensive': '进攻作战',
    'guerrilla': '游击战',
    'unknown': '未知',
  };
  return labels[strategy] || strategy;
}

/**
 * 生成兵器分析历史洞察
 */
export function getArmamentInsights(events: Event[]): string[] {
  const insights: string[] = [];
  
  // 检查是否有兵器数据
  if (!hasArmamentData(events)) {
    insights.push('当前数据中暂无兵器相关信息');
    return insights;
  }
  
  // 最常用兵器
  const mostCommon = getMostCommonArmamentTypes(events, 3);
  if (mostCommon.length > 0) {
    const types = mostCommon.map(m => m.label).join('、');
    insights.push(`古代战役中最常用的兵器是${types}，反映了当时的军事技术和战术特点`);
  }
  
  // 兵器与胜负关联
  const correlations = getArmamentOutcomeCorrelation(events);
  const effective = correlations.filter(c => c.total >= 2 && c.attackerWinRate >= 60);
  if (effective.length > 0) {
    const mostEffective = effective[0];
    insights.push(`使用${mostEffective.label}的战役中，进攻方胜率高达${mostEffective.attackerWinRate}%`);
  }
  
  // 骑兵分析
  const cavalryStats = getArmamentTypeStats(events, 'cavalry');
  if (cavalryStats.count > 0) {
    const cavalryCorrelation = correlations.find(c => c.armamentType === 'cavalry');
    if (cavalryCorrelation) {
      if (cavalryCorrelation.attackerWinRate > 55) {
        insights.push(`骑兵在进攻作战中展现出明显的战术优势`);
      } else if (cavalryCorrelation.attackerWinRate < 45) {
        insights.push(`骑兵在防守作战中更能发挥其机动性和冲击力优势`);
      }
    }
  }
  
  // 战车分析
  const chariotStats = getArmamentTypeStats(events, 'chariot');
  if (chariotStats.count > 0) {
    insights.push(`战车作战在春秋战国时期达到巅峰，体现了当时贵族战争的特色`);
  }
  
  // 弓箭/弩分析
  const rangedStats = [
    getArmamentTypeStats(events, 'bow'),
    getArmamentTypeStats(events, 'crossbow'),
  ];
  const totalRanged = rangedStats.reduce((sum, s) => sum + s.count, 0);
  if (totalRanged > 0) {
    insights.push(`远程兵器（弓、弩）的广泛使用改变了战场形态，使得远距离打击成为可能`);
  }
  
  return insights;
}

/**
 * 获取兵器分析完整摘要
 */
export function getArmamentSummary(events: Event[]): {
  hasData: boolean;
  uniqueTypes: number;
  totalUsage: number;
  mostCommon: Array<{ type: BattleArmamentType; label: string; count: number }>;
  correlations: Array<{
    armamentType: BattleArmamentType;
    label: string;
    attackerWinRate: number;
    total: number;
  }>;
  sideAnalysis: Array<{
    armamentType: BattleArmamentType;
    label: string;
    attacker: number;
    defender: number;
    both: number;
  }>;
  insights: string[];
} {
  const hasData = hasArmamentData(events);
  const uniqueTypes = getUniqueArmamentTypes(events).filter(t => t !== 'unknown').length;
  
  // 统计总使用次数
  let totalUsage = 0;
  events.forEach(event => {
    if (event.battle?.armaments) {
      totalUsage += event.battle.armaments.length;
    }
  });
  
  return {
    hasData,
    uniqueTypes,
    totalUsage,
    mostCommon: getMostCommonArmamentTypes(events, 5),
    correlations: getArmamentOutcomeCorrelation(events)
      .filter(c => c.total >= 1)
      .map(c => ({
        armamentType: c.armamentType,
        label: c.label,
        attackerWinRate: c.attackerWinRate,
        total: c.total,
      })),
    sideAnalysis: getArmamentSideAnalysis(events)
      .filter(s => s.attacker + s.defender + s.both > 0)
      .map(s => ({
        armamentType: s.armamentType,
        label: s.label,
        attacker: s.attacker,
        defender: s.defender,
        both: s.both,
      })),
    insights: getArmamentInsights(events),
  };
}
