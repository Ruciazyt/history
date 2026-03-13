import { describe, it, expect } from 'vitest';
import type { Event, Era } from './types';
import { getBattleProfile, getProfileSummary, compareBattleProfiles, hasProfileData } from './battleProfile';

describe('battleProfile', () => {
  // 测试数据
  const testEras: Era[] = [
    { id: 'spring-autumn', nameKey: '春秋时期', startYear: -770, endYear: -476 },
    { id: 'warring-states', nameKey: '战国时期', startYear: -475, endYear: -221 },
  ];

  const testEvents: Event[] = [
    {
      id: 'battle-1',
      entityId: 'warring-states',
      year: -260,
      month: 9,
      titleKey: '长平之战',
      summaryKey: '秦国与赵国之间的大规模战役',
      tags: ['war'],
      battle: {
        result: 'attacker_win',
        scale: 'massive',
        impact: 'decisive',
        belligerents: {
          attacker: '秦国',
          defender: '赵国',
        },
        commanders: {
          attacker: ['白起'],
          defender: ['赵括'],
        },
        terrain: ['plains', 'hills'],
        weather: ['clear'],
        strategy: ['encirclement', 'offensive'],
        pacing: 'extended',
        timeOfDay: 'morning',
        turningPoints: [
          { type: 'commander-death', description: '赵括阵亡', party: 'defender', impact: 'negative' },
          { type: 'encirclement', description: '秦军包围', party: 'attacker', impact: 'positive' },
        ],
        duration: 46,
        formations: [
          { formation: 'encirclement', side: 'attacker', description: '包围阵型' },
          { formation: 'defensive', side: 'defender', description: '防御阵型' },
        ],
        aftermath: [
          { type: 'military-weakening', description: '赵国军事衰弱', severity: 'massive', scope: 'regional' },
        ],
        intelligence: [
          { type: 'deception', description: '秦军假装撤退', side: 'attacker', result: 'success' },
        ],
        causes: [
          { type: 'territorial-dispute', description: '领土争端', severity: 'major' },
        ],
        moraleFactors: [
          { type: 'leadership', description: '白起指挥得当', side: 'attacker', impact: 'positive', severity: 'critical' },
        ],
        initialMorale: {
          attacker: 'high',
          defender: 'medium',
        },
      },
    },
    {
      id: 'battle-2',
      entityId: 'warring-states',
      year: -342,
      month: 5,
      titleKey: '马陵之战',
      summaryKey: '齐国与魏国之间的伏击战',
      tags: ['war'],
      battle: {
        result: 'defender_win',
        scale: 'large',
        impact: 'major',
        belligerents: {
          attacker: '魏国',
          defender: '齐国',
        },
        commanders: {
          attacker: ['庞涓'],
          defender: ['孙膑'],
        },
        terrain: ['mountains', 'forest'],
        weather: ['foggy'],
        strategy: ['ambush', 'feigned-retreat'],
        pacing: 'surprise',
        turningPoints: [
          { type: 'ambush-triggered', description: '伏击触发', party: 'defender', impact: 'positive' },
        ],
        duration: 1,
        formations: [
          { formation: 'long-wedge', side: 'defender', description: '锥形阵' },
        ],
      },
    },
    {
      id: 'battle-3',
      entityId: 'spring-autumn',
      year: -632,
      month: 4,
      titleKey: '城濮之战',
      summaryKey: '晋国与楚国的争霸战',
      tags: ['war'],
      battle: {
        result: 'attacker_win',
        scale: 'medium',
        impact: 'major',
        belligerents: {
          attacker: '晋国',
          defender: '楚国',
        },
        commanders: {
          attacker: ['晋文公'],
          defender: ['楚成王'],
        },
        terrain: ['plains'],
        weather: ['clear'],
        strategy: ['defensive', 'alliance'],
        pacing: 'extended',
      },
    },
  ];

  describe('getBattleProfile', () => {
    it('should return null for non-existent battle', () => {
      const result = getBattleProfile(testEvents, testEras, 'non-existent');
      expect(result).toBeNull();
    });

    it('should return battle profile for existing battle', () => {
      const result = getBattleProfile(testEvents, testEras, 'battle-1');
      expect(result).not.toBeNull();
      expect(result?.basic.id).toBe('battle-1');
      expect(result?.basic.name).toBe('长平之战');
      expect(result?.basic.year).toBe(-260);
      expect(result?.basic.resultLabel).toBe('进攻方胜利');
    });

    it('should include terrain analysis', () => {
      const result = getBattleProfile(testEvents, testEras, 'battle-1');
      expect(result?.terrain.types).toContain('plains');
      expect(result?.terrain.types).toContain('hills');
      expect(result?.terrain.labels).toContain('平原');
      expect(result?.terrain.advantage).toBe('双方平衡');
    });

    it('should include weather analysis', () => {
      const result = getBattleProfile(testEvents, testEras, 'battle-1');
      expect(result?.weather.conditions).toContain('clear');
      expect(result?.weather.labels).toContain('晴天');
    });

    it('should include strategy analysis', () => {
      const result = getBattleProfile(testEvents, testEras, 'battle-1');
      expect(result?.strategy.tactics).toContain('encirclement');
      expect(result?.strategy.style).toBe('进攻型');
    });

    it('should include turning points', () => {
      const result = getBattleProfile(testEvents, testEras, 'battle-1');
      expect(result?.turningPoints.count).toBe(2);
      expect(result?.turningPoints.descriptions).toContain('赵括阵亡');
    });

    it('should include duration', () => {
      const result = getBattleProfile(testEvents, testEras, 'battle-1');
      expect(result?.duration.days).toBe(46);
      expect(result?.duration.category).toBe('protracted');
    });

    it('should include formations', () => {
      const result = getBattleProfile(testEvents, testEras, 'battle-1');
      expect(result?.formations.attacker).toContain('encirclement');
      expect(result?.formations.defender).toContain('defensive');
    });

    it('should include commanders', () => {
      const result = getBattleProfile(testEvents, testEras, 'battle-1');
      expect(result?.belligerents.commanders.attacker).toContain('白起');
      expect(result?.belligerents.commanders.defender).toContain('赵括');
    });

    it('should generate unique features', () => {
      const result = getBattleProfile(testEvents, testEras, 'battle-1');
      expect(result?.uniqueFeatures).toContain('超大规模战役');
      expect(result?.uniqueFeatures).toContain('决定性战役');
      expect(result?.uniqueFeatures).toContain('多转折点战役');
      expect(result?.uniqueFeatures).toContain('持久战');
    });

    it('should generate insights', () => {
      const result = getBattleProfile(testEvents, testEras, 'battle-1');
      expect(result?.insights).toContain('进攻方取得胜利');
      expect(result?.insights).toContain('进攻方指挥官: 白起');
    });
  });

  describe('getProfileSummary', () => {
    it('should return summary with correct counts', () => {
      const result = getProfileSummary(testEvents, testEras);
      expect(result.totalBattles).toBe(3);
      expect(result.analyzedBattles).toBe(3);
    });

    it('should track analysis coverage', () => {
      const result = getProfileSummary(testEvents, testEras);
      expect(result.analysisCoverage.hasTerrain).toBeGreaterThan(0);
      expect(result.analysisCoverage.hasTurningPoints).toBeGreaterThan(0);
      expect(result.analysisCoverage.hasDuration).toBeGreaterThan(0);
    });

    it('should identify most common result', () => {
      const result = getProfileSummary(testEvents, testEras);
      expect(result.mostCommonResult).toBe('进攻方胜利');
    });
  });

  describe('compareBattleProfiles', () => {
    it('should return null if battle not found', () => {
      const result = compareBattleProfiles(testEvents, testEras, 'battle-1', 'non-existent');
      expect(result).toBeNull();
    });

    it('should compare two battles', () => {
      const result = compareBattleProfiles(testEvents, testEras, 'battle-1', 'battle-2');
      expect(result).not.toBeNull();
      expect(result?.comparison.length).toBeGreaterThan(0);
    });

    it('should identify scale difference', () => {
      const result = compareBattleProfiles(testEvents, testEras, 'battle-1', 'battle-2');
      expect(result?.comparison).toContainEqual(
        expect.objectContaining({
          dimension: '战役规模',
          winner: 'profile1', // battle-1 is massive, battle-2 is large
        })
      );
    });

    it('should include unique features comparison', () => {
      const result = compareBattleProfiles(testEvents, testEras, 'battle-1', 'battle-2');
      const featureComparison = result?.comparison.find(c => c.dimension === '独特特征');
      expect(featureComparison).toBeDefined();
    });
  });

  describe('hasProfileData', () => {
    it('should return true if battles exist', () => {
      const result = hasProfileData(testEvents);
      expect(result).toBe(true);
    });

    it('should return false for empty events', () => {
      const result = hasProfileData([]);
      expect(result).toBe(false);
    });
  });
});
