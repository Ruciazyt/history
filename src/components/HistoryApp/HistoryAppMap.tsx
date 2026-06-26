'use client';

import * as React from 'react';
import type { Event, Era, Ruler } from '@/lib/history/types';
import { getChgisBoundariesForOpenEras } from '@/lib/history/chgis';
import { getBattles } from '@/lib/history/battles';
import {
  MAP_DEFAULT_CENTER,
  MAP_DEFAULT_ZOOM,
  MAP_DESIGN_COLORS,
  POLITY_CAPITALS,
} from '@/lib/history/constants/map';
import { useTiandituMap } from '@/lib/history/hooks/useTiandituMap';
import { drawBoundaryFeature } from '@/lib/history/mapOverlays';
import { POLITY_DOT_COLORS } from '@/components/HistoryApp/eraGroups';

type MapLayers = { boundaries: boolean; events: boolean; tileLabels: boolean };

function resolveFocusPolityId(
  selectedRuler: Ruler | null,
  openPolityIds: Set<string>
): string | null {
  if (selectedRuler?.eraId && POLITY_CAPITALS[selectedRuler.eraId]) {
    return selectedRuler.eraId;
  }
  for (const id of openPolityIds) {
    if (POLITY_CAPITALS[id]) return id;
  }
  return null;
}

function MapCityPopup({
  name,
  subtitle,
  style,
}: {
  name: string;
  subtitle: string;
  style: React.CSSProperties;
}) {
  return (
    <div className="absolute z-[5] pointer-events-none" style={style}>
      <div className="relative bg-white rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.12)] px-4 py-3 min-w-[130px] -translate-x-1/2 -translate-y-[calc(100%+12px)]">
        <div className="text-[14px] font-normal text-[#747474]">{name}</div>
        <div className="text-[11px] text-[#afafaf] mt-0.5">{subtitle}</div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 shadow-sm" />
      </div>
    </div>
  );
}

function MapLegend({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute bottom-[72px] left-1/2 -translate-x-[calc(50%+40px)] z-[6] pointer-events-auto rounded-[12px] border border-[var(--color-figma-control-border)] bg-white px-4 py-3 shadow-[var(--color-figma-card-shadow)] min-w-[140px]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[13px] text-[var(--color-figma-sidebar-era-name)]">战国七国</span>
        <button type="button" onClick={onClose} className="text-[#afafaf] hover:text-[#747474] text-sm" aria-label="关闭图例">×</button>
      </div>
      <ul className="space-y-1.5">
        {Object.entries(POLITY_DOT_COLORS).map(([id, color]) => {
          const capital = POLITY_CAPITALS[id];
          if (!capital) return null;
          return (
            <li key={id} className="flex items-center gap-2 text-[12px] text-[#747474]">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
              {capital.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function MapLayerPanel({
  layers,
  onChange,
  onClose,
}: {
  layers: MapLayers;
  onChange: (next: MapLayers) => void;
  onClose: () => void;
}) {
  return (
    <div className="absolute bottom-[72px] left-1/2 -translate-x-[calc(50%+40px)] z-[6] pointer-events-auto rounded-[12px] border border-[var(--color-figma-control-border)] bg-white px-4 py-3 shadow-[var(--color-figma-card-shadow)] min-w-[160px]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[13px] text-[var(--color-figma-sidebar-era-name)]">图层</span>
        <button type="button" onClick={onClose} className="text-[#afafaf] hover:text-[#747474] text-sm" aria-label="关闭图层">×</button>
      </div>
      <label className="flex items-center gap-2 text-[12px] text-[#747474] cursor-pointer">
        <input
          type="checkbox"
          checked={layers.tileLabels}
          onChange={(e) => onChange({ ...layers, tileLabels: e.target.checked })}
          className="rounded"
        />
        地图标注（省界/地名）
      </label>
      <label className="flex items-center gap-2 text-[12px] text-[#747474] cursor-pointer mt-2">
        <input
          type="checkbox"
          checked={layers.boundaries}
          onChange={(e) => onChange({ ...layers, boundaries: e.target.checked })}
          className="rounded"
        />
        历史疆域
      </label>
      <label className="flex items-center gap-2 text-[12px] text-[#747474] cursor-pointer mt-2">
        <input
          type="checkbox"
          checked={layers.events}
          onChange={(e) => onChange({ ...layers, events: e.target.checked })}
          className="rounded"
        />
        历史事件
      </label>
    </div>
  );
}

export function HistoryAppMap({
  events,
  year,
  eras,
  openEraIds,
  openPolityIds,
  selectedRuler,
}: {
  events: Event[];
  year: number;
  eras: Era[];
  openEraIds: Set<string>;
  openPolityIds: Set<string>;
  selectedRuler: Ruler | null;
}) {
  const focusPolityId = React.useMemo(
    () => resolveFocusPolityId(selectedRuler, openPolityIds),
    [selectedRuler, openPolityIds]
  );

  const capital = React.useMemo(() => {
    if (focusPolityId && POLITY_CAPITALS[focusPolityId]) {
      return POLITY_CAPITALS[focusPolityId];
    }
    return MAP_DEFAULT_CENTER;
  }, [focusPolityId]);

  const {
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
  } = useTiandituMap({
    center: { lon: capital.lon, lat: capital.lat },
    zoom: MAP_DEFAULT_ZOOM,
    variant: 'design',
  });

  const [showLegend, setShowLegend] = React.useState(false);
  const [showLayers, setShowLayers] = React.useState(false);
  const [layers, setLayers] = React.useState<MapLayers>({ boundaries: true, events: true, tileLabels: true });
  const [popupCapitalId, setPopupCapitalId] = React.useState<string | null>(null);
  const [capitalMarkerPos, setCapitalMarkerPos] = React.useState<Record<string, { x: number; y: number }>>({});

  const capitalMarkers = React.useMemo(() => {
    const ids = new Set(openPolityIds);
    if (focusPolityId) ids.add(focusPolityId);
    return [...ids]
      .map((id) => (POLITY_CAPITALS[id] ? { id, ...POLITY_CAPITALS[id] } : null))
      .filter((item): item is { id: string; lon: number; lat: number; name: string; subtitle: string } => item != null);
  }, [openPolityIds, focusPolityId]);

  const popupCapital = popupCapitalId ? POLITY_CAPITALS[popupCapitalId] : null;
  const popupPos = popupCapitalId ? capitalMarkerPos[popupCapitalId] : null;

  const mappable = React.useMemo(
    () => events.filter((e) => e.location && Number.isFinite(e.location.lon) && Number.isFinite(e.location.lat)),
    [events]
  );

  const { battles, normalEvents } = React.useMemo(() => {
    const battleIds = new Set(getBattles(events).map((b) => b.id));
    return {
      battles: mappable.filter((e) => battleIds.has(e.id)),
      normalEvents: mappable.filter((e) => !battleIds.has(e.id)),
    };
  }, [mappable, events]);

  const activeBoundaries = React.useMemo(
    () => getChgisBoundariesForOpenEras(openEraIds, eras, year),
    [openEraIds, eras, year]
  );

  const updateCapitalMarkerPos = React.useCallback(() => {
    const next: Record<string, { x: number; y: number }> = {};
    for (const marker of capitalMarkers) {
      const point = lngLatToContainerPoint(marker.lon, marker.lat);
      if (point) next[marker.id] = point;
    }
    setCapitalMarkerPos(next);
  }, [capitalMarkers, lngLatToContainerPoint]);

  React.useEffect(() => {
    setPopupCapitalId(null);
  }, [focusPolityId]);

  React.useEffect(() => {
    if (!mapReady) return;
    setTileAnnotation(layers.tileLabels);
  }, [mapReady, layers.tileLabels, setTileAnnotation]);

  React.useEffect(() => {
    if (!mapReady) return;
    panTo(capital.lon, capital.lat);
    updateCapitalMarkerPos();
  }, [mapReady, capital.lon, capital.lat, panTo, updateCapitalMarkerPos]);

  React.useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map) return;

    updateCapitalMarkerPos();
    const onMove = () => updateCapitalMarkerPos();
    map.addEventListener('moveend', onMove);
    map.addEventListener('zoomend', onMove);

    return () => {
      map.removeEventListener('moveend', onMove);
      map.removeEventListener('zoomend', onMove);
    };
  }, [mapReady, mapRef, updateCapitalMarkerPos]);

  React.useEffect(() => {
    if (!mapRef.current || !mapReady) return;

    const map = mapRef.current;
    map.clearOverLays();

    const addCircle = (
      lon: number,
      lat: number,
      radius: number,
      opts: { strokeColor: string; strokeWeight: number; fillColor: string; fillOpacity: number }
    ) => {
      map.addOverLay(new window.T.Circle(new window.T.LngLat(lon, lat), radius, opts));
    };

    if (layers.boundaries) {
      activeBoundaries.forEach(({ feature, strokeColor, fillColor, fillOpacity }) => {
        drawBoundaryFeature(map, window.T, feature, {
          strokeColor,
          fillColor,
          fillOpacity,
          strokeWeight: 2,
        });
      });
    }

    for (const id of openPolityIds) {
      if (id === focusPolityId) continue;
      const other = POLITY_CAPITALS[id];
      if (!other) continue;
      try {
        map.addOverLay(
          new window.T.Polyline(
            [
              new window.T.LngLat(capital.lon, capital.lat),
              new window.T.LngLat(other.lon, other.lat),
            ],
            {
              color: MAP_DESIGN_COLORS.routeLine,
              weight: 2,
              opacity: 0.5,
              lineStyle: 'dashed',
            }
          )
        );
      } catch {
        // Polyline dashed style may be unsupported on some API builds
      }
    }

    for (const id of openPolityIds) {
      const c = POLITY_CAPITALS[id];
      if (!c || id === focusPolityId) continue;
      addCircle(c.lon, c.lat, 1800, {
        strokeColor: MAP_DESIGN_COLORS.cityDot,
        strokeWeight: 1,
        fillColor: MAP_DESIGN_COLORS.cityDot,
        fillOpacity: 0.95,
      });
    }

    addCircle(capital.lon, capital.lat, 9000, {
      strokeColor: MAP_DESIGN_COLORS.capitalGlow,
      strokeWeight: 2,
      fillColor: MAP_DESIGN_COLORS.capitalGlow,
      fillOpacity: 0.2,
    });
    addCircle(capital.lon, capital.lat, 3200, {
      strokeColor: MAP_DESIGN_COLORS.capitalRing,
      strokeWeight: 2,
      fillColor: MAP_DESIGN_COLORS.capitalRing,
      fillOpacity: 0.95,
    });
    addCircle(capital.lon, capital.lat, 1200, {
      strokeColor: MAP_DESIGN_COLORS.capitalDot,
      strokeWeight: 1,
      fillColor: MAP_DESIGN_COLORS.capitalDot,
      fillOpacity: 1,
    });

    if (layers.events) {
      [...normalEvents, ...battles].forEach((e) => {
        if (!e.location) return;
        addCircle(e.location.lon, e.location.lat, 2200, {
          strokeColor: MAP_DESIGN_COLORS.eventDot,
          strokeWeight: 1,
          fillColor: MAP_DESIGN_COLORS.eventDot,
          fillOpacity: 0.85,
        });
      });
    }
  }, [mapReady, mapRef, activeBoundaries, normalEvents, battles, layers, capital, focusPolityId, openPolityIds]);

  const handleLocate = () => {
    panTo(capital.lon, capital.lat, MAP_DEFAULT_ZOOM);
    updateCapitalMarkerPos();
  };

  return (
    <div className="history-app-map absolute inset-0 z-0 overflow-hidden">
      {!mapReady && (
        <div className="absolute inset-0 z-[4] flex flex-col items-center justify-center gap-3 bg-[var(--color-figma-map-bg)] text-[#747474]">
          {mapLoadError ? (
            <>
              <span className="text-sm">地图加载失败，请检查网络</span>
              <button
                type="button"
                onClick={handleRetry}
                className="px-4 py-1.5 bg-[var(--color-primary)] text-[var(--color-on-primary)] text-xs rounded-[var(--rounded-pill)]"
              >
                重试
              </button>
            </>
          ) : (
            <>
              <div className="w-6 h-6 border-2 border-[#afafaf] border-t-[#747474] rounded-full animate-spin" />
              <span className="text-sm">加载地图中...</span>
            </>
          )}
        </div>
      )}

      <div ref={mapContainerRef} className="absolute inset-0 z-0" />
      <div className="history-app-map__wash absolute inset-0 z-[1]" aria-hidden="true" />
      <div className="history-app-map__vignette absolute inset-0 z-[1]" aria-hidden="true" />

      {mapReady &&
        capitalMarkers.map((marker) => {
          const pos = capitalMarkerPos[marker.id];
          if (!pos) return null;
          const isFocus = marker.id === focusPolityId;
          return (
            <button
              key={marker.id}
              type="button"
              aria-label={marker.name}
              aria-expanded={popupCapitalId === marker.id}
              className={`absolute z-[4] -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer ${
                isFocus ? 'h-12 w-12' : 'h-8 w-8'
              }`}
              style={{ left: pos.x, top: pos.y }}
              onClick={() => setPopupCapitalId((prev) => (prev === marker.id ? null : marker.id))}
            />
          );
        })}

      {popupCapital && popupPos && mapReady && (
        <MapCityPopup
          name={popupCapital.name}
          subtitle={popupCapital.subtitle}
          style={{ left: popupPos.x, top: popupPos.y }}
        />
      )}

      {showLegend && <MapLegend onClose={() => setShowLegend(false)} />}
      {showLayers && (
        <MapLayerPanel layers={layers} onChange={setLayers} onClose={() => setShowLayers(false)} />
      )}

      <div className="absolute bottom-6 left-1/2 -translate-x-[calc(50%+40px)] flex items-center h-[52px] rounded-[19px] border border-[var(--color-figma-control-border)] bg-[var(--color-figma-control-bg)] shadow-[var(--color-figma-card-shadow)] pointer-events-auto z-[6]">
        {[
          { label: '定位', action: handleLocate, d: 'M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z' },
          { label: '图例', action: () => { setShowLayers(false); setShowLegend((v) => !v); }, d: 'M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z' },
          { label: '图层', action: () => { setShowLegend(false); setShowLayers((v) => !v); }, d: 'M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z' },
        ].map((icon, i) => (
          <button
            key={icon.label}
            type="button"
            onClick={icon.action}
            className={`flex items-center justify-center w-[44px] h-full text-[var(--color-figma-sidebar-era-name)] hover:bg-[var(--color-surface-soft)] transition-colors ${i > 0 ? 'border-l border-[var(--color-figma-control-border)]' : ''}`}
            aria-label={icon.label}
          >
            <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
              <path d={icon.d} />
            </svg>
          </button>
        ))}
      </div>

      <div className="absolute bottom-6 left-1/2 translate-x-[calc(-50%+120px)] flex items-center h-[49px] rounded-[15px] bg-[var(--color-figma-zoom-bg)] shadow-[var(--color-figma-card-shadow)] overflow-hidden pointer-events-auto z-[6]">
        <button type="button" onClick={zoomOut} className="flex items-center justify-center w-[44px] h-full text-[var(--color-figma-sidebar-era-name)] hover:bg-[var(--color-surface-soft)] text-lg" aria-label="缩小">−</button>
        <div className="w-px h-[26px] bg-[var(--color-hairline-soft)]" aria-hidden="true" />
        <button type="button" onClick={zoomIn} className="flex items-center justify-center w-[44px] h-full text-[var(--color-figma-sidebar-era-name)] hover:bg-[var(--color-surface-soft)] text-lg" aria-label="放大">+</button>
      </div>
    </div>
  );
}
