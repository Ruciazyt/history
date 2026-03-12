'use client';

import * as React from 'react';
import Map, { Marker, Popup, NavigationControl, Source, Layer, type MapLib } from 'react-map-gl/maplibre';
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
    <div className="relative w-full h-full rounded-lg overflow-hidden border border-zinc-700">
      <Map
        {...viewState}
        onMove={evt => setViewState(prev => ({ ...prev, ...evt.viewState }))}
        maxBounds={[[73.0, 17.5], [135.5, 54.5]]}
        mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="top-right" />

        {geojsonData && (
          <Source id="territories" type="geojson" data={geojsonData}>
            <Layer
              id="territory-fill"
              type="fill"
              paint={{
                'fill-color': ['get', 'color'],
                'fill-opacity': 0.35,
              }}
            />
            <Layer
              id="territory-line"
              type="line"
              paint={{
                'line-color': ['get', 'color'],
                'line-width': 2,
              }}
            />
          </Source>
        )}

        {event?.location && (
          <Marker
            longitude={event.location.lon}
            latitude={event.location.lat}
            anchor="bottom"
            onClick={e => {
              e.originalEvent.stopPropagation();
              setPopupInfo(event.location?.label || 'Location');
            }}
          >
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg" />
          </Marker>
        )}

        {popupInfo && (
          <Popup
            longitude={event?.location.lon ?? 0}
            latitude={event?.location.lat ?? 0}
            anchor="top"
            onClose={() => setPopupInfo(null)}
          >
            <div className="text-sm">{popupInfo}</div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
