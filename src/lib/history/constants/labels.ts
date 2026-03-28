/**
 * Label / i18n-key constants for History Atlas
 * String mappings for strategies, terrain, pacing, battle types, etc.
 * Values are i18n keys for use with the t() function.
 */

export const STRATEGY_LABELS: Record<string, string> = {
  ambush: 'battle.strategy.ambush',
  fire: 'battle.strategy.fire',
  water: 'battle.strategy.water',
  encirclement: 'battle.strategy.encirclement',
  siege: 'battle.strategy.siege',
  pincer: 'battle.strategy.pincer',
  'feigned-retreat': 'battle.strategy.feigned_retreat',
  alliance: 'battle.strategy.alliance',
  defensive: 'battle.strategy.defensive',
  offensive: 'battle.strategy.offensive',
  guerrilla: 'battle.strategy.guerrilla',
  unknown: 'battle.strategy.unknown',
};
export const TERRAIN_LABELS: Record<string, string> = {
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
export const PACING_LABELS: Record<string, string> = {
  surprise: 'battle.pacing.surprise',
  rapid: 'battle.pacing.rapid',
  extended: 'battle.pacing.extended',
  siege: 'battle.pacing.siege',
  unknown: 'battle.pacing.unknown',
};
export const TIME_OF_DAY_LABELS: Record<string, string> = {
  dawn: 'battle.timeOfDay.dawn',
  morning: 'battle.timeOfDay.morning',
  afternoon: 'battle.timeOfDay.afternoon',
  evening: 'battle.timeOfDay.evening',
  night: 'battle.timeOfDay.night',
  unknown: 'battle.timeOfDay.unknown',
};
export const BATTLE_TYPE_LABELS: Record<string, string> = {
  founding: 'battle.type.founding',
  unification: 'battle.type.unification',
  conquest: 'battle.type.conquest',
  defense: 'battle.type.defense',
  rebellion: 'battle.type.rebellion',
  'civil-war': 'battle.type.civil_war',
  frontier: 'battle.type.frontier',
  invasion: 'battle.type.invasion',
  unknown: 'battle.type.unknown',
};
export const TURNING_POINT_LABELS: Record<string, string> = {
  'commander-death': 'battle.turningPoint.commander_death',
  'commander-captured': 'battle.turningPoint.commander_captured',
  'flank-collapse': 'battle.turningPoint.flank_collapse',
  'reinforcement-arrival': 'battle.turningPoint.reinforcement_arrival',
  'supply-disruption': 'battle.turningPoint.supply_disruption',
  'weather-change': 'battle.turningPoint.weather_change',
  'defection': 'battle.turningPoint.defection',
  'strategic-mistake': 'battle.turningPoint.strategic_mistake',
  'fortification-breach': 'battle.turningPoint.fortification_breach',
  'ambush-triggered': 'battle.turningPoint.ambush_triggered',
  'morale-collapse': 'battle.turningPoint.morale_collapse',
  'trap-triggered': 'battle.turningPoint.trap_triggered',
  'fire-attack': 'battle.turningPoint.fire_attack',
  'encirclement': 'battle.turningPoint.encirclement',
  'moral-boost': 'battle.turningPoint.moral_boost',
  'flood-attack': 'battle.turningPoint.flood_attack',
  unknown: 'battle.turningPoint.unknown',
};
export const CASUALTY_RELIABILITY_LABELS: Record<string, string> = {
  high: 'battle.casualty.reliability.high',
  medium: 'battle.casualty.reliability.medium',
  low: 'battle.casualty.reliability.low',
};
export const SCALE_LABELS: Record<string, string> = {
  massive: 'battle.scale.massive',
  large: 'battle.scale.large',
  medium: 'battle.scale.medium',
  small: 'battle.scale.small',
  unknown: 'battle.scale.unknown',
};
export const CASUALTY_TYPE_LABELS: Record<string, string> = {
  killed: 'battle.casualty.killed',
  wounded: 'battle.casualty.wounded',
  captured: 'battle.casualty.captured',
  missing: 'battle.casualty.missing',
  combined: 'battle.casualty.combined',
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
