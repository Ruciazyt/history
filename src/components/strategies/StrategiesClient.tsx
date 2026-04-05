'use client';

import * as React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { Event } from '@/lib/history/types';
import type { BattleStrategy } from '@/lib/history/types';
import {
  getStrategyStats,
  getBattlesByStrategy,
  getStrategyLabel,
  hasStrategyData,
  getStrategySummary,
} from '@/lib/history/battleStrategy';
import { StatsCard, StatsGrid } from '@/components/common/StatsCard';
import { formatYear } from '@/lib/history/utils';

interface StrategiesClientProps {
  events: Event[];
  locale?: string;
}

const STRATEGY_GRADIENTS: Record<BattleStrategy, string> = {
  ambush: 'blue',
  fire: 'red',
  water: 'blue',
  encirclement: 'purple',
  siege: 'gray',
  pincer: 'yellow',
  'feigned-retreat': 'green',
  alliance: 'purple',
  defensive: 'blue',
  offensive: 'red',
  guerrilla: 'green',
  unknown: 'gray',
};

export function StrategiesClient({ events, locale = 'zh' }: StrategiesClientProps) {
  const t = useTranslations();

  const summary = React.useMemo(() => {
    return getStrategySummary(events);
  }, [events]);

  const stats = React.useMemo(() => {
    return getStrategyStats(events).filter(s => s.totalUsages > 0);
  }, [events]);

  if (!hasStrategyData(events)) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">{t('common.noData')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t('strategies.title')}
        </h1>
        <p className="text-muted-foreground">{t('strategies.description')}</p>
      </div>

      {/* Summary Stats */}
      <section>
        <h2 className="text-lg font-semibold mb-3">{t('strategies.overview')}</h2>
        <StatsGrid columns={4}>
          <StatsCard
            value={summary.uniqueStrategies}
            label={t('strategies.uniqueStrategies')}
            gradient="blue"
            icon={<span>⚔️</span>}
          />
          <StatsCard
            value={summary.battlesWithStrategy}
            label={t('strategies.battlesWithStrategy')}
            gradient="green"
            icon={<span>🎯</span>}
          />
          <StatsCard
            value={summary.mostUsed[0] ? getStrategyLabel(summary.mostUsed[0].strategy) : '-'}
            label={t('strategies.mostUsed')}
            gradient="red"
            icon={<span>🔥</span>}
          />
          <StatsCard
            value={
              summary.mostEffective[0] && summary.mostEffective[0].totalUsages >= 2
                ? getStrategyLabel(summary.mostEffective[0].strategy)
                : '-'
            }
            label={t('strategies.mostEffective')}
            gradient="yellow"
            icon={<span>🏆</span>}
          />
        </StatsGrid>
      </section>

      {/* Attacker/Defender favoring strategies */}
      <section className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border bg-card p-4">
          <h3 className="text-sm font-semibold text-red-600 mb-2">
            {t('strategies.attackerFavoring')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {summary.attackerFavoring.length === 0 ? (
              <span className="text-sm text-muted-foreground">-</span>
            ) : (
              summary.attackerFavoring.map(s => (
                <span
                  key={s}
                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                >
                  {getStrategyLabel(s)}
                </span>
              ))
            )}
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <h3 className="text-sm font-semibold text-blue-600 mb-2">
            {t('strategies.defenderFavoring')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {summary.defenderFavoring.length === 0 ? (
              <span className="text-sm text-muted-foreground">-</span>
            ) : (
              summary.defenderFavoring.map(s => (
                <span
                  key={s}
                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                >
                  {getStrategyLabel(s)}
                </span>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Strategy Cards */}
      <section>
        <h2 className="text-lg font-semibold mb-3">{t('strategies.allStrategies')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map(stat => (
            <StrategyCard key={stat.strategy} stat={stat} events={events} locale={locale} />
          ))}
        </div>
      </section>
    </div>
  );
}

interface StrategyCardProps {
  stat: ReturnType<typeof getStrategyStats>[number];
  events: Event[];
  locale: string;
}

function StrategyCard({ stat, events, locale }: StrategyCardProps) {
  const t = useTranslations();
  const gradient = STRATEGY_GRADIENTS[stat.strategy] || 'gray';
  const battles = getBattlesByStrategy(events, stat.strategy).slice(0, 3);

  return (
    <div
      className={`
        rounded-xl border bg-card overflow-hidden
        hover:shadow-md transition-all hover:scale-[1.01]
      `}
    >
      {/* Header with gradient */}
      <div
        className={`bg-gradient-to-r ${
          gradient === 'red'
            ? 'from-red-500 to-orange-500'
            : gradient === 'blue'
            ? 'from-blue-500 to-cyan-500'
            : gradient === 'green'
            ? 'from-green-500 to-emerald-500'
            : gradient === 'yellow'
            ? 'from-yellow-500 to-amber-500'
            : gradient === 'purple'
            ? 'from-purple-500 to-pink-500'
            : 'from-gray-500 to-slate-500'
        } p-4 text-white`}
      >
        <div className="text-lg font-bold">{getStrategyLabel(stat.strategy)}</div>
      </div>

      {/* Stats */}
      <div className="p-4 space-y-2">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-lg font-bold">{stat.totalUsages}</div>
            <div className="text-xs text-muted-foreground">{t('strategies.usage')}</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">{stat.attackerWins}</div>
            <div className="text-xs text-muted-foreground">{t('strategies.attackerWins')}</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">{stat.defenderWins}</div>
            <div className="text-xs text-muted-foreground">{t('strategies.defenderWins')}</div>
          </div>
        </div>

        {/* Win rate bar */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">{t('strategies.winRate')}</span>
            <span className="font-medium">{stat.winRate}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
              style={{ width: `${stat.winRate}%` }}
            />
          </div>
        </div>

        {/* Representative battles */}
        {battles.length > 0 && (
          <div className="pt-2 border-t">
            <div className="text-xs text-muted-foreground mb-1">
              {t('strategies.representativeBattles')}
            </div>
            <div className="space-y-1">
              {battles.map(battle => (
                <div
                  key={battle.id}
                  className="flex items-center justify-between text-sm"
                >
                  <Link
                    href={`/${locale}/battles?highlight=${battle.id}`}
                    className="hover:underline truncate max-w-[140px]"
                  >
                    {t(battle.titleKey)}
                  </Link>
                  <span className="text-xs text-muted-foreground ml-2 shrink-0">
                    {formatYear(battle.year, locale)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
