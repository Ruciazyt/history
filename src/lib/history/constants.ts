/**
 * Shared constants for History Atlas
 *
 * Modular constants are organized in constants/ directory:
 *   - colors.ts  (color palettes, themes, component colors)
 *   - labels.ts  (strategy, terrain, pacing, battle type labels)
 *   - layout.ts  (spacing, breakpoints, shadows, radius, z-index)
 *   - animations.ts  (animation duration and CSS classes)
 *
 * This file re-exports everything for backward compatibility:
 * all imports from '../constants' or '@/lib/history/constants' continue to work.
 */
export * from './constants/index';
