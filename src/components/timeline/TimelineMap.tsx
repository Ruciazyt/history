'use client';

import * as React from 'react';
import type { TimelineEvent, Territory } from '@/lib/history/data/timeline';

const BAIDU_MAP_AK = process.env.NEXT_PUBLIC_BAIDU_MAP_AK || '';

declare global {
  interface Window {
    BMapGL: any;
  }
}

interface TimelineMapProps {
  event: TimelineEvent | null;
}

export function TimelineMap({ event }: TimelineMapProps) {
  const [mapReady, setMapReady] = React.useState(false);
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<any>(null);

  // 加载百度地图
  React.useEffect(() => {
    if (mapRef.current) return;

    const initMap = () => {
      if (window.BMapGL && mapContainerRef.current) {
        try {
          const center = event?.location 
            ? { lng: event.location.lon, lat: event.location.lat }
            : { lng: 108.95, lat: 34.34 };
          
          const map = new window.BMapGL.Map(mapContainerRef.current);
          map.centerAndZoom(new window.BMapGL.Point(center.lng, center.lat), 5);
          map.enableScrollWheelZoom(true);
          mapRef.current = map;
          setMapReady(true);
          console.log('✅ TimelineMap 百度地图加载成功');
        } catch (e) {
          console.error('初始化失败:', e);
        }
      }
    };

    // 使用 JSONP 回调
    const callbackName = 'baiduMapCb_' + Date.now();
    (window as any)[callbackName] = () => initMap();

    const script = document.createElement('script');
    script.src = `https://api.map.baidu.com/api?v=1.0&type=webgl&ak=${BAIDU_MAP_AK}&callback=${callbackName}`;
    script.async = true;
    script.onload = () => console.log('百度地图 SDK 加载完成');
    document.head.appendChild(script);

    return () => { delete (window as any)[callbackName]; };
  }, []);

  // 绘制多边形
  React.useEffect(() => {
    if (!mapRef.current || !mapReady || !event?.territories) return;

    const map = mapRef.current;
    map.clearOverlays();

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

      map.addOverlay(polygon);
    });
  }, [mapReady, event]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border border-zinc-700">
      {!mapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 text-zinc-400 z-10">
          Loading... {BAIDU_MAP_AK ? '(AK已配置)' : '(AK未配置)'}
        </div>
      )}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
