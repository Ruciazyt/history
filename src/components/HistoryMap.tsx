'use client';

import * as React from 'react';
import Map, { Marker, Popup, NavigationControl, Source, Layer, type MapLib } from 'react-map-gl/maplibre';
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

  const { battles, normalEvents } = React.useMemo(() => {
    if (!events) return { battles: [], normalEvents: [] };
    const battleIds = new Set(getBattles(events).map((b) => b.id));
    return {
      battles: mappable.filter((e) => battleIds.has(e.id)),
      normalEvents: mappable.filter((e) => !battleIds.has(e.id)),
    };
  }, [mappable, events]);

  const activeBoundaries = React.useMemo(() => {
    if (!openEraIds || openEraIds.size === 0 || mode !== 'china') return [];
    return Array.from(openEraIds)
      .filter((id) => dynastyBoundaries[id])
      .map((id) => ({ id, feature: dynastyBoundaries[id] }));
  }, [openEraIds, mode]);

  const worldBoundaries = React.useMemo(() => {
    if (!year || mode === 'china') return [];
    return getActiveBoundaries(year, worldMode);
  }, [year, mode, worldMode]);

  const worldEraBounds = React.useMemo(() => {
    if (mode === 'china') return null;
    return getWorldEraBounds(worldMode);
  }, [mode, worldMode]);

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
      {mode !== 'china' && worldEraBounds && onYearChange && (
        <YearSlider
          year={year || worldEraBounds.min}
          minYear={worldEraBounds.min}
          maxYear={worldEraBounds.max}
          onYearChange={onYearChange}
          isPlaying={isPlaying}
          onPlayToggle={() => setIsPlaying(!isPlaying)}
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
          mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
          onClick={() => setSelectedId(null)}
        >
          <div className="absolute right-3 top-3 z-10">
            <NavigationControl visualizePitch />
          </div>

          {mode === 'china' && activeBoundaries.map(({ id, feature }) => (
            <Source key={id} id={`boundary-${id}`} type="geojson" data={feature}>
              <Layer
                id={`fill-${id}`}
                type="fill"
                paint={{ 'fill-color': '#DC6432', 'fill-opacity': 0.2 }}
              />
              <Layer
                id={`line-${id}`}
                type="line"
                paint={{ 'line-color': '#DC6432', 'line-width': 2, 'line-opacity': 0.8 }}
              />
            </Source>
          ))}

          {worldBoundaries.map((boundary, idx) => (
            <Source key={`world-${idx}`} id={`world-boundary-${idx}`} type="geojson" data={boundary}>
              <Layer
                id={`world-fill-${idx}`}
                type="fill"
                paint={{ 'fill-color': boundary.properties.color, 'fill-opacity': 0.25 }}
              />
              <Layer
                id={`world-line-${idx}`}
                type="line"
                paint={{ 'line-color': boundary.properties.color, 'line-width': 2, 'line-opacity': 0.8 }}
              />
            </Source>
          ))}

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
              />
            </Marker>
          ))}

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
                className="flex items-center justify-center w-6 h-6 rounded-full bg-red-600 ring-2 ring-white shadow hover:scale-125 transition-transform text-white text-xs"
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
                <div className="text-sm font-semibold">{t(selected.titleKey)}</div>
                <div className="text-sm">{t(selected.summaryKey)}</div>
                {selected.location.label && (
                  <div className="text-xs text-zinc-500">📍 {selected.location.label}</div>
                )}
              </div>
            </Popup>
          )}
        </Map>

        {worldBoundaries.length > 0 && (
          <div className="absolute right-4 bottom-4 bg-white/95 backdrop-blur-sm rounded-lg shadow p-3 z-10">
            <div className="text-xs font-medium text-zinc-500 mb-2">图例</div>
            <div className="flex flex-wrap gap-2">
              {worldBoundaries.slice(0, 6).map((b, i) => (
                <div key={i} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: b.properties.color }} />
                  <span className="text-xs">{t(b.properties.nameKey)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
