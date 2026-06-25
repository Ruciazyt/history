/**
 * Label / i18n-key constants for History Atlas
 * String mappings for strategies, terrain, turning points.
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
