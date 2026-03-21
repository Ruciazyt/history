'use client';

import * as React from 'react';
import type { Feature, Polygon, MultiPolygon } from 'geojson';
import type { Event } from '@/lib/history/types';
import { dynastyBoundaries } from '@/lib/history/data/dynastyBoundaries';
import { getBattles } from '@/lib/history/battles';

const BAIDU_MAP_AK = process.env.NEXT_PUBLIC_BAIDU_MAP_AK || '';

type BoundaryFeature = Feature<Polygon | MultiPolygon>;

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    BMapGL: any;
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

  // 加载百度地图
  React.useEffect(() => {
    if (mapRef.current) return;

    const initMap = () => {
      if (window.BMapGL && mapContainerRef.current) {
        try {
          const map = new window.BMapGL.Map(mapContainerRef.current);
          map.centerAndZoom(new window.BMapGL.Point(initialCenter.lon, initialCenter.lat), initialZoom);
          map.enableScrollWheelZoom(true);
          mapRef.current = map;
          setMapReady(true);
        } catch (e) {
          console.error('Failed to initialize Baidu Map:', e);
        }
      }
    };

    const callbackName = 'baiduMapCb_' + Date.now();
    (window as unknown as Record<string, () => void>)[callbackName] = () => { initMap(); };

    // Only load Baidu Map script when API key is configured
    if (!BAIDU_MAP_AK) {
      console.warn('[HistoryMap] NEXT_PUBLIC_BAIDU_MAP_AK is not configured — map will not load');
      // Clean up the callback we just registered
      delete (window as unknown as Record<string, unknown>)[callbackName];
      return;
    }

    const script = document.createElement('script');
    script.src = `https://api.map.baidu.com/api?v=1.0&type=webgl&ak=${BAIDU_MAP_AK}&callback=${callbackName}`;
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup: remove script tag from DOM, delete callback, and clear map ref
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      delete (window as unknown as Record<string, unknown>)[callbackName];
      // Reset map state so re-mounting can reinitialize cleanly
      mapRef.current = null;
      setMapReady(false);
    };
  }, [initialCenter.lon, initialCenter.lat, initialZoom]);

  // 绘制内容
  React.useEffect(() => {
    if (!mapRef.current || !mapReady) return;

    const map = mapRef.current;
    map.clearOverlays();

    // Helper function to draw a polygon boundary on the map
    const drawPolygon = (ring: number[][], strokeColor: string, fillOpacity: number) => {
      if (!ring || ring.length < 3) return;
      const bmapPoints = ring.map(
        (coord) => new window.BMapGL.Point(coord[0], coord[1])
      );
      const polygon = new window.BMapGL.Polygon(bmapPoints, {
        strokeColor,
        strokeWeight: 2,
        fillColor: strokeColor,
        fillOpacity,
      });
      map.addOverlay(polygon);
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
        console.warn('Failed to draw boundary', e);
      }
    };

    // 绘制中国王朝边界
    activeBoundaries.forEach(({ feature }) => {
      const coords = feature.geometry.coordinates;
      if (!coords || coords.length === 0) return;
      processBoundaryCoords(coords, '#DC6432', 0.2);
    });

    // 绘制事件标记 - 使用圆形替代 Marker
    const allEvents = [...normalEvents, ...battles];
    allEvents.forEach((e) => {
      if (!e.location) return;

      // 使用圆形标记
      const circle = new window.BMapGL.Circle(new window.BMapGL.Point(e.location.lon, e.location.lat), {
        radius: 5000,
        strokeColor: '#DC2626',
        strokeWeight: 2,
        fillColor: '#DC2626',
        fillOpacity: 0.8,
      });

      map.addOverlay(circle);
    });
  }, [mapReady, activeBoundaries, normalEvents, battles]);

  return (
    <div className="h-full w-full overflow-hidden rounded-xl border border-zinc-200 bg-white flex flex-col">
      <div className="flex-1 relative">
        {!mapReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 z-10">
            {!BAIDU_MAP_AK ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <span className="text-sm">地图需要配置 API Key</span>
              </>
            ) : (
              <>
                <div className="w-6 h-6 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" aria-hidden="true" />
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
