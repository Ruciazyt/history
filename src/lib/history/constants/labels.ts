/**
 * Label / i18n-key constants for History Atlas
 * String mappings for strategies, terrain, pacing, battle types, etc.
 */

export const STRATEGY_LABELS: Record<string, string> = {
  ambush: '伏击',
  fire: '火攻',
  water: '水攻',
  encirclement: '包围',
  siege: '攻城',
  pincer: '钳形攻势',
  'feigned-retreat': '诱敌深入',
  alliance: '联盟作战',
  defensive: '防御作战',
  offensive: '进攻作战',
  guerrilla: '游击战',
  unknown: '未知',
};
export const TERRAIN_LABELS: Record<string, string> = {
  plains: '平原',
  mountains: '山地',
  hills: '丘陵',
  water: '水域',
  desert: '沙漠',
  plateau: '高原',
  forest: '森林',
  marsh: '沼泽',
  coastal: '沿海',
  urban: '城镇',
  pass: '关隘',
  unknown: '未知',
};
export const PACING_LABELS: Record<string, string> = {
  surprise: '突袭战',
  rapid: '快速决战',
  extended: '持久战',
  siege: '围城战',
  unknown: '未知',
};
export const TIME_OF_DAY_LABELS: Record<string, string> = {
  dawn: '黎明',
  morning: '上午',
  afternoon: '下午',
  evening: '傍晚',
  night: '夜间',
  unknown: '未知',
};
export const BATTLE_TYPE_LABELS: Record<string, string> = {
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
export const TURNING_POINT_LABELS: Record<string, string> = {
  'commander-death': '指挥官阵亡',
  'commander-captured': '指挥官被俘',
  'flank-collapse': '侧翼崩溃',
  'reinforcement-arrival': '援军到达',
  'supply-disruption': '补给中断',
  'weather-change': '天气突变',
  'defection': '倒戈/背叛',
  'strategic-mistake': '战略失误',
  'fortification-breach': '防线突破',
  'ambush-triggered': '伏击触发',
  'morale-collapse': '士气崩溃',
  'trap-triggered': '陷阱触发',
  'fire-attack': '火攻成功',
  'flood-attack': '水攻成功',
  unknown: '未知',
};
export const CASUALTY_RELIABILITY_LABELS: Record<string, string> = {
  high: '可靠',
  medium: '一般',
  low: '存疑',
};
export const SCALE_LABELS: Record<string, string> = {
  massive: '超大规模',
  large: '大规模',
  medium: '中等规模',
  small: '小规模',
  unknown: '未知',
};
export const CASUALTY_TYPE_LABELS: Record<string, string> = {
  killed: '阵亡',
  wounded: '受伤',
  captured: '被俘',
  missing: '失踪',
  combined: '伤亡',
};
export const BATTLE_ICONS: Record<string, string> = {
  attacker: '⚔️',
  defender: '🛡️',
  commander: '👤',
  location: '📍',
  calendar: '📅',
  casualties: '💀',
  victory: '🏆',
  defeat: '❌',
  draw: '⚖️',
} as const;
export const ERA_INFO: Record<string, { name: string; color: string }> = {
  'wz-western-zhou': { name: '西周', color: 'bg-amber-500' },
  'period-spring-autumn': { name: '春秋', color: 'bg-blue-500' },
  'period-warring-states': { name: '战国', color: 'bg-purple-500' },
  'qin': { name: '秦', color: 'bg-zinc-600' },
  'han': { name: '汉', color: 'bg-red-600' },
} as const;
