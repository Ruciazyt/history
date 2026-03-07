'use client';

import * as React from 'react';
import Map, {
  Marker,
  Popup,
  NavigationControl,
  type MapLib,
} from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';

// react-map-gl expects a MapLib-compatible implementation.
// maplibre-gl provides the required API surface.
import 'maplibre-gl/dist/maplibre-gl.css';

import type { Event } from '@/lib/history/types';
import { formatYear } from '@/lib/history/utils';

export function HistoryMap({
  events,
  initialCenter = { lon: 112.45, lat: 34.62 },
  initialZoom = 4,
}: {
  events: Event[];
  initialCenter?: { lon: number; lat: number };
  initialZoom?: number;
}) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const selected = React.useMemo(
    () => events.find((e) => e.id === selectedId) ?? null,
    [events, selectedId]
  );

  const mappable = React.useMemo(
    () => events.filter((e) => e.location && Number.isFinite(e.location.lon) && Number.isFinite(e.location.lat)),
    [events]
  );

  return (
    <div className="h-full w-full overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <Map
        mapLib={maplibregl as unknown as MapLib}
        initialViewState={{
          longitude: initialCenter.lon,
          latitude: initialCenter.lat,
          zoom: initialZoom,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://demotiles.maplibre.org/style.json"
        onClick={() => setSelectedId(null)}
      >
        <div className="absolute right-3 top-3 z-10">
          <NavigationControl visualizePitch />
        </div>

        {mappable.map((e) => (
          <Marker
            key={e.id}
            longitude={e.location!.lon}
            latitude={e.location!.lat}
            anchor="bottom"
          >
            <button
              type="button"
              onClick={(ev) => {
                ev.stopPropagation();
                setSelectedId(e.id);
              }}
              className="h-3 w-3 rounded-full bg-red-600 ring-2 ring-white shadow"
              aria-label={`Event: ${e.title}`}
            />
          </Marker>
        ))}

        {selected?.location ? (
          <Popup
            longitude={selected.location.lon}
            latitude={selected.location.lat}
            anchor="top"
            closeButton
            closeOnClick={false}
            onClose={() => setSelectedId(null)}
            maxWidth="320px"
          >
            <div className="space-y-1">
              <div className="text-xs text-zinc-500">{formatYear(selected.year)}</div>
              <div className="text-sm font-semibold text-zinc-900">{selected.title}</div>
              <div className="text-sm text-zinc-700">{selected.summary}</div>
              {selected.location.label ? (
                <div className="text-xs text-zinc-500">📍 {selected.location.label}</div>
              ) : null}
            </div>
          </Popup>
        ) : null}
      </Map>
    </div>
  );
}
