/**
 * Shared logging utility for History Atlas
 *
 * Centralizes all console logging so it can be:
 * - Easily disabled in production
 * - Toggled per category (battles, map, hooks, etc.)
 * - Redirected to error tracking services (e.g. Sentry)
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogCategory {
  battles: boolean;
  map: boolean;
  hooks: boolean;
  ui: boolean;
  performance: boolean;
  general: boolean;
}

const isDev = process.env.NODE_ENV !== 'production';

/**
 * Default categories enabled in development; off in production
 */
const DEFAULT_ENABLED: LogCategory = {
  battles: isDev,
  map: isDev,
  hooks: isDev,
  ui: isDev,
  performance: isDev,
  general: !isDev, // Only errors in prod for 'general'
};

let enabled = { ...DEFAULT_ENABLED };

/**
 * Update which log categories are active.
 * Pass a partial object to selectively enable/disable.
 */
export function setLogEnabled(categories: Partial<LogCategory>): void {
  enabled = { ...enabled, ...categories };
}

function formatMessage(level: LogLevel, category: keyof LogCategory, message: string, _data?: unknown): string {
  const ts = new Date().toISOString().slice(11, 23);
  return `[${ts}][${level.toUpperCase()}][${category}] ${message}`;
}

function shouldLog(level: LogLevel, category: keyof LogCategory): boolean {
  if (!enabled[category]) return false;
  if (level === 'error') return true; // Always log errors
  if (level === 'warn') return true; // Always log warnings
  return isDev; // Only log debug/info in development
}

function log(level: LogLevel, category: keyof LogCategory, message: string, data?: unknown): void {
  if (!shouldLog(level, category)) return;

  const formatted = formatMessage(level, category, message);

  switch (level) {
    case 'debug':
      if (isDev) console.debug(formatted, data ?? '');
      break;
    case 'info':
      console.info(formatted, data ?? '');
      break;
    case 'warn':
      console.warn(formatted, data ?? '');
      break;
    case 'error':
      console.error(formatted, data ?? '');
      break;
  }
}

export const logger = {
  debug: (category: keyof LogCategory, message: string, data?: unknown) =>
    log('debug', category, message, data),
  info: (category: keyof LogCategory, message: string, data?: unknown) =>
    log('info', category, message, data),
  warn: (category: keyof LogCategory, message: string, data?: unknown) =>
    log('warn', category, message, data),
  error: (category: keyof LogCategory, message: string, data?: unknown) =>
    log('error', category, message, data),

  /**
   * Log battle-related events (selection, comparison, etc.)
   */
  battles: {
    debug: (msg: string, data?: unknown) => logger.debug('battles', msg, data),
    info: (msg: string, data?: unknown) => logger.info('battles', msg, data),
    warn: (msg: string, data?: unknown) => logger.warn('battles', msg, data),
    error: (msg: string, data?: unknown) => logger.error('battles', msg, data),
  },

  /**
   * Log map-related events (marker clicks, popup opens, boundary changes)
   */
  map: {
    debug: (msg: string, data?: unknown) => logger.debug('map', msg, data),
    info: (msg: string, data?: unknown) => logger.info('map', msg, data),
    warn: (msg: string, data?: unknown) => logger.warn('map', msg, data),
    error: (msg: string, data?: unknown) => logger.error('map', msg, data),
  },

  /**
   * Log React hook state changes and side effects
   */
  hooks: {
    debug: (msg: string, data?: unknown) => logger.debug('hooks', msg, data),
    info: (msg: string, data?: unknown) => logger.info('hooks', msg, data),
    warn: (msg: string, data?: unknown) => logger.warn('hooks', msg, data),
    error: (msg: string, data?: unknown) => logger.error('hooks', msg, data),
  },

  /**
   * Log UI interaction events
   */
  ui: {
    debug: (msg: string, data?: unknown) => logger.debug('ui', msg, data),
    info: (msg: string, data?: unknown) => logger.info('ui', msg, data),
    warn: (msg: string, data?: unknown) => logger.warn('ui', msg, data),
    error: (msg: string, data?: unknown) => logger.error('ui', msg, data),
  },

  /**
   * Log performance-related events (render times, lazy loads, etc.)
   */
  performance: {
    debug: (msg: string, data?: unknown) => logger.debug('performance', msg, data),
    info: (msg: string, data?: unknown) => logger.info('performance', msg, data),
    warn: (msg: string, data?: unknown) => logger.warn('performance', msg, data),
    error: (msg: string, data?: unknown) => logger.error('performance', msg, data),
  },

  /**
   * General-purpose logging
   */
  general: {
    debug: (msg: string, data?: unknown) => logger.debug('general', msg, data),
    info: (msg: string, data?: unknown) => logger.info('general', msg, data),
    warn: (msg: string, data?: unknown) => logger.warn('general', msg, data),
    error: (msg: string, data?: unknown) => logger.error('general', msg, data),
  },
};

export default logger;
