'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import {
  getActiveBoundaries,
} from '@/lib/history/data/worldBoundaries';

const BAIDU_MAP_AK = process.env.NEXT_PUBLIC_BAIDU_MAP_AK || '';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Window {
    BMapGL: any;
  }
}

interface WorldEmpireMapProps {
  year: number;
  mode: 'eurasian' | 'east-asia';
  initialCenter?: { lon: number; lat: number };
  initialZoom?: number;
  onYearChange?: (year: number) => void;
}

// 根据模式获取不同的中心点和缩放级别
function getMapConfig(mode: 'eurasian' | 'east-asia') {
  switch (mode) {
    case 'eurasian':
      return { center: { lon: 90, lat: 40 }, zoom: 2 }; // 欧亚大陆中心
    case 'east-asia':
      return { center: { lon: 110, lat: 35 }, zoom: 3 }; // 东亚中心
    default:
      return { center: { lon: 90, lat: 35 }, zoom: 2 };
  }
}

export function WorldEmpireMap({
  year,
  mode,
}: WorldEmpireMapProps) {
  const t = useTranslations();
  const [mapReady, setMapReady] = React.useState(false);
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<{ centerAndZoom: (point: unknown, zoom: number) => void; enableScrollWheelZoom: (enabled: boolean) => void; clearOverlays: () => void; addOverlay: (overlay: unknown) => void; Point: new (lng: number, lat: number) => unknown; Polygon: new (points: unknown[], options: unknown) => unknown } | null>(null);
  
  // 根据模式获取地图配置
  const mapConfig = React.useMemo(() => getMapConfig(mode), [mode]);
  const { center: initialCenter, zoom: initialZoom } = mapConfig;

  const activeBoundaries = React.useMemo(
    () => getActiveBoundaries(year, mode),
    [year, mode]
  );

  // 加载百度地图
  React.useEffect(() => {
    // 如果地图已初始化，先清除
    if (mapRef.current) {
      mapRef.current = null;
    }

    const initMap = () => {
      if (window.BMapGL && mapContainerRef.current) {
        try {
          // 每次重新创建地图实例
          const map = new window.BMapGL.Map(mapContainerRef.current);
          map.centerAndZoom(new window.BMapGL.Point(initialCenter.lon, initialCenter.lat), initialZoom);
          map.enableScrollWheelZoom(true);
          mapRef.current = map;
          setMapReady(true);
          console.log(`✅ WorldEmpireMap 百度地图加载成功 (mode: ${mode})`);
        } catch (e) {
          console.error('初始化失败:', e);
        }
      }
    };

    const callbackName = 'baiduMapCb_' + Date.now();
    const initMapWrapper = () => { initMap(); };
    (window as unknown as Record<string, () => void>)[callbackName] = initMapWrapper;

    const script = document.createElement('script');
    script.src = `https://api.map.baidu.com/api?v=1.0&type=webgl&ak=${BAIDU_MAP_AK}&callback=${callbackName}`;
    script.async = true;
    document.head.appendChild(script);

    return () => { 
      if ((window as unknown as Record<string, unknown>)[callbackName]) {
        delete (window as unknown as Record<string, unknown>)[callbackName];
      }
      // 清理地图实例
      if (mapRef.current) {
        mapRef.current = null;
      }
    };
  }, [mode, initialCenter.lon, initialCenter.lat, initialZoom]);

  // 绘制边界
  React.useEffect(() => {
    if (!mapRef.current || !mapReady) return;

    const map = mapRef.current;
    map.clearOverlays();

    activeBoundaries.forEach((boundary) => {
      const coords = boundary.geometry.coordinates;
      if (!coords || coords.length === 0) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const processPolygon = (points: any[]) => {
        if (!points || points.length < 3) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bmapPoints = points.map((coord: any) => 
          new window.BMapGL.Point(coord[0], coord[1])
        );
        const polygon = new window.BMapGL.Polygon(bmapPoints, {
          strokeColor: boundary.properties.color,
          strokeWeight: 2,
          fillColor: boundary.properties.color,
          fillOpacity: 0.35,
        });
        map.addOverlay(polygon);
      };

      try {
        if (boundary.geometry.type === 'MultiPolygon') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (coords as any[]).forEach((poly: any[]) => {
            if (poly && poly[0]) processPolygon(poly[0]);
          });
        } else if (boundary.geometry.type === 'Polygon') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          processPolygon(coords[0] as any[]);
        }
      } catch (e) {
        console.warn('绘制边界失败', e);
      }
    });
  }, [mapReady, activeBoundaries]);

  return (
    <div className="h-full w-full overflow-hidden rounded-xl border border-zinc-200 bg-white relative">
      {!mapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 text-zinc-400 z-10">
          Loading... {BAIDU_MAP_AK ? '(AK已配置)' : '(AK未配置)'}
        </div>
      )}
      <div ref={mapContainerRef} className="w-full h-full" />
      
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
