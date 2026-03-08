import type { Feature, Polygon, MultiPolygon } from 'geojson';

type BoundaryFeature = Feature<Polygon | MultiPolygon>;

// Simplified approximate historical territory polygons
// Coordinates: [longitude, latitude]
// These are rough approximations for visualization purposes

export const dynastyBoundaries: Record<string, BoundaryFeature> = {
  qin: {
    type: 'Feature',
    properties: { name: '秦朝' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [103, 24], [108, 22], [117, 22], [122, 26], [122, 36],
        [120, 41], [115, 42], [108, 40], [104, 37], [100, 32],
        [100, 28], [103, 24],
      ]],
    },
  },

  'han-western': {
    type: 'Feature',
    properties: { name: '西汉' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [76, 38], [80, 35], [90, 28], [100, 22], [108, 20],
        [117, 21], [122, 25], [122, 35], [120, 42], [115, 44],
        [108, 48], [100, 48], [90, 45], [80, 48], [73, 45],
        [73, 40], [76, 38],
      ]],
    },
  },

  xin: {
    type: 'Feature',
    properties: { name: '新朝' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [76, 38], [80, 35], [90, 28], [100, 22], [108, 20],
        [117, 21], [122, 25], [122, 35], [120, 42], [115, 44],
        [108, 48], [100, 48], [90, 45], [80, 48], [73, 45],
        [73, 40], [76, 38],
      ]],
    },
  },

  'han-eastern': {
    type: 'Feature',
    properties: { name: '东汉' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [80, 36], [87, 30], [98, 22], [108, 20],
        [117, 21], [122, 25], [122, 35], [120, 42], [115, 44],
        [108, 46], [100, 46], [90, 43], [82, 44],
        [80, 40], [80, 36],
      ]],
    },
  },

  'jin-western': {
    type: 'Feature',
    properties: { name: '西晋' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [82, 36], [87, 30], [98, 22], [108, 20],
        [117, 21], [122, 25], [122, 35], [120, 42], [115, 44],
        [108, 46], [100, 46], [90, 43], [83, 43],
        [82, 38], [82, 36],
      ]],
    },
  },

  'jin-eastern-16k': {
    type: 'Feature',
    properties: { name: '东晋' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [105, 22], [108, 20], [117, 21], [122, 25],
        [122, 35], [118, 36], [113, 36], [108, 34],
        [104, 30], [102, 25], [105, 22],
      ]],
    },
  },

  sui: {
    type: 'Feature',
    properties: { name: '隋朝' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [87, 32], [95, 26], [100, 22], [108, 20],
        [117, 21], [122, 25], [122, 35], [120, 42], [115, 45],
        [108, 47], [100, 46], [92, 44], [87, 42],
        [85, 38], [87, 32],
      ]],
    },
  },

  tang: {
    type: 'Feature',
    properties: { name: '唐朝' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [67, 38], [70, 33], [78, 28], [87, 26], [95, 24],
        [100, 20], [108, 19], [117, 21], [123, 26],
        [123, 36], [120, 43], [115, 48], [108, 50],
        [100, 50], [90, 48], [80, 50], [73, 48],
        [70, 44], [67, 40], [67, 38],
      ]],
    },
  },

  'five-dynasties-ten-kingdoms': {
    type: 'Feature',
    properties: { name: '五代十国' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [104, 25], [108, 20], [117, 21], [122, 26],
        [122, 36], [118, 38], [112, 40], [108, 41],
        [104, 40], [102, 36], [102, 30], [104, 25],
      ]],
    },
  },

  song: {
    type: 'Feature',
    properties: { name: '宋朝' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [100, 20], [105, 19], [112, 19], [117, 22],
        [122, 26], [122, 32], [118, 34], [113, 35],
        [109, 35], [105, 33], [103, 28],
        [100, 24], [100, 20],
      ]],
    },
  },

  yuan: {
    type: 'Feature',
    properties: { name: '元朝' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [73, 38], [78, 30], [87, 25], [95, 22],
        [100, 18], [110, 18], [117, 20], [123, 24],
        [135, 30], [135, 42], [130, 50], [120, 53],
        [110, 55], [100, 55], [90, 53], [80, 53],
        [73, 50], [70, 44], [73, 38],
      ]],
    },
  },

  ming: {
    type: 'Feature',
    properties: { name: '明朝' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [78, 32], [87, 27], [95, 23], [100, 20],
        [108, 18], [117, 20], [123, 25], [123, 36],
        [120, 42], [116, 44], [108, 45], [100, 43],
        [92, 42], [87, 38], [80, 36],
        [78, 34], [78, 32],
      ]],
    },
  },

  qing: {
    type: 'Feature',
    properties: { name: '清朝' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [73, 38], [78, 30], [87, 25], [95, 22],
        [100, 18], [110, 18], [117, 20], [122, 24],
        [135, 30], [135, 42], [130, 50], [125, 53],
        [115, 53], [105, 53], [95, 50], [85, 50],
        [78, 48], [73, 46], [70, 42], [73, 38],
      ]],
    },
  },
};
