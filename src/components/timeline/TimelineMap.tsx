'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { useBaiduMap } from './BaiduMapHooks';

import type { TimelineEvent, Territory } from '@/lib/history/data/timeline';

const BAIDU_MAP_AK = process.env.NEXT_PUBLIC_BAIDU_MAP_AK || '';

interface TimelineMapProps {
  event: TimelineEvent | null;
}

export function TimelineMap({ event }: TimelineMapProps) {
  const t = useTranslations();
  const [viewState, setViewState] = React.useState({
    longitude: event?.location.lon ?? 108.95,
    latitude: event?.location.lat ?? 34.34,
    zoom: 4,
  });
  const [popupInfo, setPopupInfo] = React.useState<string | null>(null);

  const { ready, map, containerRef, initMap } = useBaiduMap(BAIDU_MAP_AK);

  // 初始化地图
  React.useEffect(() => {
    if (ready && event) {
      initMap({ lng: event.location.lon, lat: event.location.lat }, 5);
    } else if (ready) {
      initMap({ lng: 108.95, lat: 34.34 }, 4);
    }
  }, [ready, event, initMap]);

  // 更新地图中心
  React.useEffect(() => {
    if (map && event) {
      map.centerAndZoom(new window.BMapGL.Point(event.location.lon, event.location.lat), 5);
    }
  }, [map, event]);

  // 绘制多边形
  React.useEffect(() => {
    if (!map || !event?.territories) return;

    // 清除之前的覆盖物
    map.clearOverlays();

    // 添加新的多边形
    event.territories.forEach((territory: Territory) => {
      if (!territory.polygon || territory.polygon.length < 3) return;

      const points = territory.polygon.map((coord: number[]) => 
        new window.BMapGL.Point(coord[0], coord[1])
      );

      const polygon = new window.BMapGL.Polygon(points, {
        strokeColor: territory.color,
        strokeWeight: 2,
        fillColor: territory.color,
        fillOpacity: 0.35,
      });

      polygon.addEventListener('click', () => {
        setPopupInfo(t(territory.factionNameKey));
      });

      map.addOverlay(polygon);
    });
  }, [map, event, t]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border border-zinc-700">
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 text-zinc-400">
          Loading map...
        </div>
      )}
      <div 
        ref={containerRef} 
        className="w-full h-full"
        style={{ visibility: ready ? 'visible' : 'hidden' }}
      />
      
      {/* Popup */}
      {popupInfo && (
        <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-2 rounded-lg text-sm">
          {popupInfo}
          <button 
            onClick={() => setPopupInfo(null)}
            className="ml-2 text-zinc-400 hover:text-white"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
