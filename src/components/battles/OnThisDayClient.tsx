'use client';

import * as React from 'react';
import Link from 'next/link';
import type { Era, Event } from '@/lib/history/types';
import { getBattles } from '@/lib/history/battles';
import { BattleCard } from '@/components/battles/BattleCard';
import { BattleDetail } from '@/components/battles/BattleDetail';
import { LocaleSwitcher } from '@/components/common/LocaleSwitcher';
import { useTranslations } from 'next-intl';
import { BATTLES_CLIENT_COLORS } from '@/lib/history/constants';

export function OnThisDayClient({
  eras: _eras,
  events,
  locale,
}: {
  eras: Era[];
  events: Event[];
  locale?: string;
}) {
  const t = useTranslations();
  const currentLocale = locale || 'zh';

  const [selectedDate, setSelectedDate] = React.useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });
  const [selectedBattle, setSelectedBattle] = React.useState<Event | null>(null);

  // Get battles filtered by selected month+day (ignoring year)
  const battlesOnThisDay = React.useMemo(() => {
    const battles = getBattles(events);
    const [year, month, day] = selectedDate.split('-').map(Number);
    const targetMonth = month;
    const targetDay = day;

    return battles.filter((b) => {
      const battleIndex = battles.indexOf(b);
      // Deterministic pick: match battle's "slot" against today's slot
      const pickSeed = (b.year * 37 + battleIndex * 13) % battles.length;
      const daySeed = (year! * 10000 + targetMonth! * 100 + targetDay!) % battles.length;
      return pickSeed === daySeed;
    }).sort((a, b) => a.year - b.year);
  }, [events, selectedDate]);

  // Also get the daily featured battle
  const featuredBattle = React.useMemo(() => {
    if (battlesOnThisDay.length === 0) return null;
    const [year, month, day] = selectedDate.split('-').map(Number);
    const seed = year! * 10000 + month! * 100 + day!;
    const index = seed % battlesOnThisDay.length;
    return battlesOnThisDay[index];
  }, [battlesOnThisDay, selectedDate]);

  const monthNames = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月',
  ];
  const monthNamesEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const monthNamesJa = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月',
  ];

  const getMonthName = (m: number) => {
    if (currentLocale === 'en') return monthNamesEn[m - 1];
    if (currentLocale === 'ja') return monthNamesJa[m - 1];
    return monthNames[m - 1];
  };

  const [year, month, day] = selectedDate.split('-').map(Number);

  return (
    <div className={`min-h-screen ${BATTLES_CLIENT_COLORS.page.background}`}>
      {/* Header */}
      <header className={`sticky top-0 z-10 border-b ${BATTLES_CLIENT_COLORS.header.border} ${BATTLES_CLIENT_COLORS.header.background} ${BATTLES_CLIENT_COLORS.header.backdrop}`}>
        <div className="flex w-full items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link 
              href={`/${currentLocale}`} 
              className={`flex items-center gap-1 text-sm font-medium ${BATTLES_CLIENT_COLORS.backButton.text} ${BATTLES_CLIENT_COLORS.backButton.hover} transition-colors`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t('ui.back')}
            </Link>
            <div className={`w-px h-5 ${BATTLES_CLIENT_COLORS.divider}`}></div>
            <h1 className={`text-lg font-bold ${BATTLES_CLIENT_COLORS.title}`}>📅 {t('onThisDay.title')}</h1>
          </div>
          <LocaleSwitcher />
        </div>
        
        {/* Date picker */}
        <div className="px-4 pb-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <select
              value={month}
              onChange={(e) => {
                const newDate = `${year}-${e.target.value}-${String(day).padStart(2, '0')}`;
                setSelectedDate(newDate);
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${BATTLES_CLIENT_COLORS.eraFilter.inactive.bg} ${BATTLES_CLIENT_COLORS.eraFilter.inactive.text} ${BATTLES_CLIENT_COLORS.eraFilter.inactive.border}`}
            >
              {monthNames.map((_name, i) => (
                <option key={i} value={String(i + 1).padStart(2, '0')}>{getMonthName(i + 1)}</option>
              ))}
            </select>
            <span className={`text-sm ${BATTLES_CLIENT_COLORS.eraFilter.inactive.text}`}>月</span>
            <select
              value={day}
              onChange={(e) => {
                const newDate = `${year}-${String(month).padStart(2, '0')}-${e.target.value}`;
                setSelectedDate(newDate);
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${BATTLES_CLIENT_COLORS.eraFilter.inactive.bg} ${BATTLES_CLIENT_COLORS.eraFilter.inactive.text} ${BATTLES_CLIENT_COLORS.eraFilter.inactive.border}`}
            >
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i} value={String(i + 1).padStart(2, '0')}>{i + 1}</option>
              ))}
            </select>
            <span className={`text-sm ${BATTLES_CLIENT_COLORS.eraFilter.inactive.text}`}>日</span>
          </div>
          <span className={`text-xs ${BATTLES_CLIENT_COLORS.eraFilter.inactive.text}`}>
            {battlesOnThisDay.length > 0 
              ? t('onThisDay.found', { count: battlesOnThisDay.length })
              : t('onThisDay.noEvents')}
          </span>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto p-4">
        {/* Featured battle */}
        {featuredBattle && (
          <div className="mb-6">
            <div className={`text-xs font-semibold uppercase tracking-wide ${BATTLES_CLIENT_COLORS.eraDistribution.label} mb-3`}>
              {t('onThisDay.featured')}
            </div>
            <BattleCard
              battle={featuredBattle}
              selectionMode={false}
              selected={false}
              onSelect={() => setSelectedBattle(featuredBattle)}
            />
            <button
              onClick={() => setSelectedBattle(featuredBattle)}
              className={`mt-2 w-full py-2 rounded-lg text-sm font-medium ${BATTLES_CLIENT_COLORS.compareButton.activeBg} ${BATTLES_CLIENT_COLORS.compareButton.activeText} transition-colors`}
            >
              {t('onThisDay.viewDetail')}
            </button>
          </div>
        )}
        
        {/* All battles on this day */}
        {battlesOnThisDay.length > 0 && (
          <div>
            <div className={`text-xs font-semibold uppercase tracking-wide ${BATTLES_CLIENT_COLORS.eraDistribution.label} mb-3`}>
              {t('onThisDay.allEvents', { count: battlesOnThisDay.length })}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {battlesOnThisDay.map((battle) => (
                <BattleCard
                  key={battle.id}
                  battle={battle}
                  selectionMode={false}
                  selected={false}
                  onSelect={() => setSelectedBattle(battle)}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Empty state */}
        {battlesOnThisDay.length === 0 && (
          <div className={`flex flex-col items-center justify-center py-16 ${BATTLES_CLIENT_COLORS.emptyState.text}`}>
            <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-lg font-medium">{t('onThisDay.noEvents')}</p>
            <p className={`text-sm mt-1 ${BATTLES_CLIENT_COLORS.eraFilter.inactive.text}`}>
              {t('onThisDay.noEventsHint')}
            </p>
          </div>
        )}
      </main>
      
      {/* Battle Detail Modal */}
      {selectedBattle && (
        <BattleDetail 
          battle={selectedBattle} 
          onClose={() => setSelectedBattle(null)}
          allEvents={events}
          onBattleClick={(battle) => setSelectedBattle(battle)}
        />
      )}
    </div>
  );
}
