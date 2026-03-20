'use client';

import * as React from 'react';
import type { Feature, Polygon, MultiPolygon } from 'geojson';
import type { Event } from '@/lib/history/types';
import { useTranslations } from 'next-intl';
import { dynastyBoundaries } from '@/lib/history/data/dynastyBoundaries';
import { getActiveBoundaries, getWorldEraBounds } from '@/lib/history/data/worldBoundaries';
import { getBattles } from '@/lib/history/battles';
import { YearSlider } from '@/components/common/YearSlider';

const BAIDU_MAP_AK = process.env.NEXT_PUBLIC_BAIDU_MAP_AK || '';

type BoundaryFeature = Feature<Polygon | MultiPolygon>;

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    BMapGL: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    BMapGLMarker: any;
  }
}

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
  const [mapReady, setMapReady] = React.useState(false);
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = React.useRef<any>(null);

  const _selected = React.useMemo(
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

  const activeBoundaries = React.useMemo((): Array<{ id: string; feature: BoundaryFeature }> => {
    if (!openEraIds || openEraIds.size === 0 || mode !== 'china') return [];
    const result: Array<{ id: string; feature: BoundaryFeature }> = [];
    for (const id of openEraIds) {
      const feature = dynastyBoundaries[id];
      if (feature) {
        result.push({ id, feature });
      }
    }
    return result;
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

  // 加载百度地图
  React.useEffect(() => {
    if (mapRef.current) return;

    const initMap = () => {
      if (window.BMapGL && mapContainerRef.current) {
        try {
          const map = new window.BMapGL.Map(mapContainerRef.current);
          map.centerAndZoom(new window.BMapGL.Point(mapCenter.lon, mapCenter.lat), mapZoom);
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
  }, [mapCenter.lon, mapCenter.lat, mapZoom]);

  // Re-center and re-zoom the map when mode changes after initial load
  React.useEffect(() => {
    if (!mapRef.current || !mapReady) return;
    const map = mapRef.current;
    map.centerAndZoom(new window.BMapGL.Point(mapCenter.lon, mapCenter.lat), mapZoom);
  }, [mode, mapReady, mapCenter, mapZoom]);

  // 绘制内容
  React.useEffect(() => {
    if (!mapRef.current || !mapReady) return;

    const map = mapRef.current;
    map.clearOverlays();

    // 绘制中国王朝边界
    if (mode === 'china') {
      activeBoundaries.forEach(({ feature }) => {
        const coords = feature.geometry.coordinates;
        if (!coords || coords.length === 0) return;

        const processPolygon = (ring: number[][]) => {
          if (!ring || ring.length < 3) return;
          const bmapPoints = ring.map(
            (coord) => new window.BMapGL.Point(coord[0], coord[1])
          );
          const polygon = new window.BMapGL.Polygon(bmapPoints, {
            strokeColor: '#DC6432',
            strokeWeight: 2,
            fillColor: '#DC6432',
            fillOpacity: 0.2,
          });
          map.addOverlay(polygon);
        };

        try {
          if (feature.geometry.type === 'MultiPolygon') {
            // coords is number[][][][]: [polygon[polygonRing[point[lon,lat]]]]
            const multi = coords as number[][][][];
            for (const polygon of multi) {
              if (polygon && polygon[0]) {
                processPolygon(polygon[0]);
              }
            }
          } else {
            // coords is number[][][]: [ring[point[lon,lat]]]
            const poly = coords as number[][][];
            if (poly[0]) {
              processPolygon(poly[0]);
            }
          }
        } catch (e) {
          console.warn('Failed to draw boundary', e);
        }
      });
    }

    // 绘制世界帝国边界
    if (mode !== 'china') {
      worldBoundaries.forEach((boundary) => {
        const coords = boundary.geometry.coordinates;
        if (!coords || coords.length === 0) return;

        const processPolygon = (ring: number[][]) => {
          if (!ring || ring.length < 3) return;
          const bmapPoints = ring.map(
            (coord) => new window.BMapGL.Point(coord[0], coord[1])
          );
          const polygon = new window.BMapGL.Polygon(bmapPoints, {
            strokeColor: boundary.properties.color,
            strokeWeight: 2,
            fillColor: boundary.properties.color,
            fillOpacity: 0.25,
          });
          map.addOverlay(polygon);
        };

        try {
          if (boundary.geometry.type === 'MultiPolygon') {
            // coords is number[][][][]: [polygon[polygonRing[point[lon,lat]]]]
            const multi = coords as number[][][][];
            for (const polygon of multi) {
              if (polygon && polygon[0]) {
                processPolygon(polygon[0]);
              }
            }
          } else {
            // coords is number[][][]: [ring[point[lon,lat]]]
            const poly = coords as number[][][];
            if (poly[0]) {
              processPolygon(poly[0]);
            }
          }
        } catch (e) {
          console.warn('Failed to draw world boundary', e);
        }
      });
    }

    // 绘制事件标记 - 使用圆形替代 Marker
    const allEvents = mode === 'china' ? [...normalEvents, ...battles] : [];
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
      
      circle.addEventListener('click', () => {
        setSelectedId(e.id);
      });
      map.addOverlay(circle);
    });
  }, [mapReady, mode, activeBoundaries, worldBoundaries, normalEvents, battles]);

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

        {/* 图例 */}
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
