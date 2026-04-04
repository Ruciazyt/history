'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { Event, Ruler } from '@/lib/history/types';
import { formatYear } from '@/lib/history/utils';
import { Z_INDEX } from '@/lib/history/constants';
import { useDebounce, useClickOutside } from '@/lib/history/useBattleHooks';

interface SearchBoxProps {
  events: Event[];
  rulers: Ruler[];
  locale?: string;
}

const SEARCH_LABELS: Record<string, { placeholder: string; noResults: string }> = {
  zh: { placeholder: '搜索帝王、战役...', noResults: '未找到相关结果' },
  en: { placeholder: 'Search rulers, battles...', noResults: 'No results found' },
  ja: { placeholder: '帝王・戦いを検索...', noResults: '結果が見つかりません' },
};

interface SearchResult {
  type: 'ruler' | 'event' | 'battle';
  id: string;
  /** i18n key — kept for matching */
  titleKey: string;
  /** Translated display title */
  title: string;
  subtitle: string;
  year?: number;
}

export const SearchBox = React.memo(function SearchBox({ events, rulers, locale = 'zh' }: SearchBoxProps) {
  const t = useTranslations();
  const tRuler = useTranslations('rulerEraName');
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const listboxId = React.useId();

  // Close dropdown when clicking outside the search container
  useClickOutside(containerRef, React.useCallback(() => setIsOpen(false), []));

  // Debounce search query to reduce frequency
  const debouncedQuery = useDebounce(query, 200);

  // Cache search results with useMemo
  const results = React.useMemo<SearchResult[]>(() => {
    if (!debouncedQuery.trim()) {
      return [];
    }

    const q = debouncedQuery.toLowerCase().trim();
    const searchResults: SearchResult[] = [];

    // Search rulers — match raw key or translated name
    for (const ruler of rulers) {
      const translatedName = t(ruler.nameKey);
      const rawName = ruler.nameKey.replace('ruler.', '');
      if (rawName.includes(q) || translatedName.includes(q) || ruler.id.includes(q)) {
        searchResults.push({
          type: 'ruler',
          id: ruler.id,
          titleKey: ruler.nameKey,
          title: translatedName,
          subtitle: ruler.eraNameKey ? `👤 ${tRuler(ruler.eraNameKey)}` : `👤 ${ruler.eraId}`,
          year: ruler.startYear,
        });
      }
    }

    // Search events — classify as battle if it has battle field, otherwise as event
    for (const event of events) {
      const translatedTitle = t(event.titleKey);
      const rawTitle = event.titleKey.replace('event.', '').replace('.title', '');
      // Use event.battle presence to accurately distinguish battles from events
      const isBattle = !!event.battle;

      if (rawTitle.includes(q) || translatedTitle.includes(q) || event.id.includes(q)) {
        searchResults.push({
          type: isBattle ? 'battle' : 'event',
          id: event.id,
          titleKey: event.titleKey,
          title: translatedTitle,
          subtitle: isBattle ? `⚔️ ${t('nav.battles')}` : `📅 ${t('ui.events')}`,
          year: event.year,
        });
      }
    }

    return searchResults.slice(0, 8);
  }, [debouncedQuery, events, rulers, t, tRuler]);

  const handleSelect = React.useCallback((result: SearchResult) => {
    setQuery('');
    setIsOpen(false);
    if (result.type === 'battle') {
      router.push(`/${locale}/battles`);
    } else {
      // Navigate to home page so user can find the ruler/event in context
      router.push(`/${locale}`);
    }
  }, [router, locale]);

  const handleClear = React.useCallback(() => {
    setQuery('');
    inputRef.current?.focus();
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsOpen(false);
              inputRef.current?.blur();
            }
          }}
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          role="combobox"
          placeholder={SEARCH_LABELS[locale]?.placeholder ?? SEARCH_LABELS['zh']?.placeholder ?? ''}
          className="w-40 sm:w-48 lg:w-56 px-3 py-1.5 pl-8 text-sm bg-zinc-50 dark:bg-zinc-800 border border-transparent dark:border-zinc-700 rounded-lg focus:bg-white dark:focus:bg-zinc-700 focus:border-zinc-300 dark:focus:border-zinc-500 focus:outline-none transition-all text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
        />
        <svg
          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {query && (
          <button
            onClick={handleClear}
            aria-label={t('ui.clearSearch')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            ✕
          </button>
        )}
      </div>

      {/* Search results dropdown */}
      {isOpen && results.length > 0 && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 py-1 max-h-80 overflow-y-auto"
          style={{ zIndex: Z_INDEX.dropdown }}
        >
          {results.map((result) => (
            <button
              key={`${result.type}-${result.id}`}
              onClick={() => handleSelect(result)}
              className="w-full px-3 py-2 text-left hover:bg-zinc-50 dark:hover:bg-zinc-700 flex items-start gap-2"
            >
              <span className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{result.subtitle}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{result.title}</div>
                {result.year !== undefined && (
                  <div className="text-xs text-zinc-400 dark:text-zinc-500">{formatYear(result.year, locale)}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {isOpen && query && results.length === 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 py-3"
          style={{ zIndex: Z_INDEX.dropdown }}
        >
          <div className="text-center text-sm text-zinc-400 dark:text-zinc-500">{SEARCH_LABELS[locale]?.noResults ?? SEARCH_LABELS['zh']?.noResults ?? ''}</div>
        </div>
      )}
    </div>
  );
});
