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

  // 获取当前年份活跃的帝国
  const activeBoundaries = React.useMemo(
    () => getActiveBoundaries(year, mode),
    [year, mode]
  );

  const boundaries = mode === 'eurasian' ? eurasianBoundaries : eastAsiaBoundaries;

  // 获取活跃帝国名称列表
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

        {/* 帝国边界 */}
        {activeBoundaries.map((boundary, index) => (
          <Source
            key={`${boundary.properties.nameKey}-${index}`}
            id={`empire-${index}`}
            type="geojson"
            data={boundary}
          >
            <Layer
              id={`empire-fill-${index}`}
              type="fill"
              paint={{
                'fill-color': boundary.properties.color,
                'fill-opacity': 0.35,
              }}
            />
            <Layer
              id={`empire-line-${index}`}
              type="line"
              paint={{
                'line-color': boundary.properties.color,
                'line-width': 2,
                'line-opacity': 0.8,
              }}
            />
          </Source>
        ))}

        {/* 帝国中心点标记 */}
        {activeBoundaries.map((boundary, index) => {
          // 简单计算多边形中心（实际应该用更精确的算法）
          const coords = boundary.geometry.type === 'Polygon' 
            ? boundary.geometry.coordinates[0] 
            : boundary.geometry.type === 'MultiPolygon'
            ? boundary.geometry.coordinates[0][0]
            : [];
          
          if (coords.length === 0) return null;
          
          const centerLon = coords.reduce((sum, c) => sum + c[0], 0) / coords.length;
          const centerLat = coords.reduce((sum, c) => sum + c[1], 0) / coords.length;

          return (
            <Marker
              key={`marker-${index}`}
              longitude={centerLon}
              latitude={centerLat}
              anchor="center"
            >
              <button
                type="button"
                onClick={(ev) => {
                  ev.stopPropagation();
                  setSelectedEmpire(boundary);
                }}
                className="px-2 py-1 text-xs font-bold text-white rounded-full shadow-md hover:scale-110 transition-transform"
                style={{ backgroundColor: boundary.properties.color }}
              >
                {t(boundary.properties.nameKey)}
              </button>
            </Marker>
          );
        })}

        {/* 选中帝国弹出框 */}
        {selectedEmpire ? (
          <Popup
            longitude={
              selectedEmpire.geometry.type === 'Polygon'
                ? selectedEmpire.geometry.coordinates[0][0][0]
                : selectedEmpire.geometry.coordinates[0][0][0][0]
            }
            latitude={
              selectedEmpire.geometry.type === 'Polygon'
                ? selectedEmpire.geometry.coordinates[0][0][1]
                : selectedEmpire.geometry.coordinates[0][0][0][1]
            }
            anchor="top"
            closeButton
            closeOnClick={false}
            onClose={() => setSelectedEmpire(null)}
            maxWidth="280px"
          >
            <div className="space-y-2 p-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedEmpire.properties.color }}
                />
                <h3 className="font-semibold text-gray-900">
                  {t(selectedEmpire.properties.nameKey)}
                </h3>
              </div>
              <div className="text-sm text-gray-600">
                {formatYear(selectedEmpire.properties.startYear)} — {formatYear(selectedEmpire.properties.endYear)}
              </div>
            </div>
          </Popup>
        ) : null}
      </Map>

      {/* 当前活跃帝国列表 */}
      <div className="absolute left-3 top-3 z-10 bg-black/70 backdrop-blur-sm rounded-lg p-2 max-w-[200px]">
        <div className="text-xs text-white/70 mb-1">
          {year > 0 ? year : Math.abs(year)} {year < 0 ? 'BCE' : 'CE'}
        </div>
        <div className="flex flex-wrap gap-1">
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
