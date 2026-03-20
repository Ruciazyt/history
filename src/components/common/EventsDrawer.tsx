'use client';

import * as React from 'react';
import type { Era, Event } from '@/lib/history/types';
import { formatYear } from '@/lib/history/utils';
import { useTranslations } from 'next-intl';

interface EventsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentEraEvents: Event[];
  otherEraEvents: Event[];
  activeEras: Era[];
}

export const EventsDrawer = React.memo(function EventsDrawer({
  isOpen,
  onClose,
  currentEraEvents,
  otherEraEvents,
  activeEras,
}: EventsDrawerProps) {
  const t = useTranslations();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer - right side */}
      <div
        className={`fixed right-0 top-0 bottom-0 z-50 w-[80vw] max-w-[320px] transform overflow-hidden lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-out`}
      >
        <div className="flex h-full flex-col bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-700">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-700 px-4 py-3">
            <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {t('ui.events')} ({currentEraEvents.length})
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              ✕
            </button>
          </div>

          {/* Events list */}
          <div className="flex-1 overflow-y-auto">
            {currentEraEvents.length > 0 ? (
              currentEraEvents.map((e) => {
                const era = activeEras.find((era) => era.id === e.entityId);
                const eraName = era ? t(era.nameKey) : '';
                return (
                  <div
                    key={e.id}
                    className="border-b border-zinc-100 dark:border-zinc-800 px-4 py-3"
                  >
                    <div className="text-xs text-zinc-400 dark:text-zinc-500">
                      {formatYear(e.year)} {eraName ? `· ${eraName}` : ''}
                    </div>
                    <div className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {t(e.titleKey)}
                    </div>
                    {e.tags && e.tags.includes('war') && (
                      <div className="mt-1 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                        ⚔️ 战役
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-sm text-zinc-400">
                {t('ui.noEvents')}
              </div>
            )}

            {otherEraEvents.length > 0 && (
              <>
                <div className="border-t border-zinc-200 dark:border-zinc-700 px-4 py-2 bg-zinc-50 dark:bg-zinc-800/50">
                  <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    {t('ui.compare')} ({otherEraEvents.length})
                  </div>
                </div>
                {otherEraEvents.slice(0, 20).map((e) => {
                  const era = activeEras.find((era) => era.id === e.entityId);
                  const eraName = era ? t(era.nameKey) : '';
                  return (
                    <div
                      key={e.id}
                      className="border-b border-zinc-100 dark:border-zinc-800 px-4 py-3"
                    >
                      <div className="text-xs text-zinc-400 dark:text-zinc-500">
                        {formatYear(e.year)} {eraName ? `· ${eraName}` : ''}
                      </div>
                      <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        {t(e.titleKey)}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
});