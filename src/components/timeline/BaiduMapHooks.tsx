'use client';

import * as React from 'react';

declare global {
  interface Window {
    BMapGL: any;
    BMapGLMap: any;
    initBMap: () => void;
  }
}

// 加载百度地图 SDK
const loadBaiduMap = (ak: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.BMapGL) {
      resolve();
      return;
    }

    // 设置回调
    window.initBMap = () => {
      resolve();
    };

    const script = document.createElement('script');
    // 使用 WebGL 版本
    script.src = `https://api.map.baidu.com/api?v=1.0&type=webgl&ak=${ak}`;
    script.async = true;
    script.onerror = () => reject(new Error('Failed to load Baidu Map SDK'));
    document.head.appendChild(script);
  });
};

export function useBaiduMap(ak: string) {
  const [ready, setReady] = React.useState(false);
  const [map, setMap] = React.useState<any>(null);
  const containerRef = React.useCallback((node: HTMLDivElement | null) => {
    if (!node || map) return;
    
    if (window.BMapGL) {
      const baiduMap = new window.BMapGL.Map(node);
      baiduMap.enableScrollWheelZoom(true);
      setMap(baiduMap);
    }
  }, [map]);

  React.useEffect(() => {
    if (!ak) return;
    
    loadBaiduMap(ak)
      .then(() => setReady(true))
      .catch(console.error);
  }, [ak]);

  const initMap = React.useCallback((center: { lng: number; lat: number }, zoom: number) => {
    if (!ready || map) return;
    
    // 等待 DOM 更新
    setTimeout(() => {
      const container = document.querySelector('.baidu-map-container');
      if (container && window.BMapGL && !map) {
        const baiduMap = new window.BMapGL.Map(container);
        baiduMap.centerAndZoom(new window.BMapGL.Point(center.lng, center.lat), zoom);
        baiduMap.enableScrollWheelZoom(true);
        baiduMap.enableKeyboardZoom();
        setMap(baiduMap);
      }
    }, 100);
  }, [ready, map]);

  return { ready, map, containerRef, initMap };
}
