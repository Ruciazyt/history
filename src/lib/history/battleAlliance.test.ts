import { describe, it, expect } from 'vitest';
import type { Event, BattleAlliance } from './types';
import {
  getAllianceTypeLabel,
  getAllianceOutcomeLabel,
  getAllianceTypeStats,
  getMostCommonAllianceTypes,
  getMostSuccessfulAllianceTypes,
  getParticipantAllianceInfo,
  getAllianceParticipants,
  getBattlesByAllianceType,
  getAllianceLeaderStats,
  getTopAllianceLeaders,
  getAllianceMemberStats,
  getAllianceInsights,
  getAllianceSummary,
  hasAllianceData,
  compareAllianceTypes,
  getBattlesWithAlliance,
} from './battleAlliance';

// Mock events with alliance data
const mockEvents: Event[] = [
  {
    id: 'battle1',
    entityId: 'spring-autumn',
    year: -632,
    titleKey: 'battle.chengpu',
    summaryKey: 'battle.chengpu.desc',
    tags: ['war'],
    location: { lon: 117.2, lat: 33.9, label: '城濮' },
    battle: {
      belligerents: { attacker: '晋国', defender: '楚国' },
      result: 'attacker_win',
      alliance: {
        id: 'alliance1',
        type: 'defensive',
        participants: [
          { name: '晋国', role: 'leader', contribution: 'major' },
          { name: '齐国', role: 'member', contribution: 'minor' },
        ],
        outcome: 'victory',
        reason: '对抗楚国北上',
      },
    },
  },
  {
    id: 'battle2',
    entityId: 'warring-states',
    year: -341,
    titleKey: 'battle.maling',
    summaryKey: 'battle.maling.desc',
    tags: ['war'],
    location: { lon: 117.0, lat: 34.4, label: '马陵' },
    battle: {
      belligerents: { attacker: '齐国', defender: '魏国' },
      result: 'attacker_win',
    },
  },
  {
    id: 'battle3',
    entityId: 'warring-states',
    year: -260,
    titleKey: 'battle.changping',
    summaryKey: 'battle.changping.desc',
    tags: ['war'],
    location: { lon: 113.0, lat: 37.5, label: '长平' },
    battle: {
      belligerents: { attacker: '秦国', defender: '赵国' },
      result: 'attacker_win',
    },
  },
  {
    id: 'battle4',
    entityId: 'warring-states',
    year: -223,
    titleKey: 'battle.yangxia',
    summaryKey: 'battle.yangxia.desc',
    tags: ['war'],
    location: { lon: 118.7, lat: 31.9, label: '杨夏' },
    battle: {
      belligerents: { attacker: '秦国', defender: '楚国' },
      result: 'attacker_win',
      alliance: {
        id: 'alliance2',
        type: 'offensive',
        participants: [
          { name: '秦国', role: 'leader', contribution: 'major' },
        ],
        outcome: 'victory',
      },
    },
  },
  {
    id: 'battle5',
    entityId: 'chuhang',
    year: -208,
    titleKey: 'battle.julu',
    summaryKey: 'battle.julu.desc',
    tags: ['war'],
    location: { lon: 114.8, lat: 37.2, label: '巨鹿' },
    battle: {
      belligerents: { attacker: '项羽', defender: '秦军' },
      result: 'attacker_win',
      alliance: {
        id: 'alliance3',
        type: 'temporary',
        participants: [
          { name: '项羽', role: 'leader', contribution: 'major' },
          { name: '刘邦', role: 'member', contribution: 'major' },
        ],
        outcome: 'victory',
        reason: '推翻秦朝',
      },
    },
  },
  {
    id: 'battle6',
    entityId: 'chuhang',
    year: -203,
    titleKey: 'battle.gaixia',
    summaryKey: 'battle.gaixia.desc',
    tags: ['war'],
    location: { lon: 118.5, lat: 32.1, label: '垓下' },
    battle: {
      belligerents: { attacker: '刘邦', defender: '项羽' },
      result: 'attacker_win',
      alliance: {
        id: 'alliance4',
        type: 'defensive',
        participants: [
          { name: '刘邦', role: 'leader', contribution: 'major' },
          { name: '韩信', role: 'member', contribution: 'major' },
          { name: '彭越', role: 'member', contribution: 'minor' },
        ],
        outcome: 'victory',
        reason: '消灭项羽',
      },
    },
  },
  {
    id: 'battle7',
    entityId: 'han',
    year: -200,
    titleKey: 'battle.baiyue',
    summaryKey: 'battle.baiyue.desc',
    tags: ['war'],
    location: { lon: 113.5, lat: 23.1, label: '百越' },
    battle: {
      belligerents: { attacker: '汉朝', defender: '百越' },
      result: 'attacker_win',
      alliance: {
        id: 'alliance5',
        type: 'offensive',
        participants: [
          { name: '汉朝', role: 'leader', contribution: 'major' },
          { name: '东瓯', role: 'member', contribution: 'minor' },
        ],
        outcome: 'defeat',
      },
    },
  },
  {
    id: 'battle8',
    entityId: 'three-kingdoms',
    year: -208,
    titleKey: 'battle.chibi',
    summaryKey: 'battle.chibi.desc',
    tags: ['war'],
    location: { lon: 113.1, lat: 29.9, label: '赤壁' },
    battle: {
      belligerents: { attacker: '曹操', defender: '孙刘联军' },
      result: 'defender_win',
      alliance: {
        id: 'alliance6',
        type: 'defensive',
        participants: [
          { name: '孙权', role: 'leader', contribution: 'major' },
          { name: '刘备', role: 'member', contribution: 'major' },
          { name: '周瑜', role: 'member', contribution: 'major' },
        ],
        outcome: 'victory',
        reason: '抵抗曹操南下',
      },
    },
  },
];

describe('battleAlliance', () => {
  describe('getAllianceTypeLabel', () => {
    it('should return correct Chinese label for alliance types', () => {
      expect(getAllianceTypeLabel('offensive')).toBe('进攻联盟');
      expect(getAllianceTypeLabel('defensive')).toBe('防御联盟');
      expect(getAllianceTypeLabel('cooperative')).toBe('合作/协同作战');
      expect(getAllianceTypeLabel('temporary')).toBe('临时联盟');
      expect(getAllianceTypeLabel('unknown')).toBe('未知');
    });
  });

  describe('getAllianceOutcomeLabel', () => {
    it('should return correct Chinese label for alliance outcomes', () => {
      expect(getAllianceOutcomeLabel('victory')).toBe('胜利');
      expect(getAllianceOutcomeLabel('defeat')).toBe('失败');
      expect(getAllianceOutcomeLabel('draw')).toBe('平局');
      expect(getAllianceOutcomeLabel('dissolved')).toBe('瓦解');
      expect(getAllianceOutcomeLabel('unknown')).toBe('未知');
      expect(getAllianceOutcomeLabel(undefined)).toBe('未知');
    });
  });

  describe('getBattlesWithAlliance', () => {
    it('should return only battles with alliance data', () => {
      const result = getBattlesWithAlliance(mockEvents);
      expect(result.length).toBe(6);
      expect(result.map(b => b.id)).toContain('battle1');
      expect(result.map(b => b.id)).not.toContain('battle2');
      expect(result.map(b => b.id)).not.toContain('battle3');
    });
  });

  describe('getAllianceTypeStats', () => {
    it('should calculate alliance type statistics', () => {
      const stats = getAllianceTypeStats(mockEvents);
      
      expect(stats.length).toBeGreaterThan(0);
      
      const defensiveStats = stats.find(s => s.type === 'defensive');
      expect(defensiveStats).toBeDefined();
      expect(defensiveStats!.count).toBe(3);
      expect(defensiveStats!.victories).toBe(3);
    });

    it('should sort by count descending', () => {
      const stats = getAllianceTypeStats(mockEvents);
      
      for (let i = 1; i < stats.length; i++) {
        expect(stats[i - 1].count).toBeGreaterThanOrEqual(stats[i].count);
      }
    });
  });

  describe('getMostCommonAllianceTypes', () => {
    it('should return alliance types sorted by frequency', () => {
      const types = getMostCommonAllianceTypes(mockEvents);
      expect(types.length).toBeGreaterThan(0);
      expect(types[0]).toBeDefined();
    });
  });

  describe('getMostSuccessfulAllianceTypes', () => {
    it('should return alliance types sorted by win rate', () => {
      const types = getMostSuccessfulAllianceTypes(mockEvents);
      expect(types.length).toBeGreaterThan(0);
    });
  });

  describe('getParticipantAllianceInfo', () => {
    it('should return alliance info for a participant', () => {
      const info = getParticipantAllianceInfo(mockEvents, '晋国');
      expect(info).not.toBeNull();
      expect(info!.name).toBe('晋国');
      expect(info!.totalAlliances).toBe(1);
      expect(info!.victories).toBe(1);
    });

    it('should return null for unknown participant', () => {
      const info = getParticipantAllianceInfo(mockEvents, '未知国家');
      expect(info).toBeNull();
    });

    it('should calculate win rate correctly', () => {
      const info = getParticipantAllianceInfo(mockEvents, '刘邦');
      expect(info).not.toBeNull();
      expect(info!.totalAlliances).toBe(2);
      expect(info!.victories).toBe(2);
      expect(info!.winRate).toBe(1);
    });
  });

  describe('getAllianceParticipants', () => {
    it('should return unique list of participants', () => {
      const participants = getAllianceParticipants(mockEvents);
      expect(participants.length).toBeGreaterThan(0);
      expect(participants).toContain('晋国');
      expect(participants).toContain('齐国');
    });
  });

  describe('getBattlesByAllianceType', () => {
    it('should filter battles by alliance type', () => {
      const defensiveBattles = getBattlesByAllianceType(mockEvents, 'defensive');
      expect(defensiveBattles.length).toBe(3);
    });

    it('should return empty array for no matches', () => {
      const battles = getBattlesByAllianceType(mockEvents, 'cooperative');
      expect(battles.length).toBe(0);
    });
  });

  describe('getAllianceLeaderStats', () => {
    it('should calculate leader statistics', () => {
      const leaders = getAllianceLeaderStats(mockEvents);
      expect(leaders.length).toBeGreaterThan(0);
      
      const leader = leaders.find(l => l.name === '晋国');
      expect(leader).toBeDefined();
      expect(leader!.totalLeads).toBe(1);
      expect(leader!.victories).toBe(1);
    });

    it('should calculate win rate for leaders', () => {
      const leaders = getAllianceLeaderStats(mockEvents);
      const leader = leaders.find(l => l.name === '晋国');
      expect(leader!.winRate).toBe(1);
    });
  });

  describe('getTopAllianceLeaders', () => {
    it('should return top leaders sorted by total leads', () => {
      const topLeaders = getTopAllianceLeaders(mockEvents, 3);
      expect(topLeaders.length).toBeLessThanOrEqual(3);
      if (topLeaders.length > 1) {
        expect(topLeaders[0].totalLeads).toBeGreaterThanOrEqual(topLeaders[1].totalLeads);
      }
    });
  });

  describe('getAllianceMemberStats', () => {
    it('should calculate member statistics', () => {
      const members = getAllianceMemberStats(mockEvents);
      expect(members.length).toBeGreaterThan(0);
      
      const member = members.find(m => m.name === '齐国');
      expect(member).toBeDefined();
      expect(member!.totalParticipations).toBe(1);
    });
  });

  describe('getAllianceInsights', () => {
    it('should generate alliance insights', () => {
      const insights = getAllianceInsights(mockEvents);
      expect(insights.length).toBeGreaterThan(0);
      
      const insightTypes = insights.map(i => i.type);
      expect(insightTypes).toContain('most_common_type');
      expect(insightTypes).toContain('top_leader');
    });

    it('should include title and description for each insight', () => {
      const insights = getAllianceInsights(mockEvents);
      for (const insight of insights) {
        expect(insight.title).toBeDefined();
        expect(insight.description).toBeDefined();
      }
    });
  });

  describe('getAllianceSummary', () => {
    it('should return complete alliance summary', () => {
      const summary = getAllianceSummary(mockEvents);
      
      expect(summary.totalBattlesWithAlliance).toBe(6);
      expect(summary.totalAlliances).toBe(6);
      expect(summary.typeStats.length).toBeGreaterThan(0);
      expect(summary.topLeaders.length).toBeGreaterThan(0);
      expect(summary.topMembers.length).toBeGreaterThan(0);
      expect(summary.insights.length).toBeGreaterThan(0);
      expect(summary.hasAllianceData).toBe(true);
    });
  });

  describe('hasAllianceData', () => {
    it('should return true when alliance data exists', () => {
      expect(hasAllianceData(mockEvents)).toBe(true);
    });

    it('should return false when no alliance data', () => {
      const eventsWithoutAlliance: Event[] = [
        {
          id: 'battle-no-alliance',
          entityId: 'test',
          year: -100,
          titleKey: 'test',
          summaryKey: 'test',
          tags: ['war'],
          battle: {
            belligerents: { attacker: 'A', defender: 'B' },
            result: 'attacker_win',
          },
        },
      ];
      expect(hasAllianceData(eventsWithoutAlliance)).toBe(false);
    });
  });

  describe('compareAllianceTypes', () => {
    it('should compare two alliance types', () => {
      const result = compareAllianceTypes(mockEvents, 'defensive', 'offensive');
      expect(result).not.toBeNull();
      expect(result!.type1.total).toBe(3);
      expect(result!.type2.total).toBe(2);
    });

    it('should return null when one type has no battles', () => {
      const result = compareAllianceTypes(mockEvents, 'defensive', 'cooperative');
      expect(result).toBeNull();
    });
  });
});
