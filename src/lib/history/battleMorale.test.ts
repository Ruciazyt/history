import { describe, it, expect } from 'vitest';
import { 
  getMoraleFactorLabel, 
  getMoraleImpactLabel, 
  getMoraleSeverityLabel,
  getInitialMoraleLabel,
  hasMoraleData,
  getBattlesWithMorale,
  getMoraleFactorStats,
  getAllMoraleFactorStats,
  getMostCommonMoraleFactorTypes,
  getMoraleFactorsBySide,
  getMoraleOutcomeCorrelation,
  getBattlesWithMostMoraleFactors,
  getMoraleSeverityDistribution,
  getMoraleShiftOutcomeCorrelation,
  getMoraleSummary,
  getMoraleInsights
} from './battleMorale';
import type { Event, MoraleFactorType, MoraleImpact, MoraleSeverity, InitialMoraleLevel } from './types';

// Mock events data
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
      moraleFactors: [
        {
          type: 'leadership',
          description: '白起率领秦军，指挥卓越',
          side: 'attacker',
          impact: 'positive',
          severity: 'critical'
        },
        {
          type: 'morale-crisis',
          description: '赵军被围，士气低落',
          side: 'defender',
          impact: 'negative',
          severity: 'critical'
        },
        {
          type: 'fatigue',
          description: '长期围困，士兵疲惫',
          side: 'defender',
          impact: 'negative',
          severity: 'major'
        }
      ],
      moraleShifts: [
        {
          description: '秦军包围成功，士气大振',
          phase: '包围阶段',
          direction: 'up',
          side: 'attacker',
          magnitude: 'large'
        },
        {
          description: '赵军断粮，士气崩溃',
          phase: '相持阶段',
          direction: 'down',
          side: 'defender',
          magnitude: 'large'
        }
      ]
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
      moraleFactors: [
        {
          type: 'motivation',
          description: '齐军为复仇而战',
          side: 'attacker',
          impact: 'positive',
          severity: 'major'
        },
        {
          type: 'discipline',
          description: '齐军纪律严明',
          side: 'attacker',
          impact: 'positive',
          severity: 'minor'
        }
      ]
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
      moraleFactors: [
        {
          type: 'loyalty',
          description: '晋军忠诚度极高',
          side: 'attacker',
          impact: 'positive',
          severity: 'major'
        }
      ]
    },
  },
  {
    id: 'battle-4',
    entityId: 'period-warring-states',
    year: -506,
    titleKey: 'battle.baiju',
    summaryKey: 'battle.baiju.desc',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '吴国', defender: '楚国' },
      result: 'attacker_win',
      moraleFactors: []
    },
  },
  {
    id: 'battle-5',
    entityId: 'period-zhou',
    year: -1046,
    titleKey: 'battle.mupo',
    summaryKey: 'battle.mupo.desc',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '周', defender: '商' },
      result: 'attacker_win',
      moraleFactors: [
        {
          type: 'morale-boost',
          description: '周军得到民众支持',
          side: 'attacker',
          impact: 'positive',
          severity: 'major'
        },
        {
          type: 'fear',
          description: '商军畏惧周军威名',
          side: 'defender',
          impact: 'negative',
          severity: 'major'
        }
      ],
      moraleShifts: [
        {
          description: '商军倒戈，局势逆转',
          phase: '决战阶段',
          direction: 'down',
          side: 'defender',
          magnitude: 'large'
        }
      ]
    },
  },
];

describe('battleMorale', () => {
  describe('getMoraleFactorLabel', () => {
    it('should return correct label for leadership', () => {
      expect(getMoraleFactorLabel('leadership')).toBe('领导力');
    });

    it('should return correct label for morale-boost', () => {
      expect(getMoraleFactorLabel('morale-boost')).toBe('士气提升');
    });

    it('should return correct label for morale-crisis', () => {
      expect(getMoraleFactorLabel('morale-crisis')).toBe('士气危机');
    });

    it('should return correct label for fatigue', () => {
      expect(getMoraleFactorLabel('fatigue')).toBe('疲劳');
    });

    it('should return 未知 for unknown type', () => {
      expect(getMoraleFactorLabel('unknown')).toBe('未知');
    });
  });

  describe('getMoraleImpactLabel', () => {
    it('should return correct label for positive', () => {
      expect(getMoraleImpactLabel('positive')).toBe('积极');
    });

    it('should return correct label for negative', () => {
      expect(getMoraleImpactLabel('negative')).toBe('消极');
    });

    it('should return correct label for neutral', () => {
      expect(getMoraleImpactLabel('neutral')).toBe('中性');
    });
  });

  describe('getMoraleSeverityLabel', () => {
    it('should return correct label for critical', () => {
      expect(getMoraleSeverityLabel('critical')).toBe('关键');
    });

    it('should return correct label for major', () => {
      expect(getMoraleSeverityLabel('major')).toBe('重大');
    });

    it('should return correct label for minor', () => {
      expect(getMoraleSeverityLabel('minor')).toBe('轻微');
    });
  });

  describe('getInitialMoraleLabel', () => {
    it('should return correct label for high', () => {
      expect(getInitialMoraleLabel('high')).toBe('高');
    });

    it('should return correct label for medium', () => {
      expect(getInitialMoraleLabel('medium')).toBe('中');
    });

    it('should return correct label for low', () => {
      expect(getInitialMoraleLabel('low')).toBe('低');
    });
  });

  describe('hasMoraleData', () => {
    it('should return true when events have morale data', () => {
      expect(hasMoraleData(mockEvents)).toBe(true);
    });

    it('should return false when no events have morale data', () => {
      const eventsWithoutMorale: Event[] = [
        { id: 'e1', entityId: 'era1', year: 100, titleKey: 't', summaryKey: 's', tags: ['war'], battle: {} },
      ];
      expect(hasMoraleData(eventsWithoutMorale)).toBe(false);
    });
  });

  describe('getBattlesWithMorale', () => {
    it('should return array', () => {
      const result = getBattlesWithMorale(mockEvents);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return correct number of battles with morale', () => {
      const result = getBattlesWithMorale(mockEvents);
      expect(result.length).toBe(4);
    });
  });

  describe('getMoraleFactorStats', () => {
    it('should return number for valid type', () => {
      const result = getMoraleFactorStats(mockEvents, 'leadership');
      expect(typeof result).toBe('number');
      expect(result).toBe(1);
    });

    it('should return 0 for type not present', () => {
      const result = getMoraleFactorStats(mockEvents, 'training');
      expect(result).toBe(0);
    });
  });

  describe('getAllMoraleFactorStats', () => {
    it('should return object with all factor types', () => {
      const result = getAllMoraleFactorStats(mockEvents);
      expect(result).toHaveProperty('leadership');
      expect(result).toHaveProperty('morale-boost');
      expect(result).toHaveProperty('morale-crisis');
      expect(result).toHaveProperty('fatigue');
      expect(result).toHaveProperty('fear');
    });

    it('should have non-negative values', () => {
      const result = getAllMoraleFactorStats(mockEvents);
      Object.values(result).forEach(val => {
        expect(val).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('getMostCommonMoraleFactorTypes', () => {
    it('should return array', () => {
      const result = getMostCommonMoraleFactorTypes(mockEvents, 5);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should respect topN parameter', () => {
      const result = getMostCommonMoraleFactorTypes(mockEvents, 3);
      expect(result.length).toBeLessThanOrEqual(3);
    });

    it('should contain type and count', () => {
      const result = getMostCommonMoraleFactorTypes(mockEvents, 5);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('type');
        expect(result[0]).toHaveProperty('count');
      }
    });
  });

  describe('getMoraleFactorsBySide', () => {
    it('should return object with attacker, defender, both', () => {
      const result = getMoraleFactorsBySide(mockEvents);
      expect(result).toHaveProperty('attacker');
      expect(result).toHaveProperty('defender');
      expect(result).toHaveProperty('both');
      expect(Array.isArray(result.attacker)).toBe(true);
      expect(Array.isArray(result.defender)).toBe(true);
      expect(Array.isArray(result.both)).toBe(true);
    });

    it('should correctly categorize factors by side', () => {
      const result = getMoraleFactorsBySide(mockEvents);
      expect(result.attacker.length).toBeGreaterThan(0);
      expect(result.defender.length).toBeGreaterThan(0);
    });
  });

  describe('getMoraleOutcomeCorrelation', () => {
    it('should return object with win rates and analysis', () => {
      const result = getMoraleOutcomeCorrelation(mockEvents);
      expect(result).toHaveProperty('positiveFactorsWinRate');
      expect(result).toHaveProperty('negativeFactorsWinRate');
      expect(result).toHaveProperty('analysis');
      expect(typeof result.positiveFactorsWinRate).toBe('number');
      expect(typeof result.negativeFactorsWinRate).toBe('number');
      expect(typeof result.analysis).toBe('string');
    });
  });

  describe('getBattlesWithMostMoraleFactors', () => {
    it('should return array', () => {
      const result = getBattlesWithMostMoraleFactors(mockEvents, 5);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should respect topN parameter', () => {
      const result = getBattlesWithMostMoraleFactors(mockEvents, 3);
      expect(result.length).toBeLessThanOrEqual(3);
    });

    it('should contain battle and factorCount', () => {
      const result = getBattlesWithMostMoraleFactors(mockEvents, 5);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('battle');
        expect(result[0]).toHaveProperty('factorCount');
      }
    });

    it('should sort by factor count descending', () => {
      const result = getBattlesWithMostMoraleFactors(mockEvents, 5);
      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].factorCount).toBeGreaterThanOrEqual(result[i + 1].factorCount);
      }
    });
  });

  describe('getMoraleSeverityDistribution', () => {
    it('should return object with severity levels', () => {
      const result = getMoraleSeverityDistribution(mockEvents);
      expect(result).toHaveProperty('critical');
      expect(result).toHaveProperty('major');
      expect(result).toHaveProperty('minor');
      expect(result).toHaveProperty('unknown');
    });

    it('should have non-negative values', () => {
      const result = getMoraleSeverityDistribution(mockEvents);
      Object.values(result).forEach(val => {
        expect(val).toBeGreaterThanOrEqual(0);
      });
    });

    it('should correctly count severity levels', () => {
      const result = getMoraleSeverityDistribution(mockEvents);
      expect(result.critical).toBe(2); // battle-1: leadership, morale-crisis
      expect(result.major).toBe(5); // battle-1: fatigue, battle-2: motivation, battle-3: loyalty, battle-5: morale-boost, fear
      expect(result.minor).toBe(1); // battle-2: discipline
    });
  });

  describe('getMoraleShiftOutcomeCorrelation', () => {
    it('should return object with shift win rates and analysis', () => {
      const result = getMoraleShiftOutcomeCorrelation(mockEvents);
      expect(result).toHaveProperty('shiftsUpWinRate');
      expect(result).toHaveProperty('shiftsDownWinRate');
      expect(result).toHaveProperty('noShiftWinRate');
      expect(result).toHaveProperty('analysis');
      expect(typeof result.shiftsUpWinRate).toBe('number');
      expect(typeof result.analysis).toBe('string');
    });
  });

  describe('getMoraleSummary', () => {
    it('should return comprehensive summary object', () => {
      const result = getMoraleSummary(mockEvents);
      expect(result).toHaveProperty('totalBattles');
      expect(result).toHaveProperty('battlesWithMorale');
      expect(result).toHaveProperty('factorCount');
      expect(result).toHaveProperty('factorTypes');
      expect(result).toHaveProperty('topFactorTypes');
      expect(result).toHaveProperty('sideDistribution');
      expect(result).toHaveProperty('severityDistribution');
      expect(result).toHaveProperty('correlation');
    });

    it('should have valid numeric values', () => {
      const result = getMoraleSummary(mockEvents);
      expect(result.totalBattles).toBe(5);
      expect(result.factorCount).toBeGreaterThan(0);
    });
  });

  describe('getMoraleInsights', () => {
    it('should return array of strings', () => {
      const result = getMoraleInsights(mockEvents);
      expect(Array.isArray(result)).toBe(true);
      result.forEach(insight => {
        expect(typeof insight).toBe('string');
      });
    });

    it('should return at least one insight', () => {
      const result = getMoraleInsights(mockEvents);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return "暂无士气数据" for events without morale data', () => {
      const eventsWithoutMorale: Event[] = [
        { id: 'e1', entityId: 'era1', year: 100, titleKey: 't', summaryKey: 's', tags: ['war'], battle: {} },
      ];
      const result = getMoraleInsights(eventsWithoutMorale);
      expect(result).toEqual(['暂无士气数据']);
    });
  });
});
