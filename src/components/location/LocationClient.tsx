'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { searchLocation, getLocationHistory, type LocationSearchResult } from '@/lib/history/location/search';
import { formatYear } from '@/lib/history/utils';

interface LocationClientProps {
  locale: string;
}

export function LocationClient({ locale }: LocationClientProps) {
  const t = useTranslations();
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<LocationSearchResult[]>([]);
  const [selectedLocation, setSelectedLocation] = React.useState<string | null>(null);
  const [history, setHistory] = React.useState<{ location: string; timeline: Array<{ year: number; event: any }> } | null>(null);

  // 搜索处理
  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.length >= 1) {
      const searchResults = searchLocation(value, locale as 'zh' | 'en' | 'ja');
      setResults(searchResults);
    } else {
      setResults([]);
    }
  };

  // 选择地点
  const handleSelectLocation = (location: string) => {
    setSelectedLocation(location);
    const historyData = getLocationHistory(location);
    setHistory(historyData);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* 标题 */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            📍 {t('location.title') || '地名演变查询'}
          </h1>
          <p className="text-zinc-400">
            {t('location.description') || '输入地名查看其历史演变'}
          </p>
        </header>

        {/* 搜索框 */}
        <div className="mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={t('location.placeholder') || '输入地名，如：长安、洛阳、邯郸...'}
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-lg focus:outline-none focus:border-blue-500"
            autoFocus
          />
        </div>

        {/* 搜索结果 */}
        {results.length > 0 && !selectedLocation && (
          <div className="space-y-2">
            {results.map((result, index) => (
              <button
                key={index}
                onClick={() => handleSelectLocation(result.location)}
                className="w-full text-left px-4 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg transition-colors"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{result.location}</span>
                  <span className="text-sm text-zinc-500">
                    {formatYear(result.firstAppearance)} ~ {formatYear(result.lastAppearance)}
                  </span>
                </div>
                <div className="text-sm text-zinc-400 mt-1">
                  {result.events.length} {t('location.events') || '个相关事件'}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* 暂无结果 */}
        {query.length >= 2 && results.length === 0 && (
          <div className="text-center text-zinc-500 py-8">
            {t('location.noResults') || '未找到相关地点'}
          </div>
        )}

        {/* 历史详情 */}
        {selectedLocation && history && (
          <div>
            <button
              onClick={() => {
                setSelectedLocation(null);
                setHistory(null);
              }}
              className="mb-4 text-blue-400 hover:text-blue-300"
            >
              ← {t('location.back') || '返回搜索'}
            </button>
            
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">{selectedLocation}</h2>
              
              {/* 时间线 */}
              <div className="relative">
                {/* 竖线 */}
                <div className="absolute left-4 top-0 bottom-0 w-px bg-zinc-700" />
                
                {/* 事件列表 */}
                <div className="space-y-6">
                  {history.timeline.map((item, index) => (
                    <div key={index} className="relative pl-12">
                      {/* 圆点 */}
                      <div className="absolute left-2.5 w-3 h-3 bg-blue-500 rounded-full" />
                      
                      <div className="bg-zinc-800/50 rounded-lg p-4">
                        <div className="text-blue-400 font-medium mb-1">
                          {formatYear(item.year)}
                        </div>
                        <div className="font-medium mb-1">
                          {item.event.titleKey ? t(item.event.titleKey) : item.event.title}
                        </div>
                        {item.event.summaryKey && (
                          <div className="text-sm text-zinc-400">
                            {t(item.event.summaryKey)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
