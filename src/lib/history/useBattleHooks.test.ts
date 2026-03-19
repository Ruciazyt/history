// Test files use complex mock objects; relax explicit-any for fixtures
/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { 
  useDebounce, 
  useLocalStorage, 
  useAsyncData, 
  useToggle, 
  usePrevious, 
  useBattleFavorites,
  useBattleFilter,
  useBattleCompare,
  useModal,
  useBattleSort,
  useClickOutside,
  useMediaQuery,
  useKeyPress
} from './useBattleHooks';

describe('useDebounce', () => {
  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('test', 500));
    expect(result.current).toBe('test');
  });

  it('should return debounced value after delay', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      { initialProps: { value: 'initial' } }
    );

    expect(result.current).toBe('initial');

    rerender({ value: 'updated' });
    expect(result.current).toBe('initial');

    await waitFor(() => {
      expect(result.current).toBe('updated');
    }, { timeout: 200 });
  });
});

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return initial value', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  it('should update value', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(localStorage.getItem('test-key')).toBe('"updated"');
  });

  it('should load existing value from localStorage', () => {
    localStorage.setItem('existing-key', '"stored"');
    const { result } = renderHook(() => useLocalStorage('existing-key', 'default'));
    expect(result.current[0]).toBe('stored');
  });
});

describe('useAsyncData', () => {
  it('should handle successful data fetching', async () => {
    const fetcher = vi.fn().mockResolvedValue('test data');
    const { result } = renderHook(() => useAsyncData(fetcher));

    expect(result.current.isLoading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBe('test data');
    expect(result.current.error).toBe(null);
  });

  it('should handle errors', async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error('test error'));
    const { result } = renderHook(() => useAsyncData(fetcher));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.data).toBe(null);
  });
});

describe('useToggle', () => {
  it('should return initial value', () => {
    const { result } = renderHook(() => useToggle(false));
    expect(result.current[0]).toBe(false);
  });

  it('should toggle value', () => {
    const { result } = renderHook(() => useToggle(false));
    
    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(true);
    
    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(false);
  });

  it('should set value directly', () => {
    const { result } = renderHook(() => useToggle(false));
    
    act(() => {
      result.current[2](true);
    });
    expect(result.current[0]).toBe(true);
  });

  it('should work with initial true value', () => {
    const { result } = renderHook(() => useToggle(true));
    expect(result.current[0]).toBe(true);
  });
});

describe('usePrevious', () => {
  it('should return undefined on first render', () => {
    const { result } = renderHook(() => usePrevious('initial'));
    expect(result.current).toBe(undefined);
  });

  it('should return previous value after update', () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: 'initial' } }
    );

    expect(result.current).toBe(undefined);

    rerender({ value: 'updated' });
    
    expect(result.current).toBe('initial');
  });

  it('should track previous value changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: 'first' } }
    );

    rerender({ value: 'second' });
    expect(result.current).toBe('first');

    rerender({ value: 'third' });
    expect(result.current).toBe('second');
  });
});

describe('useBattleFavorites', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return empty array initially', () => {
    const { result } = renderHook(() => useBattleFavorites());
    expect(result.current.favorites).toEqual([]);
    expect(result.current.favoritesCount).toBe(0);
  });

  it('should add a favorite battle', () => {
    const { result } = renderHook(() => useBattleFavorites());
    
    act(() => {
      result.current.addFavorite('battle-1');
    });

    expect(result.current.favorites).toContain('battle-1');
    expect(result.current.favoritesCount).toBe(1);
  });

  it('should not add duplicate favorites', () => {
    const { result } = renderHook(() => useBattleFavorites());
    
    act(() => {
      result.current.addFavorite('battle-1');
      result.current.addFavorite('battle-1');
    });

    expect(result.current.favorites).toEqual(['battle-1']);
    expect(result.current.favoritesCount).toBe(1);
  });

  it('should remove a favorite battle', () => {
    const { result } = renderHook(() => useBattleFavorites());
    
    act(() => {
      result.current.addFavorite('battle-1');
      result.current.addFavorite('battle-2');
    });

    act(() => {
      result.current.removeFavorite('battle-1');
    });

    expect(result.current.favorites).toEqual(['battle-2']);
    expect(result.current.favoritesCount).toBe(1);
  });

  it('should toggle favorite on/off', () => {
    const { result } = renderHook(() => useBattleFavorites());
    
    // Add favorite
    act(() => {
      result.current.toggleFavorite('battle-1');
    });
    expect(result.current.favorites).toContain('battle-1');

    // Remove favorite (toggle again)
    act(() => {
      result.current.toggleFavorite('battle-1');
    });
    expect(result.current.favorites).not.toContain('battle-1');
  });

  it('should check if battle is favorited', () => {
    const { result } = renderHook(() => useBattleFavorites());
    
    expect(result.current.isFavorite('battle-1')).toBe(false);
    
    act(() => {
      result.current.addFavorite('battle-1');
    });
    
    expect(result.current.isFavorite('battle-1')).toBe(true);
    expect(result.current.isFavorite('battle-2')).toBe(false);
  });

  it('should clear all favorites', async () => {
    const { result } = renderHook(() => useBattleFavorites());
    
    // Add favorites one by one
    act(() => {
      result.current.addFavorite('battle-1');
    });
    
    act(() => {
      result.current.addFavorite('battle-2');
    });
    
    act(() => {
      result.current.addFavorite('battle-3');
    });

    // Verify all added
    expect(result.current.favorites).toContain('battle-1');
    expect(result.current.favorites).toContain('battle-2');
    expect(result.current.favorites).toContain('battle-3');

    // Clear all
    act(() => {
      result.current.clearFavorites();
    });

    expect(result.current.favorites).toEqual([]);
  });

  it('should persist favorites to localStorage', () => {
    const { result } = renderHook(() => useBattleFavorites());
    
    act(() => {
      result.current.addFavorite('battle-1');
    });

    expect(localStorage.getItem('battle-favorites')).toBe('["battle-1"]');
  });

  it('should load favorites from localStorage on init', () => {
    localStorage.setItem('battle-favorites', '["battle-1", "battle-2"]');
    
    const { result } = renderHook(() => useBattleFavorites());
    
    expect(result.current.favorites).toEqual(['battle-1', 'battle-2']);
    expect(result.current.favoritesCount).toBe(2);
  });
});

describe('useBattleFilter', () => {
  const mockBattles = [
    { id: '1', entityId: '秦', year: -230, titleKey: 'battle1' } as any,
    { id: '2', entityId: '秦', year: -228, titleKey: 'battle2' } as any,
    { id: '3', entityId: '汉', year: -200, titleKey: 'battle3' } as any,
    { id: '4', entityId: '汉', year: -195, titleKey: 'battle4' } as any,
    { id: '5', entityId: '楚', year: -210, titleKey: 'battle5' } as any,
  ];

  it('should return all battles when no era selected', () => {
    const { result } = renderHook(() => useBattleFilter(mockBattles));
    expect(result.current.displayedBattles).toHaveLength(5);
    expect(result.current.selectedEra).toBeNull();
  });

  it('should group battles by era', () => {
    const { result } = renderHook(() => useBattleFilter(mockBattles));
    expect(result.current.battlesByEra.get('秦')).toHaveLength(2);
    expect(result.current.battlesByEra.get('汉')).toHaveLength(2);
    expect(result.current.battlesByEra.get('楚')).toHaveLength(1);
  });

  it('should return era options', () => {
    const { result } = renderHook(() => useBattleFilter(mockBattles));
    expect(result.current.eraOptions).toEqual(['秦', '汉', '楚']);
  });

  it('should filter battles by selected era', () => {
    const { result } = renderHook(() => useBattleFilter(mockBattles));
    
    act(() => {
      result.current.setSelectedEra('秦');
    });
    
    expect(result.current.displayedBattles).toHaveLength(2);
    expect(result.current.selectedEra).toBe('秦');
  });

  it('should clear era filter when set to null', () => {
    const { result } = renderHook(() => useBattleFilter(mockBattles));
    
    act(() => {
      result.current.setSelectedEra('秦');
    });
    expect(result.current.displayedBattles).toHaveLength(2);
    
    act(() => {
      result.current.setSelectedEra(null);
    });
    expect(result.current.displayedBattles).toHaveLength(5);
  });
});

describe('useBattleCompare', () => {
  it('should start with empty selection', () => {
    const { result } = renderHook(() => useBattleCompare());
    expect(result.current.compareMode).toBe(false);
    expect(result.current.selectedBattles).toEqual([]);
    expect(result.current.compareBattle).toBeNull();
  });

  it('should add battle to selection', () => {
    const { result } = renderHook(() => useBattleCompare());
    const battle = { id: '1', titleKey: 'battle1' } as any;
    
    act(() => {
      result.current.handleBattleSelect(battle);
    });
    
    expect(result.current.selectedBattles).toHaveLength(1);
    expect(result.current.selectedBattles[0].id).toBe('1');
  });

  it('should remove battle from selection', () => {
    const { result } = renderHook(() => useBattleCompare());
    const battle1 = { id: '1', titleKey: 'battle1' } as any;
    const battle2 = { id: '2', titleKey: 'battle2' } as any;
    
    act(() => {
      result.current.handleBattleSelect(battle1);
      result.current.handleBattleSelect(battle2);
    });
    expect(result.current.selectedBattles).toHaveLength(2);
    
    act(() => {
      result.current.handleBattleSelect(battle1);
    });
    expect(result.current.selectedBattles).toHaveLength(1);
    expect(result.current.selectedBattles[0].id).toBe('2');
  });

  it('should set compare mode', () => {
    const { result } = renderHook(() => useBattleCompare());
    
    act(() => {
      result.current.setCompareMode(true);
    });
    
    expect(result.current.compareMode).toBe(true);
  });

  it('should set compare battle pair', () => {
    const { result } = renderHook(() => useBattleCompare());
    const battle1 = { id: '1', titleKey: 'battle1' } as any;
    const battle2 = { id: '2', titleKey: 'battle2' } as any;
    
    act(() => {
      result.current.setCompareBattle({ battle1, battle2 });
    });
    
    expect(result.current.compareBattle).toEqual({ battle1, battle2 });
  });
});

describe('useModal', () => {
  it('should start closed', () => {
    const { result } = renderHook(() => useModal());
    expect(result.current.isOpen).toBe(false);
  });

  it('should open modal', () => {
    const { result } = renderHook(() => useModal());
    
    act(() => {
      result.current.open();
    });
    
    expect(result.current.isOpen).toBe(true);
  });

  it('should close modal', () => {
    const { result } = renderHook(() => useModal());
    
    act(() => {
      result.current.open();
    });
    expect(result.current.isOpen).toBe(true);
    
    act(() => {
      result.current.close();
    });
    
    expect(result.current.isOpen).toBe(false);
  });

  it('should toggle modal', () => {
    const { result } = renderHook(() => useModal());
    
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(true);
    
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('should set modal state directly', () => {
    const { result } = renderHook(() => useModal());
    
    act(() => {
      result.current.setIsOpen(true);
    });
    expect(result.current.isOpen).toBe(true);
  });
});

describe('useBattleSort', () => {
  const mockBattles = [
    { id: '1', year: -200, titleKey: 'bbb', battle: { impact: 'major', scale: 'large' } } as any,
    { id: '2', year: -100, titleKey: 'aaa', battle: { impact: 'decisive', scale: 'massive' } } as any,
    { id: '3', year: -150, titleKey: 'ccc', battle: { impact: 'minor', scale: 'small' } } as any,
  ];

  it('should sort by year ascending by default', () => {
    const { result } = renderHook(() => useBattleSort(mockBattles));
    expect(result.current.sortedBattles[0].year).toBe(-200);
    expect(result.current.sortedBattles[1].year).toBe(-150);
    expect(result.current.sortedBattles[2].year).toBe(-100);
  });

  it('should sort by year descending', () => {
    const { result } = renderHook(() => useBattleSort(mockBattles));
    
    act(() => {
      result.current.setSortOrder('desc');
    });
    
    expect(result.current.sortedBattles[0].year).toBe(-100);
    expect(result.current.sortedBattles[2].year).toBe(-200);
  });

  it('should sort by impact', () => {
    const { result } = renderHook(() => useBattleSort(mockBattles));
    
    act(() => {
      result.current.setSortBy('impact');
    });
    
    // Default asc: minor (2) < major (3) < decisive (4)
    expect(result.current.sortedBattles[0].battle?.impact).toBe('minor');
    expect(result.current.sortedBattles[2].battle?.impact).toBe('decisive');
  });

  it('should sort by scale', () => {
    const { result } = renderHook(() => useBattleSort(mockBattles));
    
    act(() => {
      result.current.setSortBy('scale');
    });
    
    // Default asc: small (2) < large (4) < massive (5)
    expect(result.current.sortedBattles[0].battle?.scale).toBe('small');
    expect(result.current.sortedBattles[2].battle?.scale).toBe('massive');
  });

  it('should sort by name', () => {
    const { result } = renderHook(() => useBattleSort(mockBattles));
    
    act(() => {
      result.current.setSortBy('name');
    });
    
    expect(result.current.sortedBattles[0].titleKey).toBe('aaa');
    expect(result.current.sortedBattles[2].titleKey).toBe('ccc');
  });

  it('should toggle sort order', () => {
    const { result } = renderHook(() => useBattleSort(mockBattles));
    
    expect(result.current.sortOrder).toBe('asc');
    
    act(() => {
      result.current.toggleSortOrder();
    });
    
    expect(result.current.sortOrder).toBe('desc');
  });
});

describe('useClickOutside', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should call handler when clicking outside', () => {
    const handler = vi.fn();
    const ref = { current: document.createElement('div') };
    
    renderHook(() => useClickOutside(ref as any, handler));
    
    // Mock the contains method to return false (click outside)
    const containsSpy = vi.spyOn(ref.current, 'contains').mockReturnValue(false);
    
    // Simulate click event
    const event = new MouseEvent('mousedown', { bubbles: true });
    document.dispatchEvent(event);

    expect(handler).toHaveBeenCalled();
    containsSpy.mockRestore();
  });

  it('should not call handler when clicking inside', () => {
    const handler = vi.fn();
    const ref = { current: document.createElement('div') };
    
    renderHook(() => useClickOutside(ref as any, handler));
    
    // Mock the contains method to return true (click inside)
    const containsSpy = vi.spyOn(ref.current, 'contains').mockReturnValue(true);
    
    // Simulate click event
    const event = new MouseEvent('mousedown', { bubbles: true });
    document.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
    containsSpy.mockRestore();
  });
});

describe('useMediaQuery', () => {
  it('should return false when query does not match', () => {
    // Mock window.matchMedia to return false
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const { result } = renderHook(() => useMediaQuery('(min-width: 1000px)'));
    expect(result.current).toBe(false);
  });

  it('should return true when query matches', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const { result } = renderHook(() => useMediaQuery('(min-width: 1000px)'));
    expect(result.current).toBe(true);
  });
});

describe('useKeyPress', () => {
  it('should call callback when key is pressed', () => {
    const callback = vi.fn();
    
    renderHook(() => useKeyPress('Enter', callback));
    
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    document.dispatchEvent(event);
    
    expect(callback).toHaveBeenCalled();
  });

  it('should not call callback for different key', () => {
    const callback = vi.fn();
    
    renderHook(() => useKeyPress('Enter', callback));
    
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);
    
    expect(callback).not.toHaveBeenCalled();
  });

  it('should work with different target keys', () => {
    const escapeCallback = vi.fn();
    const spaceCallback = vi.fn();
    
    renderHook(() => {
      useKeyPress('Escape', escapeCallback);
      useKeyPress(' ', spaceCallback);
    });
    
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(escapeCallback).toHaveBeenCalled();
    
    document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    expect(spaceCallback).toHaveBeenCalled();
  });
});
