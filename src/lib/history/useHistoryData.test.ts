/**
 * useHistoryData Hook 单元测试
 */

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHistoryData } from './useHistoryData';
import type { Era, Ruler } from './types';

// Mock data
const mockEras: Era[] = [
  { id: 'qin', name: '秦朝', startYear: -221, endYear: -206, civilization: '华夏' },
  { id: 'han', name: '汉朝', startYear: -206, endYear: 220, civilization: '华夏' },
];

const mockRulers: Ruler[] = [
  { id: 'qin-shihuang', name: '秦始皇', eraId: 'qin', startYear: -247, endYear: -210, dynasty: '秦' },
  { id: 'han-gaozu', name: '汉高祖', eraId: 'han', startYear: -202, endYear: -195, dynasty: '汉' },
];

describe('useHistoryData', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useHistoryData({
      eras: mockEras,
      rulers: mockRulers,
    }));

    expect(result.current.openEraIds).toEqual(new Set());
    expect(result.current.selectedRulerId).toBeNull();
    expect(result.current.windowYears).toBe(50);
    expect(result.current.year).toBe(-221); // initYear should be min year from eras
  });

  it('should calculate yearBounds correctly', () => {
    const { result } = renderHook(() => useHistoryData({
      eras: mockEras,
      rulers: mockRulers,
    }));

    expect(result.current.yearBounds).toEqual({ min: -221, max: 220 });
  });

  it('should toggle era expansion state', () => {
    const { result } = renderHook(() => useHistoryData({
      eras: mockEras,
      rulers: mockRulers,
    }));

    act(() => {
      result.current.toggleEra('qin');
    });

    expect(result.current.openEraIds).toContain('qin');

    act(() => {
      result.current.toggleEra('qin');
    });

    expect(result.current.openEraIds).not.toContain('qin');
  });

  it('should set selected ruler correctly', () => {
    const { result } = renderHook(() => useHistoryData({
      eras: mockEras,
      rulers: mockRulers,
    }));

    act(() => {
      result.current.setSelectedRulerId('qin-shihuang');
    });

    expect(result.current.selectedRulerId).toBe('qin-shihuang');
    expect(result.current.selectedRuler).toEqual(mockRulers[0]);
  });

  it('should clear selected ruler when set to null', () => {
    const { result } = renderHook(() => useHistoryData({
      eras: mockEras,
      rulers: mockRulers,
    }));

    act(() => {
      result.current.setSelectedRulerId('qin-shihuang');
    });

    act(() => {
      result.current.setSelectedRulerId(null);
    });

    expect(result.current.selectedRulerId).toBeNull();
    expect(result.current.selectedRuler).toBeNull();
  });

  it('should calculate timelineRange based on selected ruler', () => {
    const { result } = renderHook(() => useHistoryData({
      eras: mockEras,
      rulers: mockRulers,
    }));

    act(() => {
      result.current.setSelectedRulerId('qin-shihuang');
    });

    expect(result.current.timelineRange).toEqual({ min: -247, max: -210 });
  });

  it('should use era default range when no ruler selected', () => {
    const { result } = renderHook(() => useHistoryData({
      eras: mockEras,
      rulers: mockRulers,
    }));

    expect(result.current.timelineRange).toEqual({ min: -221, max: -206 });
  });

  it('should update window years', () => {
    const { result } = renderHook(() => useHistoryData({
      eras: mockEras,
      rulers: mockRulers,
    }));

    act(() => {
      result.current.setWindowYears(100);
    });

    expect(result.current.windowYears).toBe(100);
  });

  it('should update year', () => {
    const { result } = renderHook(() => useHistoryData({
      eras: mockEras,
      rulers: mockRulers,
    }));

    act(() => {
      result.current.setYear(-100);
    });

    expect(result.current.year).toBe(-100);
  });

  it('should filter events within time window', () => {
    const { result } = renderHook(() => useHistoryData({
      eras: mockEras,
      rulers: mockRulers,
    }));

    const events = [
      { id: 'e1', year: -230, entityId: 'qin', name: 'Event 1', type: 'battle' },
      { id: 'e2', year: -215, entityId: 'qin', name: 'Event 2', type: 'battle' },
      { id: 'e3', year: -100, entityId: 'han', name: 'Event 3', type: 'battle' },
    ];

    // With initYear=-221 and windowYears=50, range is -246 to -196
    const filtered = result.current.getEventsInWindow(events, -221);
    
    // e1 (-230) and e2 (-215) are in range [-246, -196]
    expect(filtered.length).toBe(2);
    expect(filtered.map(e => e.id).sort()).toEqual(['e1', 'e2']);
  });

  it('should group events by era correctly', () => {
    const { result } = renderHook(() => useHistoryData({
      eras: mockEras,
      rulers: mockRulers,
    }));

    // Use events that fall within the initYear window (-221 +/- 25 = -246 to -196)
    const events = [
      { id: 'e1', year: -230, entityId: 'qin', name: 'Event 1', type: 'battle' },
      { id: 'e2', year: -215, entityId: 'qin', name: 'Event 2', type: 'battle' },
      { id: 'e3', year: -210, entityId: 'han', name: 'Event 3', type: 'battle' },
    ];

    // Open Qin era
    act(() => {
      result.current.toggleEra('qin');
    });

    const grouped = result.current.groupEventsByEra(events);

    // Qin events should be in current (era is open)
    expect(grouped.current.length).toBe(2);
    // Han event should be in other (era is closed)
    expect(grouped.other.length).toBe(1);
  });

  it('should sort events by year', () => {
    const { result } = renderHook(() => useHistoryData({
      eras: mockEras,
      rulers: mockRulers,
    }));

    // Use events within the initYear window
    const events = [
      { id: 'e3', year: -210, entityId: 'qin', name: 'Event 3', type: 'battle' },
      { id: 'e1', year: -230, entityId: 'qin', name: 'Event 1', type: 'battle' },
      { id: 'e2', year: -220, entityId: 'qin', name: 'Event 2', type: 'battle' },
    ];

    act(() => {
      result.current.toggleEra('qin');
    });

    const grouped = result.current.groupEventsByEra(events);

    // Should be sorted by year ascending
    expect(grouped.current[0].id).toBe('e1');
    expect(grouped.current[1].id).toBe('e2');
    expect(grouped.current[2].id).toBe('e3');
  });

  it('should handle empty eras array', () => {
    const { result } = renderHook(() => useHistoryData({
      eras: [],
      rulers: mockRulers,
    }));

    expect(result.current.yearBounds).toEqual({ min: Infinity, max: -Infinity });
    expect(result.current.year).toBe(Infinity); // initYear would be Infinity
  });

  it('should handle setOpenEraIds directly', () => {
    const { result } = renderHook(() => useHistoryData({
      eras: mockEras,
      rulers: mockRulers,
    }));

    act(() => {
      result.current.setOpenEraIds(new Set(['han']));
    });

    expect(result.current.openEraIds).toContain('han');
  });
});
