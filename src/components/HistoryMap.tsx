'use client';

import * as React from 'react';
import type { Feature, Polygon, MultiPolygon } from 'geojson';
import type { Event } from '@/lib/history/types';
import { dynastyBoundaries } from '@/lib/history/data/dynastyBoundaries';
import { getBattles } from '@/lib/history/battles';
import { logger } from '@/lib/history/logger';

const TIANDITU_TOKEN = '07b4df99018dcee22e60ad2064723188';

/** Milliseconds to wait for Tianditu API to load before showing an error state */
const MAP_LOAD_TIMEOUT_MS = 15_000;

type BoundaryFeature = Feature<Polygon | MultiPolygon>;

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T: any;
  }
}

export function HistoryMap({
  events,
  openEraIds,
  initialCenter = { lon: 112.45, lat: 34.62 },
  initialZoom = 4,
}: {
  events?: Event[];
  openEraIds?: Set<string>;
  /** Geographic center of the map on initial load */
  initialCenter?: { lon: number; lat: number };
  /** Zoom level on initial load */
  initialZoom?: number;
}) {
  const [mapReady, setMapReady] = React.useState(false);
  const [mapLoadError, setMapLoadError] = React.useState(false);
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = React.useRef<any>(null);

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

  // Active dynasty boundaries for the open eras
  const activeBoundaries = React.useMemo((): Array<{ id: string; feature: BoundaryFeature }> => {
    if (!openEraIds || openEraIds.size === 0) return [];
    const result: Array<{ id: string; feature: BoundaryFeature }> = [];
    for (const id of openEraIds) {
      const feature = dynastyBoundaries[id];
      if (feature) {
        result.push({ id, feature });
      }
    }
    return result;
  }, [openEraIds]);

  // Handle retry: reset error state and force a re-mount
  const handleRetry = React.useCallback(() => {
    setMapLoadError(false);
    setMapReady(false);
    mapRef.current = null;
  }, []);

  // 加载天地图
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
          setMapLoadError(true);
        }
      }
    };

    // Check if Tianditu is already loaded
    if (window.T) {
      initMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://api.tianditu.gov.cn/api?v=4.0&tk=${TIANDITU_TOKEN}`;
    script.async = true;
    script.onload = () => {
      initMap();
    };
    script.onerror = () => {
      logger.error('map', 'Failed to load Tianditu script');
      setMapLoadError(true);
    };
    document.head.appendChild(script);

    // Timeout: if map isn't ready within MAP_LOAD_TIMEOUT_MS, show an error
    const timeoutId = window.setTimeout(() => {
      if (!mapReady) {
        setMapLoadError(true);
      }
    }, MAP_LOAD_TIMEOUT_MS);

    return () => {
      clearTimeout(timeoutId);
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      mapRef.current = null;
      setMapReady(false);
    };
  }, [initialCenter.lon, initialCenter.lat, initialZoom, mapReady]);

  // 绘制内容
  React.useEffect(() => {
    if (!mapRef.current || !mapReady) return;

    const map = mapRef.current;
    map.clearOverlays();

    // Helper function to draw a polygon boundary on the map
    const drawPolygon = (ring: number[][], strokeColor: string, fillOpacity: number) => {
      if (!ring || ring.length < 3) return;
      const points = ring.map(
        (coord) => new window.T.LngLat(coord[0], coord[1])
      );
      const polygon = new window.T.Polygon(points, {
        strokeColor,
        strokeWeight: 2,
        fillColor: strokeColor,
        fillOpacity,
      });
      map.addOverLay(polygon);
    };

    // Helper function to process GeoJSON coordinates and draw polygons
    const processBoundaryCoords = (coords: number[][][] | number[][][][], strokeColor: string, fillOpacity: number) => {
      try {
        if (Array.isArray(coords) && coords.length > 0 && Array.isArray(coords[0]) && coords[0].length > 0) {
          // Check if it's a MultiPolygon (first element is array of rings)
          if (Array.isArray(coords[0][0]) && Array.isArray(coords[0][0][0]) && typeof coords[0][0][0][0] === 'number') {
            // It's a simple Polygon: coords[0] is the ring
            drawPolygon(coords[0] as number[][], strokeColor, fillOpacity);
          } else {
            // It's a MultiPolygon: coords is number[][][][]
            const multi = coords as number[][][][];
            for (const polygon of multi) {
              if (polygon && polygon[0]) {
                drawPolygon(polygon[0], strokeColor, fillOpacity);
              }
            }
          }
        }
      } catch (e) {
        logger.warn('map', 'Failed to draw boundary', e);
      }
    };

    // 绘制中国王朝边界
    activeBoundaries.forEach(({ feature }) => {
      const coords = feature.geometry.coordinates;
      if (!coords || coords.length === 0) return;
      processBoundaryCoords(coords, '#DC6432', 0.2);
    });

    // 绘制事件标记 - 使用圆形
    const allEvents = [...normalEvents, ...battles];
    allEvents.forEach((e) => {
      if (!e.location) return;

      const center = new window.T.LngLat(e.location.lon, e.location.lat);
      const circle = new window.T.Circle(center, 5000, {
        strokeColor: '#DC2626',
        strokeWeight: 2,
        fillColor: '#DC2626',
        fillOpacity: 0.8,
      });
      map.addOverLay(circle);
    });
  }, [mapReady, activeBoundaries, normalEvents, battles]);

  return (
    <div className="h-full w-full overflow-hidden bg-white dark:bg-zinc-900 flex flex-col">
      <div className="flex-1 relative">
        {!mapReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 z-10">
            {mapLoadError ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <span className="text-sm">地图加载失败，请检查网络</span>
                <button
                  onClick={handleRetry}
                  className="mt-1 px-4 py-1.5 bg-[var(--color-primary)] text-[var(--color-on-primary)] text-xs rounded-[var(--rounded-pill)] transition-colors"
                >
                  重试
                </button>
              </>
            ) : (
              <>
                <div className="w-6 h-6 border-2 border-zinc-300 border-t-zinc-600 dark:border-zinc-600 dark:border-t-zinc-400 rounded-full animate-spin" aria-hidden="true" />
                <span className="text-sm">加载地图中...</span>
              </>
            )}
          </div>
        )}
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>
    </div>
  );
}
