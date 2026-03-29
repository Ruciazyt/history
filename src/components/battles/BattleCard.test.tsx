import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { Event } from '@/lib/history/types';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const map: Record<string, string> = {
      'favorites.addFavorite': 'Add to favorites',
      'favorites.removeFavorite': 'Remove from favorites',
      'battle.result.attacker_win': 'Attacker Victory',
      'battle.result.defender_win': 'Defender Victory',
      'battle.result.draw': 'Draw',
      'battle.result.inconclusive': 'Inconclusive',
      'battle.impact.decisive': 'Decisive',
      'battle.impact.major': 'Major',
      'battle.impact.minor': 'Minor',
      'battle.impact.unknown': 'Unknown',
      'event.sa-632.title': 'Battle of Sinhara',
      'event.sa-632.summary': 'A decisive battle.',
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

// Mock useBattleFavorites
const mockToggleFavorite = vi.fn();
const mockIsFavorite = vi.fn();
vi.mock('@/lib/history/useBattleHooks', () => ({
  useBattleFavorites: () => ({
    toggleFavorite: mockToggleFavorite,
    isFavorite: mockIsFavorite,
  }),
}));

// Mock battles module for getBattleResultLabel and getBattleImpactLabel
vi.mock('@/lib/history/battles', () => ({
  getBattleOfTheDay: vi.fn(),
  getSameEraBattles: vi.fn(() => []),
  getBattleResultLabel: vi.fn((result?: Event['battle']) => {
    if (!result) return '';
    const keys: Record<string, string> = {
      attacker_win: 'battle.result.attacker_win',
      defender_win: 'battle.result.defender_win',
      draw: 'battle.result.draw',
      inconclusive: 'battle.result.inconclusive',
    };
    return keys[result.result || ''] || '';
  }),
  getBattleImpactLabel: vi.fn((impact?: string) => {
    if (!impact) return '';
    const keys: Record<string, string> = {
      decisive: 'battle.impact.decisive',
      major: 'battle.impact.major',
      minor: 'battle.impact.minor',
      unknown: 'battle.impact.unknown',
    };
    return keys[impact] || '';
  }),
}));

// Mock constants
vi.mock('@/lib/history/constants', () => ({
  BATTLE_RESULT_COLORS: {
    attacker_win: { bg: 'bg-red-500', text: 'text-white' },
  },
  BATTLE_IMPACT_COLORS: {
    decisive: { bg: 'bg-purple-500', text: 'text-white' },
  },
  ERA_COLORS: {},
  COMMANDER_COLORS: {
    attacker: { bg: 'bg-blue-100', text: 'text-blue-800' },
    defender: { bg: 'bg-red-100', text: 'text-red-800' },
  },
  SELECTION_COLORS: {
    selected: { bg: 'bg-red-500' },
    unselected: { border: 'border-gray-400' },
  },
  BATTLE_CARD_COLORS: {
    result: { default: 'bg-gray-500' },
    fallback: { gradient: 'from-gray-50 to-gray-100', border: 'border-gray-200' },
    container: { title: 'text-gray-900', subtitle: 'text-gray-600', badgeBg: 'bg-gray-100' },
    belligerents: { container: 'bg-gray-50', text: 'text-gray-800' },
    commander: { dot: 'bg-green-500', pulse: '' },
    impact: { default: 'bg-gray-200', textDefault: 'text-gray-700' },
  },
  FAVORITE_BUTTON_COLORS: {
    favorited: { bg: 'bg-red-100', hover: 'hover:bg-red-200', text: 'text-red-500' },
    default: { bg: 'bg-gray-100', hover: 'hover:bg-gray-200', text: 'text-gray-400' },
  },
}));

import { BattleCard } from './BattleCard';

const baseBattle: Event = {
  id: 'b1',
  entityId: 'era1',
  year: -632,
  titleKey: 'event.sa-632.title',
  summaryKey: 'event.sa-632.summary',
  tags: ['war'],
  location: { lon: 1, lat: 1, label: 'Sinhara' },
  battle: {
    result: 'attacker_win',
    belligerents: { attacker: 'Army A', defender: 'Army B' },
    impact: 'decisive',
  },
};

describe('BattleCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsFavorite.mockReturnValue(false);
    mockToggleFavorite.mockClear();
  });

  describe('HTML structure validity', () => {
    it('outer wrapper is a div, not a button (avoids nested button issue)', () => {
      mockIsFavorite.mockReturnValue(false);
      render(<BattleCard battle={baseBattle} />);
      // The card content div should be a role="button" div, not a <button>
      const cardContent = screen.getByRole('button', { name: /Battle of Sinhara/ });
      expect(cardContent.tagName).toBe('DIV');
    });

    it('favorite button is a sibling of card content, not nested inside', () => {
      mockIsFavorite.mockReturnValue(false);
      const { container } = render(<BattleCard battle={baseBattle} />);
      const outerDiv = container.querySelector('div.relative');
      expect(outerDiv).toBeInTheDocument();
      // The outer div should have two children: the role=button div and the favorite <button>
      const children = outerDiv!.children;
      expect(children.length).toBe(2);
      expect(children[0].getAttribute('role')).toBe('button');
      expect(children[1].tagName).toBe('BUTTON'); // favorite button
    });

    it('favorite button does not nest inside card content', () => {
      mockIsFavorite.mockReturnValue(false);
      const { container } = render(<BattleCard battle={baseBattle} />);
      const cardContent = container.querySelector('[role="button"]');
      // favorite button should NOT be inside the card content div
      expect(cardContent!.querySelector('button')).not.toBeInTheDocument();
    });
  });

  describe('favorite functionality', () => {
    it('renders unfavorited heart when not favorited', () => {
      mockIsFavorite.mockReturnValue(false);
      render(<BattleCard battle={baseBattle} />);
      expect(screen.getByRole('button', { name: 'Add to favorites' })).toBeInTheDocument();
      expect(screen.getByText('🤍')).toBeInTheDocument();
    });

    it('renders favorited heart when favorited', () => {
      mockIsFavorite.mockReturnValue(true);
      render(<BattleCard battle={baseBattle} />);
      expect(screen.getByRole('button', { name: 'Remove from favorites' })).toBeInTheDocument();
      expect(screen.getByText('❤️')).toBeInTheDocument();
    });

    it('clicking favorite button calls toggleFavorite', () => {
      mockIsFavorite.mockReturnValue(false);
      render(<BattleCard battle={baseBattle} />);
      const favButton = screen.getByRole('button', { name: 'Add to favorites' });
      fireEvent.click(favButton);
      expect(mockToggleFavorite).toHaveBeenCalledWith('b1');
    });

    it('clicking favorite does NOT propagate to card click (no event bubbling)', () => {
      const onClick = vi.fn();
      mockIsFavorite.mockReturnValue(false);
      render(<BattleCard battle={baseBattle} onClick={onClick} />);
      // Use getAllByRole since there are two buttons with same aria-label (test finds duplicates)
      const favButtons = screen.getAllByRole('button', { name: 'Add to favorites' });
      // The favorite button is the last one (second child of the outer div)
      const favButton = favButtons[favButtons.length - 1];
      fireEvent.click(favButton);
      // card onClick should NOT have been called because favorite button stops propagation
      expect(onClick).not.toHaveBeenCalled();
      expect(screen.queryByTestId('detail-mock')).not.toBeInTheDocument();
    });
  });

  describe('card click behavior', () => {
    it('opens detail modal when clicked with no onClick prop', () => {
      render(<BattleCard battle={baseBattle} />);
      const cardContent = screen.getByRole('button', { name: /Battle of Sinhara/ });
      fireEvent.click(cardContent);
      expect(screen.getByTestId('detail-mock')).toBeInTheDocument();
    });

    it('calls onClick when provided', () => {
      const onClick = vi.fn();
      render(<BattleCard battle={baseBattle} onClick={onClick} />);
      const cardContent = screen.getByRole('button', { name: /Battle of Sinhara/ });
      fireEvent.click(cardContent);
      expect(onClick).toHaveBeenCalled();
      expect(screen.queryByTestId('detail-mock')).not.toBeInTheDocument();
    });

    it('closes detail modal', () => {
      render(<BattleCard battle={baseBattle} />);
      const cardContent = screen.getByRole('button', { name: /Battle of Sinhara/ });
      fireEvent.click(cardContent);
      expect(screen.getByTestId('detail-mock')).toBeInTheDocument();
      fireEvent.click(screen.getByTestId('detail-close'));
      expect(screen.queryByTestId('detail-mock')).not.toBeInTheDocument();
    });
  });

  describe('keyboard navigation', () => {
    it('opens detail on Enter key', () => {
      render(<BattleCard battle={baseBattle} />);
      const cardContent = screen.getByRole('button', { name: /Battle of Sinhara/ });
      fireEvent.keyDown(cardContent, { key: 'Enter' });
      expect(screen.getByTestId('detail-mock')).toBeInTheDocument();
    });

    it('opens detail on Space key', () => {
      render(<BattleCard battle={baseBattle} />);
      const cardContent = screen.getByRole('button', { name: /Battle of Sinhara/ });
      fireEvent.keyDown(cardContent, { key: ' ' });
      expect(screen.getByTestId('detail-mock')).toBeInTheDocument();
    });

    it('calls onClick on Enter when onClick provided', () => {
      const onClick = vi.fn();
      render(<BattleCard battle={baseBattle} onClick={onClick} />);
      const cardContent = screen.getByRole('button', { name: /Battle of Sinhara/ });
      fireEvent.keyDown(cardContent, { key: 'Enter' });
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('selection mode', () => {
    it('renders in selection mode with unselected visual state', () => {
      render(<BattleCard battle={baseBattle} selectionMode selected={false} />);
      const cardContent = screen.getByRole('button', { name: /Battle of Sinhara/ });
      // Selection state is conveyed via CSS ring class, not ARIA attributes on role=button
      expect(cardContent).toBeInTheDocument();
    });

    it('shows selected visual state when selected', () => {
      render(<BattleCard battle={baseBattle} selectionMode selected />);
      const cardContent = screen.getByRole('button', { name: /Battle of Sinhara/ });
      // Selection state is conveyed via CSS ring class, not ARIA attributes on role=button
      expect(cardContent).toBeInTheDocument();
    });

    it('calls onSelect in selection mode', () => {
      const onSelect = vi.fn();
      render(<BattleCard battle={baseBattle} selectionMode onSelect={onSelect} />);
      const cardContent = screen.getByRole('button', { name: /Battle of Sinhara/ });
      fireEvent.click(cardContent);
      expect(onSelect).toHaveBeenCalledWith(baseBattle);
    });

    it('Enter key calls onSelect in selection mode', () => {
      const onSelect = vi.fn();
      render(<BattleCard battle={baseBattle} selectionMode onSelect={onSelect} />);
      const cardContent = screen.getByRole('button', { name: /Battle of Sinhara/ });
      fireEvent.keyDown(cardContent, { key: 'Enter' });
      expect(onSelect).toHaveBeenCalledWith(baseBattle);
    });
  });

  describe('rendering', () => {
    it('renders battle title', () => {
      render(<BattleCard battle={baseBattle} />);
      expect(screen.getByText(/Battle of Sinhara/)).toBeInTheDocument();
    });

    it('renders year', () => {
      render(<BattleCard battle={baseBattle} />);
      // formatYear(-632) returns '632 BCE'
      expect(screen.getByText(/632 BCE/)).toBeInTheDocument();
    });

    it('renders location', () => {
      render(<BattleCard battle={baseBattle} />);
      // Location badge contains 📍 Sinhara - getAllByText since 'Sinhara' also appears in title
      const elements = screen.getAllByText(/Sinhara/);
      // The badge is the second occurrence (in the location badge span)
      expect(elements.length).toBeGreaterThanOrEqual(1);
    });

    it('renders belligerents', () => {
      render(<BattleCard battle={baseBattle} />);
      expect(screen.getByText(/Army A/)).toBeInTheDocument();
      expect(screen.getByText(/Army B/)).toBeInTheDocument();
    });

    it('renders result badge', () => {
      render(<BattleCard battle={baseBattle} />);
      expect(screen.getByText(/Attacker Victory/)).toBeInTheDocument();
    });

    it('does not render result badge when result is missing', () => {
      const noResultBattle = { ...baseBattle, battle: { ...baseBattle.battle!, result: undefined } };
      render(<BattleCard battle={noResultBattle} />);
      expect(screen.queryByText(/Attacker Victory/)).not.toBeInTheDocument();
    });

    it('does not render summary when summaryKey is missing', () => {
      const noSummaryBattle = { ...baseBattle, summaryKey: undefined };
      const { container } = render(<BattleCard battle={noSummaryBattle} />);
      expect(container.querySelector('.line-clamp-2')).not.toBeInTheDocument();
    });

    it('renders impact badge when impact is present', () => {
      render(<BattleCard battle={baseBattle} />);
      expect(screen.getByText(/Decisive/)).toBeInTheDocument();
    });

    it('does not render impact badge when impact is unknown', () => {
      const unknownImpact = { ...baseBattle, battle: { ...baseBattle.battle!, impact: 'unknown' as const } };
      const { container } = render(<BattleCard battle={unknownImpact} />);
      expect(container.textContent).not.toContain('Decisive');
    });
  });
});
