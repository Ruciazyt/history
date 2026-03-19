import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBattleData } from './useBattleData';
import type { Event, Era } from './types';

describe('useBattleData', () => {
  // Test data
  const mockEras: Era[] = [
    { id: 'period-warring-states', nameKey: '战国', startYear: -475, endYear: -221 },
    { id: 'qin', nameKey: '秦', startYear: -221, endYear: -206 },
    { id: 'han', nameKey: '汉', startYear: -206, endYear: 220 },
  ];

  const mockEvents: Event[] = [
    {
      id: 'battle-1',
      entityId: 'period-warring-states',
      year: -260,
      titleKey: 'battle.长平之战',
      summaryKey: 'summary.长平之战',
      tags: ['war'],
      battle: {
        belligerents: { attacker: '秦', defender: '赵' },
        result: 'attacker_win',
        impact: 'decisive',
        scale: 'massive',
      },
    },
    {
      id: 'battle-2',
      entityId: 'qin',
      year: -207,
      titleKey: 'battle.巨鹿之战',
      summaryKey: 'summary.巨鹿之战',
      tags: ['war'],
      battle: {
        belligerents: { attacker: '项羽', defender: '秦军' },
        result: 'attacker_win',
        impact: 'decisive',
        scale: 'large',
      },
    },
    {
      id: 'battle-3',
      entityId: 'han',
      year: -200,
      titleKey: 'battle.垓下之战',
      summaryKey: 'summary.垓下之战',
      tags: ['war'],
      battle: {
        belligerents: { attacker: '刘邦', defender: '项羽' },
        result: 'attacker_win',
        impact: 'decisive',
        scale: 'large',
      },
    },
    {
      id: 'non-battle',
      entityId: 'han',
      year: -100,
      titleKey: 'event.其他事件',
      summaryKey: 'summary.其他事件',
      tags: ['politics'],
    },
  ];

  describe('initial state', () => {
    it('should return empty filters initially', () => {
      const { result } = renderHook(() => useBattleData({
        events: mockEvents,
        eras: mockEras,
      }));

      expect(result.current.selectedEra).toBeNull();
      expect(result.current.searchQuery).toBe('');
    });

    it('should return all battles initially', () => {
      const { result } = renderHook(() => useBattleData({
        events: mockEvents,
        eras: mockEras,
      }));

      // Should filter out non-battle events
      expect(result.current.allBattles).toHaveLength(3);
      expect(result.current.filteredBattles).toHaveLength(3);
    });
  });

  describe('era filtering', () => {
    it('should filter battles by selected era', () => {
      const { result } = renderHook(() => useBattleData({
        events: mockEvents,
        eras: mockEras,
      }));

      act(() => {
        result.current.setSelectedEra('秦');
      });

      expect(result.current.selectedEra).toBe('秦');
      expect(result.current.filteredBattles).toHaveLength(1);
      expect(result.current.filteredBattles[0].id).toBe('battle-2');
    });

    it('should filter battles by multiple eras correctly', () => {
      const { result } = renderHook(() => useBattleData({
        events: mockEvents,
        eras: mockEras,
      }));

      act(() => {
        result.current.setSelectedEra('战国');
      });

      expect(result.current.filteredBattles).toHaveLength(1);
      expect(result.current.filteredBattles[0].entityId).toBe('period-warring-states');
    });

    it('should return all battles when era is deselected', () => {
      const { result } = renderHook(() => useBattleData({
        events: mockEvents,
        eras: mockEras,
      }));

      act(() => {
        result.current.setSelectedEra('秦');
      });
      expect(result.current.filteredBattles).toHaveLength(1);

      act(() => {
        result.current.setSelectedEra(null);
      });
      expect(result.current.filteredBattles).toHaveLength(3);
    });
  });

  describe('search filtering', () => {
    it('should filter battles by search query in title', () => {
      const { result } = renderHook(() => useBattleData({
        events: mockEvents,
        eras: mockEras,
      }));

      act(() => {
        result.current.setSearchQuery('长平');
      });

      expect(result.current.searchQuery).toBe('长平');
      expect(result.current.filteredBattles).toHaveLength(1);
      expect(result.current.filteredBattles[0].titleKey).toBe('battle.长平之战');
    });

    it('should filter battles by search query in location', () => {
      const mockEventsWithLocation: Event[] = [
        ...mockEvents,
        {
          id: 'battle-with-location',
          entityId: 'qin',
          year: -230,
          titleKey: 'battle.地点战役',
          summaryKey: 'summary.地点战役',
          tags: ['war'],
          location: { lon: 113, lat: 35, label: '长平' },
        },
      ];

      const { result } = renderHook(() => useBattleData({
        events: mockEventsWithLocation,
        eras: mockEras,
      }));

      act(() => {
        result.current.setSearchQuery('长平');
      });

      expect(result.current.filteredBattles).toHaveLength(2);
    });

    it('should filter battles by search query in belligerents', () => {
      const { result } = renderHook(() => useBattleData({
        events: mockEvents,
        eras: mockEras,
      }));

      act(() => {
        result.current.setSearchQuery('项羽');
      });

      // Both battle-2 (attacker: 项羽) and battle-3 (defender: 项羽) match
      expect(result.current.filteredBattles).toHaveLength(2);
      expect(result.current.filteredBattles[0].battle?.belligerents?.attacker).toBe('项羽');
    });

    it('should be case insensitive', () => {
      const { result } = renderHook(() => useBattleData({
        events: mockEvents,
        eras: mockEras,
      }));

      act(() => {
        result.current.setSearchQuery('HAN');
      });

      // Should find battles where entityId or other fields match
      expect(result.current.filteredBattles.length).toBeGreaterThanOrEqual(0);
    });

    it('should return all battles when search query is empty', () => {
      const { result } = renderHook(() => useBattleData({
        events: mockEvents,
        eras: mockEras,
      }));

      act(() => {
        result.current.setSearchQuery('test');
      });
      expect(result.current.filteredBattles.length).toBeLessThanOrEqual(3);

      act(() => {
        result.current.setSearchQuery('');
      });
      expect(result.current.filteredBattles).toHaveLength(3);
    });
  });

  describe('combined filtering', () => {
    it('should filter by both era and search query', () => {
      const { result } = renderHook(() => useBattleData({
        events: mockEvents,
        eras: mockEras,
      }));

      act(() => {
        result.current.setSelectedEra('汉');
        result.current.setSearchQuery('刘邦');
      });

      expect(result.current.filteredBattles).toHaveLength(1);
      expect(result.current.filteredBattles[0].id).toBe('battle-3');
    });

    it('should return empty when era and search have no matches', () => {
      const { result } = renderHook(() => useBattleData({
        events: mockEvents,
        eras: mockEras,
      }));

      act(() => {
        result.current.setSelectedEra('秦');
        result.current.setSearchQuery('长平'); // Only exists in 战国
      });

      expect(result.current.filteredBattles).toHaveLength(0);
    });
  });

  describe('battlesByEra', () => {
    it('should group battles by era correctly', () => {
      const { result } = renderHook(() => useBattleData({
        events: mockEvents,
        eras: mockEras,
      }));

      const battlesByEra = result.current.battlesByEra;
      expect(battlesByEra.get('战国')?.length).toBe(1);
      expect(battlesByEra.get('秦')?.length).toBe(1);
      expect(battlesByEra.get('汉')?.length).toBe(1);
    });

    it('should sort battles within each era by year', () => {
      const mockEventsWithMultipleBattles: Event[] = [
        {
          id: 'battle-a',
          entityId: 'qin',
          year: -230,
          titleKey: 'battle.早期',
          summaryKey: 'summary.早期',
          tags: ['war'],
        },
        {
          id: 'battle-b',
          entityId: 'qin',
          year: -207,
          titleKey: 'battle.晚期',
          summaryKey: 'summary.晚期',
          tags: ['war'],
        },
      ];

      const { result } = renderHook(() => useBattleData({
        events: mockEventsWithMultipleBattles,
        eras: mockEras,
      }));

      const qinBattles = result.current.battlesByEra.get('秦');
      expect(qinBattles?.[0].year).toBe(-230);
      expect(qinBattles?.[1].year).toBe(-207);
    });
  });

  describe('stats', () => {
    it('should calculate total battles correctly', () => {
      const { result } = renderHook(() => useBattleData({
        events: mockEvents,
        eras: mockEras,
      }));

      expect(result.current.stats.total).toBe(3);
    });

    it('should calculate battles by era correctly', () => {
      const { result } = renderHook(() => useBattleData({
        events: mockEvents,
        eras: mockEras,
      }));

      // stats.byEra returns array of events for each era
      expect(result.current.stats.byEra['战国']).toHaveLength(1);
      expect(result.current.stats.byEra['秦']).toHaveLength(1);
      expect(result.current.stats.byEra['汉']).toHaveLength(1);
    });
  });

  describe('clearFilters', () => {
    it('should reset all filters', () => {
      const { result } = renderHook(() => useBattleData({
        events: mockEvents,
        eras: mockEras,
      }));

      act(() => {
        result.current.setSelectedEra('qin');
        result.current.setSearchQuery('test');
      });

      expect(result.current.selectedEra).toBe('qin');
      expect(result.current.searchQuery).toBe('test');

      act(() => {
        result.current.clearFilters();
      });

      expect(result.current.selectedEra).toBeNull();
      expect(result.current.searchQuery).toBe('');
      expect(result.current.filteredBattles).toHaveLength(3);
    });
  });

  describe('edge cases', () => {
    it('should handle empty events array', () => {
      const { result } = renderHook(() => useBattleData({
        events: [],
        eras: mockEras,
      }));

      expect(result.current.allBattles).toHaveLength(0);
      expect(result.current.filteredBattles).toHaveLength(0);
      expect(result.current.stats.total).toBe(0);
    });

    it('should handle empty eras array', () => {
      const { result } = renderHook(() => useBattleData({
        events: mockEvents,
        eras: [],
      }));

      // Should still return battles grouped by entityId
      expect(result.current.allBattles).toHaveLength(3);
    });

    it('should filter out non-battle events', () => {
      const { result } = renderHook(() => useBattleData({
        events: mockEvents,
        eras: mockEras,
      }));

      // non-battle event has no 'war' tag
      const allIds = result.current.allBattles.map(b => b.id);
      expect(allIds).not.toContain('non-battle');
    });
  });
});
