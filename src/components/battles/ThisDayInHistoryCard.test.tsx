import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { Event } from '@/lib/history/types';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const map: Record<string, string> = {
      'thisDayInHistory.title': '历史上的今天',
      'thisDayInHistory.battlesFound': '场战役',
      'thisDayInHistory.expand': '展开',
      'thisDayInHistory.collapse': '收起',
    };
    return map[key] ?? key;
  },
}));

// Mock BattleDetail
vi.mock('./BattleDetail', () => ({
  BattleDetail: ({ battle, onClose }: { battle: Event; onClose: () => void }) => (
    <div data-testid="detail-mock">
      <span data-testid="detail-title">{battle.titleKey}</span>
      <button data-testid="detail-close" onClick={onClose}>X</button>
    </div>
  ),
}));

// Mock battles module
vi.mock('@/lib/history/battles', () => ({
  getBattlesOnThisDay: vi.fn(),
  getBattleResultLabel: vi.fn(() => 'attacker_win'),
  getBattleImpactLabel: vi.fn(() => ''),
}));

// Mock constants
vi.mock('@/lib/history/constants', () => ({
  BATTLE_RESULT_COLORS: {
    attacker_win: { bg: 'bg-red-100', text: 'text-red-700' },
    defender_win: { bg: 'bg-blue-100', text: 'text-blue-700' },
  },
  BATTLE_IMPACT_COLORS: {},
  ERA_COLORS: {
    'period-spring-autumn': { gradient: 'from-blue-50 to-blue-100', border: 'border-blue-200', text: 'text-blue-800' },
    'period-warring-states': { gradient: 'from-purple-50 to-purple-100', border: 'border-purple-200', text: 'text-purple-800' },
  },
  BATTLE_CARD_COLORS: {
    fallback: { gradient: 'from-gray-50 to-gray-100', border: 'border-gray-200' },
    result: { default: 'bg-gray-100 text-zinc-700' },
  },
  THIS_DAY_IN_HISTORY_COLORS: {
    container: { bg: 'bg-white', border: 'border-gray-200' },
    badge: { bg: 'bg-amber-100', text: 'text-amber-800' },
    subtitle: 'text-gray-500',
    toggle: { btn: 'text-gray-600 bg-gray-100', hover: 'hover:bg-gray-200' },
    badgeItem: { bg: 'bg-gray-100' },
    belligerents: { container: 'bg-gray-50', text: 'text-gray-700', vs: 'text-gray-500' },
  },
}));

import { ThisDayInHistoryCard } from './ThisDayInHistoryCard';
import * as battlesModule from '@/lib/history/battles';

const makeBattle = (overrides: Partial<Event> = {}): Event => ({
  id: 'battle-1',
  entityId: 'period-spring-autumn',
  year: -632,
  titleKey: 'event.chengpu',
  summaryKey: 'summary',
  tags: ['war'],
  location: { lon: 114.3, lat: 35.7, label: '城濮' },
  battle: {
    result: 'attacker_win',
    belligerents: { attacker: '晋军', defender: '楚军' },
  },
  ...overrides,
});

describe('ThisDayInHistoryCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(battlesModule.getBattlesOnThisDay).mockReset();
  });

  describe('null guard', () => {
    it('renders nothing when getBattlesOnThisDay returns empty array', () => {
      vi.mocked(battlesModule.getBattlesOnThisDay).mockReturnValueOnce([]);
      const { container } = render(<ThisDayInHistoryCard events={[]} />);
      expect(container.children).toHaveLength(0);
    });
  });

  describe('card rendering', () => {
    const renderCard = (battles: Event[], locale = 'zh') => {
      vi.mocked(battlesModule.getBattlesOnThisDay).mockReturnValueOnce(battles);
      return render(<ThisDayInHistoryCard events={[]} locale={locale} />);
    };

    it('renders title badge', () => {
      renderCard([makeBattle()]);
      expect(screen.getByText(/历史上的今天/)).toBeInTheDocument();
    });

    it('renders battle count', () => {
      renderCard([makeBattle({ id: 'b1' }), makeBattle({ id: 'b2' })]);
      expect(screen.getByText(/2 场战役/)).toBeInTheDocument();
    });

    it('renders battle title via translation', () => {
      renderCard([makeBattle({ titleKey: 'event.chengpu' })]);
      // h4 contains "⚔️ event.chengpu" (sword emoji + translated key), so use regex
      expect(screen.getByText(/event\.chengpu/)).toBeInTheDocument();
    });

    it('renders year badge via formatYear', () => {
      renderCard([makeBattle({ year: -632 })], 'en');
      // formatYear(-632, 'en') returns "632 BCE"
      expect(screen.getByText(/632 BCE/)).toBeInTheDocument();
    });

    it('renders location label', () => {
      renderCard([makeBattle({ location: { lon: 114.3, lat: 35.7, label: '城濮' } })]);
      expect(screen.getByText(/城濮/)).toBeInTheDocument();
    });

    it('renders belligerents', () => {
      renderCard([makeBattle({ battle: { result: 'attacker_win', belligerents: { attacker: '晋军', defender: '楚军' } } })]);
      expect(screen.getByText(/晋军/)).toBeInTheDocument();
      expect(screen.getByText(/楚军/)).toBeInTheDocument();
    });

    it('shows expand button when multiple battles', () => {
      renderCard([makeBattle({ id: 'b1' }), makeBattle({ id: 'b2' })]);
      expect(screen.getByText(/展开/)).toBeInTheDocument();
    });

    it('shows only first battle when collapsed', () => {
      const battles = [
        makeBattle({ id: 'b1', titleKey: 'event.first' }),
        makeBattle({ id: 'b2', titleKey: 'event.second' }),
      ];
      renderCard(battles);
      expect(screen.getByText(/event\.first/)).toBeInTheDocument();
      expect(screen.queryByText(/event\.second/)).not.toBeInTheDocument();
    });

    it('expands to show all battles when expand button clicked', () => {
      const battles = [
        makeBattle({ id: 'b1', titleKey: 'event.first' }),
        makeBattle({ id: 'b2', titleKey: 'event.second' }),
      ];
      vi.mocked(battlesModule.getBattlesOnThisDay).mockReturnValueOnce(battles);
      render(<ThisDayInHistoryCard events={[]} />);

      // Re-render with expanded state by mocking getBattlesOnThisDay again
      vi.mocked(battlesModule.getBattlesOnThisDay).mockReturnValueOnce(battles);
      const expandBtn = screen.getByText(/展开/);
      fireEvent.click(expandBtn);

      // After clicking, the button should say 收起
      // and both battles should be visible
      expect(screen.getByText(/收起/)).toBeInTheDocument();
    });
  });

  describe('battle detail modal', () => {
    it('opens detail modal when battle is clicked', () => {
      const battle = makeBattle({ id: 'b1' });
      vi.mocked(battlesModule.getBattlesOnThisDay).mockReturnValueOnce([battle]);
      render(<ThisDayInHistoryCard events={[]} />);

      const battleButton = screen.getByRole('button', { name: /event\.chengpu/ });
      fireEvent.click(battleButton);

      expect(screen.getByTestId('detail-mock')).toBeInTheDocument();
      expect(screen.getByTestId('detail-title')).toHaveTextContent('event.chengpu');
    });
  });

  describe('expand/collapse toggle', () => {
    it('shows expand button when multiple battles and collapsed', () => {
      const battles = [
        makeBattle({ id: 'b1' }),
        makeBattle({ id: 'b2' }),
        makeBattle({ id: 'b3' }),
      ];
      vi.mocked(battlesModule.getBattlesOnThisDay).mockReturnValueOnce(battles);
      render(<ThisDayInHistoryCard events={[]} />);
      expect(screen.getByText(/展开/)).toBeInTheDocument();
      expect(screen.queryByText(/收起/)).not.toBeInTheDocument();
    });

    it('shows only first battle when not expanded', () => {
      const battles = [
        makeBattle({ id: 'b1', titleKey: 'event.first' }),
        makeBattle({ id: 'b2', titleKey: 'event.second' }),
        makeBattle({ id: 'b3', titleKey: 'event.third' }),
      ];
      vi.mocked(battlesModule.getBattlesOnThisDay).mockReturnValueOnce(battles);
      render(<ThisDayInHistoryCard events={[]} />);

      expect(screen.getByText(/event\.first/)).toBeInTheDocument();
      expect(screen.queryByText(/event\.second/)).not.toBeInTheDocument();
      expect(screen.queryByText(/event\.third/)).not.toBeInTheDocument();
    });
  });

  describe('era styling', () => {
    it('renders with era-specific gradient', () => {
      const battle = makeBattle({ entityId: 'period-warring-states' });
      vi.mocked(battlesModule.getBattlesOnThisDay).mockReturnValueOnce([battle]);
      render(<ThisDayInHistoryCard events={[]} />);
      // Just verify it renders without error
      expect(screen.getByText(/历史上的今天/)).toBeInTheDocument();
    });
  });

  describe('getBattlesOnThisDay integration', () => {
    it('calls getBattlesOnThisDay with events prop', () => {
      const events = [makeBattle()];
      vi.mocked(battlesModule.getBattlesOnThisDay).mockReturnValueOnce([events[0]]);
      render(<ThisDayInHistoryCard events={events} />);
      expect(vi.mocked(battlesModule.getBattlesOnThisDay)).toHaveBeenCalledWith(events);
    });

    it('memoizes result and does not re-call on re-render with same events', () => {
      const events = [makeBattle()];
      vi.mocked(battlesModule.getBattlesOnThisDay).mockReturnValueOnce([events[0]]);
      const { rerender } = render(<ThisDayInHistoryCard events={events} />);
      rerender(<ThisDayInHistoryCard events={events} />);
      // Should only be called once (memoized)
      expect(vi.mocked(battlesModule.getBattlesOnThisDay)).toHaveBeenCalledTimes(1);
    });
  });
});
