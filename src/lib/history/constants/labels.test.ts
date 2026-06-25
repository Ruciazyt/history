/**
 * Tests for labels.ts constant exports
 * Covers STRATEGY_LABELS, TERRAIN_LABELS, TURNING_POINT_LABELS
 */

import { describe, it, expect } from 'vitest';
import {
  STRATEGY_LABELS,
  TERRAIN_LABELS,
  TURNING_POINT_LABELS,
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
});
