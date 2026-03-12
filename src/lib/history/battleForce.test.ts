import { describe, it, expect } from 'vitest';
import {
  getForceUnitLabel,
  getAdvantageLabel,
  hasForceData,
  getBattlesWithForceData,
  getForceStats,
  getBattlesByForceAdvantage,
  getOutnumberedVictories,
  getSuperiorForceVictories,
  getForceRatio,
  getForceDifferenceCategory,
  getForceDifferenceLabel,
  getForceOutcomeCorrelation,
  getForceInsights,
  getForceSummary,
} from './battleForce';
import type { Event, BattleForceComparison } from './types';

const mockBattles: Event[] = [
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
      impact: 'decisive',
      scale: 'massive',
      forceComparison: {
        attacker: { strength: 500000, unitType: 'infantry', reliability: 'high' },
        defender: { strength: 450000, unitType: 'infantry', reliability: 'high' },
        advantage: 'attacker',
        difference: '秦军略占优势',
      },
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
      impact: 'major',
      scale: 'large',
      forceComparison: {
        attacker: { strength: 100000, unitType: 'mixed', reliability: 'medium' },
        defender: { strength: 100000, unitType: 'mixed', reliability: 'medium' },
        advantage: 'balanced',
        difference: '双方军力相当',
      },
    },
  },
  {
    id: 'battle-3',
    entityId: 'period-warring-states',
    year: -313,
    titleKey: 'battle.baiju',
    summaryKey: 'battle.baiju.desc',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '吴国', defender: '楚国' },
      result: 'attacker_win',
      impact: 'major',
      scale: 'large',
      forceComparison: {
        attacker: { strength: 30000, unitType: 'infantry', reliability: 'low' },
        defender: { strength: 200000, unitType: 'mixed', reliability: 'medium' },
        advantage: 'defender',
        difference: '楚军大幅领先',
      },
    },
  },
  {
    id: 'battle-4',
    entityId: 'han',
    year: -202,
    titleKey: 'battle.gaixia',
    summaryKey: 'battle.gaixia.desc',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '刘邦', defender: '项羽' },
      result: 'attacker_win',
      impact: 'decisive',
      scale: 'massive',
      forceComparison: {
        attacker: { strength: 400000, unitType: 'mixed', reliability: 'medium' },
        defender: { strength: 100000, unitType: 'cavalry', reliability: 'medium' },
        advantage: 'attacker',
        difference: '汉军大幅领先',
      },
    },
  },
  {
    id: 'battle-5',
    entityId: 'period-warring-states',
    year: -257,
    titleKey: 'battle.moye',
    summaryKey: 'battle.moye.desc',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '周武王', defender: '商纣王' },
      result: 'attacker_win',
      impact: 'decisive',
      scale: 'massive',
      // 无军力数据
    },
  },
  {
    id: 'battle-6',
    entityId: 'period-warring-states',
    year: -632,
    titleKey: 'battle.chengpu',
    summaryKey: 'battle.chengpu.desc',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '晋国', defender: '楚国' },
      result: 'defender_win',
      impact: 'major',
      scale: 'large',
      forceComparison: {
        attacker: { strength: 20000, unitType: 'chariot', reliability: 'high' },
        defender: { strength: 40000, unitType: 'chariot', reliability: 'high' },
        advantage: 'defender',
        difference: '楚军优势明显',
      },
    },
  },
];

describe('battleForce', () => {
  describe('getForceUnitLabel', () => {
    it('should return correct Chinese labels for unit types', () => {
      expect(getForceUnitLabel('infantry')).toBe('步兵');
      expect(getForceUnitLabel('cavalry')).toBe('骑兵');
      expect(getForceUnitLabel('chariot')).toBe('战车');
      expect(getForceUnitLabel('navy')).toBe('水军');
      expect(getForceUnitLabel('archer')).toBe('弓箭手');
      expect(getForceUnitLabel('mixed')).toBe('混合部队');
      expect(getForceUnitLabel('unknown')).toBe('未知');
    });

    it('should return unknown for undefined input', () => {
      expect(getForceUnitLabel(undefined)).toBe('未知');
    });
  });

  describe('getAdvantageLabel', () => {
    it('should return correct Chinese labels for advantage', () => {
      expect(getAdvantageLabel('attacker')).toBe('进攻方优势');
      expect(getAdvantageLabel('defender')).toBe('防守方优势');
      expect(getAdvantageLabel('balanced')).toBe('势均力敌');
      expect(getAdvantageLabel('unknown')).toBe('未知');
    });

    it('should return unknown for undefined input', () => {
      expect(getAdvantageLabel(undefined)).toBe('未知');
    });
  });

  describe('hasForceData', () => {
    it('should return true when battles have force data', () => {
      expect(hasForceData(mockBattles)).toBe(true);
    });

    it('should return false when no battles have force data', () => {
      const battlesWithoutForce: Event[] = [
        {
          id: 'b1',
          entityId: 'han',
          year: -200,
          titleKey: 'battle.test',
          summaryKey: 'battle.test.desc',
          tags: ['war'],
          battle: {
            belligerents: { attacker: 'A', defender: 'B' },
            result: 'attacker_win',
          },
        },
      ];
      expect(hasForceData(battlesWithoutForce)).toBe(false);
    });
  });

  describe('getBattlesWithForceData', () => {
    it('should return only battles with force data', () => {
      const result = getBattlesWithForceData(mockBattles);
      expect(result.length).toBe(5);
      expect(result.every(b => b.battle?.forceComparison !== undefined)).toBe(true);
    });
  });

  describe('getForceStats', () => {
    it('should calculate force statistics correctly', () => {
      const stats = getForceStats(mockBattles);
      
      expect(stats.total).toBe(5);
      expect(stats.withData).toBe(5);
      expect(stats.attackerAdvantage).toBe(2); // battle-1, battle-4
      expect(stats.defenderAdvantage).toBe(2); // battle-3, battle-6
      expect(stats.balanced).toBe(1); // battle-2
      expect(stats.unknown).toBe(0);
    });
  });

  describe('getBattlesByForceAdvantage', () => {
    it('should filter battles by advantage', () => {
      const attackerAdvantage = getBattlesByForceAdvantage(mockBattles, 'attacker');
      expect(attackerAdvantage.length).toBe(2);
      expect(attackerAdvantage.every(b => b.battle?.forceComparison?.advantage === 'attacker')).toBe(true);

      const defenderAdvantage = getBattlesByForceAdvantage(mockBattles, 'defender');
      expect(defenderAdvantage.length).toBe(2);

      const balanced = getBattlesByForceAdvantage(mockBattles, 'balanced');
      expect(balanced.length).toBe(1);
    });
  });

  describe('getOutnumberedVictories', () => {
    it('should find battles where the winner had fewer forces', () => {
      const outnumbered = getOutnumberedVictories(mockBattles);
      
      // battle-3: 吴国以3万胜楚国20万
      expect(outnumbered.length).toBe(1);
      expect(outnumbered[0].id).toBe('battle-3');
    });
  });

  describe('getSuperiorForceVictories', () => {
    it('should find battles where the winner had more forces', () => {
      const superior = getSuperiorForceVictories(mockBattles);
      
      // battle-1: 秦军50万胜赵军45万
      // battle-4: 汉军40万胜项羽10万
      // battle-6: 楚军4万胜晋军2万（防守方胜利且军力优势）
      expect(superior.length).toBe(3);
      expect(superior.some(b => b.id === 'battle-1')).toBe(true);
      expect(superior.some(b => b.id === 'battle-4')).toBe(true);
      expect(superior.some(b => b.id === 'battle-6')).toBe(true);
    });
  });

  describe('getForceRatio', () => {
    it('should calculate force ratio correctly', () => {
      const force1: BattleForceComparison = {
        attacker: { strength: 100 },
        defender: { strength: 50 },
      };
      expect(getForceRatio(force1)).toBe(2);

      const force2: BattleForceComparison = {
        attacker: { strength: 100 },
        defender: { strength: 100 },
      };
      expect(getForceRatio(force2)).toBe(1);

      const force3: BattleForceComparison = {
        attacker: { strength: 50 },
        defender: { strength: 100 },
      };
      expect(getForceRatio(force3)).toBe(0.5);
    });

    it('should return undefined for missing data', () => {
      const force: BattleForceComparison = {
        attacker: { strength: 100 },
        defender: {},
      };
      expect(getForceRatio(force)).toBeUndefined();
    });

    it('should return undefined when defender strength is zero', () => {
      const force: BattleForceComparison = {
        attacker: { strength: 100 },
        defender: { strength: 0 },
      };
      expect(getForceRatio(force)).toBeUndefined();
    });
  });

  describe('getForceDifferenceCategory', () => {
    it('should categorize force ratios correctly', () => {
      expect(getForceDifferenceCategory(3)).toBe('significant-attacker');
      expect(getForceDifferenceCategory(1.5)).toBe('slight-attacker');
      expect(getForceDifferenceCategory(1)).toBe('balanced');
      expect(getForceDifferenceCategory(0.7)).toBe('slight-defender');
      expect(getForceDifferenceCategory(0.3)).toBe('significant-defender');
      expect(getForceDifferenceCategory(undefined)).toBe('unknown');
    });
  });

  describe('getForceDifferenceLabel', () => {
    it('should return correct Chinese labels', () => {
      expect(getForceDifferenceLabel('significant-attacker')).toBe('进攻方大幅领先');
      expect(getForceDifferenceLabel('slight-attacker')).toBe('进攻方略占优势');
      expect(getForceDifferenceLabel('balanced')).toBe('势均力敌');
      expect(getForceDifferenceLabel('slight-defender')).toBe('防守方略占优势');
      expect(getForceDifferenceLabel('significant-defender')).toBe('防守方大幅领先');
      expect(getForceDifferenceLabel('unknown')).toBe('未知');
    });
  });

  describe('getForceOutcomeCorrelation', () => {
    it('should analyze correlation between force advantage and outcome', () => {
      const correlation = getForceOutcomeCorrelation(mockBattles);
      
      expect(correlation.length).toBe(5);
      
      const balanced = correlation.find(c => c.category === '势均力敌');
      expect(balanced).toBeDefined();
      expect(balanced!.total).toBe(1);
    });
  });

  describe('getForceInsights', () => {
    it('should generate insights from force data', () => {
      const insights = getForceInsights(mockBattles);
      
      expect(insights.length).toBeGreaterThan(0);
      expect(insights.some(i => i.includes('以少胜多'))).toBe(true);
    });

    it('should return default message when no data', () => {
      const battlesNoData: Event[] = [
        {
          id: 'b1',
          entityId: 'han',
          year: -200,
          titleKey: 'battle.test',
          summaryKey: 'battle.test.desc',
          tags: ['war'],
          battle: {
            belligerents: { attacker: 'A', defender: 'B' },
            result: 'attacker_win',
          },
        },
      ];
      const insights = getForceInsights(battlesNoData);
      expect(insights).toContain('暂无军力对比数据');
    });
  });

  describe('getForceSummary', () => {
    it('should return comprehensive force summary', () => {
      const summary = getForceSummary(mockBattles);
      
      expect(summary.overview.totalBattles).toBe(6);
      expect(summary.overview.battlesWithData).toBe(5);
      expect(summary.advantage.attacker).toBe(2);
      expect(summary.advantage.defender).toBe(2);
      expect(summary.advantage.balanced).toBe(1);
      expect(summary.famousOutnumberedVictories.length).toBeGreaterThan(0);
      expect(summary.correlation.length).toBe(5);
      expect(summary.insights.length).toBeGreaterThan(0);
    });

    it('should sort outnumbered victories by ratio ascending', () => {
      const summary = getForceSummary(mockBattles);
      
      if (summary.famousOutnumberedVictories.length > 1) {
        for (let i = 1; i < summary.famousOutnumberedVictories.length; i++) {
          expect(summary.famousOutnumberedVictories[i].ratio).toBeGreaterThanOrEqual(
            summary.famousOutnumberedVictories[i - 1].ratio
          );
        }
      }
    });
  });
});
