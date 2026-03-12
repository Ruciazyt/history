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

const BAIDU_MAP_AK = process.env.NEXT_PUBLIC_BAIDU_MAP_AK || '';

declare global {
  interface Window {
    BMapGL: any;
    initBaiduMap: () => void;
  }
}

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
  const [mapReady, setMapReady] = React.useState(false);
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<any>(null);

  // 获取当前年份活跃的帝国
  const activeBoundaries = React.useMemo(
    () => getActiveBoundaries(year, mode),
    [year, mode]
  );

  // 获取活跃帝国名称列表
  const activeEmpireNames = React.useMemo(
    () => activeBoundaries.map((b) => t(b.properties.nameKey)),
    [activeBoundaries, t]
  );

  // 加载百度地图
  React.useEffect(() => {
    if (mapRef.current) return;
    
    const loadMap = () => {
      if (window.BMapGL) {
        const map = new window.BMapGL.Map(mapContainerRef.current);
        map.centerAndZoom(new window.BMapGL.Point(initialCenter.lon, initialCenter.lat), initialZoom);
        map.enableScrollWheelZoom(true);
        mapRef.current = map;
        setMapReady(true);
      }
    };

    if (window.BMapGL) {
      loadMap();
    } else {
      const script = document.createElement('script');
      script.src = `https://api.map.baidu.com/api?v=1.0&type=webgl&ak=${BAIDU_MAP_AK}`;
      script.async = true;
      script.onload = loadMap;
      document.head.appendChild(script);
    }
  }, [initialCenter.lon, initialCenter.lat, initialZoom]);

  // 绘制帝国边界
  React.useEffect(() => {
    if (!mapRef.current || !mapReady) return;

    const map = mapRef.current;
    map.clearOverlays();

    activeBoundaries.forEach((boundary) => {
      const coords = boundary.geometry.coordinates;
      if (!coords || coords.length === 0) return;

      const processPolygon = (points: any[]) => {
        if (!points || points.length < 3) return;
        
        const bmapPoints = points.map((coord: number[]) => 
          new window.BMapGL.Point(coord[0], coord[1])
        );

        const polygon = new window.BMapGL.Polygon(bmapPoints, {
          strokeColor: boundary.properties.color,
          strokeWeight: 2,
          fillColor: boundary.properties.color,
          fillOpacity: 0.35,
        });

        polygon.addEventListener('click', () => {
          setSelectedEmpire(boundary);
        });

        map.addOverlay(polygon);
      };

      try {
        if (boundary.geometry.type === 'MultiPolygon') {
          (coords as any[]).forEach((poly: any[]) => {
            if (poly && poly[0]) {
              processPolygon(poly[0]);
            }
          });
        } else if (boundary.geometry.type === 'Polygon') {
          processPolygon(coords[0]);
        }
      } catch (e) {
        console.warn('Failed to draw boundary:', boundary.properties.name, e);
      }
    });
  }, [mapReady, activeBoundaries]);

  return (
    <div className="h-full w-full overflow-hidden rounded-xl border border-zinc-200 bg-white relative">
      {!mapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 text-zinc-400 z-10">
          Loading...
        </div>
      )}
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* 选中的帝国信息 */}
      {selectedEmpire && (
        <div className="absolute left-4 top-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 max-w-xs z-20">
          <div className="flex justify-between items-start">
            <h3 
              className="font-bold text-lg"
              style={{ color: selectedEmpire.properties.color }}
            >
              {t(selectedEmpire.properties.nameKey)}
            </h3>
            <button 
              onClick={() => setSelectedEmpire(null)}
              className="text-zinc-400 hover:text-zinc-600"
            >
              ×
            </button>
          </div>
          <div className="text-sm text-zinc-600 mt-2">
            {formatYear(selectedEmpire.properties.startYear)} - {formatYear(selectedEmpire.properties.endYear)}
          </div>
        </div>
      )}
    </div>
  );
}
