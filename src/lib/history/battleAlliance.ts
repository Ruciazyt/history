import type { Event, BattleAlliance, AllianceType } from './types';
import { getBattles } from './battles';

/**
 * 获取战役的联盟标签（中文）
 */
export function getAllianceTypeLabel(type: AllianceType): string {
  const labels: Record<AllianceType, string> = {
    offensive: '进攻联盟',
    defensive: '防御联盟',
    cooperative: '合作/协同作战',
    temporary: '临时联盟',
    unknown: '未知',
  };
  return labels[type] || '未知';
}

/**
 * 获取所有有联盟数据的战役
 */
export function getBattlesWithAlliance(events: Event[]): Event[] {
  const battles = getBattles(events);
  return battles.filter(b => b.battle?.alliance !== undefined);
}

/**
 * 获取联盟结果标签
 */
export function getAllianceOutcomeLabel(outcome?: BattleAlliance['outcome']): string {
  if (!outcome) return '未知';
  const labels: Record<string, string> = {
    victory: '胜利',
    defeat: '失败',
    draw: '平局',
    dissolved: '瓦解',
    unknown: '未知',
  };
  return labels[outcome] || '未知';
}

/**
 * 联盟类型统计
 */
export type AllianceStats = {
  type: AllianceType;
  count: number;
  victories: number;
  defeats: number;
  draws: number;
  unknown: number;
};

/**
 * 获取联盟类型统计
 */
export function getAllianceTypeStats(events: Event[]): AllianceStats[] {
  const battlesWithAlliance = getBattlesWithAlliance(events);
  
  const statsMap = new Map<AllianceType, AllianceStats>();
  
  for (const battle of battlesWithAlliance) {
    const alliance = battle.battle?.alliance;
    if (!alliance) continue;
    
    const type = alliance.type || 'unknown';
    const outcome = alliance.outcome || 'unknown';
    
    if (!statsMap.has(type)) {
      statsMap.set(type, {
        type,
        count: 0,
        victories: 0,
        defeats: 0,
        draws: 0,
        unknown: 0,
      });
    }
    
    const stats = statsMap.get(type)!;
    stats.count++;
    
    switch (outcome) {
      case 'victory':
        stats.victories++;
        break;
      case 'defeat':
        stats.defeats++;
        break;
      case 'draw':
        stats.draws++;
        break;
      default:
        stats.unknown++;
    }
  }
  
  return Array.from(statsMap.values()).sort((a, b) => b.count - a.count);
}

/**
 * 最常用的联盟类型
 */
export function getMostCommonAllianceTypes(events: Event[]): AllianceType[] {
  const stats = getAllianceTypeStats(events);
  return stats.map(s => s.type);
}

/**
 * 最成功的联盟类型（按胜率）
 */
export function getMostSuccessfulAllianceTypes(events: Event[]): AllianceType[] {
  const stats = getAllianceTypeStats(events);
  
  // 按胜率排序
  const sorted = [...stats].filter(s => s.count > 0).sort((a, b) => {
    const aWinRate = a.victories / a.count;
    const bWinRate = b.victories / b.count;
    return bWinRate - aWinRate;
  });
  
  return sorted.map(s => s.type);
}

/**
 * 联盟参与者信息
 */
export type ParticipantAllianceInfo = {
  name: string;
  totalAlliances: number;
  victories: number;
  defeats: number;
  draws: number;
  winRate: number;
  roles: { leader: number; member: number };
  allianceTypes: Record<AllianceType, number>;
};

/**
 * 获取参与者的联盟统计
 */
export function getParticipantAllianceInfo(events: Event[], participantName: string): ParticipantAllianceInfo | null {
  const battlesWithAlliance = getBattlesWithAlliance(events);
  
  let totalAlliances = 0;
  let victories = 0;
  let defeats = 0;
  let draws = 0;
  const roles = { leader: 0, member: 0 };
  const allianceTypes: Record<AllianceType, number> = {
    offensive: 0,
    defensive: 0,
    cooperative: 0,
    temporary: 0,
    unknown: 0,
  };
  
  for (const battle of battlesWithAlliance) {
    const alliance = battle.battle?.alliance;
    if (!alliance) continue;
    
    const participant = alliance.participants?.find(
      p => p.name.toLowerCase() === participantName.toLowerCase()
    );
    
    if (participant) {
      totalAlliances++;
      
      // 统计角色
      if (participant.role === 'leader') {
        roles.leader++;
      } else if (participant.role === 'member') {
        roles.member++;
      }
      
      // 统计类型
      const type = alliance.type || 'unknown';
      if (allianceTypes[type] !== undefined) {
        allianceTypes[type]++;
      }
      
      // 统计结果
      const outcome = alliance.outcome;
      if (outcome === 'victory') {
        victories++;
      } else if (outcome === 'defeat') {
        defeats++;
      } else if (outcome === 'draw') {
        draws++;
      }
    }
  }
  
  if (totalAlliances === 0) {
    return null;
  }
  
  return {
    name: participantName,
    totalAlliances,
    victories,
    defeats,
    draws,
    winRate: victories / totalAlliances,
    roles,
    allianceTypes,
  };
}

/**
 * 获取所有有联盟数据的参与者
 */
export function getAllianceParticipants(events: Event[]): string[] {
  const battlesWithAlliance = getBattlesWithAlliance(events);
  const participants = new Set<string>();
  
  for (const battle of battlesWithAlliance) {
    const alliance = battle.battle?.alliance;
    if (!alliance?.participants) continue;
    
    for (const p of alliance.participants) {
      participants.add(p.name);
    }
  }
  
  return Array.from(participants).sort();
}

/**
 * 按联盟类型筛选战役
 */
export function getBattlesByAllianceType(events: Event[], allianceType: AllianceType): Event[] {
  const battlesWithAlliance = getBattlesWithAlliance(events);
  return battlesWithAlliance.filter(b => b.battle?.alliance?.type === allianceType);
}

/**
 * 领导者统计
 */
export type AllianceLeaderStats = {
  name: string;
  totalLeads: number;
  victories: number;
  winRate: number;
  allianceTypes: Record<AllianceType, number>;
};

/**
 * 获取联盟领导者统计
 */
export function getAllianceLeaderStats(events: Event[]): AllianceLeaderStats[] {
  const battlesWithAlliance = getBattlesWithAlliance(events);
  const leaderMap = new Map<string, AllianceLeaderStats>();
  
  for (const battle of battlesWithAlliance) {
    const alliance = battle.battle?.alliance;
    if (!alliance?.participants) continue;
    
    const type = alliance.type || 'unknown';
    
    for (const participant of alliance.participants) {
      if (participant.role !== 'leader') continue;
      
      if (!leaderMap.has(participant.name)) {
        leaderMap.set(participant.name, {
          name: participant.name,
          totalLeads: 0,
          victories: 0,
          winRate: 0,
          allianceTypes: {
            offensive: 0,
            defensive: 0,
            cooperative: 0,
            temporary: 0,
            unknown: 0,
          },
        });
      }
      
      const stats = leaderMap.get(participant.name)!;
      stats.totalLeads++;
      
      if (alliance.outcome === 'victory') {
        stats.victories++;
      }
      
      if (stats.allianceTypes[type] !== undefined) {
        stats.allianceTypes[type]++;
      }
    }
  }
  
  // 计算胜率
  for (const stats of leaderMap.values()) {
    if (stats.totalLeads > 0) {
      stats.winRate = stats.victories / stats.totalLeads;
    }
  }
  
  return Array.from(leaderMap.values()).sort((a, b) => b.totalLeads - a.totalLeads);
}

/**
 * 最成功的联盟领导者
 */
export function getTopAllianceLeaders(events: Event[], limit = 5): AllianceLeaderStats[] {
  const leaders = getAllianceLeaderStats(events);
  return leaders.slice(0, limit);
}

/**
 * 联盟成员统计
 */
export type AllianceMemberStats = {
  name: string;
  totalParticipations: number;
  victories: number;
  winRate: number;
  preferredAllianceTypes: AllianceType[];
};

/**
 * 获取联盟成员统计
 */
export function getAllianceMemberStats(events: Event[]): AllianceMemberStats[] {
  const battlesWithAlliance = getBattlesWithAlliance(events);
  const memberMap = new Map<string, AllianceMemberStats>();
  
  for (const battle of battlesWithAlliance) {
    const alliance = battle.battle?.alliance;
    if (!alliance?.participants) continue;
    
    const type = alliance.type || 'unknown';
    
    for (const participant of alliance.participants) {
      if (participant.role !== 'member') continue;
      
      if (!memberMap.has(participant.name)) {
        memberMap.set(participant.name, {
          name: participant.name,
          totalParticipations: 0,
          victories: 0,
          winRate: 0,
          preferredAllianceTypes: [],
        });
      }
      
      const stats = memberMap.get(participant.name)!;
      stats.totalParticipations++;
      
      if (alliance.outcome === 'victory') {
        stats.victories++;
      }
    }
  }
  
  // 计算胜率
  for (const stats of memberMap.values()) {
    if (stats.totalParticipations > 0) {
      stats.winRate = stats.victories / stats.totalParticipations;
    }
  }
  
  return Array.from(memberMap.values()).sort((a, b) => b.totalParticipations - a.totalParticipations);
}

/**
 * 联盟分析洞察
 */
export type AllianceInsight = {
  type: 'most_successful_type' | 'most_common_type' | 'top_leader' | 'leader_insight' | 'member_insight' | 'type_insight';
  title: string;
  description: string;
};

/**
 * 生成联盟分析洞察
 */
export function getAllianceInsights(events: Event[]): AllianceInsight[] {
  const insights: AllianceInsight[] = [];
  
  const typeStats = getAllianceTypeStats(events);
  const leaderStats = getAllianceLeaderStats(events);
  
  // 最常见联盟类型
  if (typeStats.length > 0) {
    const mostCommon = typeStats[0];
    insights.push({
      type: 'most_common_type',
      title: '最常见联盟类型',
      description: `${getAllianceTypeLabel(mostCommon.type)}是最常见的联盟类型，共有${mostCommon.count}次。`,
    });
  }
  
  // 最成功联盟类型
  const successfulTypes = getMostSuccessfulAllianceTypes(events);
  if (successfulTypes.length > 0) {
    const mostSuccessful = successfulTypes[0];
    const stats = typeStats.find(s => s.type === mostSuccessful);
    if (stats && stats.count > 0) {
      const winRate = ((stats.victories / stats.count) * 100).toFixed(1);
      insights.push({
        type: 'most_successful_type',
        title: '最成功联盟类型',
        description: `${getAllianceTypeLabel(mostSuccessful)}的胜率最高，达到${winRate}%。`,
      });
    }
  }
  
  // 最活跃的联盟领导者
  if (leaderStats.length > 0) {
    const topLeader = leaderStats[0];
    insights.push({
      type: 'top_leader',
      title: '最活跃联盟领导者',
      description: `${topLeader.name}是最活跃的联盟领导者，共主导${topLeader.totalLeads}次联盟，胜率${(topLeader.winRate * 100).toFixed(1)}%。`,
    });
    
    // 领导者洞察
    if (topLeader.totalLeads >= 3) {
      insights.push({
        type: 'leader_insight',
        title: '联盟领导力洞察',
        description: `${topLeader.name}作为联盟领导者表现出色，${topLeader.victories}胜${topLeader.totalLeads - topLeader.victories}负，联盟成功率达${(topLeader.winRate * 100).toFixed(1)}%。`,
      });
    }
  }
  
  // 联盟类型洞察
  const defensiveStats = typeStats.find(s => s.type === 'defensive');
  const offensiveStats = typeStats.find(s => s.type === 'offensive');
  
  if (defensiveStats && offensiveStats) {
    const defensiveWinRate = defensiveStats.count > 0 ? defensiveStats.victories / defensiveStats.count : 0;
    const offensiveWinRate = offensiveStats.count > 0 ? offensiveStats.victories / offensiveStats.count : 0;
    
    if (defensiveWinRate > offensiveWinRate) {
      insights.push({
        type: 'type_insight',
        title: '联盟策略洞察',
        description: `历史数据显示，防御联盟（${(defensiveWinRate * 100).toFixed(1)}%胜率）比进攻联盟（${(offensiveWinRate * 100).toFixed(1)}%胜率）更具优势。`,
      });
    }
  }
  
  return insights;
}

/**
 * 联盟摘要
 */
export type AllianceSummary = {
  totalBattlesWithAlliance: number;
  totalAlliances: number;
  typeStats: AllianceStats[];
  topLeaders: AllianceLeaderStats[];
  topMembers: AllianceMemberStats[];
  insights: AllianceInsight[];
  hasAllianceData: boolean;
};

/**
 * 获取完整联盟分析摘要
 */
export function getAllianceSummary(events: Event[]): AllianceSummary {
  const battlesWithAlliance = getBattlesWithAlliance(events);
  const typeStats = getAllianceTypeStats(events);
  const topLeaders = getTopAllianceLeaders(events, 5);
  const memberStats = getAllianceMemberStats(events).slice(0, 5);
  const insights = getAllianceInsights(events);
  
  return {
    totalBattlesWithAlliance: battlesWithAlliance.length,
    totalAlliances: battlesWithAlliance.length,
    typeStats,
    topLeaders,
    topMembers: memberStats,
    insights,
    hasAllianceData: battlesWithAlliance.length > 0,
  };
}

/**
 * 检查是否有联盟数据
 */
export function hasAllianceData(events: Event[]): boolean {
  return getBattlesWithAlliance(events).length > 0;
}

/**
 * 对比两个联盟类型的胜负概率
 */
export function compareAllianceTypes(
  events: Event[],
  type1: AllianceType,
  type2: AllianceType
): { type1: { victories: number; total: number; rate: number }; type2: { victories: number; total: number; rate: number } } | null {
  const type1Stats = getBattlesByAllianceType(events, type1);
  const type2Stats = getBattlesByAllianceType(events, type2);
  
  if (type1Stats.length === 0 || type2Stats.length === 0) {
    return null;
  }
  
  const type1Victories = type1Stats.filter(b => b.battle?.alliance?.outcome === 'victory').length;
  const type2Victories = type2Stats.filter(b => b.battle?.alliance?.outcome === 'victory').length;
  
  return {
    type1: {
      victories: type1Victories,
      total: type1Stats.length,
      rate: type1Victories / type1Stats.length,
    },
    type2: {
      victories: type2Victories,
      total: type2Stats.length,
      rate: type2Victories / type2Stats.length,
    },
  };
}
