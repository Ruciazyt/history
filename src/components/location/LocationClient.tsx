'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { searchPlaceEvolution, getPlaceEvolution, type PlaceEvolution } from '@/lib/history/data/placeNameEvolution';
import { formatYear } from '@/lib/history/utils';

interface LocationClientProps {
  locale: string;
}

export function LocationClient({ locale: _locale }: LocationClientProps) {
  const t = useTranslations();
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<PlaceEvolution[]>([]);
  const [selectedPlace, setSelectedPlace] = React.useState<PlaceEvolution | null>(null);

  // 搜索处理
  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.length >= 1) {
      const searchResults = searchPlaceEvolution(value);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  };

  // 选择地点
  const handleSelectPlace = (modernName: string) => {
    const evolution = getPlaceEvolution(modernName);
    if (evolution) {
      setSelectedPlace(evolution);
    }
  };

  // 计算年代范围
  const getTimeRange = (startYear: number, endYear: number): string => {
    const start = formatYear(startYear, locale);
    const end = endYear >= 2026 ? t('location.modernLabel') : formatYear(endYear, locale);
    return `${start} - ${end}`;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* 标题 */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            📍 {t('location.title')}
          </h1>
          <p className="text-zinc-400">
            {t('location.description')}
          </p>
        </header>

        {/* 搜索框 */}
        <div className="mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={t('location.placeholder')}
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-lg focus:outline-none focus:border-blue-500"
            autoFocus
          />
        </div>

        {/* 搜索结果 */}
        {query.length >= 1 && results.length > 0 && !selectedPlace && (
          <div className="space-y-2">
            {results.map((place, index) => (
              <button
                key={index}
                onClick={() => handleSelectPlace(place.modernName)}
                className="w-full text-left px-4 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg transition-colors"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-lg">{place.modernName}</span>
                  <span className="text-sm text-zinc-500">
                    {place.names.length} 个历史名称
                  </span>
                </div>
                <div className="text-sm text-zinc-400 mt-1">
                  {place.names[0]?.name} → {place.names[place.names.length - 1]?.name}
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

        {/* 地名演变详情 */}
        {selectedPlace && (
          <div>
            <button
              onClick={() => {
                setSelectedPlace(null);
                setQuery('');
              }}
              className="mb-4 text-blue-400 hover:text-blue-300"
            >
              ← {t('location.back')}
            </button>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-2">{selectedPlace.modernName}</h2>
              <p className="text-zinc-400 text-sm mb-6">
                {selectedPlace.names.length} {t('location.historyNames')}
              </p>

              {/* 时间线 */}
              <div className="relative">
                {/* 竖线 */}
                <div className="absolute left-4 top-0 bottom-0 w-px bg-zinc-700" />

                {/* 名称列表 */}
                <div className="space-y-6">
                  {selectedPlace.names.map((record, index) => (
                    <div key={index} className="relative pl-12">
                      {/* 圆点 */}
                      <div className="absolute left-2.5 top-4 w-3 h-3 bg-blue-500 rounded-full" />

                      <div className="bg-zinc-800/50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xl font-bold text-yellow-400">
                            {record.name}
                          </span>
                          <span className="text-sm text-zinc-500">
                            {record.dynasty}
                          </span>
                        </div>
                        <div className="text-sm text-blue-400">
                          {getTimeRange(record.startYear, record.endYear)}
                        </div>
                        {record.notes && (
                          <div className="text-sm text-zinc-400 mt-2">
                            {record.notes}
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
;
