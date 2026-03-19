'use client';

import * as React from 'react';
import { placeNameChanges, type PlaceNameChange } from '@/lib/history/data/placeNameChanges';
import { formatYear } from '@/lib/history/utils';

interface PlaceNameEvolutionProps {
  initialPlaceId?: string;
}

const REGION_COLORS: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  china: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', badge: 'bg-red-100 text-red-700' },
  korea: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700' },
  japan: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', badge: 'bg-pink-100 text-pink-700' },
  'central-asia': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700' },
  west: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700' },
};

const TYPE_LABELS: Record<string, { zh: string; en: string }> = {
  capital: { zh: '首都', en: 'Capital' },
  'major-city': { zh: '重镇', en: 'Major City' },
  regional: { zh: '区域城市', en: 'Regional' },
};

const REGION_LABELS: Record<string, { zh: string; en: string }> = {
  china: { zh: '中国', en: 'China' },
  korea: { zh: '朝鲜半岛', en: 'Korea' },
  japan: { zh: '日本', en: 'Japan' },
  'central-asia': { zh: '中亚/西域', en: 'Central Asia' },
  west: { zh: '西方', en: 'West' },
};

function getLocaleText(locale: string, zh: string, en: string): string {
  return locale === 'en' ? en : zh;
}

function PlaceCard({ place, locale }: { place: PlaceNameChange; locale: string }) {
  const colors = REGION_COLORS[place.region]!;
  const [expanded, setExpanded] = React.useState(false);

  // 计算时间跨度（用于显示宽度比例）
  const allStart = Math.min(...place.names.map(n => n.startYear));
  const allEnd = Math.max(...place.names.map(n => n.endYear));
  const totalSpan = allEnd - allStart;

  // 计算当前有效名称
  const currentYear = new Date().getFullYear();
  const currentName = place.names.find(n => currentYear >= n.startYear && currentYear <= n.endYear);
  const _earliestName = place.names[0];
  const _latestName = place.names[place.names.length - 1];

  return (
    <div className={`rounded-xl border ${colors.border} ${colors.bg} overflow-hidden transition-all duration-200`}>
      {/* 卡片头部 */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-3 flex items-start justify-between gap-3 hover:bg-black/5 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={`font-semibold text-base ${colors.text}`}>{place.modernName}</h3>
            <span className={`text-xs px-1.5 py-0.5 rounded ${colors.badge}`}>
              {getLocaleText(locale, TYPE_LABELS[place.type]!.zh, TYPE_LABELS[place.type]!.en)}
            </span>
          </div>
          <div className={`text-xs ${colors.text} opacity-70 mt-0.5`}>
            {getLocaleText(locale, REGION_LABELS[place.region]!.zh, REGION_LABELS[place.region]!.en)}
            {' · '}
            {place.names.length} {getLocaleText(locale, '个名称', 'names')}
            {' · '}
            {formatYear(allStart)} – {formatYear(allEnd)}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {currentName && (
            <span className={`text-sm font-medium ${colors.text}`}>{currentName.name}</span>
          )}
          <span className={`text-xs ${colors.text} opacity-60`}>{expanded ? '▲' : '▼'}</span>
        </div>
      </button>

      {/* 时间轴展开视图 */}
      {expanded && (
        <div className="px-4 pb-4">
          {/* 简化时间轴 */}
          <div className="relative mt-2 mb-3">
            {/* 时间轴线 */}
            <div className={`absolute left-0 right-0 top-1/2 h-0.5 ${colors.border.replace('border', 'bg')}`} />
            
            {/* 名称节点 */}
            <div className="relative flex items-center justify-between py-2">
              {place.names.map((nameEntry, index) => {
                const startPos = ((nameEntry.startYear - allStart) / totalSpan) * 100;
                const endPos = ((nameEntry.endYear - allStart) / totalSpan) * 100;
                const width = endPos - startPos;
                const _isFirst = index === 0;
                const _isLast = index === place.names.length - 1;
                
                return (
                  <div
                    key={index}
                    className="absolute flex flex-col items-center"
                    style={{
                      left: `${startPos}%`,
                      width: `${Math.max(width, 2)}%`,
                    }}
                  >
                    <div
                      className={`h-3 w-3 rounded-full border-2 ${colors.border.replace('border', 'bg').replace('50', '500')} ${colors.bg} border-current`}
                      style={{ borderColor: colors.border.includes('red') ? '#fca5a5' : colors.border.includes('blue') ? '#93c5fd' : colors.border.includes('pink') ? '#f9a8d4' : colors.border.includes('amber') ? '#fcd34d' : '#c4b5fd' }}
                    />
                    <div className={`mt-1 text-[10px] font-medium text-center leading-tight ${colors.text} whitespace-nowrap`}>
                      {nameEntry.name}
                    </div>
                    <div className={`text-[9px] ${colors.text} opacity-60 text-center whitespace-nowrap`}>
                      {formatYear(nameEntry.startYear)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 详细列表 */}
          <div className="space-y-2">
            {place.names.map((nameEntry, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-2 rounded-lg ${index % 2 === 0 ? 'bg-black/3' : ''}`}
              >
                {/* 连接线 */}
                <div className="flex flex-col items-center shrink-0 pt-1">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${colors.badge}`}
                    style={{ backgroundColor: colors.bg.includes('red') ? '#fee2e2' : colors.bg.includes('blue') ? '#dbeafe' : colors.bg.includes('pink') ? '#fce7f3' : colors.bg.includes('amber') ? '#fef3c7' : '#f3e8ff' }}
                  />
                  {index < place.names.length - 1 && (
                    <div className={`w-0.5 flex-1 min-h-[20px] ${colors.border.replace('border', 'bg')}`} />
                  )}
                </div>

                {/* 内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className={`font-semibold ${colors.text}`}>{nameEntry.name}</span>
                    {nameEntry.era && (
                      <span className={`text-xs ${colors.text} opacity-70`}>{nameEntry.era}</span>
                    )}
                    {nameEntry.note && (
                      <span className={`text-xs ${colors.text} opacity-50 italic`}>{nameEntry.note}</span>
                    )}
                  </div>
                  <div className={`text-xs ${colors.text} opacity-60`}>
                    {formatYear(nameEntry.startYear)} – {formatYear(nameEntry.endYear)}
                    {' · '}
                    {nameEntry.endYear - nameEntry.startYear} {getLocaleText(locale, '年', 'years')}
                  </div>
                </div>

                {/* 箭头 */}
                {index < place.names.length - 1 && (
                  <div className={`text-xs ${colors.text} opacity-40 shrink-0 mt-1`}>→</div>
                )}
              </div>
            ))}
          </div>

          {/* 名称演变流程 */}
          <div className={`mt-3 p-2 rounded-lg bg-black/5 text-center`}>
            <span className={`text-xs ${colors.text} opacity-70`}>
              {place.names.map(n => n.name).join(' → ')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export function PlaceNameEvolution({ initialPlaceId: _initialPlaceId }: PlaceNameEvolutionProps) {
  const [selectedRegion, setSelectedRegion] = React.useState<string>('all');
  const [selectedType, setSelectedType] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [locale, setLocale] = React.useState('zh');

  // 过滤数据
  const filteredPlaces = React.useMemo(() => {
    return placeNameChanges.filter(place => {
      if (selectedRegion !== 'all' && place.region !== selectedRegion) return false;
      if (selectedType !== 'all' && place.type !== selectedType) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = place.names.some(n => n.name.toLowerCase().includes(query));
        const matchesModern = place.modernName.toLowerCase().includes(query);
        if (!matchesName && !matchesModern) return false;
      }
      return true;
    });
  }, [selectedRegion, selectedType, searchQuery]);

  // 按区域分组
  const groupedPlaces = React.useMemo(() => {
    const groups: Record<string, PlaceNameChange[]> = {};
    for (const place of filteredPlaces) {
      if (!groups[place.region]) groups[place.region] = [];
      groups[place.region]!.push(place);
    }
    return groups;
  }, [filteredPlaces]);

  const regions = ['all', 'china', 'korea', 'japan', 'central-asia', 'west'];
  const types = ['all', 'capital', 'major-city', 'regional'];

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-zinc-900">
                {locale === 'zh' ? '🏛️ 地名演化' : '🏛️ Place Name Evolution'}
              </h1>
              <p className="text-sm text-zinc-500 mt-0.5">
                {locale === 'zh' ? '城市名称的历史变迁' : 'Historical changes of city names across time'}
              </p>
            </div>
            <button
              onClick={() => setLocale(l => l === 'zh' ? 'en' : 'zh')}
              className="px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-600 text-sm hover:bg-zinc-200 transition-colors"
            >
              {locale === 'zh' ? 'EN' : '中文'}
            </button>
          </div>

          {/* 搜索框 */}
          <div className="relative mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={locale === 'zh' ? '搜索城市名称...' : 'Search city names...'}
              className="w-full px-4 py-2 pl-10 rounded-lg bg-zinc-50 border border-zinc-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">🔍</span>
          </div>

          {/* 过滤器 */}
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedRegion}
              onChange={e => setSelectedRegion(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-700 text-sm border-0 focus:outline-none focus:ring-1 focus:ring-zinc-300"
            >
              {regions.map(r => (
                <option key={r} value={r}>
                  {r === 'all' ? (locale === 'zh' ? '全部地区' : 'All Regions') : getLocaleText(locale, REGION_LABELS[r]?.zh || r, REGION_LABELS[r]?.en || r)}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-700 text-sm border-0 focus:outline-none focus:ring-1 focus:ring-zinc-300"
            >
              {types.map(t => (
                <option key={t} value={t}>
                  {t === 'all' ? (locale === 'zh' ? '全部类型' : 'All Types') : getLocaleText(locale, TYPE_LABELS[t]?.zh || t, TYPE_LABELS[t]?.en || t)}
                </option>
              ))}
            </select>

            <span className="ml-auto text-sm text-zinc-500 self-center">
              {filteredPlaces.length} {locale === 'zh' ? '个城市' : 'cities'}
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {filteredPlaces.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🏛️</div>
            <p className="text-zinc-500">
              {locale === 'zh' ? '未找到匹配的城市' : 'No matching cities found'}
            </p>
          </div>
        ) : selectedRegion === 'all' ? (
          // 按区域分组展示
          <div className="space-y-8">
            {Object.entries(groupedPlaces).map(([region, places]) => {
              const colors = REGION_COLORS[region] ?? REGION_COLORS.china!;
              return (
                <section key={region}>
                  <h2 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${colors.text}`}>
                    <span className={`w-3 h-3 rounded-full ${colors.badge}`} style={{ backgroundColor: colors.bg.includes('red') ? '#DC2626' : colors.bg.includes('blue') ? '#2563EB' : colors.bg.includes('pink') ? '#DB2777' : colors.bg.includes('amber') ? '#D97706' : '#7C3AED' }} />
                    {getLocaleText(locale, REGION_LABELS[region]?.zh || region, REGION_LABELS[region]?.en || region)}
                    <span className="text-sm font-normal opacity-60">{places.length}</span>
                  </h2>
                  <div className="grid gap-3">
                    {places.map(place => (
                      <PlaceCard key={place.modernName} place={place} locale={locale} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          // 直接列表展示
          <div className="grid gap-3">
            {filteredPlaces.map(place => (
              <PlaceCard key={place.modernName} place={place} locale={locale} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
