import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setLogEnabled, logger } from './logger';

describe('logger', () => {
  beforeEach(() => {
    // Reset to default enabled state before each test
    setLogEnabled({
      battles: true,
      map: true,
      hooks: true,
      ui: true,
      performance: true,
      general: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('setLogEnabled', () => {
    it('should enable a specific category', () => {
      expect(() => setLogEnabled({ battles: true })).not.toThrow();
    });

    it('should disable a specific category', () => {
      expect(() => setLogEnabled({ battles: false })).not.toThrow();
    });

    it('should accept multiple categories at once', () => {
      expect(() => setLogEnabled({ map: true, hooks: false })).not.toThrow();
    });
  });

  describe('logger structure', () => {
    it('should have debug, info, warn, error methods', () => {
      expect(typeof logger.debug).toBe('function');
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.error).toBe('function');
    });
  });

  describe('category loggers', () => {
    it('logger.battles should have debug, info, warn, error methods', () => {
      expect(typeof logger.battles.debug).toBe('function');
      expect(typeof logger.battles.info).toBe('function');
      expect(typeof logger.battles.warn).toBe('function');
      expect(typeof logger.battles.error).toBe('function');
    });

    it('logger.map should have debug, info, warn, error methods', () => {
      expect(typeof logger.map.debug).toBe('function');
      expect(typeof logger.map.info).toBe('function');
      expect(typeof logger.map.warn).toBe('function');
      expect(typeof logger.map.error).toBe('function');
    });

    it('logger.hooks should have debug, info, warn, error methods', () => {
      expect(typeof logger.hooks.debug).toBe('function');
      expect(typeof logger.hooks.info).toBe('function');
      expect(typeof logger.hooks.warn).toBe('function');
      expect(typeof logger.hooks.error).toBe('function');
    });

    it('logger.ui should have debug, info, warn, error methods', () => {
      expect(typeof logger.ui.debug).toBe('function');
      expect(typeof logger.ui.info).toBe('function');
      expect(typeof logger.ui.warn).toBe('function');
      expect(typeof logger.ui.error).toBe('function');
    });

    it('logger.performance should have debug, info, warn, error methods', () => {
      expect(typeof logger.performance.debug).toBe('function');
      expect(typeof logger.performance.info).toBe('function');
      expect(typeof logger.performance.warn).toBe('function');
      expect(typeof logger.performance.error).toBe('function');
    });

    it('logger.general should have debug, info, warn, error methods', () => {
      expect(typeof logger.general.debug).toBe('function');
      expect(typeof logger.general.info).toBe('function');
      expect(typeof logger.general.warn).toBe('function');
      expect(typeof logger.general.error).toBe('function');
    });
  });

  describe('LogLevel type coverage', () => {
    it('should accept all valid log levels without throwing', () => {
      // All four log levels should be callable without throwing
      // (actual console output depends on environment)
      expect(() => logger.debug('battles', 'debug msg')).not.toThrow();
      expect(() => logger.info('battles', 'info msg')).not.toThrow();
      expect(() => logger.warn('battles', 'warn msg')).not.toThrow();
      expect(() => logger.error('battles', 'error msg')).not.toThrow();
    });
  });

  describe('LogCategory type coverage', () => {
    it('should accept all valid category names', () => {
      const categories: Array<'battles' | 'map' | 'hooks' | 'ui' | 'performance' | 'general'> = [
        'battles', 'map', 'hooks', 'ui', 'performance', 'general'
      ];
      categories.forEach(cat => {
        expect(() => setLogEnabled({ [cat]: true })).not.toThrow();
        expect(() => setLogEnabled({ [cat]: false })).not.toThrow();
      });
    });

    it('should accept all category names with logger methods', () => {
      const cats = ['battles', 'map', 'hooks', 'ui', 'performance', 'general'] as const;
      cats.forEach(cat => {
        const catLogger = logger[cat];
        expect(() => catLogger.debug('msg')).not.toThrow();
        expect(() => catLogger.info('msg')).not.toThrow();
        expect(() => catLogger.warn('msg')).not.toThrow();
        expect(() => catLogger.error('msg')).not.toThrow();
      });
    });
  });

  describe('category logger with data parameter', () => {
    it('should accept optional data parameter without throwing', () => {
      const testData = { key: 'value', num: 123, nested: { foo: 'bar' } };
      
      expect(() => logger.battles.debug('msg', testData)).not.toThrow();
      expect(() => logger.battles.info('msg', testData)).not.toThrow();
      expect(() => logger.battles.warn('msg', testData)).not.toThrow();
      expect(() => logger.battles.error('msg', testData)).not.toThrow();
    });

    it('should accept undefined as data parameter', () => {
      expect(() => logger.battles.debug('msg', undefined)).not.toThrow();
      expect(() => logger.battles.info('msg', undefined)).not.toThrow();
    });

    it('should accept null as data parameter', () => {
      expect(() => logger.battles.debug('msg', null)).not.toThrow();
      expect(() => logger.battles.info('msg', null)).not.toThrow();
    });
  });

  describe('disabling categories', () => {
    it('should not throw when calling disabled category debug', () => {
      setLogEnabled({ battles: false });
      // Should not throw even when category is disabled
      expect(() => logger.battles.debug('silent')).not.toThrow();
    });

    it('should not throw when calling disabled category info', () => {
      setLogEnabled({ map: false });
      expect(() => logger.map.info('silent')).not.toThrow();
    });
  });

  describe('all category loggers exist on logger object', () => {
    it('should have all 6 category loggers', () => {
      expect(logger.battles).toBeDefined();
      expect(logger.map).toBeDefined();
      expect(logger.hooks).toBeDefined();
      expect(logger.ui).toBeDefined();
      expect(logger.performance).toBeDefined();
      expect(logger.general).toBeDefined();
    });
  });

  describe('setLogEnabled returns void', () => {
    it('should not return a value that needs to be used', () => {
      const result = setLogEnabled({ battles: true });
      // setLogEnabled mutates internal state, returns void
      expect(result).toBeUndefined();
    });
  });

});
