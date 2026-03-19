'use client';

import * as React from 'react';
import { PLACE_EVOLUTIONS, type PlaceEvolution } from '@/lib/history/data/placeNameEvolution';
import { formatYear } from '@/lib/history/utils';

function PlaceCard({ place }: { place: PlaceEvolution }) {
  const [expanded, setExpanded] = React.useState(false);

  const allStart = Math.min(...place.names.map(n => n.startYear));
  const allEnd = Math.max(...place.names.map(n => n.endYear));
  const totalSpan = allEnd - allStart;

  const currentYear = new Date().getFullYear();
  const currentName = place.names.find(n => currentYear >= n.startYear && currentYear <= n.endYear);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden transition-all duration-200">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-3 flex items-start justify-between gap-3 hover:bg-zinc-50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-base text-zinc-900">{place.modernName}</h3>
          </div>
          <div className="text-xs text-zinc-500 mt-0.5">
            {place.names.length} 个历史名称 · {formatYear(allStart)} – {formatYear(allEnd)}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {currentName && (
            <span className="text-sm font-medium text-red-600">{currentName.name}</span>
          )}
          <span className="text-xs text-zinc-400">{expanded ? '▲' : '▼'}</span>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4">
          <div className="relative mt-2 mb-3">
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-zinc-200" />
            <div className="relative flex items-center justify-between py-2">
              {place.names.map((nameEntry, index) => {
                const startPos = ((nameEntry.startYear - allStart) / totalSpan) * 100;
                const endPos = ((nameEntry.endYear - allStart) / totalSpan) * 100;
                const width = Math.max(endPos - startPos, 2);
                const isCurrent = currentYear >= nameEntry.startYear && currentYear <= nameEntry.endYear;

                return (
                  <div key={index} className="absolute" style={{ left: `${startPos}%`, width: `${width}%` }}>
                    <div
                      className={`h-6 rounded-full flex items-center justify-center text-xs font-medium truncate px-1 ${
                        isCurrent ? 'bg-red-500 text-white' : 'bg-zinc-200 text-zinc-600'
                      }`}
                      style={{ width: '100%' }}
                    >
                      {nameEntry.name}
                    </div>
                    <div className="text-center text-[10px] text-zinc-400 mt-1">
                      {formatYear(nameEntry.startYear)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 详细列表 */}
          <div className="space-y-2">
            {place.names.map((nameEntry, index) => {
              const isCurrent = currentYear >= nameEntry.startYear && currentYear <= nameEntry.endYear;
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-2 rounded-lg ${
                    isCurrent ? 'bg-red-50 border border-red-200' : 'bg-zinc-50'
                  }`}
                >
                  <div className="w-20 text-sm font-medium text-zinc-700">
                    {formatYear(nameEntry.startYear)} - {formatYear(nameEntry.endYear)}
                  </div>
                  <div className={`flex-1 text-sm font-semibold ${isCurrent ? 'text-red-600' : 'text-zinc-800'}`}>
                    {nameEntry.name}
                  </div>
                  {nameEntry.dynasty && (
                    <div className="text-xs text-zinc-500">{nameEntry.dynasty}</div>
                  )}
                  {isCurrent && (
                    <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded">当前</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function PlaceNameEvolution({}: {
  initialPlaceId?: string;
}) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [locale, setLocale] = React.useState('zh');

  const filteredPlaces = React.useMemo(() => {
    if (!searchQuery) return PLACE_EVOLUTIONS;
    const query = searchQuery.toLowerCase();
    return PLACE_EVOLUTIONS.filter(place => {
      const matchesName = place.names.some(n => n.name.toLowerCase().includes(query));
      const matchesModern = place.modernName.toLowerCase().includes(query);
      return matchesName || matchesModern;
    });
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-zinc-900">
                🏛️ {locale === 'zh' ? '地名演化' : 'Place Name Evolution'}
              </h1>
              <p className="text-sm text-zinc-500 mt-0.5">
                {locale === 'zh' ? '城市名称的历史变迁' : 'Historical changes of city names'}
              </p>
            </div>
            <button
              onClick={() => setLocale(l => l === 'zh' ? 'en' : 'zh')}
              className="px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-600 text-sm hover:bg-zinc-200 transition-colors"
            >
              {locale === 'zh' ? 'EN' : '中文'}
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={locale === 'zh' ? '搜索城市名称...' : 'Search city names...'}
              className="w-full px-4 py-2 pl-10 rounded-lg bg-zinc-50 border border-zinc-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">🔍</span>
          </div>

          <div className="mt-2 text-sm text-zinc-500">
            {filteredPlaces.length} {locale === 'zh' ? '个城市' : 'cities'}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {filteredPlaces.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🏛️</div>
            <p className="text-zinc-500">
              {locale === 'zh' ? '未找到匹配的城市' : 'No matching cities found'}
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredPlaces.map(place => (
              <PlaceCard key={place.modernName} place={place} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
