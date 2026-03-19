'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import type { Event, Ruler } from '@/lib/history/types';
import { formatYear } from '@/lib/history/utils';
import { Z_INDEX, LIGHT_THEME_COLORS } from '@/lib/history/constants';

interface SearchBoxProps {
  events: Event[];
  rulers: Ruler[];
  locale?: string;
}

interface SearchResult {
  type: 'ruler' | 'event' | 'battle';
  id: string;
  title: string;
  subtitle: string;
  year?: number;
}

import { useDebounce } from '@/lib/history/useBattleHooks';

export const SearchBox = React.memo(function SearchBox({ events, rulers, locale = 'zh' }: SearchBoxProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  // Debounce search query to reduce frequency
  const debouncedQuery = useDebounce(query, 200);

  // 使用 useMemo 缓存搜索结果
  const results = React.useMemo<SearchResult[]>(() => {
    if (!debouncedQuery.trim()) {
      return [];
    }

    const q = debouncedQuery.toLowerCase().trim();
    const searchResults: SearchResult[] = [];

    // 搜索帝王 - 使用更高效的过滤
    for (const ruler of rulers) {
      const name = ruler.nameKey.replace('ruler.', '');
      if (name.includes(q) || ruler.id.includes(q)) {
        searchResults.push({
          type: 'ruler',
          id: ruler.id,
          title: ruler.nameKey,
          subtitle: `👤 ${ruler.eraId}`,
          year: ruler.startYear,
        });
      }
    }

    // 搜索战役/事件
    for (const event of events) {
      const titleKey = event.titleKey;
      const title = titleKey.replace('event.', '').replace('.title', '');
      const isWar = event.tags?.includes('war');
      
      if (title.includes(q) || event.id.includes(q)) {
        searchResults.push({
          type: isWar ? 'battle' : 'event',
          id: event.id,
          title: event.titleKey,
          subtitle: isWar ? '⚔️ 战役' : '📅 事件',
          year: event.year,
        });
      }
    }

    return searchResults.slice(0, 8);
  }, [debouncedQuery, events, rulers]);

  const handleSelect = React.useCallback((result: SearchResult) => {
    setQuery('');
    setIsOpen(false);
    // 根据类型跳转到对应页面或展示
    if (result.type === 'battle') {
      router.push(`/${locale}/battles`);
    }
  }, [router, locale]);

  const handleClear = React.useCallback(() => {
    setQuery('');
    inputRef.current?.focus();
  }, []);

  return (
    <div className="relative">
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
          placeholder="搜索帝王、战役..."
          className={`w-40 sm:w-48 lg:w-56 px-3 py-1.5 pl-8 text-sm ${LIGHT_THEME_COLORS.background} border border-transparent rounded-lg focus:${LIGHT_THEME_COLORS.surface} focus:${LIGHT_THEME_COLORS.border} focus:outline-none transition-all`}
        />
        <svg
          className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 ${LIGHT_THEME_COLORS.textMuted}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {query && (
          <button
            onClick={handleClear}
            className={`absolute right-2 top-1/2 -translate-y-1/2 ${LIGHT_THEME_COLORS.textMuted} hover:${LIGHT_THEME_COLORS.textSecondary}`}
          >
            ✕
          </button>
        )}
      </div>

      {/* 搜索结果下拉 */}
      {isOpen && results.length > 0 && (
        <div 
          className={`absolute top-full left-0 right-0 mt-1 ${LIGHT_THEME_COLORS.surface} rounded-lg shadow-lg border ${LIGHT_THEME_COLORS.border} py-1 max-h-80 overflow-y-auto`}
          style={{ zIndex: Z_INDEX.dropdown }}
        >
          {results.map((result) => (
            <button
              key={`${result.type}-${result.id}`}
              onClick={() => handleSelect(result)}
              className={`w-full px-3 py-2 text-left hover:${LIGHT_THEME_COLORS.background} flex items-start gap-2`}
            >
              <span className={`text-xs ${LIGHT_THEME_COLORS.textMuted} mt-0.5`}>{result.subtitle}</span>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${LIGHT_THEME_COLORS.text} truncate`}>{result.title}</div>
                {result.year !== undefined && (
                  <div className={`text-xs ${LIGHT_THEME_COLORS.textMuted}`}>{formatYear(result.year)}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* 无结果提示 */}
      {isOpen && query && results.length === 0 && (
        <div 
          className={`absolute top-full left-0 right-0 mt-1 ${LIGHT_THEME_COLORS.surface} rounded-lg shadow-lg border ${LIGHT_THEME_COLORS.border} py-3`}
          style={{ zIndex: Z_INDEX.dropdown }}
        >
          <div className={`text-center text-sm ${LIGHT_THEME_COLORS.textMuted}`}>未找到相关结果</div>
        </div>
      )}

      {/* 点击外部关闭 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
});
