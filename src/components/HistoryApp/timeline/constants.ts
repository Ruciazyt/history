/** 时间轴圆点轨道 X（圆心，相对滚动区内边距）— 与 globals.css --timeline-rail-* 同步 */
export const TIMELINE_RAIL_X = {
  era: 14,
  period: 28,
  polity: 42,
} as const;

export type TimelineDepth = 0 | 1 | 2;

/** 君主名称相对国家名称的额外文本缩进（圆点不缩进） */
export const RULER_TEXT_EXTRA_INDENT = 14;

export const DOT_HALO_PAD = 3;
export const ERA_DOT_SIZE = 8;
export const RULER_DOT_SIZE = 6;

/** 行半高 — 竖线起止对齐圆心 */
export const ROW_HALF = {
  era: 17,
  period: 17,
  polity: 16,
  ruler: 15,
} as const;
