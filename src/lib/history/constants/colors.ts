/**
 * Color constants for History Atlas
 * All color palettes, theme colors, and component-specific color sets.
 */

export const UI_COLORS = {
  text: {
    primary: 'text-white',
    secondary: 'text-zinc-300',
    muted: 'text-zinc-500',
  },
  bg: {
    primary: 'bg-white',
    secondary: 'bg-zinc-100',
    dark: 'bg-black/70',
  },
  border: {
    light: 'border-white',
    dark: 'border-zinc-700',
  },
} as const;
export const ERA_COLORS: Record<string, { bg: string; text: string; dot: string; gradient: string; border: string }> = {
  'wz-western-zhou': { 
    bg: 'bg-amber-50', 
    text: 'text-amber-700', 
    dot: 'bg-amber-500',
    gradient: 'from-amber-50 to-orange-50',
    border: 'border-amber-200',
  },
  'period-spring-autumn': { 
    bg: 'bg-blue-50', 
    text: 'text-blue-700', 
    dot: 'bg-blue-500',
    gradient: 'from-blue-50 to-indigo-50',
    border: 'border-blue-200',
  },
  'period-warring-states': { 
    bg: 'bg-purple-50', 
    text: 'text-purple-700', 
    dot: 'bg-purple-500',
    gradient: 'from-purple-50 to-red-50',
    border: 'border-red-200',
  },
  'qin': { 
    bg: 'bg-zinc-100', 
    text: 'text-zinc-700', 
    dot: 'bg-zinc-600',
    gradient: 'from-zinc-50 to-zinc-100',
    border: 'border-zinc-300',
  },
  'han-western': { 
    bg: 'bg-red-50', 
    text: 'text-red-700', 
    dot: 'bg-red-500',
    gradient: 'from-red-50 to-orange-50',
    border: 'border-red-200',
  },
  'han': { // alias for han-western
    bg: 'bg-red-50', 
    text: 'text-red-700', 
    dot: 'bg-red-500',
    gradient: 'from-red-50 to-orange-50',
    border: 'border-red-200',
  },
  'xin': { 
    bg: 'bg-yellow-50', 
    text: 'text-yellow-700', 
    dot: 'bg-yellow-500',
    gradient: 'from-yellow-50 to-amber-50',
    border: 'border-yellow-200',
  },
  'han-eastern': { 
    bg: 'bg-orange-50', 
    text: 'text-orange-700', 
    dot: 'bg-orange-500',
    gradient: 'from-orange-50 to-amber-50',
    border: 'border-orange-200',
  },
  'three-kingdoms': { 
    bg: 'bg-green-50', 
    text: 'text-green-700', 
    dot: 'bg-green-500',
    gradient: 'from-green-50 to-emerald-50',
    border: 'border-green-200',
  },
  'jin-western': { 
    bg: 'bg-cyan-50', 
    text: 'text-cyan-700', 
    dot: 'bg-cyan-500',
    gradient: 'from-cyan-50 to-blue-50',
    border: 'border-cyan-200',
  },
  'jin-eastern-16k': { 
    bg: 'bg-teal-50', 
    text: 'text-teal-700', 
    dot: 'bg-teal-500',
    gradient: 'from-teal-50 to-cyan-50',
    border: 'border-teal-200',
  },
  'southern-northern': { 
    bg: 'bg-indigo-50', 
    text: 'text-indigo-700', 
    dot: 'bg-indigo-500',
    gradient: 'from-indigo-50 to-purple-50',
    border: 'border-indigo-200',
  },
  'sui': { 
    bg: 'bg-rose-50', 
    text: 'text-rose-700', 
    dot: 'bg-rose-500',
    gradient: 'from-rose-50 to-pink-50',
    border: 'border-rose-200',
  },
  'tang': { 
    bg: 'bg-orange-50', 
    text: 'text-orange-700', 
    dot: 'bg-orange-500',
    gradient: 'from-orange-50 to-amber-50',
    border: 'border-orange-200',
  },
  'five-dynasties-ten-kingdoms': { 
    bg: 'bg-pink-50', 
    text: 'text-pink-700', 
    dot: 'bg-pink-500',
    gradient: 'from-pink-50 to-rose-50',
    border: 'border-pink-200',
  },
  'song': { 
    bg: 'bg-violet-50', 
    text: 'text-violet-700', 
    dot: 'bg-violet-500',
    gradient: 'from-violet-50 to-purple-50',
    border: 'border-violet-200',
  },
  'yuan': { 
    bg: 'bg-sky-50', 
    text: 'text-sky-700', 
    dot: 'bg-sky-500',
    gradient: 'from-sky-50 to-blue-50',
    border: 'border-sky-200',
  },
  'ming': { 
    bg: 'bg-amber-50', 
    text: 'text-amber-700', 
    dot: 'bg-amber-500',
    gradient: 'from-amber-50 to-yellow-50',
    border: 'border-amber-200',
  },
  'qing': { 
    bg: 'bg-emerald-50', 
    text: 'text-emerald-700', 
    dot: 'bg-emerald-500',
    gradient: 'from-emerald-50 to-green-50',
    border: 'border-emerald-200',
  },
  'roc': { 
    bg: 'bg-blue-50', 
    text: 'text-blue-700', 
    dot: 'bg-blue-500',
    gradient: 'from-blue-50 to-cyan-50',
    border: 'border-blue-200',
  },
  'prc': { 
    bg: 'bg-red-50', 
    text: 'text-red-700', 
    dot: 'bg-red-500',
    gradient: 'from-red-50 to-orange-50',
    border: 'border-red-200',
  },
};
export const BATTLE_RESULT_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  attacker_win: { bg: 'bg-red-500', text: 'text-red-700', ring: 'ring-red-500' },
  defender_win: { bg: 'bg-blue-500', text: 'text-blue-700', ring: 'ring-blue-500' },
  draw: { bg: 'bg-gray-400', text: 'text-gray-600', ring: 'ring-gray-400' },
  inconclusive: { bg: 'bg-yellow-500', text: 'text-yellow-700', ring: 'ring-yellow-500' },
  unknown: { bg: 'bg-zinc-400', text: 'text-zinc-600', ring: 'ring-zinc-400' },
};
export const BATTLE_IMPACT_COLORS: Record<string, { bg: string; text: string }> = {
  decisive: { bg: 'bg-red-100', text: 'text-red-700' },
  major: { bg: 'bg-orange-100', text: 'text-orange-700' },
  minor: { bg: 'bg-green-100', text: 'text-green-700' },
  unknown: { bg: 'bg-zinc-100', text: 'text-zinc-500' },
};
export const ACTION_COLORS = {
  // Primary action colors
  primary: {
    bg: 'bg-blue-600',
    hover: 'hover:bg-blue-700',
    text: 'text-blue-600',
    border: 'border-blue-200',
    light: 'bg-blue-50',
  },
  // Danger/warning colors
  danger: {
    bg: 'bg-red-600',
    hover: 'hover:bg-red-700',
    text: 'text-red-600',
    border: 'border-red-200',
    light: 'bg-red-50',
  },
  // Success colors
  success: {
    bg: 'bg-green-600',
    hover: 'hover:bg-green-700',
    text: 'text-green-600',
    border: 'border-green-200',
    light: 'bg-green-50',
  },
  // Neutral colors
  neutral: {
    bg: 'bg-zinc-600',
    hover: 'hover:bg-zinc-700',
    text: 'text-zinc-600',
    border: 'border-zinc-200',
    light: 'bg-zinc-50',
  },
} as const;
export const CARD_VARIANTS = {
  default: {
    container: 'border border-zinc-200 bg-white rounded-xl',
    hover: 'hover:shadow-md hover:border-zinc-300 transition-all duration-200',
  },
  elevated: {
    container: 'border-0 bg-white rounded-xl shadow-md',
    hover: 'hover:shadow-lg transition-all duration-200',
  },
  outlined: {
    container: 'border-2 border-zinc-200 bg-transparent rounded-xl',
    hover: 'hover:border-zinc-300 hover:bg-zinc-50 transition-all duration-200',
  },
  ghost: {
    container: 'border-0 bg-transparent',
    hover: 'hover:bg-zinc-100 transition-colors duration-150',
  },
} as const;
export const BADGE_VARIANTS = {
  default: 'bg-zinc-100 text-zinc-700',
  primary: 'bg-blue-100 text-blue-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-cyan-100 text-cyan-700',
  purple: 'bg-purple-100 text-purple-700',
} as const;
export const PARTY_COLORS = {
  attacker: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    badge: 'bg-red-100 text-red-700',
  },
  defender: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    badge: 'bg-blue-100 text-blue-700',
  },
} as const;
export const BATTLE_RESULT_STYLES: Record<string, { bg: string; text: string; ring: string; badge: string }> = {
  attacker_win: { 
    bg: 'bg-red-500', 
    text: 'text-red-700', 
    ring: 'ring-red-500',
    badge: 'bg-red-100 text-red-700',
  },
  defender_win: { 
    bg: 'bg-blue-500', 
    text: 'text-blue-700', 
    ring: 'ring-blue-500',
    badge: 'bg-blue-100 text-blue-700',
  },
  draw: { 
    bg: 'bg-gray-400', 
    text: 'text-gray-600', 
    ring: 'ring-gray-400',
    badge: 'bg-gray-100 text-gray-700',
  },
  inconclusive: { 
    bg: 'bg-yellow-500', 
    text: 'text-yellow-700', 
    ring: 'ring-yellow-500',
    badge: 'bg-yellow-100 text-yellow-700',
  },
  unknown: { 
    bg: 'bg-zinc-400', 
    text: 'text-zinc-600', 
    ring: 'ring-zinc-400',
    badge: 'bg-zinc-100 text-zinc-700',
  },
};
export const GEO_INSIGHT_COLORS = {
  container: 'bg-amber-50',
  containerBorder: 'border-amber-100',
  title: 'text-amber-700',
  description: 'text-amber-600',
} as const;
export const WIN_RATE_COLORS = {
  attacker: {
    high: 'bg-red-100 text-red-600',    // > 55%
    low: 'bg-blue-100 text-blue-600',    // < 45%
    balanced: 'bg-zinc-100 text-zinc-600',
  },
  defender: {
    high: 'bg-blue-100 text-blue-600',   // > 55%
    low: 'bg-red-100 text-red-600',       // < 45%
    balanced: 'bg-zinc-100 text-zinc-600',
  },
} as const;
export const REGION_BAR_COLORS = {
  attacker: 'from-red-400 to-red-500',
  defender: 'from-blue-400 to-blue-500',
  other: 'bg-zinc-300',
  track: 'bg-zinc-100',
} as const;
export const POLITY_COLORS: Record<string, string> = {
  // Spring & Autumn
  'sa-zhou': '#8B4513',
  'sa-qi': '#228B22',
  'sa-jin': '#4169E1',
  'sa-chu': '#DC143C',
  'sa-qin': '#FF8C00',
  'sa-lu': '#9370DB',
  // Warring States
  'ws-qin': '#FF8C00',
  'ws-chu': '#DC143C',
  'ws-qi': '#228B22',
  'ws-yan': '#4169E1',
  'ws-zhao': '#20B2AA',
  'ws-wei': '#D2691E',
  'ws-han': '#708090',
  // Three Kingdoms
  'tk-wei': '#4169E1',
  'tk-shu': '#228B22',
  'tk-wu': '#DC143C',
  // Eastern Jin & 16 Kingdoms
  'ej-jin': '#4169E1',
  'ej-north': '#DC143C',
  // Southern & Northern
  'sn-south': '#228B22',
  'sn-north': '#4169E1',
  // Five Dynasties
  'fdtk-later-liang': '#8B4513',
  'fdtk-later-tang': '#DC143C',
  'fdtk-later-jin': '#4169E1',
  'fdtk-later-han': '#228B22',
  'fdtk-later-zhou': '#FF8C00',
} as const;

/**
 * Shared theme color interface used by both light and dark themes.
 */
export type ThemeColors = {
  background: string;
  surface: string;
  border: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  hover?: string;
};

export const DARK_THEME_COLORS: ThemeColors = {
  background: 'bg-zinc-900',
  surface: 'bg-zinc-800',
  border: 'border-zinc-700',
  text: 'text-white',
  textSecondary: 'text-zinc-400',
  textMuted: 'text-zinc-500',
  hover: 'hover:bg-zinc-700',
} as const;
export const LIGHT_THEME_COLORS = {
  background: 'bg-zinc-50',
  surface: 'bg-white',
  border: 'border-zinc-200',
  text: 'text-zinc-900',
  textSecondary: 'text-zinc-600',
  textMuted: 'text-zinc-400',
} as const;
export const STATS_GRADIENTS: Record<string, string> = {
  red: 'from-red-50 to-orange-50',
  blue: 'from-blue-50 to-indigo-50',
  green: 'from-green-50 to-emerald-50',
  yellow: 'from-yellow-50 to-amber-50',
  purple: 'from-purple-50 to-pink-50',
  gray: 'from-zinc-50 to-gray-50',
};
export const STATS_BORDER_COLORS: Record<string, string> = {
  red: 'border-red-100',
  blue: 'border-blue-100',
  green: 'border-green-100',
  yellow: 'border-yellow-100',
  purple: 'border-purple-100',
  gray: 'border-zinc-200',
};
export const STATS_TEXT_COLORS: Record<string, string> = {
  red: 'text-red-600',
  blue: 'text-blue-600',
  green: 'text-green-600',
  yellow: 'text-yellow-600',
  purple: 'text-purple-600',
  gray: 'text-zinc-600',
};
export const STATS_LABEL_COLORS: Record<string, string> = {
  red: 'text-red-500',
  blue: 'text-blue-500',
  green: 'text-green-500',
  yellow: 'text-yellow-500',
  purple: 'text-purple-500',
  gray: 'text-zinc-500',
};
export const BATTLE_COMPARE_GRADIENTS = {
  attacker: 'from-red-50 to-orange-50',
  defender: 'from-blue-50 to-indigo-50',
} as const;
export const BATTLE_STATS_GRADIENTS = {
  attackerWins: 'from-red-50 to-orange-50',
  defenderWins: 'from-blue-50 to-indigo-50',
  draws: 'from-gray-50 to-zinc-50',
  inconclusive: 'from-yellow-50 to-amber-50',
} as const;
export const BATTLE_STATS_BORDER_COLORS = {
  attackerWins: 'border-red-100',
  defenderWins: 'border-blue-100',
  draws: 'border-zinc-200',
  inconclusive: 'border-yellow-100',
} as const;
export const TIMELINE_COLORS = {
  background: 'bg-zinc-900',
  surface: 'bg-zinc-800',
  border: 'border-zinc-700',
  text: 'text-white',
  textSecondary: 'text-zinc-400',
  textMuted: 'text-zinc-300',
  accent: 'text-red-500',
  active: 'bg-red-500',
  activeBorder: 'border-red-500',
} as const;
export const TIMELINE_TAB_COLORS = {
  active: {
    border: 'border-red-500',
    text: TIMELINE_COLORS.text,
  },
  inactive: {
    border: 'border-transparent',
    text: 'text-zinc-400',
  },
} as const;
export const TIMELINE_ITEM_COLORS = {
  inactiveBg: 'bg-zinc-800/50',
  description: 'text-zinc-300',
  location: 'text-zinc-400',
} as const;
export const TIMELINE_BUTTON_COLORS = {
  active: {
    bg: 'bg-red-600',
    hover: 'hover:bg-red-500',
    text: 'text-white',
    border: 'border-red-500',
  },
  inactive: {
    bg: 'bg-zinc-700',
    hover: 'hover:bg-zinc-600',
    text: 'text-zinc-400',
    border: 'border-zinc-600',
  },
  play: {
    play: 'bg-green-600 hover:bg-green-500',
    pause: 'bg-red-600 hover:bg-red-500',
  },
} as const;
export const COMMANDER_COLORS = {
  attacker: {
    bg: 'bg-red-50',
    text: 'text-red-600',
    label: 'text-red-600',
  },
  defender: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    label: 'text-blue-600',
  },
} as const;
export const BATTLE_DETAIL_COLORS = {
  header: {
    bg: 'bg-red-600',
    hover: 'hover:bg-red-700',
    text: 'text-white',
    close: 'bg-red-700 hover:bg-red-800',
    yearLocation: 'text-red-100',
  },
  section: {
    bg: 'bg-zinc-50',
    border: 'border-zinc-200',
  },
  closeButton: 'bg-zinc-600 hover:bg-zinc-700',
  belligerents: {
    attacker: 'text-red-700',
    defender: 'text-blue-700',
  },
} as const;
export const BATTLE_DETAIL_TEXT_COLORS = {
  label: 'text-zinc-600',
  labelSmall: 'text-zinc-500',
  content: 'text-zinc-700',
  contentLight: 'text-zinc-500',
  unknown: 'text-zinc-400',
  sectionTitle: 'text-zinc-700',
  divider: 'border-zinc-200',
  link: 'text-blue-600 hover:underline',
} as const;
export const MAP_MARKER_COLORS = {
  default: 'bg-red-500',
  active: 'bg-red-600',
  inactive: 'bg-zinc-400',
} as const;
export const STRATEGY_BADGE_COLORS = {
  bg: 'bg-purple-100',
  text: 'text-purple-700',
} as const;
export const TERRAIN_BADGE_COLORS = {
  bg: 'bg-emerald-100',
  text: 'text-emerald-700',
} as const;
export const BATTLE_TYPE_COLORS = {
  bg: 'bg-indigo-100',
  text: 'text-indigo-700',
} as const;
export const PACING_BADGE_COLORS = {
  bg: 'bg-cyan-100',
  text: 'text-cyan-700',
} as const;
export const TIME_OF_DAY_COLORS = {
  bg: 'bg-amber-100',
  text: 'text-amber-700',
} as const;
export const TURNING_POINT_COLORS = {
  positive: 'bg-green-500',
  negative: 'bg-red-500',
  neutral: 'bg-yellow-500',
  container: 'bg-amber-50',
  containerBorder: 'border-amber-200',
} as const;
export const COMPARISON_SUMMARY_COLORS = {
  container: 'bg-amber-50',
  border: 'border-amber-100',
  badge: 'bg-amber-100 text-amber-700',
} as const;
export const SLIDER_COLORS = {
  background: 'bg-zinc-900',
  track: 'bg-zinc-700',
  progress: 'bg-blue-500',
  dot: 'bg-blue-500',
  centuryMark: 'bg-zinc-600',
  // 快捷按钮颜色
  quickButton: {
    default: 'text-zinc-500',
    hover: 'hover:text-zinc-300',
  },
  // 播放按钮悬停颜色
  playButton: {
    hover: 'hover:bg-zinc-600',
  },
  // 世纪标记（主要刻度）
  majorTick: 'bg-zinc-500',
  // 世纪标记文字
  tickLabel: 'text-zinc-500',
} as const;
export const MOBILE_TAB_COLORS = {
  active: {
    border: 'border-blue-500',
    text: 'text-white',
  },
  inactive: {
    border: 'border-transparent',
    text: 'text-zinc-400',
  },
} as const;
export const SELECTION_COLORS = {
  selected: {
    bg: 'bg-red-500',
    border: 'border-red-500',
  },
  unselected: {
    border: 'border-gray-300',
  },
} as const;
export const WORLD_VIEW_COLORS = {
  background: 'bg-black/70',
  backdrop: 'backdrop-blur-sm',
  text: 'text-white',
  textSecondary: 'text-white/70',
  textMuted: 'text-white/50',
  border: 'border-zinc-700',
  empireBadge: 'px-1.5 py-0.5 text-[10px] text-white rounded',
} as const;
export const SLIDER_TRACK_COLORS = {
  track: 'bg-zinc-700',
  progress: 'bg-blue-500',
  centuryMark: 'bg-zinc-600',
  thumb: 'bg-white',
  thumbInner: 'bg-blue-500',
} as const;
export const MAP_NAV_COLORS = {
  container: 'right-3 top-3 z-10',
  button: 'bg-zinc-800 text-white hover:bg-zinc-700',
} as const;
export const WORLD_MAP_COLORS = {
  container: {
    bg: 'bg-white',
    border: 'border-zinc-200',
  },
} as const;
export const MAP_POPUP_COLORS = {
  container: 'space-y-2 p-1',
  title: 'font-semibold text-gray-900',
  subtitle: 'text-sm text-gray-600',
  dot: 'w-3 h-3 rounded-full',
} as const;
export const RULER_RELATIONS_COLORS = {
  container: {
    border: 'border-gray-200',
  },
  label: {
    text: 'text-gray-500',
  },
  badge: {
    bg: 'bg-amber-50',
    hoverBg: 'hover:bg-amber-100',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
} as const;
export const TIMELINE_MAP_COLORS = {
  marker: {
    bg: 'bg-red-500',
    border: 'border-white',
    icon: 'text-xs',
  },
  markerLabel: {
    bg: 'bg-red-600',
    border: 'border-white',
    text: 'text-white',
  },
  overlay: {
    bg: 'bg-black/70',
    backdrop: 'backdrop-blur',
  },
  legend: {
    title: 'text-zinc-400',
    text: 'text-white',
    itemBg: 'rounded-sm',
  },
  popup: {
    text: 'text-zinc-500',
  },
  container: 'border-zinc-700',
} as const;
export const TIMELINE_SLIDER_COLORS = {
  container: {
    bg: 'bg-zinc-900/95 backdrop-blur-sm',
    border: 'border-zinc-700',
  },
  yearText: 'text-zinc-400',
  centuryText: 'text-zinc-500',
} as const;
export const TIMELINE_EVENT_COLORS = {
  year: {
    active: 'text-red-400',
    inactive: 'text-zinc-500',
  },
  title: {
    active: TIMELINE_COLORS.text,
    inactive: 'text-zinc-400',
  },
  location: 'text-zinc-400',
  activeIndicator: TIMELINE_BUTTON_COLORS.active.bg,
  border: {
    active: TIMELINE_BUTTON_COLORS.active.border,
    inactive: 'border-zinc-700',
    hover: 'hover:border-zinc-500',
  },
} as const;
export const MATRIX_COLORS = {
  background: DARK_THEME_COLORS.background,
  surface: DARK_THEME_COLORS.surface,
  border: DARK_THEME_COLORS.border,
  text: DARK_THEME_COLORS.text,
  textSecondary: DARK_THEME_COLORS.textSecondary,
  textMuted: DARK_THEME_COLORS.textMuted,
  hover: DARK_THEME_COLORS.hover,
  // Tab colors
  tab: {
    active: {
      border: 'border-blue-500',
      text: 'text-white',
    },
    inactive: {
      border: 'border-transparent',
      text: 'text-zinc-400',
    },
  },
  // Era selector
  eraSelector: {
    container: 'bg-zinc-800',
    border: 'border-zinc-700',
    headerText: 'text-zinc-400',
    button: {
      active: {
        bg: 'bg-blue-600',
        text: 'text-white',
        border: 'border-blue-500',
      },
      inactive: {
        text: 'text-zinc-400',
        hover: 'hover:bg-zinc-700 hover:text-white',
      },
    },
    yearText: 'text-zinc-500',
  },
  // Matrix grid
  grid: {
    xAxis: {
      bg: 'bg-zinc-800',
      border: 'border-zinc-700',
    },
    yAxis: {
      bg: 'bg-zinc-900',
      border: 'border-zinc-700',
      text: 'text-zinc-500',
    },
    cell: {
      border: 'border-zinc-800',
      selected: 'bg-zinc-700',
      hover: 'hover:bg-zinc-800',
      empty: 'bg-zinc-900/50',
    },
    rulerBadge: 'text-zinc-500',
  },
  // Detail panel
  detailPanel: {
    container: 'bg-zinc-800',
    border: 'border-zinc-700',
    header: {
      text: 'text-zinc-400',
    },
    card: {
      bg: 'bg-zinc-700',
      text: 'text-zinc-400',
      secondaryText: 'text-zinc-500',
      highlight: 'text-red-400',
    },
  },
  // Mobile view
  mobile: {
    tab: 'bg-zinc-800',
  },
} as const;
export const EVENT_ITEM_COLORS = {
  container: {
    compare: 'border-zinc-50',
    default: 'border-zinc-100',
  },
  year: {
    text: 'text-zinc-400',
  },
  title: {
    compare: 'text-zinc-600',
    default: 'text-zinc-800',
  },
  warBadge: {
    bg: 'bg-red-50',
    text: 'text-red-600',
  },
} as const;
export const HISTORY_MAP_COLORS = {
  container: {
    bg: 'bg-white',
    border: 'border-zinc-200',
  },
  marker: {
    bg: 'bg-red-600',
    ring: 'ring-white',
  },
  popup: {
    year: 'text-zinc-500',
    title: 'text-zinc-900',
    summary: 'text-zinc-700',
    location: 'text-zinc-500',
  },
  legend: {
    bg: 'bg-white/90',
    text: 'text-zinc-400',
  },
} as const;
export const BATTLE_COMPARE_COLORS = {
  header: {
    title: 'text-zinc-800',
    year: 'text-zinc-500',
    location: 'text-zinc-400',
  },
  label: 'text-zinc-500',
  section: {
    divider: 'border-zinc-200',
  },
  description: 'text-zinc-600',
  commander: {
    label: 'text-zinc-500',
    badge: 'text-xs rounded',
  },
  overview: {
    label: 'text-zinc-500',
    text: 'text-zinc-600',
  },
} as const;
export const BATTLE_COMPARE_VIEW_COLORS = {
  overlay: 'bg-black/60 backdrop-blur-sm',
  modal: 'bg-white sm:shadow-2xl',
  header: 'bg-gradient-to-r from-red-600 to-blue-600 text-white',
  closeButton: {
    bg: 'bg-white/20',
    hover: 'hover:bg-white/30',
  },
  belligerents: {
    attacker: 'text-red-700',
    defender: 'text-blue-700',
  },
} as const;
export const BATTLE_TIMELINE_COLORS = {
  empty: {
    text: 'text-zinc-400',
  },
  line: 'bg-zinc-200',
  entry: {
    hover: 'hover:bg-zinc-50',
  },
  dot: {
    ring: 'border-white',
  },
  year: 'text-zinc-500',
  card: {
    bg: 'bg-white',
    border: 'border-zinc-200',
    shadow: 'shadow-sm',
    hoverShadow: 'group-hover:shadow-md',
  },
  title: 'text-zinc-900',
  belligerents: {
    text: 'text-zinc-600',
    attacker: 'text-red-600',
    separator: 'text-zinc-400',
    defender: 'text-blue-600',
  },
  meta: {
    text: 'text-zinc-400',
  },
} as const;
export const BATTLE_GEOGRAPHY_COLORS = {
  container: {
    bg: 'bg-white',
    border: 'border-zinc-200',
  },
  title: 'text-zinc-800',
  unknown: {
    text: 'text-zinc-400',
    divider: 'border-zinc-100',
  },
  regionName: 'text-zinc-700',
  count: 'text-zinc-500',
} as const;
export const BATTLES_CLIENT_COLORS = {
  page: {
    background: 'bg-zinc-50',
  },
  header: {
    border: 'border-zinc-200',
    background: 'bg-white/95',
    backdrop: 'backdrop-blur-sm',
  },
  backButton: {
    text: 'text-zinc-600',
    hover: 'hover:text-zinc-900',
  },
  title: 'text-zinc-900',
  badge: {
    background: 'bg-zinc-100',
    text: 'text-zinc-500',
  },
  compareButton: {
    activeBg: 'bg-amber-100',
    activeText: 'text-amber-700',
    inactiveText: 'text-zinc-500',
    inactiveHover: 'hover:text-zinc-700 hover:bg-zinc-100',
  },
  viewToggle: {
    container: 'bg-zinc-100',
    activeBg: 'bg-white',
    activeText: 'text-zinc-900',
    activeShadow: 'shadow-sm',
    inactiveText: 'text-zinc-500',
    inactiveHover: 'hover:text-zinc-700',
  },
  backLink: {
    text: 'text-zinc-600',
    hover: 'hover:text-zinc-900',
    icon: 'text-zinc-400',
  },
  divider: 'bg-zinc-200',
  statCards: {
    attackerWins: {
      gradient: BATTLE_STATS_GRADIENTS.attackerWins,
      border: BATTLE_STATS_BORDER_COLORS.attackerWins,
      value: STATS_TEXT_COLORS.red,
      label: STATS_LABEL_COLORS.red,
    },
    defenderWins: {
      gradient: BATTLE_STATS_GRADIENTS.defenderWins,
      border: BATTLE_STATS_BORDER_COLORS.defenderWins,
      value: STATS_TEXT_COLORS.blue,
      label: STATS_LABEL_COLORS.blue,
    },
    draws: {
      gradient: BATTLE_STATS_GRADIENTS.draws,
      border: BATTLE_STATS_BORDER_COLORS.draws,
      value: STATS_TEXT_COLORS.gray,
      label: STATS_LABEL_COLORS.gray,
    },
    inconclusive: {
      gradient: BATTLE_STATS_GRADIENTS.inconclusive,
      border: BATTLE_STATS_BORDER_COLORS.inconclusive,
      value: STATS_TEXT_COLORS.yellow,
      label: STATS_LABEL_COLORS.yellow,
    },
  },
  eraFilter: {
    active: {
      bg: 'bg-red-600',
      text: 'text-white',
      border: 'border-red-600',
      shadow: 'shadow-sm',
    },
    inactive: {
      bg: 'bg-white',
      text: 'text-zinc-600',
      border: 'border-zinc-200',
      hover: 'hover:border-zinc-300',
    },
  },
  battleDot: {
    default: 'bg-gray-400',
  },
  section: {
    bg: 'bg-white',
    border: 'border-b border-zinc-100',
    padding: 'px-4 py-4',
  },
  eraDistribution: {
    container: {
      bg: 'bg-zinc-50',
    },
    label: 'text-zinc-500',
    tag: {
      bg: 'bg-zinc-50',
      text: 'text-zinc-700',
      count: 'text-zinc-400',
    },
  },
  compareIndicator: {
    bg: 'bg-amber-500',
    text: 'text-white',
    hover: 'hover:bg-amber-600',
  },
  statsBar: {
    container: {
      bg: 'bg-white',
      border: 'border-b border-zinc-100',
      padding: 'px-4 py-3',
    },
    selectedText: 'text-zinc-500',
    countText: 'text-zinc-400',
  },
  geoSection: {
    divider: 'border-t border-zinc-100',
    padding: 'mt-4 pt-4',
  },
  emptyState: {
    text: 'text-zinc-400',
  },
} as const;
export const EMPTY_STATE_COLORS = {
  container: 'text-center',
  icon: 'text-5xl mb-4',
  title: 'text-lg font-semibold text-zinc-700 mb-2',
  description: 'text-sm text-zinc-500 max-w-sm mb-4',
  actionButton: {
    default: 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium',
  },
} as const;
export const LOADING_STATE_COLORS = {
  skeleton: {
    bg: 'bg-zinc-200',
    animate: 'animate-pulse',
  },
  spinner: {
    container: 'flex items-center justify-center py-12',
    ring: 'w-8 h-8 border-4 border-zinc-200 border-t-blue-600 rounded-full animate-spin',
    text: 'text-zinc-500',
  },
} as const;
export const CARD_SKELETON_COLORS = {
  container: 'p-4 rounded-xl border-2 bg-zinc-50 animate-pulse',
  title: 'h-5 bg-zinc-200 rounded w-3/4 mb-2',
  subtitle: 'h-3 bg-zinc-100 rounded w-1/2',
  content: 'mt-3 h-12 bg-zinc-100 rounded-lg',
  badge: 'w-16 h-6 bg-zinc-200 rounded-full',
} as const;
export const BATTLE_CARD_COLORS = {
  container: {
    title: 'text-gray-800',
    subtitle: 'text-gray-500',
    badgeBg: 'bg-white/60',
    badgeBorder: 'border-gray-200',
    hover: {
      scale: 'scale-[1.02]',
      shadow: 'shadow-lg',
    },
  },
  result: {
    default: 'bg-gray-400',
  },
  belligerents: {
    container: 'bg-white/50',
    text: 'text-gray-700',
  },
  impact: {
    default: 'bg-zinc-100',
    textDefault: 'text-zinc-500',
  },
  commander: {
    dot: 'bg-white/80',
    pulse: 'animate-pulse',
  },
  fallback: {
    gradient: 'from-gray-50 to-gray-100',
    border: 'border-gray-200',
  },
} as const;
export const FAVORITE_BUTTON_COLORS = {
  default: {
    bg: 'bg-white/70',
    text: 'text-gray-400',
    hover: 'hover:text-red-500 hover:bg-white/90',
  },
  favorited: {
    bg: 'bg-red-50',
    text: 'text-red-500',
    hover: 'hover:bg-red-100',
  },
} as const;
export const FAVORITES_LIST_COLORS = {
  container: {
    bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
    border: 'border-amber-200',
    title: 'text-amber-800',
    subtitle: 'text-amber-600',
  },
  empty: {
    icon: '🍃',
    title: '还没有收藏的战役',
    subtitle: '点击战役卡片上的心形图标来收藏',
  },
  clearButton: {
    bg: 'bg-zinc-100',
    text: 'text-zinc-600',
    hover: 'hover:bg-zinc-200',
  },
} as const;
export const MAP_BOUNDARY_COLORS = {
  china: {
    fill: '#DC6432',
    fillOpacity: 0.2,
    line: '#DC6432',
    lineWidth: 2,
    lineOpacity: 0.8,
  },
} as const;
export const HISTORY_APP_COLORS = {
  // 页面容器
  container: {
    bg: 'bg-zinc-50',
    text: 'text-zinc-900',
  },
  // Header 区域
  header: {
    border: 'border-zinc-200',
    bg: 'bg-white',
    title: {
      small: 'text-zinc-500',
      large: 'text-zinc-900',
    },
  },
  // 文明切换按钮
  civSwitcher: {
    container: 'border border-zinc-200 bg-zinc-100',
    active: {
      bg: 'bg-white',
      text: 'text-zinc-900',
      shadow: 'shadow-sm',
      font: 'font-medium',
    },
    inactive: 'text-zinc-500 hover:text-zinc-700',
  },
  // 时代信息
  eraInfo: {
    text: 'text-zinc-600',
    separator: 'text-zinc-300',
    font: 'font-medium',
  },
  // 快捷链接按钮
  quickLink: {
    timeline: {
      bg: 'bg-zinc-100 hover:bg-zinc-200',
      text: 'text-zinc-700',
      border: 'border-zinc-200',
    },
    matrix: {
      bg: 'bg-blue-50 hover:bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-200',
    },
    battles: {
      bg: 'bg-red-50 hover:bg-red-100',
      text: 'text-red-700',
      border: 'border-red-200',
    },
    eurasian: {
      bg: 'bg-purple-50 hover:bg-purple-100',
      text: 'text-purple-700',
      border: 'border-purple-200',
    },
    placeNames: {
      bg: 'bg-green-50 hover:bg-green-100',
      text: 'text-green-700',
      border: 'border-green-200',
    },
  },
  // 左侧边栏 - Era 列表
  sidebar: {
    container: {
      bg: 'bg-white',
      border: 'border-zinc-200',
    },
    header: {
      bg: 'bg-white',
      border: 'border-zinc-200',
      text: 'text-zinc-500',
    },
    eraItem: {
      border: 'border-zinc-100',
      hover: 'hover:bg-zinc-100/50',
      dot: 'bg-zinc-400',
      name: 'text-zinc-700',
      year: 'text-zinc-400',
      toggle: 'text-zinc-300',
    },
    // 表格样式（多国并立时期）
    table: {
      header: {
        border: 'border-zinc-200',
        text: 'text-zinc-500',
      },
      row: {
        border: 'border-zinc-100',
        hover: 'hover:bg-zinc-100/50',
        year: 'text-zinc-500 font-medium',
        cell: 'text-zinc-700',
      },
      rulerButton: {
        active: 'bg-blue-100 text-blue-800 font-medium',
        inactive: 'hover:bg-zinc-100 text-zinc-700',
      },
    },
    // 普通时期统治者列表
    rulerList: {
      active: 'bg-blue-100 text-blue-800',
      inactive: 'hover:bg-zinc-100 text-zinc-600',
    },
  },
  // 中间区域 - 时间轴控制
  timeline: {
    container: {
      bg: 'bg-white',
      border: 'border-zinc-200',
    },
    header: {
      text: 'text-zinc-500',
      year: 'text-zinc-800 font-semibold',
      window: 'font-semibold',
      range: 'text-zinc-600',
    },
    // 窗口年份按钮
    windowButton: {
      active: {
        bg: 'bg-blue-600',
        text: 'text-white',
      },
      inactive: {
        bg: 'bg-zinc-100',
        text: 'text-zinc-600',
        hover: 'hover:bg-zinc-200',
      },
    },
    // 导航按钮
    navButton: {
      bg: 'bg-zinc-100',
      text: 'text-zinc-600',
      hover: 'hover:bg-zinc-200',
      disabled: 'disabled:opacity-50',
    },
  },
  // 地图容器
  mapContainer: {
    bg: 'bg-white',
    border: 'border-zinc-200',
  },
  // 右侧边栏 - 事件列表
  eventsSidebar: {
    container: {
      bg: 'bg-white',
      border: 'border-zinc-200',
    },
    header: {
      bg: 'bg-white',
      border: 'border-zinc-200',
      text: 'text-zinc-500',
    },
    eventItem: {
      border: 'border-zinc-100',
      year: 'text-zinc-400',
      title: 'text-zinc-800',
      warBadge: {
        bg: 'bg-red-50',
        text: 'text-red-600',
      },
    },
    // 对比事件
    compare: {
      header: {
        bg: 'bg-zinc-50',
        border: 'border-zinc-200',
        text: 'text-zinc-500',
      },
      title: 'text-zinc-600',
    },
    empty: 'text-zinc-400',
  },
  // 统治者详情面板
  rulerDetail: {
    container: {
      bg: 'bg-white',
      border: 'border-zinc-200',
    },
    header: {
      text: 'text-zinc-500',
      name: 'text-zinc-900',
      eraBadge: {
        bg: 'bg-amber-100',
        text: 'text-amber-700',
      },
      year: 'text-zinc-500',
    },
    closeButton: {
      border: 'border-zinc-200',
      bg: 'bg-white',
      text: 'text-zinc-700',
      hover: 'hover:bg-zinc-50',
    },
    highlight: 'text-zinc-700',
    bio: 'text-zinc-600',
    seedNote: 'text-zinc-500',
  },
} as const;
export const ERA_ITEM_COLORS = {
  default: {
    bg: 'bg-zinc-50',
    text: 'text-zinc-700',
    dot: 'bg-zinc-400',
  },
  button: {
    hover: 'hover:bg-zinc-100/50',
  },
  list: {
    active: 'bg-blue-100 text-blue-800',
    inactive: 'hover:bg-zinc-100 text-zinc-600',
  },
} as const;
export const LOCALE_SWITCHER_COLORS = {
  container: {
    text: 'text-zinc-600',
  },
  select: {
    border: 'border-zinc-200',
    bg: 'bg-white',
    text: 'text-zinc-600',
  },
} as const;
export const SEARCH_BOX_COLORS = {
  input: {
    bg: 'bg-zinc-50',
    border: 'border-transparent',
    focus: {
      bg: 'bg-white',
      border: 'border-zinc-200',
    },
  },
  icon: 'text-zinc-400',
  clearButton: {
    text: 'text-zinc-400',
    hover: 'hover:text-zinc-600',
  },
  dropdown: {
    bg: 'bg-white',
    border: 'border-zinc-200',
    item: {
      hover: 'hover:bg-zinc-50',
      subtitle: 'text-zinc-400',
      title: 'text-zinc-900',
    },
    empty: 'text-zinc-400',
  },
} as const;
export const YEAR_SLIDER_COLORS = {
  background: 'bg-zinc-900',
  track: 'bg-zinc-700',
  progress: 'bg-blue-500',
  dot: 'bg-blue-500',
  button: {
    play: 'bg-green-600 hover:bg-green-500',
    pause: 'bg-red-600 hover:bg-red-500',
  },
  centuryMark: 'bg-zinc-600',
  thumb: 'bg-white',
  thumbInner: 'bg-blue-500',
} as const;
export const ERROR_BOUNDARY_COLORS = {
  container: {
    text: 'text-zinc-800',
  },
  title: {
    text: 'text-zinc-800',
  },
  description: {
    text: 'text-zinc-500',
  },
  errorDetails: {
    summary: {
      text: 'text-zinc-500',
      hover: 'hover:text-zinc-700',
    },
    pre: {
      bg: 'bg-zinc-100',
      text: 'text-red-600',
    },
  },
  button: {
    primary: {
      bg: 'bg-blue-600',
      hover: 'hover:bg-blue-700',
      text: 'text-white',
    },
    secondary: {
      bg: 'bg-zinc-100',
      hover: 'hover:bg-zinc-200',
      text: 'text-zinc-700',
    },
  },
} as const;
export const BUTTON_GHOST_COLORS = {
  bg: 'bg-transparent',
  hover: 'hover:bg-zinc-100',
  text: 'text-zinc-700',
} as const;
export const LIST_SKELETON_COLORS = {
  avatar: {
    bg: 'bg-zinc-200',
  },
  title: {
    bg: 'bg-zinc-200',
  },
  subtitle: {
    bg: 'bg-zinc-100',
  },
} as const;
export const ERA_ITEM_EXTRA_COLORS = {
  divider: 'border-zinc-100',
  rulerList: {
    year: 'text-zinc-400',
  },
} as const;
export const THEME_TOGGLE_COLORS = {
  button: {
    container: 'inline-flex items-center justify-center',
    dimensions: 'w-9 h-9',
    border: 'border-none',
    borderRadius: 'rounded-lg',
    bg: 'bg-transparent',
    cursor: 'cursor-pointer',
    fontSize: 'text-lg',
    transition: 'transition-colors duration-200',
  },
  hover: {
    bg: 'hover:bg-zinc-100',
  },
} as const;
export const CARD_COLORS = {
  header: {
    border: 'border-zinc-200',
    padding: 'px-4 py-3',
  },
  footer: {
    border: 'border-t border-zinc-200',
    bg: 'bg-zinc-50',
    padding: 'px-4 py-3',
  },
} as const;
export const HISTORY_APP_EXTRA_COLORS = {
  // 分隔符
  divider: {
    default: 'text-zinc-300',
    light: 'text-zinc-200',
    dark: 'text-zinc-400',
  },
  // 多国并立标签
  multiPolity: {
    text: 'text-zinc-400',
  },
  // 箭头图标
  arrow: {
    text: 'text-zinc-300',
  },
  // 事件标题
  eventTitle: {
    default: 'text-zinc-800',
    light: 'text-zinc-600',
  },
  // 时间范围标签
  rangeLabel: {
    text: 'text-zinc-600',
  },
  // 侧边栏导航
  sidebar: {
    nav: {
      border: 'border-zinc-200',
      padding: 'pl-2 ml-1',
    },
  },
  // 事件项
  eventItem: {
    title: 'text-zinc-800',
  },
} as const;
export const ERA_ITEM_ARROW_COLORS = {
  text: 'text-zinc-300',
} as const;
export const ERA_ITEM_EXPANDED_COLORS = {
  bg: 'bg-zinc-50/50',
} as const;
export const BATTLE_GEOGRAPHY_DIVIDER_COLORS = {
  border: 'border-zinc-100',
} as const;
export const EMPTY_STATE_TEXT_COLORS = {
  default: 'text-zinc-400',
} as const;
export const MODAL_BACKDROP_COLORS = {
  bg: 'bg-black/60',
  blur: 'backdrop-blur-sm',
} as const;

export const BATTLE_OF_THE_DAY_COLORS = {
  badge: {
    bg: 'bg-gradient-to-r from-amber-100 to-orange-100',
    text: 'text-amber-800',
  },
  subtitle: 'text-gray-500',
  badgeItem: {
    bg: 'bg-white/60',
  },
  belligerents: {
    container: 'bg-white/50',
    text: 'text-gray-700',
    vs: 'text-amber-500',
  },
  cta: 'text-amber-700',
} as const;

