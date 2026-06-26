'use client';

import * as React from 'react';
import {
  computeMinZoomToFillViewport,
  configureDesignMapConstraints,
  createDesignMap,
  MAP_LOAD_TIMEOUT_MS,
  setDesignBasemapAnnotation,
  TIANDITU_TOKEN,
} from '@/lib/history/constants/map';
import { logger } from '@/lib/history/logger';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T: any;
  }
}

export function useTiandituMap({
  center,
  zoom,
  variant = 'default',
}: {
  center: { lon: number; lat: number };
  zoom: number;
  variant?: 'default' | 'design';
}) {
  const [mapReady, setMapReady] = React.useState(false);
  const [mapLoadError, setMapLoadError] = React.useState(false);
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = React.useRef<any>(null);
  const initialCenterRef = React.useRef(center);
  const initialZoomRef = React.useRef(zoom);
  const initMapRef = React.useRef<() => void>(() => {});

  const variantRef = React.useRef(variant);
  variantRef.current = variant;

  const getMinZoom = React.useCallback(() => {
    const width = mapContainerRef.current?.clientWidth ?? 0;
    return computeMinZoomToFillViewport(width);
  }, []);

  initMapRef.current = () => {
    if (mapRef.current || !window.T || !mapContainerRef.current) return;

    try {
      const container = mapContainerRef.current;
      const map =
        variantRef.current === 'design'
          ? createDesignMap(container, window.T, { withAnnotation: true })
          : new window.T.Map(container);
      const { lon, lat } = initialCenterRef.current;
      map.centerAndZoom(new window.T.LngLat(lon, lat), initialZoomRef.current);
      map.enableScrollWheelZoom();

      if (variantRef.current === 'design') {
        configureDesignMapConstraints(map, window.T, container);
      }

      mapRef.current = map;
      setMapLoadError(false);
      setMapReady(true);
    } catch (e) {
      logger.error('map', 'Failed to initialize Tianditu', e);
      setMapLoadError(true);
    }
  };

  const handleRetry = React.useCallback(() => {
    setMapLoadError(false);
    setMapReady(false);
    mapRef.current = null;
    if (mapContainerRef.current) {
      mapContainerRef.current.innerHTML = '';
    }
    initMapRef.current();
  }, []);

  React.useEffect(() => {
    const initMap = () => initMapRef.current();

    if (window.T) {
      initMap();
      return () => {
        mapRef.current = null;
        setMapReady(false);
      };
    }

    const script = document.createElement('script');
    script.src = `https://api.tianditu.gov.cn/api?v=4.0&tk=${TIANDITU_TOKEN}`;
    script.async = true;
    script.onload = initMap;
    script.onerror = () => {
      logger.error('map', 'Failed to load Tianditu script');
      setMapLoadError(true);
    };
    document.head.appendChild(script);

    const timeoutId = window.setTimeout(() => {
      if (!mapRef.current) setMapLoadError(true);
    }, MAP_LOAD_TIMEOUT_MS);

    return () => {
      clearTimeout(timeoutId);
      script.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, []);

  React.useEffect(() => {
    if (!mapReady || variantRef.current !== 'design') return;
    const map = mapRef.current;
    const container = mapContainerRef.current;
    if (!map || !container) return;

    const onResize = () => {
      configureDesignMapConstraints(map, window.T, container);
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [mapReady]);

  const zoomIn = React.useCallback(() => {
    mapRef.current?.zoomIn();
  }, []);

  const zoomOut = React.useCallback(() => {
    const map = mapRef.current;
    if (!map?.getZoom || !map.zoomOut) return;
    const minZoom = getMinZoom();
    if (map.getZoom() > minZoom) map.zoomOut();
  }, [getMinZoom]);

  const panTo = React.useCallback((lon: number, lat: number, nextZoom?: number) => {
    const map = mapRef.current;
    if (!map) return;
    const lngLat = new window.T.LngLat(lon, lat);
    if (nextZoom != null) {
      const minZoom = getMinZoom();
      map.centerAndZoom(lngLat, Math.max(nextZoom, minZoom));
    } else {
      map.panTo(lngLat);
    }
  }, [getMinZoom]);

  const lngLatToContainerPoint = React.useCallback((lon: number, lat: number) => {
    const map = mapRef.current;
    if (!map?.lngLatToContainerPoint) return null;
    const point = map.lngLatToContainerPoint(new window.T.LngLat(lon, lat));
    return { x: point.x, y: point.y };
  }, []);

  const setTileAnnotation = React.useCallback((enabled: boolean) => {
    const map = mapRef.current;
    if (!map || !window.T || variantRef.current !== 'design') return;
    setDesignBasemapAnnotation(map, window.T, enabled);
  }, []);

  return {
    mapContainerRef,
    mapRef,
    mapReady,
    mapLoadError,
    handleRetry,
    zoomIn,
    zoomOut,
    panTo,
    lngLatToContainerPoint,
    setTileAnnotation,
  };
}
