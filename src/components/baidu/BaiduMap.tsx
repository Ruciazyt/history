'use client';

import * as React from 'react';

interface BaiduMapProps {
  longitude: number;
  latitude: number;
  zoom: number;
  children?: React.ReactNode;
  onMove?: (viewState: { longitude: number; latitude: number; zoom: number }) => void;
}

declare global {
  interface Window {
    BMap: any;
    BMapGL: any;
    BMAP_STATUS_SUCCESS: any;
  }
}

// 加载百度地图 SDK
const loadBaiduMap = (ak: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.BMapGL) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://api.map.baidu.com/api?v=1.0&type=webgl&ak=${ak}&callback=initBMap`;
    script.async = true;
    
    (window as any).initBMap = () => {
      resolve();
    };
    
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

export function useBaiduMap(ak: string) {
  const [ready, setReady] = React.useState(false);
  const [map, setMap] = React.useState<any>(null);
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);

  React.useEffect(() => {
    loadBaiduMap(ak).then(() => {
      setReady(true);
    }).catch(console.error);
  }, [ak]);

  const initMap = React.useCallback((center: { lng: number; lat: number }, zoom: number) => {
    if (!ready || !container || map) return;

    const baiduMap = new window.BMapGL.Map(container);
    baiduMap.centerAndZoom(new window.BMapGL.Point(center.lng, center.lat), zoom);
    baiduMap.enableScrollWheelZoom(true);
    
    setMap(baiduMap);
  }, [ready, container, map]);

  return { ready, map, container: setContainer, initMap };
}
