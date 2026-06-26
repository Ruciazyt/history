/** UI-only grouping for sidebar tree (matches Figma "先秦" node) */
export const PRE_QIN_GROUP_ID = 'group-pre-qin';
export const PRE_QIN_ERA_IDS = ['wz-western-zhou', 'period-spring-autumn', 'period-warring-states'] as const;

/** Colored dots for Warring States polities in sidebar */
export const POLITY_DOT_COLORS: Record<string, string> = {
  'ws-qin': '#1a1a1a',
  'ws-qi': '#f97316',
  'ws-chu': '#3b82f6',
  'ws-yan': '#6366f1',
  'ws-zhao': '#8b5cf6',
  'ws-wei': '#14b8a6',
  'ws-han': '#ec4899',
};
