/**
 * Shared hooks for History Atlas components
 */
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import type { Event } from './types';

/**
 * Hook for filtering battles by era
 */
export function useBattleFilter(battles: Event[]) {
  const [selectedEra, setSelectedEra] = useState<string | null>(null);

  const battlesByEra = useMemo(() => {
    const map = new Map<string, Event[]>();
    for (const battle of battles) {
      // Use entityId as era name key
      const eraName = battle.entityId;
      if (!map.has(eraName)) map.set(eraName, []);
      map.get(eraName)!.push(battle);
    }
    // Sort battles within each era by year
    for (const [, evts] of map) {
      evts.sort((a, b) => a.year - b.year);
    }
    return map;
  }, [battles]);

  const eraOptions = useMemo(() => Array.from(battlesByEra.keys()), [battlesByEra]);

  const displayedBattles = useMemo(
    () => selectedEra ? battlesByEra.get(selectedEra) || [] : battles,
    [selectedEra, battlesByEra, battles]
  );

  return {
    selectedEra,
    setSelectedEra,
    battlesByEra,
    eraOptions,
    displayedBattles,
  };
}

/**
 * Hook for battle comparison mode
 */
export function useBattleCompare() {
  const [compareMode, setCompareMode] = useState(false);
  const [selectedBattles, setSelectedBattles] = useState<Event[]>([]);
  const [compareBattle, setCompareBattle] = useState<{ battle1: Event; battle2: Event } | null>(null);

  const handleBattleSelect = useCallback((battle: Event) => {
    setSelectedBattles(prev => {
      const isSelected = prev.some(b => b.id === battle.id);
      if (isSelected) {
        return prev.filter(b => b.id !== battle.id);
      }
      if (prev.length >= 2) {
        // When selecting a 3rd battle, auto-open compare with previous 2
        const prevBattle = prev[1];
        if (prevBattle) {
          setCompareBattle({ battle1: prevBattle, battle2: battle });
        }
        return [];
      }
      return [...prev, battle];
    });
  }, []);

  return {
    compareMode,
    setCompareMode,
    selectedBattles,
    setSelectedBattles,
    compareBattle,
    setCompareBattle,
    handleBattleSelect,
  };
}

/**
 * Hook for modal/drawer state management
 */
export function useModal() {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return { isOpen, open, close, toggle, setIsOpen };
}

/**
 * Hook for keyboard accessibility (Escape key)
 */
export function useEscapeKey(onEscape: () => void) {
  const escapeHandler = React.useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onEscape();
  }, [onEscape]);

  React.useEffect(() => {
    document.addEventListener('keydown', escapeHandler);
    return () => document.removeEventListener('keydown', escapeHandler);
  }, [escapeHandler]);
}

/**
 * Battle sorting options
 */
export type BattleSortOption = 'year' | 'impact' | 'scale' | 'name';

/**
 * Hook for sorting battles
 */
export function useBattleSort(battles: Event[]) {
  const [sortBy, setSortBy] = useState<BattleSortOption>('year');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const sortedBattles = useMemo(() => {
    const sorted = [...battles];
    sorted.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'year':
          comparison = a.year - b.year;
          break;
        case 'impact':
          const impactOrder = { decisive: 4, major: 3, minor: 2, unknown: 1 };
          const impactA = impactOrder[a.battle?.impact || 'unknown'];
          const impactB = impactOrder[b.battle?.impact || 'unknown'];
          comparison = impactA - impactB;
          break;
        case 'scale':
          const scaleOrder = { massive: 5, large: 4, medium: 3, small: 2, unknown: 1 };
          const scaleA = scaleOrder[a.battle?.scale || 'unknown'];
          const scaleB = scaleOrder[b.battle?.scale || 'unknown'];
          comparison = scaleA - scaleB;
          break;
        case 'name':
          comparison = a.titleKey.localeCompare(b.titleKey);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    return sorted;
  }, [battles, sortBy, sortOrder]);

  const toggleSortOrder = useCallback(() => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  }, []);

  return {
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    sortedBattles,
    toggleSortOrder,
  };
}

/**
 * Hook for debounced value (useful for search)
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for click outside detection
 */
export function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  handler: () => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

/**
 * Hook for media query
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

/**
 * Hook for local storage
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      setStoredValue((prev) => {
        const next = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value;
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(next));
        }
        return next;
      });
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [key]);

  return [storedValue, setValue];
}

/**
 * Hook for infinite scroll (pagination)
 */
export function useInfiniteScroll(
  callback: () => void,
  hasMore: boolean,
  isLoading: boolean
) {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver((entries) => {
        const firstEntry = entries[0];
        if (firstEntry && firstEntry.isIntersecting && hasMore) {
          callback();
        }
      });
      
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, callback]
  );

  return lastElementRef;
}

/**
 * Hook for async data loading with states
 */
export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList = []
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    let mounted = true;
    
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetcherRef.current();
        if (mounted) {
          setData(result);
        }
      } catch (e) {
        if (mounted) {
          setError(e as Error);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, isLoading, error, refetch: () => fetcher() };
}

/**
 * Hook for toggle state (true/false)
 */
export function useToggle(initialValue: boolean = false): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);
  
  return [value, toggle, setValue];
}

/**
 * Hook for keyboard key press detection
 */
export function useKeyPress(targetKey: string, callback: () => void) {
  const callbackRef = useRef(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        callbackRef.current();
      }
    };
    
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [targetKey]);
}

/**
 * Hook for previous value
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = React.useRef<T | undefined>(undefined);
  
  React.useEffect(() => {
    ref.current = value;
  }, [value]);
  
  // eslint-disable-next-line react-hooks/refs
  return ref.current;
}

/**
 * Hook for battle favorites (using localStorage)
 */
export function useBattleFavorites() {
  const [favorites, setFavorites] = useLocalStorage<string[]>('battle-favorites', []);

  const addFavorite = React.useCallback((battleId: string) => {
    setFavorites((prev) => prev.includes(battleId) ? prev : [...prev, battleId]);
  }, [setFavorites]);

  const removeFavorite = React.useCallback((battleId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== battleId));
  }, [setFavorites]);

  const toggleFavorite = React.useCallback((battleId: string) => {
    setFavorites((prev) =>
      prev.includes(battleId)
        ? prev.filter((id) => id !== battleId)
        : [...prev, battleId]
    );
  }, [setFavorites]);

  const isFavorite = React.useCallback(
    (battleId: string) => favorites.includes(battleId),
    [favorites]
  );

  const clearFavorites = React.useCallback(() => {
    setFavorites([]);
  }, [setFavorites]);
  
  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    favoritesCount: favorites.length,
  };
}
