import { describe, it, expect } from 'vitest';
import {
  buildCommanderNetwork,
  getCommanderRelation,
  getTopOpponents,
  getTopCollaborators,
  getTopMatchups,
  getTopCollaborations,
  getCommanderClusters,
  hasCommanderNetworkData,
  getCommanderNetworkSummary,
  getCommanderNetworkInsights,
} from './commanderNetwork';
import type { Event } from './types';

const mockBattles: Event[] = [
  {
    id: 'battle-1',
    entityId: 'period-warring-states',
    year: -260,
    titleKey: 'battle.changping',
    summaryKey: 'battle.changping.summary',
    tags: ['war'],
    location: { lon: 113.0, lat: 35.5, label: '长平' },
    battle: {
      belligerents: {
        attacker: '秦军',
        defender: '赵军',
      },
      result: 'attacker_win',
      commanders: {
        attacker: ['白起'],
        defender: ['赵括'],
      },
    },
  },
  {
    id: 'battle-2',
    entityId: 'period-warring-states',
    year: -341,
    titleKey: 'battle.maling',
    summaryKey: 'battle.maling.summary',
    tags: ['war'],
    location: { lon: 117.0, lat: 34.5, label: '马陵' },
    battle: {
      belligerents: {
        attacker: '齐军',
        defender: '魏军',
      },
      result: 'attacker_win',
      commanders: {
        attacker: ['孙膑', '田忌'],
        defender: ['庞涓'],
      },
    },
  },
  {
    id: 'battle-3',
    entityId: 'period-spring-autumn',
    year: -506,
    titleKey: 'battle.boju',
    summaryKey: 'battle.boju.summary',
    tags: ['war'],
    location: { lon: 114.3, lat: 30.59, label: '柏举' },
    battle: {
      belligerents: {
        attacker: '吴军',
        defender: '楚军',
      },
      result: 'attacker_win',
      commanders: {
        attacker: ['孙武', '伍子胥'],
        defender: ['囊瓦'],
      },
    },
  },
  {
    id: 'battle-4',
    entityId: 'wz-western-zhou',
    year: -1046,
    titleKey: 'battle.muye',
    summaryKey: 'battle.muye.summary',
    tags: ['war'],
    location: { lon: 114.7, lat: 34.8, label: '牧野' },
    battle: {
      belligerents: {
        attacker: '周军',
        defender: '商军',
      },
      result: 'attacker_win',
      commanders: {
        attacker: ['姬发', '姜子牙'],
        defender: ['帝辛'],
      },
    },
  },
  {
    id: 'battle-5',
    entityId: 'period-warring-states',
    year: -278,
    titleKey: 'battle.ying',
    summaryKey: 'battle.ying.summary',
    tags: ['war'],
    location: { lon: 112.5, lat: 29.0, label: '郢' },
    battle: {
      belligerents: {
        attacker: '秦军',
        defender: '楚军',
      },
      result: 'attacker_win',
    },
  },
];

describe('Commander Network Analysis', () => {
  describe('buildCommanderNetwork', () => {
    it('should build a network with nodes and relations', () => {
      const network = buildCommanderNetwork(mockBattles);
      
      expect(network.nodes.length).toBeGreaterThan(0);
      expect(network.relations.length).toBeGreaterThan(0);
      expect(network.metrics.totalCommanders).toBeGreaterThan(0);
    });

    it('should correctly identify collaborators', () => {
      const network = buildCommanderNetwork(mockBattles);
      
      // 孙膑和田忌是队友
      const sunbin = network.nodes.find(n => n.name === '孙膑');
      const tianji = network.nodes.find(n => n.name === '田忌');
      
      expect(sunbin).toBeDefined();
      expect(tianji).toBeDefined();
      
      if (sunbin && tianji) {
        expect(sunbin.collaborators).toContain('田忌');
        expect(tianji.collaborators).toContain('孙膑');
      }
    });

    it('should correctly identify opponents', () => {
      const network = buildCommanderNetwork(mockBattles);
      
      // 白起和赵括是对手
      const baiqi = network.nodes.find(n => n.name === '白起');
      const zhaokuo = network.nodes.find(n => n.name === '赵括');
      
      expect(baiqi).toBeDefined();
      expect(zhaokuo).toBeDefined();
      
      if (baiqi && zhaokuo) {
        expect(baiqi.opponents).toContain('赵括');
        expect(zhaokuo.opponents).toContain('白起');
      }
    });
  });

  describe('getCommanderRelation', () => {
    it('should return collaborated relation for teammates', () => {
      const relation = getCommanderRelation(mockBattles, '孙膑', '田忌');
      
      expect(relation).not.toBeNull();
      expect(relation?.relationType).toBe('collaborated');
      expect(relation?.battleCount).toBe(1);
    });

    it('should return opposed relation for opponents', () => {
      const relation = getCommanderRelation(mockBattles, '白起', '赵括');
      
      expect(relation).not.toBeNull();
      expect(relation?.relationType).toBe('opposed');
    });

    it('should return null for commanders who never met', () => {
      const relation = getCommanderRelation(mockBattles, '白起', '孙膑');
      
      expect(relation).toBeNull();
    });
  });

  describe('getTopOpponents', () => {
    it('should return opponents sorted by battle count', () => {
      const opponents = getTopOpponents(mockBattles, '孙膑');
      
      expect(opponents.length).toBeGreaterThan(0);
      expect(opponents[0].name).toBe('庞涓');
    });

    it('should limit results to specified limit', () => {
      const opponents = getTopOpponents(mockBattles, '孙膑', 2);
      
      expect(opponents.length).toBeLessThanOrEqual(2);
    });
  });

  describe('getTopCollaborators', () => {
    it('should return collaborators sorted by battle count', () => {
      const collaborators = getTopCollaborators(mockBattles, '孙膑');
      
      expect(collaborators.length).toBeGreaterThan(0);
      expect(collaborators[0].name).toBe('田忌');
    });
  });

  describe('getTopMatchups', () => {
    it('should return most common commander matchups', () => {
      const matchups = getTopMatchups(mockBattles);
      
      expect(matchups.length).toBeGreaterThan(0);
    });

    it('should include win information for each commander', () => {
      const matchups = getTopMatchups(mockBattles);
      
      if (matchups.length > 0) {
        expect(matchups[0]).toHaveProperty('commander1Wins');
        expect(matchups[0]).toHaveProperty('commander2Wins');
      }
    });
  });

  describe('getTopCollaborations', () => {
    it('should return most frequent collaborations', () => {
      const collaborations = getTopCollaborations(mockBattles);
      
      expect(collaborations.length).toBeGreaterThan(0);
    });

    it('should include win count for collaborations', () => {
      const collaborations = getTopCollaborations(mockBattles);
      
      if (collaborations.length > 0) {
        expect(collaborations[0]).toHaveProperty('wins');
      }
    });
  });

  describe('getCommanderClusters', () => {
    it('should group commanders by era', () => {
      const clusters = getCommanderClusters(mockBattles);
      
      expect(Array.isArray(clusters)).toBe(true);
    });
  });

  describe('hasCommanderNetworkData', () => {
    it('should return true when there are enough commanders', () => {
      expect(hasCommanderNetworkData(mockBattles)).toBe(true);
    });

    it('should return false for empty array', () => {
      expect(hasCommanderNetworkData([])).toBe(false);
    });

    it('should return false when not enough commanders', () => {
      const singleCommander: Event[] = [
        {
          id: 'single',
          entityId: 'test',
          year: -100,
          titleKey: 'test',
          summaryKey: 'test',
          battle: {
            belligerents: { attacker: 'A', defender: 'B' },
            commanders: { attacker: ['General'], defender: [] },
          },
        },
      ];
      
      expect(hasCommanderNetworkData(singleCommander)).toBe(false);
    });
  });

  describe('getCommanderNetworkSummary', () => {
    it('should return summary with hasData true for valid data', () => {
      const summary = getCommanderNetworkSummary(mockBattles);
      
      expect(summary.hasData).toBe(true);
      expect(summary.totalCommanders).toBeGreaterThan(0);
    });

    it('should return hasData false for insufficient data', () => {
      const summary = getCommanderNetworkSummary([]);
      
      expect(summary.hasData).toBe(false);
    });
  });

  describe('getCommanderNetworkInsights', () => {
    it('should return insights array', () => {
      const insights = getCommanderNetworkInsights(mockBattles);
      
      expect(Array.isArray(insights)).toBe(true);
    });

    it('should return insights about commanders', () => {
      const insights = getCommanderNetworkInsights(mockBattles);
      
      // Should have some insights
      expect(insights.length).toBeGreaterThan(0);
    });

    it('should return empty array when no data', () => {
      const insights = getCommanderNetworkInsights([]);
      
      expect(insights).toHaveLength(0);
    });
  });
});
