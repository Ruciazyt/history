'use client';

import * as React from 'react';
import Map, { Marker, Popup, NavigationControl, Source, Layer } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

import type { TimelineEvent } from '@/lib/history/data/timeline';
import { formatYear } from '@/lib/history/utils';
import { useTranslations } from 'next-intl';
import { TIMELINE_MAP_COLORS, UI_COLORS } from '@/lib/history/constants';

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
      features: event.territories.map((territory) => ({
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
    <div className={`relative w-full h-full rounded-lg overflow-hidden border ${TIMELINE_MAP_COLORS.container}`}>
      <Map
        {...viewState}
        onMove={evt => setViewState(prev => ({ ...prev, ...evt.viewState }))}
        // 限制视野在中国附近
        maxBounds={[[73.0, 17.5], [135.5, 54.5]]}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
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
              <div className={`w-5 h-5 ${TIMELINE_MAP_COLORS.marker.bg} rounded-full ${TIMELINE_MAP_COLORS.marker.border} shadow-lg cursor-pointer animate-pulse flex items-center justify-center`}>
                <span className={TIMELINE_MAP_COLORS.marker.icon}>📍</span>
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
                  className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium shadow-lg border-2 whitespace-nowrap ${UI_COLORS.text.primary}`}
                  style={{ backgroundColor: faction.color, borderColor: faction.color }}
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
                  <p className={TIMELINE_MAP_COLORS.popup.text}>{formatYear(event.year)}</p>
                </div>
              </Popup>
            )}
          </>
        )}
      </Map>

      {/* 年份指示器 - 移动端更小 */}
      {event && (
        <div className={`absolute top-2 sm:top-4 left-2 sm:left-4 ${TIMELINE_MAP_COLORS.overlay.bg} ${TIMELINE_MAP_COLORS.overlay.backdrop} px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg`}>
          <span className="text-lg sm:text-2xl font-bold text-white">{formatYear(event.year)}</span>
        </div>
      )}

      {/* 势力范围图例 - 移动端更小 */}
      {event?.territories && event.territories.length > 0 && (
        <div className={`absolute bottom-2 sm:bottom-4 left-2 sm:left-4 ${TIMELINE_MAP_COLORS.overlay.bg} ${TIMELINE_MAP_COLORS.overlay.backdrop} px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg max-w-[60%] sm:max-w-none`}>
          <p className={`text-xs ${TIMELINE_MAP_COLORS.legend.title} mb-1 sm:mb-2 hidden sm:block`}>势力范围</p>
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
