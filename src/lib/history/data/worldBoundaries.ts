import type { Feature, Polygon, MultiPolygon } from 'geojson';

type BoundaryFeature = Feature<Polygon | MultiPolygon>;

/**
 * 世界主要帝国/文明疆域数据
 * 包含时间范围，用于时序展示
 */
export interface WorldBoundary extends BoundaryFeature {
  properties: {
    name: string;
    nameKey: string; // i18n key
    startYear: number;
    endYear: number;
    color: string;
  };
}

/**
 * 根据年份获取活跃的帝国边界
 */
export function getActiveBoundaries(year: number, mode: 'eurasian' | 'east-asia'): WorldBoundary[] {
  return (mode === 'eurasian' ? eurasianBoundaries : eastAsiaBoundaries).filter(
    (b) => year >= b.properties.startYear && year <= b.properties.endYear
  );
}

/**
 * 获取时间范围内所有帝国的年份范围
 */
export function getWorldEraBounds(mode: 'eurasian' | 'east-asia'): { min: number; max: number } {
  const boundaries = mode === 'eurasian' ? eurasianBoundaries : eastAsiaBoundaries;
  let min = Infinity;
  let max = -Infinity;
  for (const b of boundaries) {
    min = Math.min(min, b.properties.startYear);
    max = Math.max(max, b.properties.endYear);
  }
  return { min, max };
}

// 欧亚大陆主要帝国边界
export const eurasianBoundaries: WorldBoundary[] = [
  // ═══ 中国王朝 (China) ═══
  {
    type: 'Feature',
    properties: { name: '秦朝', nameKey: 'empire_qin', startYear: -221, endYear: -206, color: '#374151' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [75, 35], [85, 30], [95, 22], [105, 18], [115, 18], [122, 22], [125, 30], [125, 40],
        [120, 45], [110, 48], [95, 48], [80, 45], [70, 40], [75, 35],
      ]],
    },
  },
  {
    type: 'Feature',
    properties: { name: '西汉', nameKey: 'empire_han-western', startYear: -206, endYear: 9, color: '#DC2626' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [75, 38], [85, 32], [95, 22], [105, 15], [120, 15], [125, 22], [125, 35], [125, 42],
        [120, 48], [105, 52], [90, 52], [75, 48], [65, 42], [70, 38], [75, 38],
      ]],
    },
  },
  {
    type: 'Feature',
    properties: { name: '东汉', nameKey: 'empire_han-eastern', startYear: 25, endYear: 220, color: '#EA580C' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [78, 36], [85, 30], [95, 22], [105, 15], [120, 18], [125, 25], [125, 38], [120, 45],
        [105, 48], [90, 48], [78, 44], [70, 38], [78, 36],
      ]],
    },
  },
  {
    type: 'Feature',
    properties: { name: '唐朝', nameKey: 'empire_tang', startYear: 618, endYear: 907, color: '#F59E0B' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [70, 40], [75, 35], [85, 28], [95, 22], [105, 18], [120, 15], [130, 20], [135, 30],
        [130, 42], [120, 48], [105, 50], [85, 50], [70, 48], [60, 45], [65, 42], [70, 40],
      ]],
    },
  },
  {
    type: 'Feature',
    properties: { name: '宋朝', nameKey: 'empire_song', startYear: 960, endYear: 1279, color: '#10B981' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [105, 20], [115, 18], [125, 22], [125, 35], [120, 40], [110, 38], [105, 32], [105, 20],
      ]],
    },
  },
  {
    type: 'Feature',
    properties: { name: '元朝', nameKey: 'empire_yuan', startYear: 1271, endYear: 1368, color: '#6366F1' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [60, 40], [70, 35], [85, 25], [100, 18], [120, 15], [140, 20], [150, 35], [145, 50],
        [125, 55], [100, 55], [80, 52], [60, 48], [50, 45], [55, 42], [60, 40],
      ]],
    },
  },
  {
    type: 'Feature',
    properties: { name: '明朝', nameKey: 'empire_ming', startYear: 1368, endYear: 1644, color: '#EF4444' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [75, 38], [85, 32], [95, 22], [110, 18], [125, 20], [130, 30], [125, 42], [115, 45],
        [100, 45], [85, 45], [75, 42], [70, 40], [75, 38],
      ]],
    },
  },
  {
    type: 'Feature',
    properties: { name: '清朝', nameKey: 'empire_qing', startYear: 1644, endYear: 1912, color: '#059669' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [65, 42], [75, 35], [85, 28], [100, 18], [120, 15], [140, 20], [155, 35], [150, 50],
        [130, 55], [110, 55], [90, 52], [70, 50], [60, 48], [60, 45], [65, 42],
      ]],
    },
  },

  // ═══ 罗马帝国 (Rome/Byzantine/Ottoman) ═══
  {
    type: 'Feature',
    properties: { name: '罗马共和国', nameKey: 'empire_rome-republic', startYear: -500, endYear: -27, color: '#7C3AED' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-10, 36], [0, 36], [10, 37], [15, 42], [25, 46], [35, 46], [40, 42], [35, 37],
        [25, 35], [15, 35], [5, 35], [-5, 36], [-10, 36],
      ]],
    },
  },
  {
    type: 'Feature',
    properties: { name: '罗马帝国', nameKey: 'empire_rome-empire', startYear: -27, endYear: 395, color: '#9333EA' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-15, 30], [-10, 36], [0, 36], [10, 37], [20, 38], [35, 42], [45, 45], [50, 48],
        [45, 52], [35, 55], [20, 55], [5, 52], [-5, 48], [-10, 42], [-15, 38], [-18, 34],
        [-15, 30],
      ]],
    },
  },
  {
    type: 'Feature',
    properties: { name: '拜占庭帝国', nameKey: 'empire_byzantine', startYear: 395, endYear: 1453, color: '#8B5CF6' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [20, 34], [25, 36], [30, 40], [35, 42], [45, 45], [42, 48], [35, 48], [30, 45],
        [25, 42], [20, 38], [22, 35], [20, 34],
      ]],
    },
  },
  {
    type: 'Feature',
    properties: { name: '奥斯曼帝国', nameKey: 'empire_ottoman', startYear: 1299, endYear: 1922, color: '#A855F7' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [15, 34], [20, 36], [25, 38], [35, 42], [50, 45], [60, 48], [55, 52], [45, 52],
        [35, 50], [25, 46], [20, 42], [15, 38], [12, 36], [15, 34],
      ]],
    },
  },

  // ═══ 波斯帝国 (Persia) ═══
  {
    type: 'Feature',
    properties: { name: '阿契美尼德波斯', nameKey: 'empire_achaemenid', startYear: -550, endYear: -330, color: '#E11D48' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [40, 28], [45, 32], [55, 35], [65, 38], [75, 40], [80, 42], [75, 45], [65, 48],
        [50, 48], [40, 45], [35, 40], [35, 32], [40, 28],
      ]],
    },
  },
  {
    type: 'Feature',
    properties: { name: '帕提亚帝国', nameKey: 'empire_parthian', startYear: -247, endYear: 224, color: '#BE185D' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [42, 28], [48, 32], [58, 35], [70, 38], [80, 40], [75, 44], [65, 46], [50, 45],
        [42, 40], [38, 34], [42, 28],
      ]],
    },
  },
  {
    type: 'Feature',
    properties: { name: '萨珊波斯', nameKey: 'empire_sassanid', startYear: 224, endYear: 651, color: '#9D174D' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [42, 26], [48, 30], [58, 34], [72, 38], [80, 40], [75, 44], [65, 46], [50, 44],
        [42, 38], [38, 32], [42, 26],
      ]],
    },
  },
  {
    type: 'Feature',
    properties: { name: '萨法维波斯', nameKey: 'empire_safavid', startYear: 1501, endYear: 1736, color: '#831843' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [44, 28], [50, 32], [60, 36], [72, 40], [78, 42], [72, 46], [60, 46], [48, 42],
        [42, 36], [44, 30], [44, 28],
      ]],
    },
  },

  // ═══ 阿拉伯帝国 (Islamic Caliphates) ═══
  {
    type: 'Feature',
    properties: { name: '倭马亚王朝', nameKey: 'empire_umayyad', startYear: 661, endYear: 750, color: '#059602' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-17, 28], [-10, 32], [0, 35], [15, 38], [35, 40], [55, 42], [65, 40], [60, 35],
        [50, 30], [35, 28], [20, 28], [5, 28], [-10, 27], [-17, 28],
      ]],
    },
  },
  {
    type: 'Feature',
    properties: { name: '阿拔斯王朝', nameKey: 'empire_abbasid', startYear: 750, endYear: 1258, color: '#16A34A' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-10, 30], [0, 34], [20, 38], [40, 40], [65, 42], [80, 40], [75, 35], [60, 30],
        [40, 28], [20, 28], [0, 28], [-10, 28], [-10, 30],
      ]],
    },
  },
  {
    type: 'Feature',
    properties: { name: '帖木儿帝国', nameKey: 'empire_timurid', startYear: 1370, endYear: 1507, color: '#15803D' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [50, 32], [60, 35], [75, 40], [90, 45], [85, 50], [70, 52], [55, 48], [45, 42],
        [45, 36], [50, 32],
      ]],
    },
  },

  // ═══ 埃及文明 (Egypt) ═══
  {
    type: 'Feature',
    properties: { name: '古埃及', nameKey: 'empire_egypt-old', startYear: -2686, endYear: -2181, color: '#EAB308' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [25, 31], [30, 31], [35, 32], [35, 28], [30, 24], [25, 24], [25, 31],
      ]],
    },
  },
  {
    type: 'Feature',
    properties: { name: '古埃及', nameKey: 'empire_egypt-middle', startYear: -2055, endYear: -1650, color: '#CA8A04' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [25, 31], [30, 31], [35, 32], [35, 28], [30, 24], [25, 24], [25, 31],
      ]],
    },
  },
  {
    type: 'Feature',
    properties: { name: '古埃及', nameKey: 'empire_egypt-new', startYear: -1550, endYear: -1069, color: '#A16207' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [25, 31], [32, 31], [38, 32], [40, 28], [35, 22], [28, 22], [25, 24], [25, 31],
      ]],
    },
  },
  {
    type: 'Feature',
    properties: { name: '托勒密埃及', nameKey: 'empire_egypt-ptolemaic', startYear: -332, endYear: -30, color: '#854D0E' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [22, 31], [32, 31], [38, 32], [40, 28], [32, 22], [25, 24], [22, 28], [22, 31],
      ]],
    },
  },

  // ═══ 其他帝国 ═══
  {
    type: 'Feature',
    properties: { name: '亚历山大帝国', nameKey: 'empire_alexander', startYear: -336, endYear: -323, color: '#F97316' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [10, 30], [20, 32], [35, 38], [55, 42], [75, 42], [85, 38], [75, 32], [55, 28],
        [35, 28], [20, 28], [10, 30],
      ]],
    },
  },
  {
    type: 'Feature',
    properties: { name: '蒙古帝国', nameKey: 'empire_mongol', startYear: 1206, endYear: 1368, color: '#0D9488' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [30, 40], [50, 38], [80, 35], [120, 35], [150, 40], [150, 55], [120, 60], [80, 58],
        [50, 55], [30, 50], [25, 45], [30, 40],
      ]],
    },
  },
  {
    type: 'Feature',
    properties: { name: '孔雀王朝', nameKey: 'empire_maurya', startYear: -322, endYear: -185, color: '#EAB308' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [70, 22], [78, 25], [90, 28], [95, 32], [90, 36], [80, 38], [72, 35], [68, 28],
        [70, 22],
      ]],
    },
  },
  {
    type: 'Feature',
    properties: { name: '莫卧儿帝国', nameKey: 'empire_mughal', startYear: 1526, endYear: 1857, color: '#CA8A04' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [68, 22], [75, 25], [85, 28], [95, 32], [95, 38], [85, 40], [75, 38], [68, 32],
        [65, 26], [68, 22],
      ]],
    },
  },
];

// 东亚主要帝国边界
export const eastAsiaBoundaries: WorldBoundary[] = [
  // ═══ 中国王朝 ═══
  {
    type: 'Feature',
    properties: { name: '秦朝', nameKey: 'empire_qin', startYear: -221, endYear: -206, color: '#374151' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [75, 35], [85, 30], [105, 18], [125, 22], [125, 40], [110, 48], [80, 45], [70, 40], [75, 35],
      ]],
    },
  },
  {
    type: 'Feature',
    properties: { name: '西汉', nameKey: 'empire_han-western', startYear: -206, endYear: 9, color: '#DC2626' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [75, 38], [85, 32], [105, 15], [125, 18], [125, 42], [110, 52], [75, 48], [65, 42], [75, 38],
      ]],
    },
  },
  {
    type: 'Feature',
    properties: { name: '东汉', nameKey: 'empire_han-eastern', startYear: 25, endYear: 220, color: '#EA580C' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [78, 36], [85, 30], [105, 15], [125, 20], [125, 42], [105, 48], [78, 44], [70, 38], [78, 36],
      ]],
    },
  },
  {
    type: 'Feature',
    properties: { name: '唐朝', nameKey: 'empire_tang', startYear: 618, endYear: 907, color: '#F59E0B' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [70, 40], [75, 35], [85, 28], [105, 18], [135, 25], [135, 48], [105, 52], [70, 48], [60, 44], [70, 40],
      ]],
    },
  },
  {
    type: 'Feature',
    properties: { name: '宋朝', nameKey: 'empire_song', startYear: 960, endYear: 1279, color: '#10B981' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [105, 20], [115, 18], [125, 22], [125, 38], [110, 40], [105, 32], [105, 20],
      ]],
    },
  },
  {
    type: 'Feature',
    properties: { name: '元朝', nameKey: 'empire_yuan', startYear: 1271, endYear: 1368, color: '#6366F1' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [60, 40], [70, 35], [100, 18], [150, 30], [150, 55], [105, 58], [60, 50], [50, 44], [60, 40],
      ]],
    },
  },
  {
    type: 'Feature',
    properties: { name: '明朝', nameKey: 'empire_ming', startYear: 1368, endYear: 1644, color: '#EF4444' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [75, 38], [85, 32], [105, 18], [130, 22], [130, 45], [105, 48], [75, 45], [70, 40], [75, 38],
      ]],
    },
  },
  {
    type: 'Feature',
    properties: { name: '清朝', nameKey: 'empire_qing', startYear: 1644, endYear: 1912, color: '#059669' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [65, 42], [75, 35], [100, 18], [155, 30], [155, 55], [110, 58], [70, 52], [60, 46], [65, 42],
      ]],
    },
  },

  // ═══ 日本 (Japan) ═══
  {
    type: 'Feature',
    properties: { name: '平安时代', nameKey: 'empire_heian', startYear: 794, endYear: 1185, color: '#EC4899' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [129, 32], [130, 34], [132, 36], [136, 38], [140, 38], [142, 36], [141, 32], [130, 30], [129, 32],
      ]],
    },
  },
  {
    type: 'Feature',
    properties: { name: '江户时代', nameKey: 'empire_edo', startYear: 1603, endYear: 1868, color: '#DB2777' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [129, 30], [130, 33], [133, 36], [141, 39], [146, 41], [146, 36], [142, 32], [135, 30], [129, 30],
      ]],
    },
  },

  // ═══ 朝鲜/韩国 (Korea) ═══
  {
    type: 'Feature',
    properties: { name: '高丽王朝', nameKey: 'empire_goryeo', startYear: 918, endYear: 1392, color: '#14B8A6' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [124, 37], [126, 38], [128, 40], [130, 40], [130, 38], [128, 36], [125, 35], [124, 37],
      ]],
    },
  },
  {
    type: 'Feature',
    properties: { name: '朝鲜王朝', nameKey: 'empire_joseon', startYear: 1392, endYear: 1897, color: '#0D9488' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [124, 37], [126, 38], [130, 41], [132, 41], [130, 38], [126, 36], [124, 37],
      ]],
    },
  },

  // ═══ 越南 (Vietnam) ═══
  {
    type: 'Feature',
    properties: { name: '李朝', nameKey: 'empire_ly-dynasty', startYear: 1009, endYear: 1225, color: '#F59E0B' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [102, 16], [106, 15], [110, 18], [110, 23], [106, 24], [102, 22], [102, 16],
      ]],
    },
  },
  {
    type: 'Feature',
    properties: { name: '黎朝', nameKey: 'empire_le-dynasty', startYear: 1428, endYear: 1788, color: '#D97706' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [102, 15], [108, 14], [111, 18], [111, 24], [106, 25], [102, 22], [102, 15],
      ]],
    },
  },
  {
    type: 'Feature',
    properties: { name: '阮朝', nameKey: 'empire_nguyen-dynasty', startYear: 1802, endYear: 1945, color: '#B45309' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [102, 15], [109, 14], [114, 18], [114, 24], [109, 24], [103, 22], [102, 15],
      ]],
    },
  },
];
