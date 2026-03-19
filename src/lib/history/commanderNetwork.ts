/**
 * 指挥官网络分析模块
 * 
 * 分析指挥官之间的关系网络：合作与对立关系
 */

import type { Event } from './types';

/**
 * 指挥官关系类型
 */
export type CommanderRelationType = 'collaborated' | 'opposed';

/**
 * 指挥官关系边
 */
export type CommanderRelation = {
  commander1: string;
  commander2: string;
  relationType: CommanderRelationType;
  battleCount: number;
  battleIds: string[];
};

/**
 * 指挥官网络节点
 */
export type CommanderNode = {
  name: string;
  battles: number;
  wins: number;
  losses: number;
  winRate: number;
  collaborators: string[];
  opponents: string[];
  firstBattle?: number;
  lastBattle?: number;
};

/**
 * 指挥官网络图
 */
export type CommanderNetwork = {
  nodes: CommanderNode[];
  relations: CommanderRelation[];
  metrics: {
    totalCommanders: number;
    totalRelations: number;
    mostConnected: string | null;
    mostActive: string | null;
  };
};

/**
 * 指挥官对决记录
 */
export type CommanderMatchup = {
  commander1: string;
  commander2: string;
  battles: number;
  commander1Wins: number;
  commander2Wins: number;
  draws: number;
  battleIds: string[];
};

/**
 * 提取所有战役指挥官（进攻方和防守方）
 */
function extractAllCommanders(battles: Event[]): Map<string, { side: 'attacker' | 'defender'; battle: Event }[]> {
  const commanderMap = new Map<string, { side: 'attacker' | 'defender'; battle: Event }[]>();
  
  for (const battle of battles) {
    if (!battle.battle?.commanders) continue;
    
    const { attackers, defenders } = getBattleCommanders(battle);
    
    for (const commander of attackers) {
      if (!commanderMap.has(commander)) {
        commanderMap.set(commander, []);
      }
      commanderMap.get(commander)!.push({ side: 'attacker', battle });
    }
    
    for (const commander of defenders) {
      if (!commanderMap.has(commander)) {
        commanderMap.set(commander, []);
      }
      commanderMap.get(commander)!.push({ side: 'defender', battle });
    }
  }
  
  return commanderMap;
}

/**
 * 获取战役的进攻方和防守方指挥官
 */
function getBattleCommanders(battle: Event): { attackers: string[]; defenders: string[] } {
  const commanders = battle.battle?.commanders;
  if (!commanders) return { attackers: [], defenders: [] };
  
  return {
    attackers: commanders.attacker || [],
    defenders: commanders.defender || [],
  };
}

/**
 * 获取战役结果
 */
function getBattleResult(battle: Event): 'win' | 'loss' | 'draw' | 'unknown' {
  const result = battle.battle?.result;
  if (!result) return 'unknown';
  
  if (result === 'attacker_win') return 'win';
  if (result === 'defender_win') return 'loss';
  if (result === 'draw') return 'draw';
  return 'unknown';
}

/**
 * 构建完整的指挥官网络
 */
export function buildCommanderNetwork(battles: Event[]): CommanderNetwork {
  const commanderMap = extractAllCommanders(battles);
  
  // 构建关系边
  const relations: CommanderRelation[] = [];
  const relationKeySet = new Set<string>();
  
  for (const battle of battles) {
    if (!battle.battle?.commanders) continue;
    
    const { attackers, defenders } = getBattleCommanders(battle);
    
    // 同一方的指挥官：合作关关系
    for (let i = 0; i < attackers.length; i++) {
      for (let j = i + 1; j < attackers.length; j++) {
        const cmd1 = attackers[i];
        const cmd2 = attackers[j];
        if (cmd1 && cmd2) {
          const key = [cmd1, cmd2].sort().join('::') + '::collaborated';
          if (!relationKeySet.has(key)) {
            relationKeySet.add(key);
            relations.push({
              commander1: cmd1,
              commander2: cmd2,
              relationType: 'collaborated',
              battleCount: 1,
              battleIds: [battle.id],
            });
          } else {
            const rel = relations.find(r => 
              [r.commander1, r.commander2].sort().join('::') === [cmd1, cmd2].sort().join('::') &&
              r.relationType === 'collaborated'
            );
            if (rel) {
              rel.battleCount++;
              rel.battleIds.push(battle.id);
            }
          }
        }
      }
    }
    
    for (let i = 0; i < defenders.length; i++) {
      for (let j = i + 1; j < defenders.length; j++) {
        const cmd1 = defenders[i];
        const cmd2 = defenders[j];
        if (cmd1 && cmd2) {
          const key = [cmd1, cmd2].sort().join('::') + '::collaborated';
          if (!relationKeySet.has(key)) {
            relationKeySet.add(key);
            relations.push({
              commander1: cmd1,
              commander2: cmd2,
              relationType: 'collaborated',
              battleCount: 1,
              battleIds: [battle.id],
            });
          } else {
            const rel = relations.find(r => 
              [r.commander1, r.commander2].sort().join('::') === [cmd1, cmd2].sort().join('::') &&
              r.relationType === 'collaborated'
            );
            if (rel) {
              rel.battleCount++;
              rel.battleIds.push(battle.id);
            }
          }
        }
      }
    }
    
    // 攻守双方的指挥官：对立关系
    for (const attacker of attackers) {
      for (const defender of defenders) {
        const key = [attacker, defender].sort().join('::') + '::opposed';
        if (!relationKeySet.has(key)) {
          relationKeySet.add(key);
          relations.push({
            commander1: attacker,
            commander2: defender,
            relationType: 'opposed',
            battleCount: 1,
            battleIds: [battle.id],
          });
        } else {
          const rel = relations.find(r => 
            [r.commander1, r.commander2].sort().join('::') === [attacker, defender].sort().join('::') &&
            r.relationType === 'opposed'
          );
          if (rel) {
            rel.battleCount++;
            rel.battleIds.push(battle.id);
          }
        }
      }
    }
  }
  
  // 构建节点
  const nodes: CommanderNode[] = [];
  
  for (const [name, entries] of commanderMap) {
    let wins = 0;
    let losses = 0;
    let firstYear = Infinity;
    let lastYear = -Infinity;
    const collaboratorsSet = new Set<string>();
    const opponentsSet = new Set<string>();
    
    for (const entry of entries) {
      const year = entry.battle.year;
      if (year < firstYear) firstYear = year;
      if (year > lastYear) lastYear = year;
      
      const result = getBattleResult(entry.battle);
      if (entry.side === 'attacker') {
        if (result === 'win') wins++;
        else if (result === 'loss') losses++;
      } else {
        if (result === 'win') losses++;
        else if (result === 'loss') wins++;
      }
    }
    
    // 收集合作者和对手
    for (const rel of relations) {
      if (rel.commander1 === name) {
        if (rel.relationType === 'collaborated') {
          collaboratorsSet.add(rel.commander2);
        } else {
          opponentsSet.add(rel.commander2);
        }
      } else if (rel.commander2 === name) {
        if (rel.relationType === 'collaborated') {
          collaboratorsSet.add(rel.commander1);
        } else {
          opponentsSet.add(rel.commander1);
        }
      }
    }
    
    const totalBattles = entries.length;
    nodes.push({
      name,
      battles: totalBattles,
      wins,
      losses,
      winRate: totalBattles > 0 ? Math.round((wins / totalBattles) * 100) : 0,
      collaborators: Array.from(collaboratorsSet),
      opponents: Array.from(opponentsSet),
      firstBattle: firstYear === Infinity ? undefined : firstYear,
      lastBattle: lastYear === -Infinity ? undefined : lastYear,
    });
  }
  
  // 计算网络指标
  let mostConnected: string | null = null;
  let maxConnections = 0;
  let mostActive: string | null = null;
  let maxBattles = 0;
  
  for (const node of nodes) {
    const connections = node.collaborators.length + node.opponents.length;
    if (connections > maxConnections) {
      maxConnections = connections;
      mostConnected = node.name;
    }
    if (node.battles > maxBattles) {
      maxBattles = node.battles;
      mostActive = node.name;
    }
  }
  
  return {
    nodes,
    relations,
    metrics: {
      totalCommanders: nodes.length,
      totalRelations: relations.length,
      mostConnected,
      mostActive,
    },
  };
}

/**
 * 获取两个指挥官之间的关系
 */
export function getCommanderRelation(
  battles: Event[],
  commander1: string,
  commander2: string
): CommanderRelation | null {
  const network = buildCommanderNetwork(battles);
  
  return (
    network.relations.find(
      r =>
        (r.commander1 === commander1 && r.commander2 === commander2) ||
        (r.commander1 === commander2 && r.commander2 === commander1)
    ) || null
  );
}

/**
 * 获取指挥官的对手列表（按对决次数排序）
 */
export function getTopOpponents(battles: Event[], commander: string, limit = 5): { name: string; battles: number }[] {
  const network = buildCommanderNetwork(battles);
  const node = network.nodes.find(n => n.name === commander);
  
  if (!node) return [];
  
  const opponentCounts: Map<string, number> = new Map();
  
  for (const rel of network.relations) {
    if (rel.relationType === 'opposed') {
      if (rel.commander1 === commander) {
        opponentCounts.set(rel.commander2, (opponentCounts.get(rel.commander2) || 0) + rel.battleCount);
      } else if (rel.commander2 === commander) {
        opponentCounts.set(rel.commander1, (opponentCounts.get(rel.commander1) || 0) + rel.battleCount);
      }
    }
  }
  
  return Array.from(opponentCounts.entries())
    .map(([name, battles]) => ({ name, battles }))
    .sort((a, b) => b.battles - a.battles)
    .slice(0, limit);
}

/**
 * 获取指挥官的合作者列表（按合作次数排序）
 */
export function getTopCollaborators(battles: Event[], commander: string, limit = 5): { name: string; battles: number }[] {
  const network = buildCommanderNetwork(battles);
  const node = network.nodes.find(n => n.name === commander);
  
  if (!node) return [];
  
  const collaboratorCounts: Map<string, number> = new Map();
  
  for (const rel of network.relations) {
    if (rel.relationType === 'collaborated') {
      if (rel.commander1 === commander) {
        collaboratorCounts.set(rel.commander2, (collaboratorCounts.get(rel.commander2) || 0) + rel.battleCount);
      } else if (rel.commander2 === commander) {
        collaboratorCounts.set(rel.commander1, (collaboratorCounts.get(rel.commander1) || 0) + rel.battleCount);
      }
    }
  }
  
  return Array.from(collaboratorCounts.entries())
    .map(([name, battles]) => ({ name, battles }))
    .sort((a, b) => b.battles - a.battles)
    .slice(0, limit);
}

/**
 * 获取最常见的对手组合
 */
export function getTopMatchups(battles: Event[], limit = 5): CommanderMatchup[] {
  const network = buildCommanderNetwork(battles);
  
  const matchups: CommanderMatchup[] = [];
  
  for (const rel of network.relations) {
    if (rel.relationType === 'opposed') {
      // 计算各自胜场
      let commander1Wins = 0;
      let commander2Wins = 0;
      let draws = 0;
      
      for (const battleId of rel.battleIds) {
        const battle = battles.find(b => b.id === battleId);
        if (!battle) continue;
        
        const { attackers, defenders } = getBattleCommanders(battle);
        const result = battle.battle?.result;
        
        if (result === 'draw') {
          draws++;
        } else if (result === 'attacker_win') {
          if (attackers.includes(rel.commander1)) commander1Wins++;
          else commander2Wins++;
        } else if (result === 'defender_win') {
          if (defenders.includes(rel.commander1)) commander1Wins++;
          else commander2Wins++;
        }
      }
      
      matchups.push({
        commander1: rel.commander1,
        commander2: rel.commander2,
        battles: rel.battleCount,
        commander1Wins,
        commander2Wins,
        draws,
        battleIds: rel.battleIds,
      });
    }
  }
  
  return matchups
    .filter(m => m.battles > 0)
    .sort((a, b) => b.battles - a.battles)
    .slice(0, limit);
}

/**
 * 获取最默契的合作组合
 */
export function getTopCollaborations(battles: Event[], limit = 5): { commander1: string; commander2: string; battles: number; wins: number }[] {
  const network = buildCommanderNetwork(battles);
  
  const collaborations: { commander1: string; commander2: string; battles: number; wins: number }[] = [];
  
  for (const rel of network.relations) {
    if (rel.relationType === 'collaborated') {
      // 计算合作胜利场次
      let wins = 0;
      
      for (const battleId of rel.battleIds) {
        const battle = battles.find(b => b.id === battleId);
        if (!battle) continue;
        
        if (battle.battle?.result === 'attacker_win' || battle.battle?.result === 'defender_win') {
          wins++;
        }
      }
      
      collaborations.push({
        commander1: rel.commander1,
        commander2: rel.commander2,
        battles: rel.battleCount,
        wins,
      });
    }
  }
  
  return collaborations
    .filter(c => c.battles > 0)
    .sort((a, b) => b.battles - a.battles)
    .slice(0, limit);
}

/**
 * 找出活跃的指挥官群体（同一时代参与多场战役的指挥官）
 */
export function getCommanderClusters(battles: Event[]): { year: number; commanders: string[] }[] {
  const network = buildCommanderNetwork(battles);
  
  // 按年代分组
  const yearCommanders: Map<number, Set<string>> = new Map();
  
  for (const node of network.nodes) {
    if (node.firstBattle !== undefined && node.lastBattle !== undefined) {
      // 找出该指挥官活跃的年代区间
      const startYear = Math.ceil(node.firstBattle / 50) * 50;
      const endYear = Math.floor(node.lastBattle / 50) * 50;
      
      for (let year = startYear; year <= endYear; year += 50) {
        if (!yearCommanders.has(year)) {
          yearCommanders.set(year, new Set());
        }
        yearCommanders.get(year)!.add(node.name);
      }
    }
  }
  
  // 返回有多个指挥官的年代
  return Array.from(yearCommanders.entries())
    .filter(([, commanders]) => commanders.size >= 2)
    .map(([year, commanders]) => ({
      year,
      commanders: Array.from(commanders),
    }))
    .sort((a, b) => b.year - a.year);
}

/**
 * 检查是否有足够的指挥官网络数据
 */
export function hasCommanderNetworkData(battles: Event[]): boolean {
  const commanderMap = extractAllCommanders(battles);
  return commanderMap.size >= 2;
}

/**
 * 获取指挥官网络摘要
 */
export function getCommanderNetworkSummary(battles: Event[]): {
  totalCommanders: number;
  totalRelations: number;
  collaborations: number;
  matchups: number;
  mostConnected: string | null;
  mostActive: string | null;
  hasData: boolean;
} {
  if (!hasCommanderNetworkData(battles)) {
    return {
      totalCommanders: 0,
      totalRelations: 0,
      collaborations: 0,
      matchups: 0,
      mostConnected: null,
      mostActive: null,
      hasData: false,
    };
  }
  
  const network = buildCommanderNetwork(battles);
  const collaborations = network.relations.filter(r => r.relationType === 'collaborated').length;
  const matchups = network.relations.filter(r => r.relationType === 'opposed').length;
  
  return {
    totalCommanders: network.metrics.totalCommanders,
    totalRelations: network.metrics.totalRelations,
    collaborations,
    matchups,
    mostConnected: network.metrics.mostConnected,
    mostActive: network.metrics.mostActive,
    hasData: true,
  };
}

/**
 * 生成指挥官网络洞察
 */
export function getCommanderNetworkInsights(battles: Event[]): string[] {
  const insights: string[] = [];
  
  if (!hasCommanderNetworkData(battles)) {
    return insights;
  }
  
  const network = buildCommanderNetwork(battles);
  const summary = getCommanderNetworkSummary(battles);
  
  // 最活跃的指挥官
  if (summary.mostActive) {
    const node = network.nodes.find(n => n.name === summary.mostActive);
    if (node && node.battles >= 2) {
      insights.push(`最活跃的指挥官是 ${node.name}，参与了 ${node.battles} 场战役`);
    }
  }
  
  // 最多连接的指挥官
  if (summary.mostConnected) {
    const node = network.nodes.find(n => n.name === summary.mostConnected);
    if (node) {
      const totalConnections = node.collaborators.length + node.opponents.length;
      insights.push(`人脉最广的指挥官是 ${node.name}，与 ${totalConnections} 位指挥官有交集`);
    }
  }
  
  // 最常见的对手组合
  const topMatchups = getTopMatchups(battles, 1);
  if (topMatchups.length > 0) {
    const matchup = topMatchups[0];
    if (matchup && matchup.battles > 1) {
      insights.push(
        `${matchup.commander1} 与 ${matchup.commander2} 是最常见的对手，共对决 ${matchup.battles} 次`
      );
    }
  }
  
  // 最默契的合作
  const topCollaborations = getTopCollaborations(battles, 1);
  if (topCollaborations.length > 0) {
    const collab = topCollaborations[0];
    if (collab && collab.battles > 1) {
      insights.push(
        `${collab.commander1} 与 ${collab.commander2} 是最佳搭档，合作 ${collab.battles} 场，胜 ${collab.wins} 场`
      );
    }
  }
  
  // 战争时期集群
  const clusters = getCommanderClusters(battles);
  if (clusters.length > 0) {
    const latestCluster = clusters[0];
    if (latestCluster && latestCluster.commanders.length >= 3) {
      const yearStr = latestCluster.year < 0 ? `${Math.abs(latestCluster.year)} BCE` : `${latestCluster.year} CE`;
      insights.push(
        `约 ${yearStr} 年是指挥官最活跃的时期，有 ${latestCluster.commanders.length} 位著名指挥官`
      );
    }
  }
  
  return insights;
}
