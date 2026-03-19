/**
 * Layout / structural constants for History Atlas
 * Spacing, breakpoints, shadows, radius, z-index, sizes.
 */

export const UI_SPACING = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
} as const;
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;
export const Z_INDEX = {
  dropdown: 100,
  sticky: 200,
  modal: 1000,
  toast: 2000,
} as const;
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;
export const SHADOW = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
} as const;
export const RADIUS = {
  none: '0',
  sm: '0.125rem',
  DEFAULT: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
} as const;
export const UI_LIMITS = {
  searchResults: 8,
  cardTitle: 50,
  cardSummary: 100,
  modalTitle: 100,
  listItems: 20,
} as const;
export const BUTTON_SIZES = {
  sm: {
    padding: 'px-2 py-1',
    text: 'text-xs',
    radius: 'rounded',
  },
  md: {
    padding: 'px-3 py-1.5',
    text: 'text-sm',
    radius: 'rounded-md',
  },
  lg: {
    padding: 'px-4 py-2',
    text: 'text-base',
    radius: 'rounded-lg',
  },
} as const;
export const INPUT_STYLES = {
  default: 'bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
  filled: 'bg-zinc-100 border-0 rounded-lg px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500',
  minimal: 'bg-transparent border-b border-zinc-300 px-2 py-1 text-sm focus:outline-none focus:border-blue-500',
} as const;
