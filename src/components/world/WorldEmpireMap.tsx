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
  getActiveBoundaries,
  type WorldBoundary,
} from '@/lib/history/data/worldBoundaries';
import { WORLD_VIEW_COLORS, MAP_NAV_COLORS, WORLD_MAP_COLORS, MAP_POPUP_COLORS } from '@/lib/history/constants';

interface WorldEmpireMapProps {
  year: number;
  mode: 'eurasian' | 'east-asia';
  initialCenter?: { lon: number; lat: number };
  initialZoom?: number;
}

export function WorldEmpireMap({
  year,
  mode,
  initialCenter = { lon: 90, lat: 35 },
  initialZoom = 2,
}: WorldEmpireMapProps) {
  const t = useTranslations();
  const [selectedEmpire, setSelectedEmpire] = React.useState<WorldBoundary | null>(null);

  // 获取当前年份活跃的帝国
  const activeBoundaries = React.useMemo(
    () => getActiveBoundaries(year, mode),
    [year, mode]
  );

  // 预计算每个帝国的中心点（避免在 JSX map 中调用 useMemo）
  const empireCenters = React.useMemo<Record<number, { lon: number; lat: number } | null>>(() => {
    const centers: Record<number, { lon: number; lat: number } | null> = {};
    activeBoundaries.forEach((boundary, index) => {
      const polygonCoords = boundary.geometry.type === 'Polygon'
        ? boundary.geometry.coordinates[0]
        : boundary.geometry.type === 'MultiPolygon'
        ? boundary.geometry.coordinates[0]?.[0]
        : undefined;
      const coords = polygonCoords ?? [];

      if (coords.length === 0) {
        centers[index] = null;
        return;
      }

      const validCoords = coords.filter(c => c && c[0] !== undefined && c[1] !== undefined);
      if (validCoords.length < 3) {
        centers[index] = null;
        return;
      }

      let centerLon = 0;
      let centerLat = 0;
      for (const c of validCoords) {
        centerLon += c[0] ?? 0;
        centerLat += c[1] ?? 0;
      }
      centers[index] = { lon: centerLon / validCoords.length, lat: centerLat / validCoords.length };
    });
    return centers;
  }, [activeBoundaries]);

  return (
    <div className={`h-full w-full overflow-hidden rounded-xl border ${WORLD_MAP_COLORS.container.border} ${WORLD_MAP_COLORS.container.bg} relative`}>
      <Map
        mapLib={maplibregl as unknown as MapLib}
        initialViewState={{
          longitude: initialCenter.lon,
          latitude: initialCenter.lat,
          zoom: initialZoom,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
        onClick={() => setSelectedEmpire(null)}
      >
        <div className={`absolute ${MAP_NAV_COLORS.container}`}>
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
          const center = empireCenters[index];
          if (!center) return null;

          return (
            <Marker
              key={`marker-${index}`}
              longitude={center.lon}
              latitude={center.lat}
              anchor="center"
            >
              <button
                type="button"
                onClick={(ev) => {
                  ev.stopPropagation();
                  setSelectedEmpire(boundary);
                }}
                onKeyDown={(ev) => {
                  if (ev.key === 'Enter' || ev.key === ' ') {
                    ev.preventDefault();
                    ev.stopPropagation();
                    setSelectedEmpire(boundary);
                  }
                }}
                className="px-2 py-1 text-xs font-bold text-white rounded-full shadow-md hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1"
                style={{ backgroundColor: boundary.properties.color }}
                aria-label={`${t(boundary.properties.nameKey)} — ${formatYear(boundary.properties.startYear)} to ${formatYear(boundary.properties.endYear)}`}
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
                ? selectedEmpire.geometry.coordinates[0]?.[0]?.[0] ?? 0
                : selectedEmpire.geometry.coordinates[0]?.[0]?.[0]?.[0] ?? 0
            }
            latitude={
              selectedEmpire.geometry.type === 'Polygon'
                ? selectedEmpire.geometry.coordinates[0]?.[0]?.[1] ?? 0
                : selectedEmpire.geometry.coordinates[0]?.[0]?.[0]?.[1] ?? 0
            }
            anchor="top"
            closeButton
            closeOnClick={false}
            onClose={() => setSelectedEmpire(null)}
            maxWidth="280px"
          >
            <div className={`${MAP_POPUP_COLORS.container}`}>
              <div className="flex items-center gap-2">
                <div
                  className={MAP_POPUP_COLORS.dot}
                  style={{ backgroundColor: selectedEmpire.properties.color }}
                />
                <h3 className={MAP_POPUP_COLORS.title}>
                  {t(selectedEmpire.properties.nameKey)}
                </h3>
              </div>
              <div className={MAP_POPUP_COLORS.subtitle}>
                {formatYear(selectedEmpire.properties.startYear)} — {formatYear(selectedEmpire.properties.endYear)}
              </div>
            </div>
          </Popup>
        ) : null}
      </Map>

      {/* 当前活跃帝国列表 */}
      <div className={`absolute left-3 top-3 z-10 ${WORLD_VIEW_COLORS.background} ${WORLD_VIEW_COLORS.backdrop} rounded-lg p-2 max-w-[200px]`}>
        <div className={`text-xs ${WORLD_VIEW_COLORS.textSecondary} mb-1`}>
          {formatYear(year)}
        </div>
        <div className="flex flex-wrap gap-1">
          {activeBoundaries.map((b, i) => (
            <span
              key={i}
              className={WORLD_VIEW_COLORS.empireBadge}
              style={{ backgroundColor: b.properties.color }}
            >
              {t(b.properties.nameKey)}
            </span>
          ))}
          {activeBoundaries.length === 0 && (
            <span className={`text-xs ${WORLD_VIEW_COLORS.textMuted}`}>No empires</span>
          )}
        </div>
      </div>
    </div>
  );
}
