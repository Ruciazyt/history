export const TIANDITU_TOKEN = '07b4df99018dcee22e60ad2064723188';

export const MAP_LOAD_TIMEOUT_MS = 15_000;

export const MAP_MAX_ZOOM = 18;
/** 绝对下限：避免缩得过小出现两侧空白 */
export const MAP_MIN_ZOOM_FLOOR = 4;

/** 历史地图可视范围（东亚/中国及周边） */
export const MAP_VIEW_BOUNDS = {
  west: 72,
  south: 16,
  east: 138,
  north: 55,
} as const;

/** 战国七国都城（近似坐标） */
export const POLITY_CAPITALS: Record<
  string,
  { lon: number; lat: number; name: string; subtitle: string }
> = {
  'ws-qin': { lon: 108.95, lat: 34.34, name: '咸阳', subtitle: '秦的都城' },
  'ws-chu': { lon: 112.2, lat: 30.3, name: '郢都', subtitle: '楚的都城' },
  'ws-qi': { lon: 118.05, lat: 36.8, name: '临淄', subtitle: '齐的都城' },
  'ws-yan': { lon: 116.4, lat: 39.9, name: '蓟', subtitle: '燕的都城' },
  'ws-zhao': { lon: 114.5, lat: 36.6, name: '邯郸', subtitle: '赵的都城' },
  'ws-wei': { lon: 114.35, lat: 34.79, name: '大梁', subtitle: '魏的都城' },
  'ws-han': { lon: 113.7, lat: 34.4, name: '新郑', subtitle: '韩的都城' },
};

export const MAP_DEFAULT_CENTER = POLITY_CAPITALS['ws-qin']!;
export const MAP_DEFAULT_ZOOM = 5;

/** 首页地图视觉 token（对齐蓝湖设计稿） */
export const MAP_DESIGN_COLORS = {
  boundaryStroke: '#8aab6e',
  boundaryFill: '#a8c48a',
  capitalGlow: '#8fb86a',
  capitalRing: '#ffffff',
  capitalDot: '#1a1a1a',
  cityDot: '#1a1a1a',
  eventDot: '#4a4a4a',
  routeLine: '#ffffff',
} as const;

const DESIGN_ANNO_LAYER_KEY = '__historyDesignAnnoLayer';
const TILE_SIZE = 256;

/** 按视口宽度计算最小缩放，使世界地图横向至少铺满屏幕 */
export function computeMinZoomToFillViewport(width: number): number {
  if (width <= 0) return MAP_MIN_ZOOM_FLOOR;
  const z = Math.ceil(Math.log2(width / TILE_SIZE));
  return Math.max(z, MAP_MIN_ZOOM_FLOOR);
}

/** 地形晕渲瓦片（Web Mercator） */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createTerrainTileLayer(T: any) {
  const url = `https://t0.tianditu.gov.cn/DataServer?T=ter_w&x={x}&y={y}&l={z}&tk=${TIANDITU_TOKEN}`;
  return new T.TileLayer(url, { minZoom: MAP_MIN_ZOOM_FLOOR, maxZoom: MAP_MAX_ZOOM });
}

/** 矢量注记瓦片（省界、地名） */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createAnnotationTileLayer(T: any) {
  const url = `https://t0.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=${TIANDITU_TOKEN}`;
  return new T.TileLayer(url, { minZoom: MAP_MIN_ZOOM_FLOOR, maxZoom: MAP_MAX_ZOOM });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getStoredAnnotationLayer(map: any): any | null {
  return map[DESIGN_ANNO_LAYER_KEY] ?? null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function storeAnnotationLayer(map: any, layer: any | null): void {
  map[DESIGN_ANNO_LAYER_KEY] = layer;
}

/**
 * 初始化设计稿底图：显式 ter_w 地形瓦片 + 可选 cva_w 注记。
 * 比 setMapType 更稳定，避免切换图层时底图空白。
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createDesignMap(container: HTMLElement, T: any, options?: { withAnnotation?: boolean }): any {
  const withAnnotation = options?.withAnnotation ?? true;
  const terrainLayer = createTerrainTileLayer(T);
  const map = new T.Map(container, { layers: [terrainLayer] });

  if (withAnnotation) {
    const annoLayer = createAnnotationTileLayer(T);
    map.addLayer(annoLayer);
    storeAnnotationLayer(map, annoLayer);
  }

  return map;
}

/**
 * 限制缩放与拖拽范围：动态 minZoom 保证横向铺满，maxBounds 限制在东亚范围。
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function configureDesignMapConstraints(map: any, T: any, container: HTMLElement): void {
  const applyMinZoom = () => {
    const minZoom = computeMinZoomToFillViewport(container.clientWidth);
    if (typeof map.setMinZoom === 'function') {
      map.setMinZoom(minZoom);
    }
    if (typeof map.getZoom === 'function' && typeof map.setZoom === 'function') {
      const current = map.getZoom();
      if (current < minZoom) map.setZoom(minZoom);
    }
  };

  applyMinZoom();

  if (typeof map.setMaxZoom === 'function') {
    map.setMaxZoom(MAP_MAX_ZOOM);
  }

  if (typeof map.setMaxBounds === 'function' && T.LngLatBounds) {
    const { west, south, east, north } = MAP_VIEW_BOUNDS;
    const bounds = new T.LngLatBounds(new T.LngLat(west, south), new T.LngLat(east, north));
    map.setMaxBounds(bounds);
  }

  if (typeof map.addEventListener === 'function') {
    map.addEventListener('zoomend', applyMinZoom);
  }
}

/** @deprecated 保留兼容；请优先使用 createDesignMap */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function applyDesignBasemap(map: any, T: any, options?: { withAnnotation?: boolean }): void {
  setDesignBasemapAnnotation(map, T, options?.withAnnotation ?? true);
}

/** 运行时切换瓦片注记（省界/地名），不重置地形底图 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setDesignBasemapAnnotation(map: any, T: any, withAnnotation: boolean): void {
  try {
    const existing = getStoredAnnotationLayer(map);

    if (withAnnotation) {
      if (existing) return;
      const annoLayer = createAnnotationTileLayer(T);
      map.addLayer(annoLayer);
      storeAnnotationLayer(map, annoLayer);
      return;
    }

    if (existing && typeof map.removeLayer === 'function') {
      map.removeLayer(existing);
      storeAnnotationLayer(map, null);
    }
  } catch {
    // 保持当前底图
  }
}
