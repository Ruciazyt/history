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

/**
 * Tests for RULER_RELATIONS_COLORS constant
 * Dark mode support added in commit 9376f6d
 */

import { RULER_RELATIONS_COLORS } from './colors';

describe('RULER_RELATIONS_COLORS', () => {
  it('should export container, label, and badge sections', () => {
    expect(RULER_RELATIONS_COLORS).toHaveProperty('container');
    expect(RULER_RELATIONS_COLORS).toHaveProperty('label');
    expect(RULER_RELATIONS_COLORS).toHaveProperty('badge');
  });

  describe('container', () => {
    it('should have border color with light and dark mode', () => {
      expect(RULER_RELATIONS_COLORS.container.border).toBe('border-gray-200 dark:border-zinc-700');
    });
  });

  describe('label', () => {
    it('should have text color with light and dark mode', () => {
      expect(RULER_RELATIONS_COLORS.label.text).toBe('text-gray-500 dark:text-zinc-400');
    });
  });

  describe('badge', () => {
    it('should have bg color with light and dark mode', () => {
      expect(RULER_RELATIONS_COLORS.badge.bg).toBe('bg-amber-50 dark:bg-amber-900/30');
    });

    it('should have hoverBg color with light and dark mode', () => {
      expect(RULER_RELATIONS_COLORS.badge.hoverBg).toBe('hover:bg-amber-100 dark:hover:bg-amber-900/50');
    });

    it('should have text color with light and dark mode', () => {
      expect(RULER_RELATIONS_COLORS.badge.text).toBe('text-amber-700 dark:text-amber-300');
    });

    it('should have border color with light and dark mode', () => {
      expect(RULER_RELATIONS_COLORS.badge.border).toBe('border-amber-200 dark:border-amber-700/50');
    });
  });

  it('all colors should contain dark: prefix for dark mode support', () => {
    Object.entries(RULER_RELATIONS_COLORS).forEach(([_section, styles]) => {
      Object.values(styles).forEach((cls: string) => {
        expect(cls).toContain(' dark:');
      });
    });
  });
});
