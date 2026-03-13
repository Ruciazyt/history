/**
 * 战役后勤/补给分析模块
 * 分析战役中的后勤、补给线、粮草等因素
 */

import { Event, BattleLogistics, LogisticsType, SupplySource, SupplyStatus } from './types';

/** 补给类型的中文标签 */
export function getLogisticsTypeLabel(type: LogisticsType): string {
  const labels: Record<LogisticsType, string> = {
    'supply-line': '补给线',
    'food-provision': '粮草供应',
    'ammunition': '武器弹药',
    'reinforcement': '援军/兵力补给',
    'medical': '医疗救护',
    'winter-supply': '冬装/御寒物资',
    'equipment': '装备补充',
    'horse-supply': '战马补充',
    'naval-supply': '水军补给',
    'siege-equipment': '攻城器械',
    'treasury': '财力资源',
    'unknown': '未知',
  };
  return labels[type] || '未知';
}

/** 补给来源的中文标签 */
export function getSupplySourceLabel(source: SupplySource): string {
  const labels: Record<SupplySource, string> = {
    'home-base': '本土供应',
    'conquered-territory': '征伐当地',
    'allied-support': '盟友支援',
    'plundering': '掠夺敌方',
    'local-levy': '当地征集',
    'strategic-reserve': '战略储备',
    'unknown': '未知',
  };
  return labels[source] || '未知';
}

/** 补给状态的中文标签 */
export function getSupplyStatusLabel(status: SupplyStatus): string {
  const labels: Record<SupplyStatus, string> = {
    'adequate': '充足',
    'strained': '紧张',
    'depleted': '枯竭',
    'cut-off': '切断',
    'unknown': '未知',
  };
  return labels[status] || '未知';
}

/** 检查是否有后勤/补给数据 */
export function hasLogisticsData(events: Event[]): boolean {
  return events.some(event => 
    event.battle?.logistics && event.battle.logistics.length > 0
  );
}

/** 获取所有唯一的后勤/补给类型 */
export function getUniqueLogisticsTypes(events: Event[]): LogisticsType[] {
  const types = new Set<LogisticsType>();

  events.forEach(event => {
    if (event.battle?.logistics) {
      event.battle.logistics.forEach(logistics => {
        types.add(logistics.type);
      });
    }
  });

  return Array.from(types);
}

/** 获取特定类型的后勤统计 */
export function getLogisticsTypeStats(
  events: Event[],
  type: LogisticsType
): { count: number; decisive: number; parties: Set<string> } {
  let count = 0;
  let decisive = 0;
  const parties = new Set<string>();

  events.forEach(event => {
    if (event.battle?.logistics) {
      event.battle.logistics.forEach(logistics => {
        if (logistics.type === type) {
          count++;
          if (logistics.decisive) {
            decisive++;
          }
          if (logistics.side && logistics.side !== 'unknown') {
            parties.add(logistics.side);
          }
        }
      });
    }
  });

  return { count, decisive, parties };
}

/** 获取所有类型的后勤统计 */
export function getAllLogisticsTypeStats(
  events: Event[]
): Array<{
  type: LogisticsType;
  label: string;
  count: number;
  decisive: number;
  parties: Set<string>;
}> {
  const allTypes: LogisticsType[] = [
    'supply-line', 'food-provision', 'ammunition', 'reinforcement',
    'medical', 'winter-supply', 'equipment', 'horse-supply',
    'naval-supply', 'siege-equipment', 'treasury', 'unknown'
  ];

  return allTypes.map(type => ({
    type,
    label: getLogisticsTypeLabel(type),
    ...getLogisticsTypeStats(events, type)
  }));
}

/** 按阵营统计后勤/补给 */
export function getLogisticsBySide(
  events: Event[]
): { attacker: number; defender: number; both: number; unknown: number } {
  const stats = {
    attacker: 0,
    defender: 0,
    both: 0,
    unknown: 0
  };

  events.forEach(event => {
    if (event.battle?.logistics) {
      event.battle.logistics.forEach(logistics => {
        switch (logistics.side) {
          case 'attacker':
            stats.attacker++;
            break;
          case 'defender':
            stats.defender++;
            break;
          case 'both':
            stats.both++;
            break;
          default:
            stats.unknown++;
        }
      });
    }
  });

  return stats;
}

/** 获取有后勤数据的战役 */
export function getBattlesWithLogistics(events: Event[]): Event[] {
  return events.filter(event => 
    event.battle?.logistics && event.battle.logistics.length > 0
  );
}

/** 按后勤类型筛选战役 */
export function getBattlesByLogisticsType(
  events: Event[],
  type: LogisticsType
): Event[] {
  return events.filter(event => 
    event.battle?.logistics?.some(l => l.type === type)
  );
}

/** 获取后勤数据最多的战役 */
export function getBattlesWithMostLogistics(
  events: Event[],
  limit: number = 5
): Array<{ event: Event; count: number }> {
  const battles = events
    .filter(event => event.battle?.logistics)
    .map(event => ({
      event,
      count: event.battle!.logistics!.length
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  return battles;
}

/** 获取决定性后勤因素战役 */
export function getDecisiveLogisticsBattles(events: Event[]): Event[] {
  return events.filter(event => 
    event.battle?.logistics?.some(l => l.decisive === true)
  );
}

/** 分析后勤与战役结果的关联 */
export function getLogisticsResultCorrelation(
  events: Event[]
): {
  attacker: { win: number; lose: number; draw: number };
  defender: { win: number; lose: number; draw: number };
  both: { win: number; lose: number; draw: number };
} {
  const correlation = {
    attacker: { win: 0, lose: 0, draw: 0 },
    defender: { win: 0, lose: 0, draw: 0 },
    both: { win: 0, lose: 0, draw: 0 }
  };

  events.forEach(event => {
    if (!event.battle?.logistics || !event.battle?.result) return;

    event.battle.logistics.forEach(logistics => {
      const side = logistics.side === 'both' ? 'both' : 
                   logistics.side === 'attacker' ? 'attacker' : 
                   logistics.side === 'defender' ? 'defender' : null;
      
      if (!side) return;

      switch (event.battle!.result) {
        case 'attacker_win':
          correlation[side].win++;
          break;
        case 'defender_win':
          correlation[side].lose++;
          break;
        case 'draw':
        case 'inconclusive':
          correlation[side].draw++;
          break;
      }
    });
  });

  return correlation;
}

/** 分析补给的战略价值 - 根据来源分析 */
export function getSupplySourceAnalysis(
  events: Event[]
): Array<{ source: SupplySource; label: string; count: number }> {
  const sourceCounts = new Map<SupplySource, number>();

  events.forEach(event => {
    if (event.battle?.logistics) {
      event.battle.logistics.forEach(logistics => {
        if (logistics.source && logistics.source !== 'unknown') {
          sourceCounts.set(
            logistics.source,
            (sourceCounts.get(logistics.source) || 0) + 1
          );
        }
      });
    }
  });

  return Array.from(sourceCounts.entries())
    .map(([source, count]) => ({
      source,
      label: getSupplySourceLabel(source),
      count
    }))
    .sort((a, b) => b.count - a.count);
}

/** 分析补给状态 - 充足vs枯竭的影响 */
export function getSupplyStatusAnalysis(
  events: Event[]
): Array<{ status: SupplyStatus; label: string; count: number; winRate: number }> {
  const statusCounts = new Map<SupplyStatus, { total: number; wins: number }>();

  events.forEach(event => {
    if (!event.battle?.logistics || !event.battle?.result) return;

    event.battle.logistics.forEach(logistics => {
      if (logistics.status && logistics.status !== 'unknown') {
        const current = statusCounts.get(logistics.status) || { total: 0, wins: 0 };
        current.total++;
        
        // 计算进攻方胜利的情况
        if (event.battle!.result === 'attacker_win') {
          current.wins++;
        }
        
        statusCounts.set(logistics.status, current);
      }
    });
  });

  return Array.from(statusCounts.entries())
    .map(([status, data]) => ({
      status,
      label: getSupplyStatusLabel(status),
      count: data.total,
      winRate: data.total > 0 ? Math.round((data.wins / data.total) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);
}

/** 生成后勤分析洞察 */
export function getLogisticsInsights(events: Event[]): string[] {
  const insights: string[] = [];

  // 检查是否有后勤数据
  if (!hasLogisticsData(events)) {
    insights.push('暂无后勤/补给数据');
    return insights;
  }

  // 统计各类型后勤活动
  const typeStats = getAllLogisticsTypeStats(events);
  const totalLogistics = typeStats.reduce((sum, t) => sum + t.count, 0);
  
  if (totalLogistics === 0) {
    insights.push('暂无后勤/补给数据');
    return insights;
  }

  // 最常见的后勤类型
  const sortedTypes = [...typeStats].sort((a, b) => b.count - a.count);
  if (sortedTypes[0].count > 0) {
    insights.push(`最常见的后勤活动是${sortedTypes[0].label}，共${sortedTypes[0].count}次`);
  }

  // 分析决定性后勤因素
  const decisiveBattles = getDecisiveLogisticsBattles(events);
  if (decisiveBattles.length > 0) {
    insights.push(`有${decisiveBattles.length}场战役的后勤因素起到决定性作用`);
  }

  // 分析补给来源
  const sourceAnalysis = getSupplySourceAnalysis(events);
  if (sourceAnalysis.length > 0) {
    const topSource = sourceAnalysis[0];
    insights.push(`最主要的补给来源是${topSource.label}（${topSource.count}次）`);
  }

  // 分析补给状态
  const statusAnalysis = getSupplyStatusAnalysis(events);
  const depletedStatus = statusAnalysis.find(s => s.status === 'depleted');
  const cutOffStatus = statusAnalysis.find(s => s.status === 'cut-off');
  
  if (depletedStatus && depletedStatus.count > 0) {
    insights.push(`记录了${depletedStatus.count}次粮草枯竭的情况`);
  }
  
  if (cutOffStatus && cutOffStatus.count > 0) {
    insights.push(`记录了${cutOffStatus.count}次补给线被切断的情况`);
  }

  // 按阵营分析
  const sideStats = getLogisticsBySide(events);
  const attackerLogistics = sideStats.attacker;
  const defenderLogistics = sideStats.defender;
  
  if (attackerLogistics > defenderLogistics) {
    insights.push('进攻方在后勤记录中更为活跃');
  } else if (defenderLogistics > attackerLogistics) {
    insights.push('防守方在后勤记录中更为活跃');
  }

  // 关联分析
  const correlation = getLogisticsResultCorrelation(events);
  const attackerWinsWithLogistics = correlation.attacker.win;
  const attackerLossesWithLogistics = correlation.attacker.lose;
  
  if (attackerWinsWithLogistics + attackerLossesWithLogistics > 0) {
    const winRate = Math.round(
      (attackerWinsWithLogistics / (attackerWinsWithLogistics + attackerLossesWithLogistics)) * 100
    );
    insights.push(`有后勤记录的进攻方胜率为${winRate}%`);
  }

  return insights;
}

/** 获取后勤分析完整摘要 */
export function getLogisticsSummary(events: Event[]) {
  const allEvents = events.filter(e => e.battle);
  const battlesWithLogistics = getBattlesWithLogistics(events);
  const allTypeStats = getAllLogisticsTypeStats(events);
  const sideStats = getLogisticsBySide(events);
  const sourceAnalysis = getSupplySourceAnalysis(events);
  const statusAnalysis = getSupplyStatusAnalysis(events);
  const correlation = getLogisticsResultCorrelation(events);
  const insights = getLogisticsInsights(events);
  const decisiveBattles = getDecisiveLogisticsBattles(events);
  const mostLogisticsBattles = getBattlesWithMostLogistics(events, 3);

  return {
    totalBattles: allEvents.length,
    battlesWithLogistics: battlesWithLogistics.length,
    coverage: allEvents.length > 0 
      ? Math.round((battlesWithLogistics.length / allEvents.length) * 100) + '%'
      : '0%',
    logisticsByType: allTypeStats.filter(t => t.count > 0),
    logisticsBySide: sideStats,
    supplySources: sourceAnalysis,
    supplyStatus: statusAnalysis,
    resultCorrelation: correlation,
    decisiveLogisticsBattles: decisiveBattles.length,
    mostLogisticsBattles,
    insights
  };
}
