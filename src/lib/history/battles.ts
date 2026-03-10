import type { Event } from './types';

/**
 * Filter events to get only battles (wars)
 */
export function getBattles(events: Event[]): Event[] {
  return events.filter((e) => e.tags?.includes('war'));
}

/**
 * Get battle label in Chinese
 */
export function getBattleResultLabel(result?: string): string {
  if (!result) return '';
  const labels: Record<string, string> = {
    attacker_win: '进攻方胜利',
    defender_win: '防守方胜利',
    draw: '平局',
    inconclusive: '胜负未明',
  };
  return labels[result] || '';
}
