'use client';

import * as React from 'react';
import Map, { Marker, Popup, NavigationControl, Source, Layer } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import type { TimelineEvent, Territory } from '@/lib/history/data/timeline';
import { formatYear } from '@/lib/history/utils';
import { useTranslations } from 'next-intl';

interface TimelineMapProps {
  event: TimelineEvent | null;
}

export function TimelineMap({ event }: TimelineMapProps) {
  const t = useTranslations();
  const [viewState, setViewState] = React.useState({
    longitude: event?.location.lon ?? 108.95,
    latitude: event?.location.lat ?? 34.34,
    zoom: 4,
    minZoom: 3,
    maxZoom: 8,
    pitch: 0,
    bearing: 0,
  });
  const [popupInfo, setPopupInfo] = React.useState<string | null>(null);

  // 生成 GeoJSON 数据
  const geojsonData = React.useMemo(() => {
    if (!event?.territories) return null;
    
    return {
      type: 'FeatureCollection' as const,
      features: event.territories.map((territory, index) => ({
        type: 'Feature' as const,
        properties: {
          name: t(territory.factionNameKey),
          color: territory.color,
        },
        geometry: {
          type: 'Polygon' as const,
          coordinates: [territory.polygon],
        },
      }))
    };
  }, [event, t]);

  React.useEffect(() => {
    if (event) {
      setViewState({
        longitude: event.location.lon,
        latitude: event.location.lat,
        zoom: 5,
        minZoom: 3,
        maxZoom: 8,
        pitch: 0,
        bearing: 0,
      });
    }
  }, [event]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border border-zinc-700">
      <Map
        {...viewState}
        onMove={evt => setViewState(prev => ({ ...prev, ...evt.viewState }))}
        // 限制视野在中国附近
        maxBounds={[[73.0, 17.5], [135.5, 54.5]]}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="top-right" />

        {/* 势力范围多边形 */}
        {geojsonData && (
          <Source id="territories" type="geojson" data={geojsonData}>
            {/* 填充层 */}
            <Layer
              id="territory-fill"
              type="fill"
              paint={{
                'fill-color': ['get', 'color'],
                'fill-opacity': 0.35,
              }}
            />
            {/* 边框层 */}
            <Layer
              id="territory-line"
              type="line"
              paint={{
                'line-color': ['get', 'color'],
                'line-width': 2,
                'line-opacity': 0.9,
              }}
            />
          </Source>
        )}

        {event && (
          <>
            {/* 事件地点标记 */}
            <Marker
              longitude={event.location.lon}
              latitude={event.location.lat}
              anchor="bottom"
              onClick={e => {
                e.originalEvent.stopPropagation();
                setPopupInfo(event.location.nameKey);
              }}
            >
              <div className="w-5 h-5 bg-red-500 rounded-full border-2 border-white shadow-lg cursor-pointer animate-pulse flex items-center justify-center">
                <span className="text-xs">📍</span>
              </div>
            </Marker>

            {/* 势力名称标签 */}
            {event.factions?.map((faction, index) => (
              <Marker
                key={index}
                longitude={event.location.lon + (index - (event.factions!.length - 1) / 2) * 8}
                latitude={event.location.lat + 2}
                anchor="center"
              >
                <div 
                  className="px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg border-2"
                  style={{ backgroundColor: faction.color, borderColor: faction.color, color: '#fff' }}
                >
                  {t(faction.nameKey)}
                </div>
              </Marker>
            ))}

            {/* 弹出信息 */}
            {popupInfo && (
              <Popup
                longitude={event.location.lon}
                latitude={event.location.lat}
                anchor="top"
                onClose={() => setPopupInfo(null)}
                closeButton={false}
              >
                <div className="text-sm p-1">
                  <p className="font-semibold">{t(popupInfo)}</p>
                  <p className="text-zinc-500">{formatYear(event.year)}</p>
                </div>
              </Popup>
            )}
          </>
        )}
      </Map>

      {/* 年份指示器 */}
      {event && (
        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur px-4 py-2 rounded-lg">
          <span className="text-2xl font-bold text-white">{formatYear(event.year)}</span>
        </div>
      )}

      {/* 势力范围图例 */}
      {event?.territories && event.territories.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur px-3 py-2 rounded-lg">
          <p className="text-xs text-zinc-400 mb-2">势力范围</p>
          <div className="flex flex-wrap gap-2">
            {event.territories.map((territory, index) => (
              <div key={index} className="flex items-center gap-1">
                <div 
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: territory.color }}
                />
                <span className="text-xs text-white">{t(territory.factionNameKey)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
