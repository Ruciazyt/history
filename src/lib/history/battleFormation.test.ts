import { describe, it, expect } from 'vitest';
import {
  getFormationLabel,
  getFormationRoleLabel,
  hasFormationData,
  getUniqueFormationTypes,
  getFormationTypeStats,
  getAllFormationTypeStats,
  getBattlesByFormation,
  getMostUsedFormations,
  getBattleFormations,
  getFormationBySide,
  getFormationOutcomeCorrelation,
  getMostEffectiveFormations,
  getBattlesWithFormationCount,
  getInnovativeFormationBattles,
  getFormationCharacteristicsStats,
  getMostCommonFormationCharacteristics,
  getFormationSummary,
  getFormationInsights,
} from './battleFormation';
import type { Event, BattleFormationData } from './types';

const mockEvents: Event[] = [
  {
    id: 'battle-1',
    entityId: 'period-warring-states',
    year: -260,
    titleKey: 'battle.changping',
    summaryKey: 'battle.changping.desc',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '秦国', defender: '赵国' },
      result: 'attacker_win',
      formations: [
        {
          formation: 'encirclement',
          description: '秦军包围赵军',
          side: 'attacker',
          characteristics: ['包围', '持久战'],
          isInnovative: true,
        },
      ],
    },
  },
  {
    id: 'battle-2',
    entityId: 'period-warring-states',
    year: -341,
    titleKey: 'battle.maling',
    summaryKey: 'battle.maling.desc',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '齐国', defender: '魏国' },
      result: 'attacker_win',
      formations: [
        {
          formation: 'long-wedge',
          description: '锥形阵突破',
          side: 'attacker',
          characteristics: ['伏击', '突击'],
        },
      ],
    },
  },
  {
    id: 'battle-3',
    entityId: 'period-warring-states',
    year: -632,
    titleKey: 'battle.chengpu',
    summaryKey: 'battle.chengpu.desc',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '晋国', defender: '楚国' },
      result: 'attacker_win',
      formations: [
        {
          formation: 'flanking',
          description: '侧翼夹击',
          side: 'attacker',
          characteristics: ['夹击', '灵活'],
        },
        {
          formation: 'defensive',
          description: '防守反击',
          side: 'defender',
          characteristics: ['防守'],
        },
      ],
    },
  },
  {
    id: 'battle-4',
    entityId: 'qin',
    year: -207,
    titleKey: 'battle Julu',
    summaryKey: 'battle Julu desc',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '刘邦', defender: '秦军' },
      result: 'attacker_win',
      formations: [
        {
          formation: 'frontal-attack',
          description: '正面突击',
          side: 'attacker',
          characteristics: ['突击', '勇猛'],
        },
      ],
    },
  },
  {
    id: 'battle-5',
    entityId: 'han',
    year: -200,
    titleKey: 'battle Gaixia',
    summaryKey: 'battle Gaixia desc',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '刘邦', defender: '项羽' },
      result: 'defender_win',
      formations: [
        {
          formation: 'encirclement',
          description: '十面埋伏',
          side: 'attacker',
          characteristics: ['包围', '埋伏'],
        },
      ],
    },
  },
  {
    id: 'event-1',
    entityId: 'period-warring-states',
    year: -300,
    titleKey: 'event.1',
    summaryKey: 'event.1.desc',
    tags: ['event'],
  },
];

describe('battleFormation', () => {
  describe('getFormationLabel', () => {
    it('should return correct Chinese label for formation types', () => {
      expect(getFormationLabel('long-wedge')).toBe('锥形阵');
      expect(getFormationLabel('frontal-attack')).toBe('正面突击');
      expect(getFormationLabel('flanking')).toBe('侧翼攻击');
      expect(getFormationLabel('encirclement')).toBe('包围阵型');
      expect(getFormationLabel('defensive')).toBe('防御阵型');
      expect(getFormationLabel('retreating')).toBe('诱敌深入');
      expect(getFormationLabel('center-break')).toBe('中央突破');
      expect(getFormationLabel('skirmish')).toBe('散兵阵型');
      expect(getFormationLabel('cavalry-flank')).toBe('骑兵侧翼');
      expect(getFormationLabel('chariot-charge')).toBe('战车冲击');
      expect(getFormationLabel('mixed-formation')).toBe('混合阵型');
      expect(getFormationLabel('unknown')).toBe('未知阵型');
    });

    it('should return unknown for invalid formation', () => {
      expect(getFormationLabel('invalid' as any)).toBe('未知');
    });
  });

  describe('getFormationRoleLabel', () => {
    it('should return correct Chinese label for roles', () => {
      expect(getFormationRoleLabel('attacker')).toBe('进攻方');
      expect(getFormationRoleLabel('defender')).toBe('防守方');
      expect(getFormationRoleLabel('both')).toBe('双方');
    });
  });

  describe('hasFormationData', () => {
    it('should return true when events have formation data', () => {
      expect(hasFormationData(mockEvents)).toBe(true);
    });

    it('should return false when no events have formation data', () => {
      const eventsWithoutFormation: Event[] = [
        { id: 'e1', entityId: 'era1', year: 100, titleKey: 't', summaryKey: 's', tags: ['war'], battle: {} },
      ];
      expect(hasFormationData(eventsWithoutFormation)).toBe(false);
    });
  });

  describe('getUniqueFormationTypes', () => {
    it('should return all unique formation types', () => {
      const types = getUniqueFormationTypes(mockEvents);
      expect(types).toContain('encirclement');
      expect(types).toContain('long-wedge');
      expect(types).toContain('flanking');
      expect(types).toContain('defensive');
      expect(types).toContain('frontal-attack');
    });
  });

  describe('getFormationTypeStats', () => {
    it('should return correct count for specific formation', () => {
      expect(getFormationTypeStats(mockEvents, 'encirclement')).toBe(2);
      expect(getFormationTypeStats(mockEvents, 'long-wedge')).toBe(1);
      expect(getFormationTypeStats(mockEvents, 'flanking')).toBe(1);
    });
  });

  describe('getAllFormationTypeStats', () => {
    it('should return stats for all formation types', () => {
      const stats = getAllFormationTypeStats(mockEvents);
      expect(stats.encirclement).toBe(2);
      // Verify stats object has encirclement key with count 2
      expect(Object.keys(stats).length).toBeGreaterThan(0);
    });
  });

  describe('getBattlesByFormation', () => {
    it('should filter battles by formation type', () => {
      const battles = getBattlesByFormation(mockEvents, 'encirclement');
      expect(battles.length).toBe(2);
      expect(battles.map(b => b.id)).toContain('battle-1');
      expect(battles.map(b => b.id)).toContain('battle-5');
    });
  });

  describe('getMostUsedFormations', () => {
    it('should return formations sorted by count', () => {
      const mostUsed = getMostUsedFormations(mockEvents, 3);
      expect(mostUsed[0].formation).toBe('encirclement');
      expect(mostUsed[0].count).toBe(2);
    });

    it('should respect limit parameter', () => {
      const mostUsed = getMostUsedFormations(mockEvents, 2);
      expect(mostUsed.length).toBe(2);
    });
  });

  describe('getBattleFormations', () => {
    it('should return formations for a specific battle', () => {
      const battle = mockEvents[0];
      const formations = getBattleFormations(battle);
      expect(formations.length).toBe(1);
      expect(formations[0].formation).toBe('encirclement');
    });

    it('should return empty array for battle without formations', () => {
      const battle = mockEvents[5];
      const formations = getBattleFormations(battle);
      expect(formations.length).toBe(0);
    });
  });

  describe('getFormationBySide', () => {
    it('should return formations used by attacker', () => {
      const formations = getFormationBySide(mockEvents, 'attacker');
      expect(formations.length).toBeGreaterThan(0);
      expect(formations[0].formation).toBe('encirclement');
    });

    it('should return formations used by defender', () => {
      const formations = getFormationBySide(mockEvents, 'defender');
      expect(formations.length).toBeGreaterThan(0);
      expect(formations[0].formation).toBe('defensive');
    });
  });

  describe('getFormationOutcomeCorrelation', () => {
    it('should return correlation between formations and outcomes', () => {
      const correlation = getFormationOutcomeCorrelation(mockEvents);
      expect(correlation.encirclement.total).toBe(2);
      expect(correlation.encirclement.attacker_win).toBe(1);
      expect(correlation.encirclement.defender_win).toBe(1);
    });
  });

  describe('getMostEffectiveFormations', () => {
    it('should return formations sorted by win rate', () => {
      const effective = getMostEffectiveFormations(mockEvents, 1);
      expect(effective.length).toBeGreaterThan(0);
    });

    it('should respect minBattles parameter', () => {
      const effective = getMostEffectiveFormations(mockEvents, 3);
      effective.forEach(e => expect(e.total).toBeGreaterThanOrEqual(3));
    });
  });

  describe('getBattlesWithFormationCount', () => {
    it('should return count of battles with formation data', () => {
      expect(getBattlesWithFormationCount(mockEvents)).toBe(5);
    });
  });

  describe('getInnovativeFormationBattles', () => {
    it('should return battles with innovative formations', () => {
      const innovative = getInnovativeFormationBattles(mockEvents);
      expect(innovative.length).toBe(1);
      expect(innovative[0].id).toBe('battle-1');
    });
  });

  describe('getFormationCharacteristicsStats', () => {
    it('should return stats for formation characteristics', () => {
      const stats = getFormationCharacteristicsStats(mockEvents);
      expect(stats['包围']).toBe(2);
      expect(stats['伏击']).toBe(1);
    });
  });

  describe('getMostCommonFormationCharacteristics', () => {
    it('should return most common characteristics', () => {
      const common = getMostCommonFormationCharacteristics(mockEvents, 3);
      expect(common.length).toBeGreaterThan(0);
      expect(common[0].characteristic).toBe('包围');
    });
  });

  describe('getFormationSummary', () => {
    it('should return complete summary', () => {
      const summary = getFormationSummary(mockEvents);
      expect(summary.totalBattles).toBe(5);
      expect(summary.battlesWithFormation).toBe(5);
      expect(summary.mostUsedFormations.length).toBeGreaterThan(0);
      expect(summary.mostEffectiveFormations.length).toBeGreaterThan(0);
    });
  });

  describe('getFormationInsights', () => {
    it('should return insights array', () => {
      const insights = getFormationInsights(mockEvents);
      expect(insights.length).toBeGreaterThan(0);
      expect(typeof insights[0]).toBe('string');
    });

    it('should return empty array when no formation data', () => {
      const eventsWithoutFormation: Event[] = [
        { id: 'e1', entityId: 'era1', year: 100, titleKey: 't', summaryKey: 's', tags: ['war'], battle: {} },
      ];
      const insights = getFormationInsights(eventsWithoutFormation);
      expect(insights).toEqual(['暂无阵型数据']);
    });
  });
});
