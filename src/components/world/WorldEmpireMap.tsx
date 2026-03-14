'use client';

import * as React from 'react';
import { formatYear } from '@/lib/history/utils';
import { useTranslations } from 'next-intl';
import {
  eurasianBoundaries,
  eastAsiaBoundaries,
  getActiveBoundaries,
  type WorldBoundary,
} from '@/lib/history/data/worldBoundaries';

// 动态导入 leaflet 以避免 SSR 问题
let L: any = null;
let ReactLeaflet: any = null;

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
}: WorldEmpireMapProps) {
  const t = useTranslations();
  const [mapReady, setMapReady] = React.useState(false);
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<any>(null);
  const polygonsRef = React.useRef<any[]>([]);

  const activeBoundaries = React.useMemo(
    () => getActiveBoundaries(year, mode),
    [year, mode]
  );

  // 中心点设置 - 根据模式调整
  const center: [number, number] = mode === 'eurasian' 
    ? [35, 90]   // 欧亚大陆中心
    : [35, 110]; // 东亚中心

  const zoom = mode === 'eurasian' ? 2 : 3;

  // 加载 Leaflet 地图
  React.useEffect(() => {
    if (mapRef.current) return;

    const loadLeaflet = async () => {
      // 动态导入 leaflet
      const leaflet = await import('leaflet');
      L = leaflet.default || leaflet;
      
      // 导入 react-leaflet
      const ReactL = await import('react-leaflet');
      ReactLeaflet = ReactL;

      if (mapContainerRef.current && !mapRef.current) {
        const map = L.map(mapContainerRef.current).setView(center, zoom);
        
        // 使用 OpenStreetMap 图层（免费，无需 API Key）
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
        }).addTo(map);

        mapRef.current = map;
        setMapReady(true);
        console.log('✅ WorldEmpireMap Leaflet 地图加载成功 (欧亚/东亚模式)');
      }
    };

    loadLeaflet();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [center, zoom]);

  // 绘制边界
  React.useEffect(() => {
    if (!mapRef.current || !mapReady || !L) return;

    const map = mapRef.current;

    // 清除之前的 polygons
    polygonsRef.current.forEach((poly: any) => {
      map.removeLayer(poly);
    });
    polygonsRef.current = [];

    // 绘制新的边界
    activeBoundaries.forEach((boundary) => {
      const coords = boundary.geometry.coordinates;
      if (!coords || coords.length === 0) return;

      try {
        const processPolygon = (points: any[]) => {
          if (!points || points.length < 3) return;
          
          // 转换坐标: [lon, lat] -> [lat, lon]
          const latLngs = points.map((coord: number[]) => 
            L.latLng(coord[1], coord[0])
          );
          
          const polygon = L.polygon(latLngs, {
            color: boundary.properties.color,
            weight: 2,
            fillColor: boundary.properties.color,
            fillOpacity: 0.35,
          });
          
          // 添加 popup
          polygon.bindPopup(`
            <div style="font-weight: bold; color: ${boundary.properties.color}">
              ${t(boundary.properties.nameKey)}
            </div>
            <div>${formatYear(boundary.properties.startYear)} - ${formatYear(boundary.properties.endYear)}</div>
          `);
          
          polygon.addTo(map);
          polygonsRef.current.push(polygon);
        };

        if (boundary.geometry.type === 'MultiPolygon') {
          (coords as any[]).forEach((poly: any[]) => {
            if (poly && poly[0]) processPolygon(poly[0]);
          });
        } else if (boundary.geometry.type === 'Polygon') {
          processPolygon(coords[0]);
        }
      } catch (e) {
        console.warn('绘制边界失败', e);
      }
    });
  }, [mapReady, activeBoundaries, t]);

  // 监听模式变化，更新地图中心
  React.useEffect(() => {
    if (!mapRef.current || !mapReady) return;
    mapRef.current.setView(center, zoom);
  }, [mode, center, zoom, mapReady]);

  return (
    <div className="h-full w-full overflow-hidden rounded-xl border border-zinc-200 bg-white relative">
      {!mapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 text-zinc-400 z-10">
          Loading map...
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
