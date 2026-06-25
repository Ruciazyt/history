import { describe, it, expect } from 'vitest';
import { formatYear, clamp, matchPath } from './utils';

describe('utils', () => {
  describe('formatYear', () => {
    it('should format positive years as CE', () => {
      expect(formatYear(0)).toBe('1 CE'); // Year 0 does not exist historically; mapped to 1 CE
      expect(formatYear(1)).toBe('1 CE');
      expect(formatYear(2024)).toBe('2024 CE');
    });

    it('should format negative years as BCE', () => {
      expect(formatYear(-1)).toBe('1 BCE');
      expect(formatYear(-100)).toBe('100 BCE');
      expect(formatYear(-1046)).toBe('1046 BCE');
    });

    it('should handle year 0 correctly (maps to 1 CE — no year 0 exists historically)', () => {
      expect(formatYear(0)).toBe('1 CE');
    });

    it('should format positive years in Chinese locale (zh)', () => {
      expect(formatYear(1, 'zh')).toBe('公元1年');
      expect(formatYear(2024, 'zh')).toBe('公元2024年');
    });

    it('should format negative years in Chinese locale (zh)', () => {
      expect(formatYear(-1, 'zh')).toBe('公元前1年');
      expect(formatYear(-100, 'zh')).toBe('公元前100年');
      expect(formatYear(-1046, 'zh')).toBe('公元前1046年');
    });

    it('should handle year 0 in Chinese locale (zh) — maps to 公元1年 (no year 0 historically)', () => {
      expect(formatYear(0, 'zh')).toBe('公元1年');
    });

    it('should format positive years in Japanese locale (ja)', () => {
      expect(formatYear(1, 'ja')).toBe('公元1年');
      expect(formatYear(2024, 'ja')).toBe('公元2024年');
    });

    it('should format negative years in Japanese locale (ja)', () => {
      expect(formatYear(-1, 'ja')).toBe('公元前1年');
      expect(formatYear(-100, 'ja')).toBe('公元前100年');
    });

    it('should handle year 0 in Japanese locale (ja) — maps to 公元1年 (no year 0 historically)', () => {
      expect(formatYear(0, 'ja')).toBe('公元1年');
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

  describe('matchPath', () => {
    it('should match root locale path', () => {
      expect(matchPath('/zh', 'zh', '')).toBe(true);
      expect(matchPath('/zh/', 'zh', '')).toBe(true);
      expect(matchPath('/en', 'en', '')).toBe(true);
    });

    it('should NOT match root when path is non-empty', () => {
      expect(matchPath('/zh/timeline', 'zh', '')).toBe(false);
    });

    it('should match sub-paths', () => {
      expect(matchPath('/zh/timeline', 'zh', '/timeline')).toBe(true);
      expect(matchPath('/zh/battles', 'zh', '/battles')).toBe(true);
      expect(matchPath('/zh/on-this-day', 'zh', '/on-this-day')).toBe(true);
      expect(matchPath('/en/quiz', 'en', '/quiz')).toBe(true);
      expect(matchPath('/ja/world', 'ja', '/world')).toBe(true);
    });

    it('should handle trailing slash on sub-paths', () => {
      expect(matchPath('/zh/timeline/', 'zh', '/timeline')).toBe(true);
    });

    it('should not match wrong locale', () => {
      expect(matchPath('/en/timeline', 'zh', '/timeline')).toBe(false);
    });

    it('should not match wrong path', () => {
      expect(matchPath('/zh/battles', 'zh', '/timeline')).toBe(false);
    });
  });
});
