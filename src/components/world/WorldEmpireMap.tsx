'use client';

import * as React from 'react';
import Map, { Marker, Popup, NavigationControl, Source, Layer, type MapLib } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { formatYear } from '@/lib/history/utils';
import { useTranslations } from 'next-intl';
import {
  eurasianBoundaries,
  eastAsiaBoundaries,
  getActiveBoundaries,
  type WorldBoundary,
} from '@/lib/history/data/worldBoundaries';

interface WorldEmpireMapProps {
  year: number;
  mode: 'eurasian' | 'east-asia';
  initialCenter?: { lon: number; lat: number };
  initialZoom?: number;
  onYearChange?: (year: number) => void;
}

export function WorldEmpireMap({
  year,
  mode,
  initialCenter = { lon: 90, lat: 35 },
  initialZoom = 2,
  onYearChange,
}: WorldEmpireMapProps) {
  const t = useTranslations();
  const [selectedEmpire, setSelectedEmpire] = React.useState<WorldBoundary | null>(null);

  const activeBoundaries = React.useMemo(
    () => getActiveBoundaries(year, mode),
    [year, mode]
  );

  const activeEmpireNames = React.useMemo(
    () => activeBoundaries.map((b) => t(b.properties.nameKey)),
    [activeBoundaries, t]
  );

  return (
    <div className="h-full w-full overflow-hidden rounded-xl border border-zinc-200 bg-white relative">
      <Map
        mapLib={maplibregl as unknown as MapLib}
        initialViewState={{
          longitude: initialCenter.lon,
          latitude: initialCenter.lat,
          zoom: initialZoom,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
        onClick={() => setSelectedEmpire(null)}
      >
        <div className="absolute right-3 top-3 z-10">
          <NavigationControl visualizePitch />
        </div>

        {activeBoundaries.map((boundary, index) => (
          <Source
            key={`${boundary.properties.nameKey}-${index}`}
            id={`empire-${index}`}
            type="geojson"
            data={{
              type: 'Feature',
              properties: boundary.properties,
              geometry: boundary.geometry
            }}
          >
            <Layer
              id={`empire-fill-${index}`}
              type="fill"
              paint={{
                'fill-color': boundary.properties.color,
                'fill-opacity': 0.3,
              }}
            />
            <Layer
              id={`empire-line-${index}`}
              type="line"
              paint={{
                'line-color': boundary.properties.color,
                'line-width': 2,
              }}
            />
          </Source>
        ))}
      </Map>

      {/* 底部帝国列表 */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-zinc-200 p-3">
        <div className="flex flex-wrap gap-2">
          {activeBoundaries.map((b, i) => (
            <span
              key={i}
              className="px-1.5 py-0.5 text-[10px] text-white rounded"
              style={{ backgroundColor: b.properties.color }}
            >
              {t(b.properties.nameKey)}
            </span>
          ))}
          {activeBoundaries.length === 0 && (
            <span className="text-xs text-white/50">No empires</span>
          )}
        </div>
      </div>
    </div>
  );
}
