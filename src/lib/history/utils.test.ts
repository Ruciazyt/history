import { describe, it, expect } from 'vitest';
import { formatYear, clamp } from './utils';

describe('utils', () => {
  describe('formatYear', () => {
    it('should format positive years as CE', () => {
      expect(formatYear(0)).toBe('0 CE');
      expect(formatYear(1)).toBe('1 CE');
      expect(formatYear(2024)).toBe('2024 CE');
    });

    it('should format negative years as BCE', () => {
      expect(formatYear(-1)).toBe('1 BCE');
      expect(formatYear(-100)).toBe('100 BCE');
      expect(formatYear(-1046)).toBe('1046 BCE');
    });

    it('should handle year 0 correctly', () => {
      expect(formatYear(0)).toBe('0 CE');
    });
  });

  describe('clamp', () => {
    it('should return value when within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(0, 0, 10)).toBe(0);
      expect(clamp(10, 0, 10)).toBe(10);
    });

    it('should return min when value is below range', () => {
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(-100, 0, 10)).toBe(0);
    });

    it('should return max when value is above range', () => {
      expect(clamp(15, 0, 10)).toBe(10);
      expect(clamp(100, 0, 10)).toBe(10);
    });

    it('should work with negative ranges', () => {
      expect(clamp(0, -10, -5)).toBe(-5);
      expect(clamp(-7, -10, -5)).toBe(-7);
      expect(clamp(-15, -10, -5)).toBe(-10);
    });

    it('should work with float values', () => {
      expect(clamp(3.5, 0, 10)).toBe(3.5);
      expect(clamp(-1.5, 0, 10)).toBe(0);
      expect(clamp(15.7, 0, 10)).toBe(10);
    });

    it('should handle equal min and max', () => {
      expect(clamp(5, 5, 5)).toBe(5);
      expect(clamp(0, 5, 5)).toBe(5);
      expect(clamp(10, 5, 5)).toBe(5);
    });
  });
});
