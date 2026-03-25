'use client';

import * as React from 'react';
import type { TimelineEvent } from '@/lib/history/data/timeline';
import { formatYear } from '@/lib/history/utils';
import { useTranslations } from 'next-intl';
import { TIMELINE_MAP_COLORS } from '@/lib/history/constants';
import { logger } from '@/lib/history/logger';

const BAIDU_MAP_AK = process.env.NEXT_PUBLIC_BAIDU_MAP_AK || '';

interface TimelineMapProps {
  event: TimelineEvent | null;
}

// WGS-84 to BD-09 (Baidu) coordinate conversion
// Based on the official coordinate transformation algorithm
function wgs84ToBd09(lon: number, lat: number): { lon: number; lat: number } {
  const PI = Math.PI;

  // Step 1: WGS-84 to GCJ-02 (China encrypted coordinates)
  const transformLat = (x: number, y: number): number => {
    let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * PI) + 40.0 * Math.sin(y / 3.0 * PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * PI) + 320.0 * Math.sin(y * PI / 30.0)) * 2.0 / 3.0;
    return ret;
  };

  const transformLon = (x: number, y: number): number => {
    let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(x * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * PI) + 40.0 * Math.sin(x / 3.0 * PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * PI) + 300.0 * Math.sin(x / 30.0 * PI)) * 2.0 / 3.0;
    return ret;
  };

  const isInChina = (lat: number, lon: number): boolean => {
    return lon >= 72.004 && lon <= 137.8347 && lat >= 0.8293 && lat <= 55.8271;
  };

  let gcjLon = lon;
  let gcjLat = lat;

  if (isInChina(lat, lon)) {
    const dLat = transformLat(lon - 105.0, lat - 35.0);
    const dLon = transformLon(lon - 105.0, lat - 35.0);
    gcjLat = lat + dLat;
    gcjLon = lon + dLon;
  }

  // Step 2: GCJ-02 to BD-09
  const ZB2 = Math.sqrt(gcjLon * gcjLon + gcjLat * gcjLat) + 0.00002 * Math.sin(gcjLat * PI * 3000.0 / 180.0);
  const THETA2 = Math.atan2(gcjLat, gcjLon) + 0.000003 * Math.cos(gcjLon * PI * 3000.0 / 180.0);
  const bdLon = ZB2 * Math.cos(THETA2) + 0.0065;
  const bdLat = ZB2 * Math.sin(THETA2) + 0.006;

  return { lon: bdLon, lat: bdLat };
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    BMapGL: any;
  }
}

export function TimelineMap({ event }: TimelineMapProps) {
  const t = useTranslations();
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = React.useRef<any>(null);
  const [mapReady, setMapReady] = React.useState(false);

  // Center is computed on mount; map pans to event location via separate effect
  const initialCenter = (() => {
    if (event?.location) {
      const converted = wgs84ToBd09(event.location.lon, event.location.lat);
      return { lon: converted.lon, lat: converted.lat };
    }
    return { lon: 108.95, lat: 34.34 };
  })();

  // Load Baidu Map script
  React.useEffect(() => {
    if (mapRef.current) return;

    const initMap = () => {
      if (window.BMapGL && mapContainerRef.current) {
        try {
          const map = new window.BMapGL.Map(mapContainerRef.current);
          map.centerAndZoom(new window.BMapGL.Point(initialCenter.lon, initialCenter.lat), event ? 5 : 4);
          map.enableScrollWheelZoom(true);
          mapRef.current = map;
          setMapReady(true);
        } catch (e) {
          logger.error('map', 'Failed to initialize Baidu Map', e);
        }
      }
    };

    const callbackName = 'baiduTimelineMapCb_' + Date.now();
    (window as unknown as Record<string, () => void>)[callbackName] = () => { initMap(); };

    if (!BAIDU_MAP_AK) {
      logger.warn('map', 'NEXT_PUBLIC_BAIDU_MAP_AK is not configured — map will not load');
      delete (window as unknown as Record<string, unknown>)[callbackName];
      return;
    }

    const script = document.createElement('script');
    script.src = `https://api.map.baidu.com/api?v=1.0&type=webgl&ak=${BAIDU_MAP_AK}&callback=${callbackName}`;
    script.async = true;
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
      delete (window as unknown as Record<string, unknown>)[callbackName];
      mapRef.current = null;
      setMapReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Draw map content whenever event changes
  React.useEffect(() => {
    if (!mapRef.current || !mapReady || !event) return;

    const map = mapRef.current;
    map.clearOverlays();

    // Draw territory polygons
    if (event.territories) {
      for (const territory of event.territories) {
        if (!territory.polygon || territory.polygon.length < 3) continue;

        try {
          const bdCoords = territory.polygon.map(
            (coord: number[]) => {
              if (coord[0] === undefined || coord[1] === undefined) return null;
              const converted = wgs84ToBd09(coord[0], coord[1]);
              return new window.BMapGL.Point(converted.lon, converted.lat);
            }
          ).filter((p): p is NonNullable<typeof p> => p !== null);

          const polygon = new window.BMapGL.Polygon(bdCoords, {
            strokeColor: territory.color,
            strokeWeight: 2,
            fillColor: territory.color,
            fillOpacity: 0.35,
          });
          map.addOverlay(polygon);
        } catch (e) {
          logger.warn('map', 'Failed to draw territory polygon', e);
        }
      }
    }

    // Draw event location marker
    if (event.location) {
      const converted = wgs84ToBd09(event.location.lon, event.location.lat);
      const point = new window.BMapGL.Point(converted.lon, converted.lat);

      // Create custom marker with emoji
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const icon = new window.BMapGL.Icon(('' as any), new window.BMapGL.Size(0, 0));
      const marker = new window.BMapGL.Marker(point, { icon });

      // Add tooltip via label
      const label = new window.BMapGL.Label(t(event.location.nameKey), {
        offset: new window.BMapGL.Size(-20, -25),
      });
      label.setStyle({
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: '16px',
      });
      marker.setLabel(label);

      map.addOverlay(marker);

      // Draw faction labels near the marker
      if (event.factions && event.factions.length > 0) {
        const count = event.factions.length;
        event.factions.forEach((faction, index) => {
          const offset = (index - (count - 1) / 2) * 4;
          const labelPoint = new window.BMapGL.Point(converted.lon + offset, converted.lat + 1.5);
          const factionLabel = new window.BMapGL.Label(t(faction.nameKey), {
            offset: new window.BMapGL.Size(-30, -10),
          });
          factionLabel.setStyle({
            backgroundColor: faction.color,
            color: '#fff',
            border: `1px solid ${faction.color}`,
            borderRadius: '4px',
            padding: '2px 6px',
            fontSize: '12px',
            fontWeight: '500',
            whiteSpace: 'nowrap',
          });
          // Position label using a transparent marker
          const labelMarker = new window.BMapGL.Marker(labelPoint, {
            icon: new window.BMapGL.Icon(
              'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
              new window.BMapGL.Size(1, 1)
            ),
          });
          labelMarker.setLabel(factionLabel);
          map.addOverlay(labelMarker);
        });
      }
    }

    // Pan to the event location
    if (event.location) {
      const converted = wgs84ToBd09(event.location.lon, event.location.lat);
      map.panTo(new window.BMapGL.Point(converted.lon, converted.lat));
    }
  }, [mapReady, event, t]);

  return (
    <div className={`relative w-full h-full rounded-lg overflow-hidden border ${TIMELINE_MAP_COLORS.container}`}>
      {!mapReady && (
        <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 z-10`}>
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

      {/* Year indicator */}
      {event && mapReady && (
        <div className={`absolute top-2 sm:top-4 left-2 sm:left-4 ${TIMELINE_MAP_COLORS.overlay.bg} ${TIMELINE_MAP_COLORS.overlay.backdrop} px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg`}>
          <span className="text-lg sm:text-2xl font-bold text-white">{formatYear(event.year)}</span>
        </div>
      )}

      {/* Legend */}
      {event?.territories && event.territories.length > 0 && mapReady && (
        <div className={`absolute bottom-2 sm:bottom-4 left-2 sm:left-4 ${TIMELINE_MAP_COLORS.overlay.bg} ${TIMELINE_MAP_COLORS.overlay.backdrop} px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg max-w-[60%] sm:max-w-none`}>
          <p className={`text-xs ${TIMELINE_MAP_COLORS.legend.title} mb-1 sm:mb-2 hidden sm:block`}>{t('map.legend')}</p>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {event.territories.map((territory, index) => (
              <div key={index} className="flex items-center gap-1">
                <div
                  className={`w-2 sm:w-3 h-2 sm:h-3 ${TIMELINE_MAP_COLORS.legend.itemBg}`}
                  style={{ backgroundColor: territory.color }}
                />
                <span className={`text-xs ${TIMELINE_MAP_COLORS.legend.text} whitespace-nowrap`}>{t(territory.factionNameKey)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
