'use client';

import * as React from 'react';
import { formatYear } from '@/lib/history/utils';
import { useTranslations } from 'next-intl';
import {
  getActiveBoundaries,
  type WorldBoundary,
} from '@/lib/history/data/worldBoundaries';
import { WORLD_VIEW_COLORS, MAP_POPUP_COLORS } from '@/lib/history/constants';
import { logger } from '@/lib/history/logger';

const TIANDITU_TOKEN = '07b4df99018dcee22e60ad2064723188';

interface WorldEmpireMapProps {
  year: number;
  mode: 'eurasian' | 'east-asia';
  initialCenter?: { lon: number; lat: number };
  initialZoom?: number;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T: any;
  }
}

export function WorldEmpireMap({
  year,
  mode,
  initialCenter = { lon: 90, lat: 35 },
  initialZoom = 2,
}: WorldEmpireMapProps) {
  const t = useTranslations();
  const [selectedEmpire, setSelectedEmpire] = React.useState<WorldBoundary | null>(null);
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = React.useRef<any>(null);
  const [mapReady, setMapReady] = React.useState(false);

  // Get active empires for the current year
  const activeBoundaries = React.useMemo(
    () => getActiveBoundaries(year, mode),
    [year, mode]
  );

  // Pre-compute empire centers
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

  // Load Tianditu
  React.useEffect(() => {
    if (mapRef.current) return;

    const initMap = () => {
      if (window.T && mapContainerRef.current) {
        try {
          const map = new window.T.Map(mapContainerRef.current);
          const center = new window.T.LngLat(initialCenter.lon, initialCenter.lat);
          map.centerAndZoom(center, initialZoom);
          map.enableScrollWheelZoom();
          mapRef.current = map;
          setMapReady(true);
        } catch (e) {
          logger.error('map', 'Failed to initialize Tianditu', e);
        }
      }
    };

    if (window.T) {
      initMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://api.tianditu.gov.cn/api?v=4.0&tk=${TIANDITU_TOKEN}`;
    script.async = true;
    script.onload = () => { initMap(); };
    script.onerror = () => { logger.error('map', 'Failed to load Tianditu script'); };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
      mapRef.current = null;
      setMapReady(false);
    };
  }, [initialCenter.lon, initialCenter.lat, initialZoom]);

  // Draw empire boundaries and markers
  React.useEffect(() => {
    if (!mapRef.current || !mapReady) return;

    const map = mapRef.current;
    map.clearOverLays();

    // Draw empire boundaries
    activeBoundaries.forEach((boundary, index) => {
      const coords = boundary.geometry.type === 'Polygon'
        ? boundary.geometry.coordinates
        : boundary.geometry.type === 'MultiPolygon'
        ? boundary.geometry.coordinates
        : [];

      const drawRing = (ring: unknown) => {
        const r = ring as number[][];
        if (!r || r.length < 3) return;
        const points = r.map(c => new window.T.LngLat(c[0], c[1]));
        const polygon = new window.T.Polygon(points, {
          strokeColor: boundary.properties.color,
          strokeWeight: 2,
          fillColor: boundary.properties.color,
          fillOpacity: 0.35,
        });
        map.addOverLay(polygon);
      };

      if (boundary.geometry.type === 'Polygon') {
        for (const ring of coords) {
          drawRing(ring);
        }
      } else if (boundary.geometry.type === 'MultiPolygon') {
        for (const polygon of coords) {
          for (const ring of polygon) {
            drawRing(ring);
          }
        }
      }

      // Add empire label at center
      const center = empireCenters[index];
      if (center) {
        const lnglat = new window.T.LngLat(center.lon, center.lat);
        const label = new window.T.Label({
          text: t(boundary.properties.nameKey),
          position: lnglat,
          offset: new window.T.Pixel(-30, -10),
        });
        label.setBackgroundColor(boundary.properties.color);
        label.setBorderLine(0);
        label.setFontColor('#fff');
        label.setFontSize(12);
        label.setFontWeight('bold');
        map.addOverLay(label);
      }
    });
  }, [mapReady, activeBoundaries, empireCenters, t]);

  return (
    <div className="h-full w-full overflow-hidden relative">
      {!mapReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 z-10">
          <div className="w-6 h-6 border-2 border-zinc-300 border-t-zinc-600 dark:border-zinc-600 dark:border-t-zinc-400 rounded-full animate-spin" aria-hidden="true" />
          <span className="text-sm">加载地图中...</span>
        </div>
      )}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Currently active empire list */}
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

      {/* Selected empire popup */}
      {selectedEmpire && (
        <div className={`absolute right-3 top-3 z-10 bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-3 max-w-[280px]`}>
          <div className={MAP_POPUP_COLORS.container}>
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
          <button
            type="button"
            onClick={() => setSelectedEmpire(null)}
            className="absolute top-1 right-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
