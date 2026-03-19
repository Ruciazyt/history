import { describe, it, expect } from 'vitest';
import { formatYear, clamp, truncate, groupBy, sortBy, uniqueBy, get, isEmpty, generateId, pick, omit, arraysEqual, toOrdinal, percentage, formatNumberWithUnit, parseYear, isEvent, hasBattleData, isArray, isString, isNumber, isObject, capitalize, camelToKebab, kebabToCamel, range, average, sum, shallowEqual } from './utils';
import type { Event } from './types';

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

  describe('truncate', () => {
    it('should return original string if shorter than maxLength', () => {
      expect(truncate('hello', 10)).toBe('hello');
      expect(truncate('hello', 5)).toBe('hello');
    });

    it('should truncate and add ellipsis if longer than maxLength', () => {
      expect(truncate('hello world', 8)).toBe('hello...');
      expect(truncate('这是一段中文', 5)).toBe('这是...');
    });
  });

  describe('groupBy', () => {
    it('should group array items by key function', () => {
      const items = [
        { type: 'a', value: 1 },
        { type: 'b', value: 2 },
        { type: 'a', value: 3 },
      ];
      const grouped = groupBy(items, item => item.type);
      expect(grouped).toEqual({
        a: [{ type: 'a', value: 1 }, { type: 'a', value: 3 }],
        b: [{ type: 'b', value: 2 }],
      });
    });
  });

  describe('sortBy', () => {
    it('should sort array by numeric key in ascending order', () => {
      const items = [{ value: 3 }, { value: 1 }, { value: 2 }];
      const sorted = sortBy(items, item => item.value);
      expect(sorted).toEqual([{ value: 1 }, { value: 2 }, { value: 3 }]);
    });

    it('should sort array in descending order', () => {
      const items = [{ value: 3 }, { value: 1 }, { value: 2 }];
      const sorted = sortBy(items, item => item.value, 'desc');
      expect(sorted).toEqual([{ value: 3 }, { value: 2 }, { value: 1 }]);
    });
  });

  describe('uniqueBy', () => {
    it('should remove duplicates by key function', () => {
      const items = [
        { id: 'a', value: 1 },
        { id: 'b', value: 2 },
        { id: 'a', value: 3 },
      ];
      const unique = uniqueBy(items, item => item.id);
      expect(unique).toHaveLength(2);
      expect(unique[0].id).toBe('a');
    });
  });

  describe('get', () => {
    it('should safely access nested object property', () => {
      const obj = { a: { b: { c: 'value' } } };
      expect(get(obj, 'a.b.c')).toBe('value');
      expect(get(obj, 'a.b.d', 'default')).toBe('default');
      expect(get(null, 'a.b')).toBeUndefined();
    });
  });

  describe('isEmpty', () => {
    it('should return true for null/undefined', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });

    it('should return true for empty strings', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true);
    });

    it('should return true for empty arrays', () => {
      expect(isEmpty([])).toBe(true);
    });

    it('should return true for empty objects', () => {
      expect(isEmpty({})).toBe(true);
    });

    it('should return false for non-empty values', () => {
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty([1, 2])).toBe(false);
      expect(isEmpty({ a: 1 })).toBe(false);
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it('should include prefix if provided', () => {
      const id = generateId('test');
      expect(id.startsWith('test-')).toBe(true);
    });
  });

  describe('pick', () => {
    it('should pick only specified keys', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const picked = pick(obj, ['a', 'c']);
      expect(picked).toEqual({ a: 1, c: 3 });
    });
  });

  describe('omit', () => {
    it('should omit specified keys', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const omitted = omit(obj, ['b']);
      expect(omitted).toEqual({ a: 1, c: 3 });
    });
  });

  describe('arraysEqual', () => {
    it('should return true for equal arrays', () => {
      expect(arraysEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    });

    it('should return false for unequal arrays', () => {
      expect(arraysEqual([1, 2], [1, 2, 3])).toBe(false);
      expect(arraysEqual([1, 2, 3], [3, 2, 1])).toBe(false);
    });
  });

  describe('toOrdinal', () => {
    it('should convert numbers to ordinal strings', () => {
      expect(toOrdinal(1)).toBe('1st');
      expect(toOrdinal(2)).toBe('2nd');
      expect(toOrdinal(3)).toBe('3rd');
      expect(toOrdinal(4)).toBe('4th');
      expect(toOrdinal(11)).toBe('11th');
      expect(toOrdinal(21)).toBe('21st');
    });
  });

  describe('percentage', () => {
    it('should calculate percentage', () => {
      expect(percentage(50, 100)).toBe(50);
      expect(percentage(1, 3)).toBe(33);
      expect(percentage(1, 4)).toBe(25);
    });

    it('should handle zero total', () => {
      expect(percentage(10, 0)).toBe(0);
    });
  });

  describe('formatNumberWithUnit', () => {
    it('should format numbers with Chinese units', () => {
      expect(formatNumberWithUnit(100)).toBe('100');
      expect(formatNumberWithUnit(10000)).toBe('1.0万');
      expect(formatNumberWithUnit(50000)).toBe('5.0万');
      expect(formatNumberWithUnit(100000000)).toBe('1.0亿');
      expect(formatNumberWithUnit(200000000)).toBe('2.0亿');
    });
  });

  describe('parseYear', () => {
    it('should parse BCE years', () => {
      expect(parseYear('前260')).toBe(-260);
      expect(parseYear('前1046')).toBe(-1046);
    });

    it('should parse CE years', () => {
      expect(parseYear('2024')).toBe(2024);
    });
  });

  describe('type guards', () => {
    it('isEvent should detect valid Event objects', () => {
      const validEvent: Event = {
        id: 'test',
        entityId: 'test',
        year: 2024,
        titleKey: 'test',
        summaryKey: 'test',
      };
      expect(isEvent(validEvent)).toBe(true);
      expect(isEvent({})).toBe(false);
      expect(isEvent(null)).toBe(false);
    });

    it('hasBattleData should detect events with battle data', () => {
      const eventWithBattle: Event = {
        id: 'test',
        entityId: 'test',
        year: 2024,
        titleKey: 'test',
        summaryKey: 'test',
        battle: {
          belligerents: { attacker: 'A', defender: 'B' },
        },
      };
      const eventWithoutBattle: Event = {
        id: 'test',
        entityId: 'test',
        year: 2024,
        titleKey: 'test',
        summaryKey: 'test',
      };
      expect(hasBattleData(eventWithBattle)).toBe(true);
      expect(hasBattleData(eventWithoutBattle)).toBe(false);
    });

    it('isArray should detect arrays', () => {
      expect(isArray([])).toBe(true);
      expect(isArray([1, 2, 3])).toBe(true);
      expect(isArray('test')).toBe(false);
      expect(isArray({})).toBe(false);
    });

    it('isString should detect strings', () => {
      expect(isString('test')).toBe(true);
      expect(isString('')).toBe(true);
      expect(isString(123)).toBe(false);
    });

    it('isNumber should detect numbers', () => {
      expect(isNumber(123)).toBe(true);
      expect(isNumber(0)).toBe(true);
      expect(isNumber(NaN)).toBe(false);
      expect(isNumber('123')).toBe(false);
    });

    it('isObject should detect objects', () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ a: 1 })).toBe(true);
      expect(isObject([])).toBe(false);
      expect(isObject(null)).toBe(false);
    });
  });

  describe('string utilities', () => {
    it('capitalize should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('')).toBe('');
    });

    it('camelToKebab should convert camelCase to kebab-case', () => {
      expect(camelToKebab('helloWorld')).toBe('hello-world');
      expect(camelToKebab('battleResult')).toBe('battle-result');
    });

    it('kebabToCamel should convert kebab-case to camelCase', () => {
      expect(kebabToCamel('hello-world')).toBe('helloWorld');
      expect(kebabToCamel('battle-result')).toBe('battleResult');
    });
  });

  describe('array utilities', () => {
    it('range should generate number range', () => {
      expect(range(0, 5)).toEqual([0, 1, 2, 3, 4]);
      expect(range(0, 5, 2)).toEqual([0, 2, 4]);
    });

    it('average should calculate average', () => {
      expect(average([1, 2, 3, 4, 5])).toBe(3);
      expect(average([])).toBe(0);
    });

    it('sum should calculate sum', () => {
      expect(sum([1, 2, 3, 4, 5])).toBe(15);
      expect(sum([])).toBe(0);
    });
  });

  describe('shallowEqual', () => {
    it('should compare objects shallowly', () => {
      expect(shallowEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
      expect(shallowEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
      expect(shallowEqual({ a: 1, b: 2 }, { a: 1, c: 2 })).toBe(false);
    });
  });
});
