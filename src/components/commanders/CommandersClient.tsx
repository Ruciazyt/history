'use client';

import * as React from 'react';
import Link from 'next/link';
import type { Era, Event } from '@/lib/history/types';
import {
  buildCommanderNetwork,
  getCommanderNetworkSummary,
  getCommanderNetworkInsights,
  getTopMatchups,
  getTopCollaborations,
  hasCommanderNetworkData,
} from '@/lib/history/commanderNetwork';
import { formatYear } from '@/lib/history/utils';
import { COMMANDER_COLORS } from '@/lib/history/constants';
import { LocaleSwitcher } from '@/components/common/LocaleSwitcher';
import { useTranslations } from 'next-intl';
import { EmptyState } from '@/components/common/EmptyState';

const COMMANDERS_COLORS = {
  page: {
    bg: 'bg-zinc-50 dark:bg-zinc-900',
  },
  header: {
    border: 'border-zinc-200 dark:border-zinc-700',
    bg: 'bg-white dark:bg-zinc-800',
    title: 'text-zinc-900 dark:text-zinc-100',
    badge: {
      bg: 'bg-zinc-100 dark:bg-zinc-700',
      text: 'text-zinc-600 dark:text-zinc-400',
    },
  },
  statCard: {
    bg: 'bg-white dark:bg-zinc-800',
    border: 'border-zinc-200 dark:border-zinc-700',
    label: 'text-zinc-500 dark:text-zinc-400',
    value: 'text-zinc-900 dark:text-zinc-100',
  },
  section: {
    title: 'text-zinc-800 dark:text-zinc-200',
    border: 'border-zinc-200 dark:border-zinc-700',
  },
  commanderCard: {
    bg: 'bg-white dark:bg-zinc-800',
    border: 'border-zinc-200 dark:border-zinc-700',
    hover: 'hover:border-zinc-400 dark:hover:border-zinc-500',
    name: 'text-zinc-900 dark:text-zinc-100',
    stat: 'text-zinc-600 dark:text-zinc-400',
  },
  collaborationCard: {
    bg: 'bg-white dark:bg-zinc-800',
    border: 'border-zinc-200 dark:border-zinc-700',
    name: 'text-zinc-900 dark:text-zinc-100',
    badge: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
    stat: 'text-zinc-600 dark:text-zinc-400',
  },
  matchupCard: {
    bg: 'bg-white dark:bg-zinc-800',
    border: 'border-zinc-200 dark:border-zinc-700',
    name: 'text-zinc-900 dark:text-zinc-100',
    badge: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300',
    stat: 'text-zinc-600 dark:text-zinc-400',
  },
  vs: 'text-zinc-400 dark:text-zinc-500',
  tab: {
    active: {
      bg: 'bg-zinc-100 dark:bg-zinc-700',
      text: 'text-zinc-900 dark:text-zinc-100',
    },
    inactive: {
      bg: 'bg-transparent',
      text: 'text-zinc-500 dark:text-zinc-400',
      hover: 'hover:text-zinc-700 dark:hover:text-zinc-300',
    },
  },
};

type Tab = 'commanders' | 'collaborations' | 'matchups' | 'insights';

function WinRateBadge({ winRate, t }: { winRate: number; t: ReturnType<typeof useTranslations> }) {
  const cls =
    winRate >= 60
      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      : winRate >= 45
      ? 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400'
      : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${cls}`}>
      {winRate}% {t('commanders.winRate')}
    </span>
  );
}

function CommanderCard({
  node,
  index,
  t,
}: {
  node: {
    name: string;
    battles: number;
    wins: number;
    losses: number;
    winRate: number;
    collaborators: string[];
    opponents: string[];
    firstBattle?: number;
    lastBattle?: number;
  };
  index: number;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div
      className={`rounded-xl border p-4 transition-all hover:shadow-md ${COMMANDERS_COLORS.commanderCard.bg} ${COMMANDERS_COLORS.commanderCard.border} ${COMMANDERS_COLORS.commanderCard.hover}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-700 text-xs font-bold text-zinc-500 dark:text-zinc-400">
            {index + 1}
          </span>
          <div>
            <div className={`font-semibold ${COMMANDERS_COLORS.commanderCard.name}`}>
              👤 {node.name}
            </div>
            {node.firstBattle !== undefined && (
              <div className={`text-xs ${COMMANDERS_COLORS.commanderCard.stat}`}>
                {formatYear(node.firstBattle)}
                {node.lastBattle !== undefined && node.lastBattle !== node.firstBattle
                  ? ` – ${formatYear(node.lastBattle)}`
                  : ''}
              </div>
            )}
          </div>
        </div>
        <WinRateBadge winRate={node.winRate} t={t} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className={`text-center rounded-lg p-2 bg-zinc-50 dark:bg-zinc-700/50`}>
          <div className={`text-sm font-bold ${COMMANDERS_COLORS.commanderCard.name}`}>{node.battles}</div>
          <div className={`text-xs ${COMMANDERS_COLORS.commanderCard.stat}`}>{t('commanders.participated')}</div>
        </div>
        <div className={`text-center rounded-lg p-2 bg-green-50 dark:bg-green-900/20`}>
          <div className={`text-sm font-bold text-green-600 dark:text-green-400`}>{node.wins}</div>
          <div className={`text-xs ${COMMANDERS_COLORS.commanderCard.stat}`}>{t('commanders.wins')}</div>
        </div>
        <div className={`text-center rounded-lg p-2 bg-red-50 dark:bg-red-900/20`}>
          <div className={`text-sm font-bold text-red-600 dark:text-red-400`}>{node.losses}</div>
          <div className={`text-xs ${COMMANDERS_COLORS.commanderCard.stat}`}>{t('commanders.losses')}</div>
        </div>
      </div>

      {/* Relationships */}
      <div className="flex flex-wrap gap-1.5">
        {node.collaborators.slice(0, 3).map((c) => (
          <span
            key={c}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${COMMANDER_COLORS.attacker.bg} ${COMMANDER_COLORS.attacker.text}`}
          >
            🤝 {c}
          </span>
        ))}
        {node.opponents.slice(0, 3).map((c) => (
          <span
            key={c}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${COMMANDER_COLORS.defender.bg} ${COMMANDER_COLORS.defender.text}`}
          >
            ⚔️ {c}
          </span>
        ))}
        {node.collaborators.length > 3 && (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-zinc-100 dark:bg-zinc-700 ${COMMANDER_COLORS.attacker.text}`}>
            +{node.collaborators.length - 3}
          </span>
        )}
        {node.opponents.length > 3 && (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-zinc-100 dark:bg-zinc-700 ${COMMANDER_COLORS.defender.text}`}>
            +{node.opponents.length - 3}
          </span>
        )}
      </div>
    </div>
  );
}

export function CommandersClient({
  events,
  locale,
}: {
  eras: Era[];
  events: Event[];
  locale?: string;
}) {
  const t = useTranslations();
  const [activeTab, setActiveTab] = React.useState<Tab>('commanders');

  const battles = React.useMemo(() => events.filter((e) => e.battle?.commanders), [events]);
  const hasData = React.useMemo(() => hasCommanderNetworkData(battles), [battles]);

  const network = React.useMemo(
    () => (hasData ? buildCommanderNetwork(battles) : null),
    [battles, hasData]
  );

  const summary = React.useMemo(
    () => (hasData ? getCommanderNetworkSummary(battles) : null),
    [battles, hasData]
  );

  const insights = React.useMemo(
    () => (hasData ? getCommanderNetworkInsights(battles) : []),
    [battles, hasData]
  );

  const topCommanders = React.useMemo(() => {
    if (!network) return [];
    return [...network.nodes].sort((a, b) => b.battles - a.battles);
  }, [network]);

  const topMatchups = React.useMemo(() => (hasData ? getTopMatchups(battles, 10) : []), [battles, hasData]);
  const topCollaborations = React.useMemo(
    () => (hasData ? getTopCollaborations(battles, 10) : []),
    [battles, hasData]
  );

  if (!hasData) {
    return (
      <div className={`min-h-screen ${COMMANDERS_COLORS.page.bg}`}>
        <header className={`sticky top-0 z-10 border-b ${COMMANDERS_COLORS.header.border} ${COMMANDERS_COLORS.header.bg}`}>
          <div className="flex w-full items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Link
                href={`/${locale || 'zh'}`}
                className="flex items-center gap-1 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {t('ui.back')}
              </Link>
              <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-700"></div>
              <h1 className={`text-lg font-bold ${COMMANDERS_COLORS.header.title}`}>
                👑 {t('nav.commanders') || '指挥官网络'}
              </h1>
            </div>
            <LocaleSwitcher />
          </div>
        </header>
        <div className="flex items-center justify-center min-h-[60vh]">
          <EmptyState
            icon="👑"
            title={t('commanders.noData') || '暂无指挥官数据'}
            description={t('commanders.noDataDesc') || '当前战役数据中没有指挥官信息'}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${COMMANDERS_COLORS.page.bg}`}>
      {/* Header */}
      <header className={`sticky top-0 z-10 border-b ${COMMANDERS_COLORS.header.border} ${COMMANDERS_COLORS.header.bg}`}>
        <div className="flex w-full items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale || 'zh'}`}
              className="flex items-center gap-1 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t('ui.back')}
            </Link>
            <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-700"></div>
            <h1 className={`text-lg font-bold ${COMMANDERS_COLORS.header.title}`}>
              👑 {t('nav.commanders') || '指挥官网络'}
            </h1>
            <span className={`text-xs px-2 py-0.5 rounded-full ${COMMANDERS_COLORS.header.badge.bg} ${COMMANDERS_COLORS.header.badge.text}`}>
              {t('commanders.commanderCount', { count: summary?.totalCommanders || 0 })}
            </span>
          </div>
          <LocaleSwitcher />
        </div>

        {/* Stats summary */}
        {summary && (
          <div className="px-4 pb-3 flex gap-3 overflow-x-auto">
            <div className={`shrink-0 rounded-lg border px-3 py-2 ${COMMANDERS_COLORS.statCard.bg} ${COMMANDERS_COLORS.statCard.border}`}>
              <div className={`text-xs ${COMMANDERS_COLORS.statCard.label}`}>{t('commanders.totalCommanders')}</div>
              <div className={`text-sm font-bold ${COMMANDERS_COLORS.statCard.value}`}>{summary.totalCommanders}</div>
            </div>
            <div className={`shrink-0 rounded-lg border px-3 py-2 ${COMMANDERS_COLORS.statCard.bg} ${COMMANDERS_COLORS.statCard.border}`}>
              <div className={`text-xs ${COMMANDERS_COLORS.statCard.label}`}>{t('commanders.totalRelations')}</div>
              <div className={`text-sm font-bold ${COMMANDERS_COLORS.statCard.value}`}>{summary.totalRelations}</div>
            </div>
            <div className={`shrink-0 rounded-lg border px-3 py-2 ${COMMANDERS_COLORS.statCard.bg} ${COMMANDERS_COLORS.statCard.border}`}>
              <div className={`text-xs ${COMMANDERS_COLORS.statCard.label}`}>{t('commanders.collaborations')}</div>
              <div className={`text-sm font-bold ${COMMANDERS_COLORS.statCard.value}`}>{summary.collaborations}</div>
            </div>
            <div className={`shrink-0 rounded-lg border px-3 py-2 ${COMMANDERS_COLORS.statCard.bg} ${COMMANDERS_COLORS.statCard.border}`}>
              <div className={`text-xs ${COMMANDERS_COLORS.statCard.label}`}>{t('commanders.matchups')}</div>
              <div className={`text-sm font-bold ${COMMANDERS_COLORS.statCard.value}`}>{summary.matchups}</div>
            </div>
            {summary.mostActive && (
              <div className={`shrink-0 rounded-lg border px-3 py-2 ${COMMANDERS_COLORS.statCard.bg} ${COMMANDERS_COLORS.statCard.border}`}>
                <div className={`text-xs ${COMMANDERS_COLORS.statCard.label}`}>{t('commanders.mostActive')}</div>
                <div className={`text-sm font-bold ${COMMANDERS_COLORS.statCard.value}`}>{summary.mostActive}</div>
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="px-4 pb-3 flex gap-1">
          {(['commanders', 'collaborations', 'matchups', 'insights'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? `${COMMANDERS_COLORS.tab.active.bg} ${COMMANDERS_COLORS.tab.active.text}`
                  : `${COMMANDERS_COLORS.tab.inactive.bg} ${COMMANDERS_COLORS.tab.inactive.text} ${COMMANDERS_COLORS.tab.inactive.hover}`
              }`}
            >
              {tab === 'commanders' && '👤 '}
              {tab === 'collaborations' && '🤝 '}
              {tab === 'matchups' && '⚔️ '}
              {tab === 'insights' && '💡 '}
              {t(`commanders.tabs.${tab}`)}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-4">
        {activeTab === 'commanders' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topCommanders.slice(0, 30).map((node, i) => (
              <CommanderCard key={node.name} node={node} index={i} t={t} />
            ))}
          </div>
        )}

        {activeTab === 'collaborations' && (
          <div className="space-y-3">
            <h2 className={`text-base font-semibold ${COMMANDERS_COLORS.section.title}`}>
              🤝 {t('commanders.topCollaborations') || '最佳搭档'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {topCollaborations.map((collab, i) => (
                <div
                  key={`${collab.commander1}-${collab.commander2}`}
                  className={`rounded-xl border p-4 ${COMMANDERS_COLORS.collaborationCard.bg} ${COMMANDERS_COLORS.collaborationCard.border}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900 text-xs font-bold text-green-600 dark:text-green-400">
                        {i + 1}
                      </span>
                      <span className={`font-semibold ${COMMANDERS_COLORS.collaborationCard.name}`}>
                        👤 {collab.commander1}
                      </span>
                      <span className={COMMANDERS_COLORS.vs}>+</span>
                      <span className={`font-semibold ${COMMANDERS_COLORS.collaborationCard.name}`}>
                        👤 {collab.commander2}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${COMMANDERS_COLORS.collaborationCard.badge}`}>
                      {t('commanders.battleCount', { count: collab.battles })}
                    </span>
                  </div>
                  <div className={`text-sm ${COMMANDERS_COLORS.collaborationCard.stat}`}>
                    🤝 {t('commanders.collaborationStat', { battles: collab.battles, wins: collab.wins })}
                  </div>
                </div>
              ))}
              {topCollaborations.length === 0 && (
                <div className={`text-sm ${COMMANDERS_COLORS.commanderCard.stat}`}>
                  {t('commanders.noCollaborations') || '暂无合作数据'}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'matchups' && (
          <div className="space-y-3">
            <h2 className={`text-base font-semibold ${COMMANDERS_COLORS.section.title}`}>
              ⚔️ {t('commanders.topMatchups') || '经典对决'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {topMatchups.map((matchup, i) => (
                <div
                  key={`${matchup.commander1}-${matchup.commander2}`}
                  className={`rounded-xl border p-4 ${COMMANDERS_COLORS.matchupCard.bg} ${COMMANDERS_COLORS.matchupCard.border}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900 text-xs font-bold text-red-600 dark:text-red-400">
                        {i + 1}
                      </span>
                      <span className={`font-semibold ${COMMANDERS_COLORS.matchupCard.name}`}>
                        👤 {matchup.commander1}
                      </span>
                      <span className={COMMANDERS_COLORS.vs}>vs</span>
                      <span className={`font-semibold ${COMMANDERS_COLORS.matchupCard.name}`}>
                        👤 {matchup.commander2}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${COMMANDERS_COLORS.matchupCard.badge}`}>
                      {t('commanders.battleCount', { count: matchup.battles })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      {matchup.commander1Wins} {t('commanders.wins')}
                    </span>
                    <span className={COMMANDERS_COLORS.vs}>—</span>
                    <span className="text-red-600 dark:text-red-400 font-medium">
                      {matchup.commander2Wins} {t('commanders.wins')}
                    </span>
                    {matchup.draws > 0 && (
                      <>
                        <span className={COMMANDERS_COLORS.vs}>·</span>
                        <span className={COMMANDERS_COLORS.matchupCard.stat}>
                          {matchup.draws} {t('commanders.draws')}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {topMatchups.length === 0 && (
                <div className={`text-sm ${COMMANDERS_COLORS.commanderCard.stat}`}>
                  {t('commanders.noMatchups') || '暂无对决数据'}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-3">
            <h2 className={`text-base font-semibold ${COMMANDERS_COLORS.section.title}`}>
              💡 {t('commanders.insights') || '指挥官洞察'}
            </h2>
            {insights.length > 0 ? (
              <div className="space-y-2">
                {insights.map((insight, i) => (
                  <div
                    key={i}
                    className={`rounded-xl border p-4 ${COMMANDERS_COLORS.collaborationCard.bg} ${COMMANDERS_COLORS.collaborationCard.border}`}
                  >
                    <div className={`text-sm ${COMMANDERS_COLORS.commanderCard.name}`}>{insight}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`text-sm ${COMMANDERS_COLORS.commanderCard.stat}`}>
                {t('commanders.noInsights') || '暂无洞察数据'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
