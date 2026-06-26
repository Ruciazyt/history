'use client';

import * as React from 'react';
import type { TimelineEvent } from '@/lib/history/data/timeline';
import { formatYear } from '@/lib/history/utils';
import { useTranslations } from 'next-intl';
import { TIMELINE_MAP_COLORS } from '@/lib/history/constants';
import { logger } from '@/lib/history/logger';

const TIANDITU_TOKEN = '07b4df99018dcee22e60ad2064723188';

interface TimelineMapProps {
  event: TimelineEvent | null;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T: any;
  }
}

export function TimelineMap({ event }: TimelineMapProps) {
  const t = useTranslations();
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = React.useRef<any>(null);
  const [mapReady, setMapReady] = React.useState(false);

  const initialCenter = (() => {
    if (event?.location) {
      return { lon: event.location.lon, lat: event.location.lat };
    }
    return { lon: 108.95, lat: 34.34 };
  })();

  // Load Tianditu script
  React.useEffect(() => {
    if (mapRef.current) return;

    const initMap = () => {
      if (window.T && mapContainerRef.current) {
        try {
          const map = new window.T.Map(mapContainerRef.current);
          const center = new window.T.LngLat(initialCenter.lon, initialCenter.lat);
          map.centerAndZoom(center, event ? 5 : 4);
          map.enableScrollWheelZoom();
          mapRef.current = map;
          setMapReady(true);
        } catch (e) {
          logger.error('map', 'Failed to initialize Tianditu', e);
        }
      }
    };

    if (window.T) {
      initMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://api.tianditu.gov.cn/api?v=4.0&tk=${TIANDITU_TOKEN}`;
    script.async = true;
    script.onload = () => { initMap(); };
    script.onerror = () => { logger.error('map', 'Failed to load Tianditu script'); };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
      mapRef.current = null;
      setMapReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Draw map content whenever event changes
  React.useEffect(() => {
    if (!mapRef.current || !mapReady || !event) return;

    const map = mapRef.current;
    map.clearOverLays();

    // Draw territory polygons
    if (event.territories) {
      for (const territory of event.territories) {
        if (!territory.polygon || territory.polygon.length < 3) continue;

        try {
          const points = territory.polygon.map(
            (coord: number[]) => {
              if (coord[0] === undefined || coord[1] === undefined) return null;
              return new window.T.LngLat(coord[0], coord[1]);
            }
          ).filter((p): p is NonNullable<typeof p> => p !== null);

          const polygon = new window.T.Polygon(points, {
            strokeColor: territory.color,
            strokeWeight: 2,
            fillColor: territory.color,
            fillOpacity: 0.35,
          });
          map.addOverLay(polygon);
        } catch (e) {
          logger.warn('map', 'Failed to draw territory polygon', e);
        }
      }
    }

    // Draw event location marker
    if (event.location) {
      const lnglat = new window.T.LngLat(event.location.lon, event.location.lat);

      // Create marker
      const marker = new window.T.Marker(lnglat);

      // Add label
      const label = new window.T.Label({
        text: t(event.location.nameKey),
        position: lnglat,
        offset: new window.T.Pixel(-20, -25),
      });
      label.setBackgroundColor('transparent');
      label.setBorderLine(0);
      label.setFontColor('#000');
      label.setFontSize(16);
      map.addOverLay(label);

      map.addOverLay(marker);

      // Draw faction labels near the marker
      if (event.factions && event.factions.length > 0) {
        const count = event.factions.length;
        event.factions.forEach((faction, index) => {
          const offset = (index - (count - 1) / 2) * 4;
          const labelPoint = new window.T.LngLat(event.location.lon + offset, event.location.lat + 1.5);

          const factionLabel = new window.T.Label({
            text: t(faction.nameKey),
            position: labelPoint,
            offset: new window.T.Pixel(-30, -10),
          });
          factionLabel.setBackgroundColor(faction.color);
          factionLabel.setBorderLine(0);
          factionLabel.setFontColor('#fff');
          factionLabel.setFontSize(12);
          map.addOverLay(factionLabel);
        });
      }
    }

    // Pan to the event location
    if (event.location) {
      const lnglat = new window.T.LngLat(event.location.lon, event.location.lat);
      map.panTo(lnglat);
    }
  }, [mapReady, event, t]);

  return (
    <div className={`relative w-full h-full rounded-lg overflow-hidden border ${TIMELINE_MAP_COLORS.container}`}>
      {!mapReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 z-10">
          <div className="w-6 h-6 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" aria-hidden="true" />
          <span className="text-sm">加载地图中...</span>
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
