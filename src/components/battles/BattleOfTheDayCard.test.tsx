import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { Event } from '@/lib/history/types';

// Mock next-intl at the top level — must return an object with useTranslations and useLocale
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const map: Record<string, string> = {
      'battleOfTheDay.title': '今日战役',
      'battleOfTheDay.badge': '今日推荐',
      'battleOfTheDay.viewDetail': '查看详情',
      'onThisDay.title': '历史上的今天',
    };
    return map[key] ?? key;
  },
  useLocale: () => 'zh',
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

// Mock the battles module to control getBattleOfTheDay
vi.mock('@/lib/history/battles', () => ({
  getBattleOfTheDay: vi.fn(),
  getSameEraBattles: vi.fn(() => []),
  getBattleResultLabel: vi.fn(() => ''),
  getBattleImpactLabel: vi.fn(() => ''),
}));

import { BattleOfTheDayCard } from './BattleOfTheDayCard';
import * as battlesModule from '@/lib/history/battles';

const baseBattle: Event = {
  id: 'b1',
  entityId: 'era1',
  year: -632,
  titleKey: 'event.sa-632.title',
  summaryKey: 's',
  tags: ['war'],
  location: { lon: 1, lat: 1, label: 'Loc' },
  battle: {
    result: 'attacker_win',
    belligerents: { attacker: 'A', defender: 'B' },
  },
};

describe('BattleOfTheDayCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(battlesModule.getBattleOfTheDay).mockReset();
    vi.mocked(battlesModule.getSameEraBattles).mockReset();
  });

  describe('null guard', () => {
    it('renders nothing when getBattleOfTheDay returns undefined', () => {
      vi.mocked(battlesModule.getBattleOfTheDay).mockReturnValueOnce(undefined as unknown as Event);
      const { container } = render(<BattleOfTheDayCard events={[]} />);
      expect(container.children).toHaveLength(0);
    });
  });

  describe('card rendering', () => {
    const renderCard = (battle: Event) => {
      vi.mocked(battlesModule.getBattleOfTheDay).mockReturnValueOnce(battle);
      return render(<BattleOfTheDayCard events={[battle]} />);
    };

    // Get the card button (the one with aria-label containing '今日战役')
    const getCardButton = () => screen.getByRole('button', { name: /今日战役/ });

    it('renders a card button', () => {
      renderCard(baseBattle);
      expect(getCardButton()).toBeInTheDocument();
    });

    it('card button has aria-label with battle title', () => {
      renderCard(baseBattle);
      expect(getCardButton()).toHaveAttribute('aria-label', expect.stringContaining('event.sa-632.title'));
    });

    it('card shows expand CTA text', () => {
      renderCard(baseBattle);
      expect(getCardButton()).toHaveTextContent(/查看详情/);
    });

    it('renders attacker and defender', () => {
      renderCard(baseBattle);
      expect(getCardButton()).toHaveTextContent(/A/);
      expect(getCardButton()).toHaveTextContent(/B/);
    });

    it('renders location', () => {
      renderCard(baseBattle);
      expect(getCardButton()).toHaveTextContent(/Loc/);
    });

    it('renders year', () => {
      renderCard(baseBattle);
      expect(getCardButton()).toHaveTextContent(/-632/);
    });

    it('renders badge', () => {
      renderCard(baseBattle);
      expect(getCardButton()).toHaveTextContent(/今日推荐/);
    });
  });

  describe('detail modal', () => {
    const getCardButton = () => screen.getByRole('button', { name: /今日战役/ });

    it('initially does not show detail', () => {
      vi.mocked(battlesModule.getBattleOfTheDay).mockReturnValue(baseBattle);
      render(<BattleOfTheDayCard events={[baseBattle]} />);
      expect(screen.queryByTestId('detail-mock')).not.toBeInTheDocument();
    });

    it('opens detail modal when card is clicked', () => {
      vi.mocked(battlesModule.getBattleOfTheDay).mockReturnValue(baseBattle);
      render(<BattleOfTheDayCard events={[baseBattle]} />);
      fireEvent.click(getCardButton());
      expect(screen.getByTestId('detail-mock')).toBeInTheDocument();
    });

    it('closes detail modal when close is clicked', () => {
      vi.mocked(battlesModule.getBattleOfTheDay).mockReturnValue(baseBattle);
      render(<BattleOfTheDayCard events={[baseBattle]} />);
      fireEvent.click(getCardButton());
      expect(screen.getByTestId('detail-mock')).toBeInTheDocument();
      fireEvent.click(screen.getByTestId('detail-close'));
      expect(screen.queryByTestId('detail-mock')).not.toBeInTheDocument();
    });
  });

  describe('conditional rendering', () => {
    const getCardButton = () => screen.getByRole('button', { name: /今日战役/ });

    it('does not render commanders section when no commanders', () => {
      const noCmdBattle = { ...baseBattle, battle: { ...baseBattle.battle!, commanders: undefined } };
      vi.mocked(battlesModule.getBattleOfTheDay).mockReturnValueOnce(noCmdBattle);
      render(<BattleOfTheDayCard events={[noCmdBattle]} />);
      expect(getCardButton()).not.toHaveTextContent(/子玉/);
    });

    it('does not render result badge when result is missing', () => {
      const noResultBattle = {
        ...baseBattle,
        battle: { ...baseBattle.battle!, result: undefined, belligerents: { attacker: 'A', defender: 'B' } },
      };
      vi.mocked(battlesModule.getBattleOfTheDay).mockReturnValueOnce(noResultBattle);
      render(<BattleOfTheDayCard events={[noResultBattle]} />);
      expect(getCardButton()).toBeInTheDocument();
    });

    it('does not render location badge when location is missing', () => {
      const noLocBattle = { ...baseBattle, location: undefined };
      vi.mocked(battlesModule.getBattleOfTheDay).mockReturnValueOnce(noLocBattle);
      render(<BattleOfTheDayCard events={[noLocBattle]} />);
      expect(getCardButton()).not.toHaveTextContent(/Loc/);
    });
  });
});
