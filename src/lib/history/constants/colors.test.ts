/**
 * Tests for BATTLE_SCALE_COLORS constant
 * Added in commit dbf196d to support battle scale color mapping
 */

import { describe, it, expect } from 'vitest';
import { BATTLE_SCALE_COLORS } from './colors';

describe('BATTLE_SCALE_COLORS', () => {
  it('should export all 5 battle scale levels', () => {
    expect(BATTLE_SCALE_COLORS).toHaveProperty('massive');
    expect(BATTLE_SCALE_COLORS).toHaveProperty('large');
    expect(BATTLE_SCALE_COLORS).toHaveProperty('medium');
    expect(BATTLE_SCALE_COLORS).toHaveProperty('small');
    expect(BATTLE_SCALE_COLORS).toHaveProperty('unknown');
  });

  it('should have exactly 5 entries', () => {
    expect(Object.keys(BATTLE_SCALE_COLORS)).toHaveLength(5);
  });

  describe('massive scale colors', () => {
    it('should have red background and text classes', () => {
      expect(BATTLE_SCALE_COLORS.massive.bg).toBe('bg-red-100');
      expect(BATTLE_SCALE_COLORS.massive.text).toBe('text-red-700');
    });
  });

  describe('large scale colors', () => {
    it('should have orange background and text classes', () => {
      expect(BATTLE_SCALE_COLORS.large.bg).toBe('bg-orange-100');
      expect(BATTLE_SCALE_COLORS.large.text).toBe('text-orange-700');
    });
  });

  describe('medium scale colors', () => {
    it('should have blue background and text classes', () => {
      expect(BATTLE_SCALE_COLORS.medium.bg).toBe('bg-blue-100');
      expect(BATTLE_SCALE_COLORS.medium.text).toBe('text-blue-700');
    });
  });

  describe('small scale colors', () => {
    it('should have green background and text classes', () => {
      expect(BATTLE_SCALE_COLORS.small.bg).toBe('bg-green-100');
      expect(BATTLE_SCALE_COLORS.small.text).toBe('text-green-700');
    });
  });

  describe('unknown scale colors', () => {
    it('should have neutral zinc background and text classes', () => {
      expect(BATTLE_SCALE_COLORS.unknown.bg).toBe('bg-zinc-100');
      expect(BATTLE_SCALE_COLORS.unknown.text).toBe('text-zinc-500');
    });
  });

  it('each entry should have valid bg and text Tailwind classes', () => {
    Object.entries(BATTLE_SCALE_COLORS).forEach(([_scale, colors]) => {
      expect(colors.bg).toMatch(/^bg-[a-z]+-\d+$/);
      expect(colors.text).toMatch(/^text-[a-z]+-\d+$/);
    });
  });

  it('color intensity should reflect scale severity (massive=red, small=green)', () => {
    // Massive = most severe = red (highest intensity color)
    expect(BATTLE_SCALE_COLORS.massive.bg).toBe('bg-red-100');
    // Small = least severe = green (lowest intensity color)
    expect(BATTLE_SCALE_COLORS.small.bg).toBe('bg-green-100');
  });
});
