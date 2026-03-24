/**
 * useHistoryAppColors Hook 单元测试
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useHistoryAppColors } from './useHistoryAppColors';
import { HISTORY_APP_COLORS, HISTORY_APP_EXTRA_COLORS } from '@/lib/history/constants';
import type { ThemeColors } from '@/lib/history/constants/colors';

// Mock useTheme
vi.mock('@/components/common/ThemeContext', () => ({
  useTheme: vi.fn(),
}));

import { useTheme } from '@/components/common/ThemeContext';

const mockUseTheme = useTheme as ReturnType<typeof vi.fn>;

describe('useHistoryAppColors', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return light theme colors when theme is "light"', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      toggleTheme: vi.fn(),
      setTheme: vi.fn(),
      mounted: true,
      themeColors: {} as ThemeColors,
    });

    const { result } = renderHook(() => useHistoryAppColors());

    expect(result.current.C).toBe(HISTORY_APP_COLORS);
    expect(result.current.EXTRA).toBe(HISTORY_APP_EXTRA_COLORS);
  });

  it('should return dark theme colors when theme is "dark"', () => {
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      toggleTheme: vi.fn(),
      setTheme: vi.fn(),
      mounted: true,
      themeColors: {} as ThemeColors,
    });

    const { result } = renderHook(() => useHistoryAppColors());

    // C should be a transformed dark-mode version (not the same reference as light)
    expect(result.current.C).not.toBe(HISTORY_APP_COLORS);

    // Dark mode should override container to zinc-900
    expect(result.current.C.container.bg).toBe('bg-zinc-900');
    expect(result.current.C.container.text).toBe('text-zinc-100');

    // Header border should be zinc-700
    expect(result.current.C.header.border).toBe('border-zinc-700');

    // Timeline window button active bg should be blue-600
    expect(result.current.C.timeline.windowButton.active.bg).toBe('bg-blue-600');

    // Sidebar ruler button active should use blue-900
    expect(result.current.C.sidebar.table.rulerButton.active).toBe(
      'bg-blue-900 text-blue-200 font-medium'
    );
  });

  it('should return dark mode EXTRA colors when theme is "dark"', () => {
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      toggleTheme: vi.fn(),
      setTheme: vi.fn(),
      mounted: true,
      themeColors: {} as ThemeColors,
    });

    const { result } = renderHook(() => useHistoryAppColors());

    expect(result.current.EXTRA).not.toBe(HISTORY_APP_EXTRA_COLORS);
    expect(result.current.EXTRA.divider.default).toBe('text-zinc-600');
    expect(result.current.EXTRA.multiPolity.text).toBe('text-zinc-500');
  });

  it('should memoize C and EXTRA separately', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      toggleTheme: vi.fn(),
      setTheme: vi.fn(),
      mounted: true,
      themeColors: {} as ThemeColors,
    });

    const { result, rerender } = renderHook(() => useHistoryAppColors());
    const firstC = result.current.C;
    const firstEXTRA = result.current.EXTRA;

    // Re-render with same theme — should get same references (memoized)
    rerender();
    expect(result.current.C).toBe(firstC);
    expect(result.current.EXTRA).toBe(firstEXTRA);

    // Switch to dark — should get new references
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      toggleTheme: vi.fn(),
      setTheme: vi.fn(),
      mounted: true,
      themeColors: {} as ThemeColors,
    });
    rerender();
    expect(result.current.C).not.toBe(firstC);
    expect(result.current.EXTRA).not.toBe(firstEXTRA);
  });

  it('should apply dark mode to sidebar colors correctly', () => {
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      toggleTheme: vi.fn(),
      setTheme: vi.fn(),
      mounted: true,
      themeColors: {} as ThemeColors,
    });

    const { result } = renderHook(() => useHistoryAppColors());

    // Sidebar container
    expect(result.current.C.sidebar.container.bg).toBe('bg-zinc-800');
    expect(result.current.C.sidebar.container.border).toBe('border-zinc-700');

    // Sidebar table row hover
    expect(result.current.C.sidebar.table.row.hover).toBe('hover:bg-zinc-700');

    // Sidebar ruler list active
    expect(result.current.C.sidebar.rulerList.active).toBe('bg-blue-900 text-blue-200');
  });

  it('should apply dark mode to timeline colors correctly', () => {
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      toggleTheme: vi.fn(),
      setTheme: vi.fn(),
      mounted: true,
      themeColors: {} as ThemeColors,
    });

    const { result } = renderHook(() => useHistoryAppColors());

    // Timeline container
    expect(result.current.C.timeline.container.bg).toBe('bg-zinc-800');

    // Timeline header text
    expect(result.current.C.timeline.header.text).toBe('text-zinc-500');
    expect(result.current.C.timeline.header.year).toBe('text-zinc-100 font-semibold');

    // Timeline nav button hover
    expect(result.current.C.timeline.navButton.hover).toBe('hover:bg-zinc-600');
  });

  it('should apply dark mode to rulerDetail colors correctly', () => {
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      toggleTheme: vi.fn(),
      setTheme: vi.fn(),
      mounted: true,
      themeColors: {} as ThemeColors,
    });

    const { result } = renderHook(() => useHistoryAppColors());

    // Ruler detail header era badge
    expect(result.current.C.rulerDetail.header.eraBadge.bg).toBe('bg-amber-900/50');
    expect(result.current.C.rulerDetail.header.eraBadge.text).toBe('text-amber-300');

    // Close button
    expect(result.current.C.rulerDetail.closeButton.hover).toBe('hover:bg-zinc-600');
  });

  it('should apply dark mode to eventsSidebar war badge correctly', () => {
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      toggleTheme: vi.fn(),
      setTheme: vi.fn(),
      mounted: true,
      themeColors: {} as ThemeColors,
    });

    const { result } = renderHook(() => useHistoryAppColors());

    expect(result.current.C.eventsSidebar.eventItem.warBadge.bg).toBe('bg-red-900/50');
    expect(result.current.C.eventsSidebar.eventItem.warBadge.text).toBe('text-red-300');
  });

  it('should return light theme divider colors in EXTRA', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      toggleTheme: vi.fn(),
      setTheme: vi.fn(),
      mounted: true,
      themeColors: {} as ThemeColors,
    });

    const { result } = renderHook(() => useHistoryAppColors());

    expect(result.current.EXTRA.divider).toBe(HISTORY_APP_EXTRA_COLORS.divider);
  });

  it('should have all required top-level C color groups', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      toggleTheme: vi.fn(),
      setTheme: vi.fn(),
      mounted: true,
      themeColors: {} as ThemeColors,
    });

    const { result } = renderHook(() => useHistoryAppColors());

    const expectedGroups = [
      'container', 'header', 'civSwitcher', 'eraInfo', 'quickLink',
      'sidebar', 'timeline', 'mapContainer', 'eventsSidebar', 'rulerDetail',
    ];
    for (const group of expectedGroups) {
      expect(result.current.C).toHaveProperty(group);
    }
  });
});
