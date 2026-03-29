/**
 * Tests for labels.ts constant exports
 * Covers STRATEGY_LABELS, TERRAIN_LABELS, PACING_LABELS, TIME_OF_DAY_LABELS,
 * BATTLE_TYPE_LABELS, TURNING_POINT_LABELS, CASUALTY_RELIABILITY_LABELS,
 * SCALE_LABELS, CASUALTY_TYPE_LABELS, BATTLE_ICONS
 */

import { describe, it, expect } from 'vitest';
import {
  STRATEGY_LABELS,
  TERRAIN_LABELS,
  PACING_LABELS,
  TIME_OF_DAY_LABELS,
  BATTLE_TYPE_LABELS,
  TURNING_POINT_LABELS,
  CASUALTY_RELIABILITY_LABELS,
  SCALE_LABELS,
  CASUALTY_TYPE_LABELS,
  BATTLE_ICONS,
} from './labels';

describe('labels constants', () => {
  describe('STRATEGY_LABELS', () => {
    it('should export encirclement strategy label', () => {
      expect(STRATEGY_LABELS.encirclement).toBe('battle.strategy.encirclement');
    });

    it('should have all expected strategy keys', () => {
      const expected = [
        'ambush', 'fire', 'water', 'encirclement', 'siege', 'pincer',
        'feigned-retreat', 'alliance', 'defensive', 'offensive', 'guerrilla', 'unknown',
      ];
      expect(Object.keys(STRATEGY_LABELS).sort()).toEqual(expected.sort());
    });

    it('each strategy should have valid i18n key prefix', () => {
      Object.entries(STRATEGY_LABELS).forEach(([_key, value]) => {
        expect(value).toMatch(/^battle\.strategy\./);
      });
    });
  });

  describe('TERRAIN_LABELS', () => {
    it('should have all expected terrain keys', () => {
      const expected = [
        'plains', 'mountains', 'hills', 'water', 'desert', 'plateau',
        'forest', 'marsh', 'coastal', 'urban', 'pass', 'unknown',
      ];
      expect(Object.keys(TERRAIN_LABELS).sort()).toEqual(expected.sort());
    });

    it('each terrain should have valid i18n key prefix', () => {
      Object.entries(TERRAIN_LABELS).forEach(([_key, value]) => {
        expect(value).toMatch(/^battle\.terrain\./);
      });
    });
  });

  describe('PACING_LABELS', () => {
    it('should have all expected pacing keys', () => {
      const expected = ['surprise', 'rapid', 'extended', 'siege', 'unknown'];
      expect(Object.keys(PACING_LABELS).sort()).toEqual(expected.sort());
    });

    it('each pacing should have valid i18n key prefix', () => {
      Object.entries(PACING_LABELS).forEach(([_key, value]) => {
        expect(value).toMatch(/^battle\.pacing\./);
      });
    });
  });

  describe('TIME_OF_DAY_LABELS', () => {
    it('should have all expected time of day keys', () => {
      const expected = ['dawn', 'morning', 'afternoon', 'evening', 'night', 'unknown'];
      expect(Object.keys(TIME_OF_DAY_LABELS).sort()).toEqual(expected.sort());
    });

    it('each time of day should have valid i18n key prefix', () => {
      Object.entries(TIME_OF_DAY_LABELS).forEach(([_key, value]) => {
        expect(value).toMatch(/^battle\.timeOfDay\./);
      });
    });
  });

  describe('BATTLE_TYPE_LABELS', () => {
    it('should have all expected battle type keys', () => {
      const expected = [
        'founding', 'unification', 'conquest', 'defense', 'rebellion',
        'civil-war', 'frontier', 'invasion', 'unknown',
      ];
      expect(Object.keys(BATTLE_TYPE_LABELS).sort()).toEqual(expected.sort());
    });

    it('each battle type should have valid i18n key prefix', () => {
      Object.entries(BATTLE_TYPE_LABELS).forEach(([_key, value]) => {
        expect(value).toMatch(/^battle\.type\./);
      });
    });
  });

  describe('TURNING_POINT_LABELS', () => {
    it('should have encirclement turning point label', () => {
      expect(TURNING_POINT_LABELS.encirclement).toBe('battle.turningPoint.encirclement');
    });

    it('should have moral-boost turning point label', () => {
      expect(TURNING_POINT_LABELS['moral-boost']).toBe('battle.turningPoint.moral_boost');
    });

    it('should have fire-attack turning point label', () => {
      expect(TURNING_POINT_LABELS['fire-attack']).toBe('battle.turningPoint.fire_attack');
    });

    it('should have flood-attack turning point label', () => {
      expect(TURNING_POINT_LABELS['flood-attack']).toBe('battle.turningPoint.flood_attack');
    });

    it('should have all core turning point keys', () => {
      const coreKeys = [
        'commander-death', 'commander-captured', 'flank-collapse',
        'reinforcement-arrival', 'supply-disruption', 'weather-change',
        'defection', 'strategic-mistake', 'fortification-breach',
        'ambush-triggered', 'morale-collapse', 'trap-triggered',
      ];
      coreKeys.forEach(key => {
        expect(TURNING_POINT_LABELS).toHaveProperty(key);
      });
    });

    it('should have unknown turning point', () => {
      expect(TURNING_POINT_LABELS.unknown).toBe('battle.turningPoint.unknown');
    });

    it('each turning point should have valid i18n key prefix', () => {
      Object.entries(TURNING_POINT_LABELS).forEach(([_key, value]) => {
        expect(value).toMatch(/^battle\.turningPoint\./);
      });
    });

    it('should have at least 14 turning point types', () => {
      // Core types + encirclement + moral-boost + fire-attack + flood-attack + unknown
      expect(Object.keys(TURNING_POINT_LABELS).length).toBeGreaterThanOrEqual(16);
    });
  });

  describe('CASUALTY_RELIABILITY_LABELS', () => {
    it('should have all reliability levels', () => {
      expect(CASUALTY_RELIABILITY_LABELS).toHaveProperty('high');
      expect(CASUALTY_RELIABILITY_LABELS).toHaveProperty('medium');
      expect(CASUALTY_RELIABILITY_LABELS).toHaveProperty('low');
    });

    it('each reliability should have valid i18n key prefix', () => {
      Object.entries(CASUALTY_RELIABILITY_LABELS).forEach(([_key, value]) => {
        expect(value).toMatch(/^battle\.casualty\.reliability\./);
      });
    });
  });

  describe('SCALE_LABELS', () => {
    it('should have all scale levels', () => {
      expect(SCALE_LABELS).toHaveProperty('massive');
      expect(SCALE_LABELS).toHaveProperty('large');
      expect(SCALE_LABELS).toHaveProperty('medium');
      expect(SCALE_LABELS).toHaveProperty('small');
      expect(SCALE_LABELS).toHaveProperty('unknown');
    });

    it('should have exactly 5 scale entries', () => {
      expect(Object.keys(SCALE_LABELS)).toHaveLength(5);
    });

    it('each scale should have valid i18n key prefix', () => {
      Object.entries(SCALE_LABELS).forEach(([_key, value]) => {
        expect(value).toMatch(/^battle\.scale\./);
      });
    });
  });

  describe('CASUALTY_TYPE_LABELS', () => {
    it('should have all casualty type keys', () => {
      const expected = ['killed', 'wounded', 'captured', 'missing', 'combined'];
      expect(Object.keys(CASUALTY_TYPE_LABELS).sort()).toEqual(expected.sort());
    });

    it('each casualty type should have valid i18n key prefix', () => {
      Object.entries(CASUALTY_TYPE_LABELS).forEach(([_key, value]) => {
        expect(value).toMatch(/^battle\.casualty\./);
      });
    });
  });

  describe('BATTLE_ICONS', () => {
    it('should have attacker and defender icons', () => {
      expect(BATTLE_ICONS).toHaveProperty('attacker');
      expect(BATTLE_ICONS).toHaveProperty('defender');
    });

    it('attacker icon should be a sword emoji', () => {
      expect(BATTLE_ICONS.attacker).toBe('⚔️');
    });
  });
});
