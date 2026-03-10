'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import type { Era, Event, Ruler } from '@/lib/history/types';
import { formatYear } from '@/lib/history/utils';

interface SearchBoxProps {
  eras: Era[];
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

export function SearchBox({ eras, events, rulers, locale = 'zh' }: SearchBoxProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // 搜索逻辑
  React.useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase().trim();
    const results: SearchResult[] = [];

    // 搜索帝王
    for (const ruler of rulers) {
      const name = ruler.nameKey.replace('ruler.', '');
      if (name.includes(q) || ruler.id.includes(q)) {
        results.push({
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
        results.push({
          type: isWar ? 'battle' : 'event',
          id: event.id,
          title: event.titleKey,
          subtitle: isWar ? '⚔️ 战役' : '📅 事件',
          year: event.year,
        });
      }
    }

    setResults(results.slice(0, 8));
  }, [query, events, rulers]);

  const handleSelect = (result: SearchResult) => {
    setQuery('');
    setIsOpen(false);
    // 根据类型跳转到对应页面或展示
    if (result.type === 'battle') {
      router.push(`/${locale}/battles`);
    }
  };

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
          className="w-40 sm:w-48 lg:w-56 px-3 py-1.5 pl-8 text-sm bg-zinc-100 border border-transparent rounded-lg focus:bg-white focus:border-zinc-300 focus:outline-none transition-all"
        />
        <svg
          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              inputRef.current?.focus();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* 搜索结果下拉 */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-zinc-200 py-1 z-50 max-h-80 overflow-y-auto">
          {results.map((result) => (
            <button
              key={`${result.type}-${result.id}`}
              onClick={() => handleSelect(result)}
              className="w-full px-3 py-2 text-left hover:bg-zinc-50 flex items-start gap-2"
            >
              <span className="text-xs text-zinc-400 mt-0.5">{result.subtitle}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-zinc-800 truncate">{result.title}</div>
                {result.year !== undefined && (
                  <div className="text-xs text-zinc-400">{formatYear(result.year)}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* 无结果提示 */}
      {isOpen && query && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-zinc-200 py-3 z-50">
          <div className="text-center text-sm text-zinc-400">未找到相关结果</div>
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
}
