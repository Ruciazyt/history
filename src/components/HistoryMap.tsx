'use client';

import * as React from 'react';
import Map, {
  Marker,
  Popup,
  NavigationControl,
  Source,
  Layer,
  type MapLib,
} from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import type { Event } from '@/lib/history/types';
import { formatYear } from '@/lib/history/utils';
import { useTranslations } from 'next-intl';
import { dynastyBoundaries } from '@/lib/history/data/dynastyBoundaries';
import { getActiveBoundaries, getWorldEraBounds } from '@/lib/history/data/worldBoundaries';
import { getBattles } from '@/lib/history/battles';
import { YearSlider } from '@/components/common/YearSlider';

export function HistoryMap({
  events,
  openEraIds,
  year,
  mode = 'china',
  worldMode = 'eurasian',
  onYearChange,
  initialCenter = { lon: 112.45, lat: 34.62 },
  initialZoom = 4,
}: {
  events?: Event[];
  openEraIds?: Set<string>;
  year?: number;
  mode?: 'china' | 'eurasian' | 'east-asia';
  worldMode?: 'eurasian' | 'east-asia';
  onYearChange?: (year: number) => void;
  initialCenter?: { lon: number; lat: number };
  initialZoom?: number;
}) {
  const t = useTranslations();
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const selected = React.useMemo(
    () => events?.find((e) => e.id === selectedId) ?? null,
    [events, selectedId]
  );

  const mappable = React.useMemo(
    () => events?.filter((e) => e.location && Number.isFinite(e.location.lon) && Number.isFinite(e.location.lat)) ?? [],
    [events]
  );

  // 分离战役和普通事件
  const { battles, normalEvents } = React.useMemo(() => {
    if (!events) return { battles: [], normalEvents: [] };
    const battleIds = new Set(getBattles(events).map((b) => b.id));
    return {
      battles: mappable.filter((e) => battleIds.has(e.id)),
      normalEvents: mappable.filter((e) => !battleIds.has(e.id)),
    };
  }, [mappable, events]);

  // 中国王朝边界
  const activeBoundaries = React.useMemo(() => {
    if (!openEraIds || openEraIds.size === 0 || mode !== 'china') return [];
    return Array.from(openEraIds)
      .filter((id) => dynastyBoundaries[id])
      .map((id) => ({ id, feature: dynastyBoundaries[id] }));
  }, [openEraIds, mode]);

  // 世界帝国边界（基于年份）
  const worldBoundaries = React.useMemo(() => {
    if (!year || mode === 'china') return [];
    return getActiveBoundaries(year, worldMode);
  }, [year, mode, worldMode]);

  // 世界帝国时间范围
  const worldEraBounds = React.useMemo(() => {
    if (mode === 'china') return null;
    return getWorldEraBounds(worldMode);
  }, [mode, worldMode]);

  // 播放功能
  React.useEffect(() => {
    if (!isPlaying || !onYearChange || !worldEraBounds) return;

    const interval = setInterval(() => {
      const currentYear = year || worldEraBounds.min;
      if (currentYear < worldEraBounds.max) {
        onYearChange(currentYear + 10);
      } else {
        setIsPlaying(false);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [isPlaying, year, worldEraBounds, onYearChange]);

  const playToggle = () => {
    setIsPlaying(!isPlaying);
  };

  // 根据模式确定地图中心
  const mapCenter = React.useMemo(() => {
    if (mode === 'china') return initialCenter;
    if (mode === 'eurasian') return { lon: 50, lat: 35 };
    return { lon: 115, lat: 25 };
  }, [mode, initialCenter]);

  const mapZoom = React.useMemo(() => {
    if (mode === 'china') return initialZoom;
    return 2;
  }, [mode, initialZoom]);

  return (
    <div className="h-full w-full overflow-hidden rounded-xl border border-zinc-200 bg-white flex flex-col">
      {/* 时间轴（仅世界模式显示） */}
      {mode !== 'china' && worldEraBounds && onYearChange && (
        <YearSlider
          year={year || worldEraBounds.min}
          minYear={worldEraBounds.min}
          maxYear={worldEraBounds.max}
          onYearChange={onYearChange}
          isPlaying={isPlaying}
          onPlayToggle={playToggle}
        />
      )}

      <div className="flex-1 relative">
        <Map
          mapLib={maplibregl as unknown as MapLib}
          initialViewState={{
            longitude: mapCenter.lon,
            latitude: mapCenter.lat,
            zoom: mapZoom,
          }}
          style={{ width: '100%', height: '100%' }}
          mapStyle="https://tiles.openfreemap.org/styles/liberty"
          onClick={() => setSelectedId(null)}
        >
          <div className="absolute right-3 top-3 z-10">
            <NavigationControl visualizePitch />
          </div>

          {/* 中国王朝边界 */}
          {mode === 'china' && activeBoundaries.map(({ id, feature }) => (
            <Source key={id} id={`boundary-${id}`} type="geojson" data={feature}>
              <Layer
                id={`fill-${id}`}
                type="fill"
                paint={{
                  'fill-color': '#DC6432',
                  'fill-opacity': 0.2,
                }}
              />
              <Layer
                id={`line-${id}`}
                type="line"
                paint={{
                  'line-color': '#DC6432',
                  'line-width': 2,
                  'line-opacity': 0.8,
                }}
              />
            </Source>
          ))}

          {/* 世界帝国边界 */}
          {worldBoundaries.map((boundary, idx) => (
            <Source key={`world-${idx}`} id={`world-boundary-${idx}`} type="geojson" data={boundary}>
              <Layer
                id={`world-fill-${idx}`}
                type="fill"
                paint={{
                  'fill-color': boundary.properties.color,
                  'fill-opacity': 0.25,
                }}
              />
              <Layer
                id={`world-line-${idx}`}
                type="line"
                paint={{
                  'line-color': boundary.properties.color,
                  'line-width': 2,
                  'line-opacity': 0.8,
                }}
              />
            </Source>
          ))}

          {/* 普通事件标记 - 红色圆点 */}
          {mode === 'china' && normalEvents.map((e) => (
            <Marker
              key={e.id}
              longitude={e.location!.lon}
              latitude={e.location!.lat}
              anchor="bottom"
            >
              <button
                type="button"
                onClick={(ev) => {
                  ev.stopPropagation();
                  setSelectedId(e.id);
                }}
                className="h-3 w-3 rounded-full bg-red-600 ring-2 ring-white shadow hover:scale-125 transition-transform"
                aria-label={`Event: ${t(e.titleKey)}`}
              />
            </Marker>
          ))}

          {/* 战役标记 - 剑图标 */}
          {mode === 'china' && battles.map((e) => (
            <Marker
              key={e.id}
              longitude={e.location!.lon}
              latitude={e.location!.lat}
              anchor="bottom"
            >
              <button
                type="button"
                onClick={(ev) => {
                  ev.stopPropagation();
                  setSelectedId(e.id);
                }}
                className="flex items-center justify-center w-6 h-6 rounded-full bg-red-600 ring-2 ring-white shadow hover:scale-125 transition-transform text-white text-xs font-bold"
                aria-label={`Battle: ${t(e.titleKey)}`}
              >
                ⚔️
              </button>
            </Marker>
          ))}

          {selected?.location && (
            <Popup
              longitude={selected.location.lon}
              latitude={selected.location.lat}
              anchor="top"
              closeButton
              closeOnClick={false}
              onClose={() => setSelectedId(null)}
              maxWidth="320px"
            >
              <div className="space-y-1">
                <div className="text-xs text-zinc-500">{formatYear(selected.year)}</div>
                <div className="text-sm font-semibold text-zinc-900">{t(selected.titleKey)}</div>
                <div className="text-sm text-zinc-700">{t(selected.summaryKey)}</div>
                {selected.location.label ? (
                  <div className="text-xs text-zinc-500">📍 {selected.location.label}</div>
                ) : null}
              </div>
            </Popup>
          )}
        </Map>

        {/* 图例 */}
        {worldBoundaries.length > 0 && (
          <div className="absolute left-3 bottom-3 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs shadow-lg max-h-48 overflow-y-auto">
            <div className="font-semibold mb-2">{t('map.legend') || '图例'}</div>
            <div className="space-y-1">
              {worldBoundaries.map((b, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: b.properties.color }}
                  />
                  <span>{t(b.properties.nameKey)}</span>
                  <span className="text-zinc-400 text-[10px]">
                    ({formatYear(b.properties.startYear)}-{formatYear(b.properties.endYear)})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
