import { Event } from './types';

/**
 * 战役因果链分析模块
 * 分析战役之间的历史关联和连锁反应
 */

export type BattleChainNode = {
  battle: Event;
  /** 受此战役影响的后续战役 */
  influencedBattles: string[];
  /** 引发此战役的前置战役 */
  predecessorBattles: string[];
  /** 因果强度 */
  influenceScore: number;
};

export type BattleChain = {
  /** 起始战役 */
  rootBattle: Event;
  /** 因果链中的所有战役 */
  battles: Event[];
  /** 链的长度 */
  length: number;
  /** 总影响力得分 */
  totalImpact: number;
};

export type ChainInsight = {
  type: 'escalation' | 'retaliation' | 'conquest' | 'collapse' | 'domino' | 'unknown';
  description: string;
  battles: string[];
  confidence: number;
};

/**
 * 检查两场战役是否有时间上的因果关系（前一场可能引发后一场）
 */
function hasTemporalCausalRelation(battle1: Event, battle2: Event): boolean {
  // 后一场战役必须在时间上晚于前一场
  if (battle2.year <= battle1.year) return false;
  
  // 考虑时间窗口：50年内可能存在因果关系
  const timeDiff = battle2.year - battle1.year;
  return timeDiff <= 50;
}

/**
 * 根据战役类型和结果判断因果关系的可能性
 */
function getCausalProbability(battle1: Event, battle2: Event): number {
  let probability = 0.3; // 基础概率
  
  // 同一地域的战役更可能有因果关系
  if (battle1.location?.label && battle2.location?.label) {
    if (battle1.location.label === battle2.location.label) {
      probability += 0.3;
    } else if (battle1.location.label.includes(battle2.location.label) || 
               battle2.location.label.includes(battle1.location.label)) {
      probability += 0.2;
    }
  }
  
  // 同一参战方更可能有因果关系
  const b1Attacker = battle1.battle?.belligerents?.attacker;
  const b1Defender = battle1.battle?.belligerents?.defender;
  const b2Attacker = battle2.battle?.belligerents?.attacker;
  const b2Defender = battle2.battle?.belligerents?.defender;
  
  if ((b1Attacker && (b1Attacker === b2Attacker || b1Attacker === b2Defender)) ||
      (b1Defender && (b1Defender === b2Attacker || b1Defender === b2Defender))) {
    probability += 0.2;
  }
  
  // 战役规模升级
  const scaleOrder = ['small', 'medium', 'large', 'massive'];
  const b1Scale = battle1.battle?.scale || 'unknown';
  const b2Scale = battle2.battle?.scale || 'unknown';
  const b1Index = scaleOrder.indexOf(b1Scale);
  const b2Index = scaleOrder.indexOf(b2Scale);
  
  if (b1Index >= 0 && b2Index >= 0 && b2Index > b1Index) {
    probability += 0.1;
  }
  
  // 结果可能导致后续战役
  if (battle1.battle?.result === 'attacker_win') {
    // 胜利方可能继续进攻
    probability += 0.1;
  } else if (battle1.battle?.result === 'defender_win') {
    // 战败方可能反击
    probability += 0.1;
  }
  
  return Math.min(probability, 0.95);
}

/**
 * 构建战役因果链图
 */
export function buildBattleChainGraph(battles: Event[]): Map<string, BattleChainNode> {
  const graph = new Map<string, BattleChainNode>();
  
  // 初始化所有战役节点
  for (const battle of battles) {
    graph.set(battle.id, {
      battle,
      influencedBattles: [],
      predecessorBattles: [],
      influenceScore: 0,
    });
  }
  
  // 分析因果关系
  for (let i = 0; i < battles.length; i++) {
    for (let j = i + 1; j < battles.length; j++) {
      const battle1 = battles[i];
      const battle2 = battles[j];
      
      if (battle1 && battle2 && hasTemporalCausalRelation(battle1, battle2)) {
        const probability = getCausalProbability(battle1, battle2);
        
        if (probability > 0.4) {
          const node1 = graph.get(battle1.id)!;
          const node2 = graph.get(battle2.id)!;
          
          node1.influencedBattles.push(battle2.id);
          node2.predecessorBattles.push(battle1.id);
          
          // 根据影响力级别增加分数
          const impactScore = battle1.battle?.impact === 'decisive' ? 3 :
                             battle1.battle?.impact === 'major' ? 2 : 1;
          node1.influenceScore += probability * impactScore;
        }
      }
    }
  }
  
  return graph;
}

/**
 * 获取战役的因果链
 */
export function getBattleChain(battles: Event[], rootBattleId: string): BattleChain | null {
  const graph = buildBattleChainGraph(battles);
  const rootNode = graph.get(rootBattleId);
  
  if (!rootNode) return null;
  
  const visited = new Set<string>();
  const chain: Event[] = [];
  let totalImpact = 0;
  
  function traverse(battleId: string) {
    if (visited.has(battleId)) return;
    visited.add(battleId);
    
    const node = graph.get(battleId);
    if (!node) return;
    
    chain.push(node.battle);
    totalImpact += node.battle.battle?.impact === 'decisive' ? 3 :
                   node.battle.battle?.impact === 'major' ? 2 : 1;
    
    for (const influencedId of node.influencedBattles) {
      traverse(influencedId);
    }
  }
  
  traverse(rootBattleId);
  
  return {
    rootBattle: rootNode.battle,
    battles: chain,
    length: chain.length,
    totalImpact,
  };
}

/**
 * 获取最具影响力的战役链（蝴蝶结效应）
 */
export function getMostInfluentialChains(battles: Event[], limit: number = 5): BattleChain[] {
  const graph = buildBattleChainGraph(battles);
  const chains: BattleChain[] = [];
  
  // 从每个战役开始，递归构建因果链
  function buildChain(battleId: string, visited: Set<string>): Event[] {
    if (visited.has(battleId)) return [];
    visited.add(battleId);
    
    const node = graph.get(battleId);
    if (!node) return [];
    
    const chain = [node.battle];
    for (const influencedId of node.influencedBattles) {
      const subChain = buildChain(influencedId, new Set(visited));
      chain.push(...subChain);
    }
    
    return chain;
  }
  
  for (const battle of battles) {
    const chain = buildChain(battle.id, new Set());
    if (chain.length > 1) {
      let totalImpact = 0;
      for (const b of chain) {
        totalImpact += b.battle?.impact === 'decisive' ? 3 :
                       b.battle?.impact === 'major' ? 2 : 1;
      }
      
      const rootBattle = chain[0];
      if (rootBattle) {
        chains.push({
          rootBattle,
          battles: chain,
          length: chain.length,
          totalImpact,
        });
      }
    }
  }
  
  // 按总影响力排序
  chains.sort((a, b) => b.totalImpact - a.totalImpact);
  
  return chains.slice(0, limit);
}

/**
 * 分析战役链的类型
 */
export function analyzeChainType(battles: Event[]): ChainInsight | null {
  if (battles.length < 2) return null;
  
  let escalationCount = 0;
  let retaliationCount = 0;
  let conquestCount = 0;
  let collapseCount = 0;
  
  for (let i = 0; i < battles.length - 1; i++) {
    const current = battles[i];
    const next = battles[i + 1];
    
    if (!current || !next) continue;
    
    // 规模升级
    const scaleOrder = ['small', 'medium', 'large', 'massive'];
    const currentScale = scaleOrder.indexOf(current.battle?.scale || 'unknown');
    const nextScale = scaleOrder.indexOf(next.battle?.scale || 'unknown');
    
    if (nextScale > currentScale && currentScale >= 0) {
      escalationCount++;
    }
    
    // 复仇关系（防守方失败后反击）
    if (current.battle?.result === 'attacker_win' && 
        next.battle?.belligerents?.attacker === current.battle?.belligerents?.defender) {
      retaliationCount++;
    }
    
    // 征服链（连续进攻胜利）
    if (current.battle?.result === 'attacker_win' && 
        next.battle?.result === 'attacker_win' &&
        next.battle?.belligerents?.attacker === current.battle?.belligerents?.attacker) {
      conquestCount++;
    }
    
    // 崩塌链（战败后持续衰落）
    if (current.battle?.result === 'defender_win' && 
        next.battle?.result === 'defender_win' &&
        next.battle?.belligerents?.defender === current.battle?.belligerents?.defender) {
      collapseCount++;
    }
  }
  
  // 确定主要类型
  const maxCount = Math.max(escalationCount, retaliationCount, conquestCount, collapseCount);
  
  if (maxCount === 0) {
    return {
      type: 'unknown',
      description: '无法确定明确的因果链类型',
      battles: battles.map(b => b.id),
      confidence: 0.3,
    };
  }
  
  const battleIds = battles.map(b => b.id);
  const firstBattle = battles[0];
  const lastBattle = battles[battles.length - 1];
  
  if (maxCount === escalationCount) {
    return {
      type: 'escalation',
      description: `战役规模逐步升级，从${firstBattle?.battle?.scale ?? '未知'}到${lastBattle?.battle?.scale ?? '未知'}，冲突强度不断增加`,
      battles: battleIds,
      confidence: Math.min(0.5 + escalationCount * 0.15, 0.9),
    };
  }
  
  if (maxCount === retaliationCount) {
    return {
      type: 'retaliation',
      description: '呈现复仇与反击的因果链，一方战败后持续反击',
      battles: battleIds,
      confidence: Math.min(0.5 + retaliationCount * 0.15, 0.9),
    };
  }
  
  if (maxCount === conquestCount) {
    return {
      type: 'conquest',
      description: '呈现征服与扩张的连锁反应，连续进攻并取得胜利',
      battles: battleIds,
      confidence: Math.min(0.5 + conquestCount * 0.15, 0.9),
    };
  }
  
  return {
    type: 'collapse',
    description: '呈现防守方持续溃败的崩塌链',
    battles: battleIds,
    confidence: Math.min(0.5 + collapseCount * 0.15, 0.9),
  };
}

/**
 * 获取战役的因果分析摘要
 */
export function getBattleChainSummary(battles: Event[]): {
  totalChains: number;
  longestChain: number;
  mostInfluential: Event | null;
  chainTypes: Record<string, number>;
  insights: string[];
} {
  const chains = getMostInfluentialChains(battles);
  const chainTypes: Record<string, number> = {};
  
  let longestChain = 0;
  let mostInfluential: Event | null = null;
  let maxInfluence = 0;
  
  for (const chain of chains) {
    if (chain.length > longestChain) {
      longestChain = chain.length;
    }
    
    if (chain.totalImpact > maxInfluence) {
      maxInfluence = chain.totalImpact;
      mostInfluential = chain.rootBattle;
    }
    
    if (chain.length >= 2) {
      const type = analyzeChainType(chain.battles);
      if (type) {
        chainTypes[type.type] = (chainTypes[type.type] || 0) + 1;
      }
    }
  }
  
  // 生成洞察
  const insights: string[] = [];
  
  if (mostInfluential) {
    insights.push(`最具影响力的因果链起点是「${mostInfluential.titleKey}」，引发了后续连锁反应`);
  }
  
  if (longestChain > 2) {
    insights.push(`发现最长的因果链包含${longestChain}场战役，呈现复杂的连锁反应`);
  }
  
  const dominantType = Object.entries(chainTypes)
    .sort(([, a], [, b]) => b - a)[0];
  
  if (dominantType) {
    const typeNames: Record<string, string> = {
      escalation: '规模升级',
      retaliation: '复仇反击',
      conquest: '征服扩张',
      collapse: '持续溃败',
    };
    insights.push(`最常见的因果链类型是「${typeNames[dominantType[0]] || dominantType[0]}」`);
  }
  
  return {
    totalChains: chains.length,
    longestChain,
    mostInfluential,
    chainTypes,
    insights,
  };
}

/**
 * 检查战役数据是否支持因果链分析
 */
export function hasChainData(battles: Event[]): boolean {
  // 需要至少有一定数量的战役
  if (battles.length < 5) return false;
  
  // 至少有一些战役有地理位置信息
  let locationCount = 0;
  for (const battle of battles) {
    if (battle.location?.label) locationCount++;
  }
  
  return locationCount >= battles.length * 0.3;
}
