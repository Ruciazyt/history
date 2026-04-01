'use client';

import * as React from 'react';

/**
 * Reads the current dark/light theme from the DOM `data-theme` attribute on <html>.
 *
 * This hook is used by components that live outside the ThemeProvider subtree
 * (e.g. BottomNav, BattleCard) so they stay in sync with the theme toggle without
 * requiring prop-drilling or context subscription.
 *
 * ThemeContext writes `data-theme="dark"` / `data-theme="light"` to <html> whenever
 * the user toggles the theme — this hook observes those changes via MutationObserver.
 */
export function useDarkMode(): boolean {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    // Hydrate with the current value on mount
    setIsDark(document.documentElement.dataset.theme === 'dark');

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.dataset.theme === 'dark');
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  return isDark;
}
