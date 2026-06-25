/**
 * Layout / structural constants for History Atlas
 * Z-index and button sizes.
 */

export const Z_INDEX = {
  dropdown: 100,
  sticky: 200,
  modal: 1000,
  toast: 2000,
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
