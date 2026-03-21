/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { Event } from '@/lib/history/types';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const map: Record<string, string> = {
      'battleDetail.close': '关闭',
      'battleDetail.result': '结果：',
      'battleDetail.belligerents': '交战方',
      'battleDetail.attacker': '进攻方',
      'battleDetail.defender': '防守方',
      'battleDetail.summary': '概要',
      'battleDetail.location': '地点',
      'battleDetail.commanders': '指挥官',
      'battleDetail.unknown': '不详',
      'battleDetail.impact': '影响：',
      'battleDetail.strategy': '战略',
      'battleDetail.terrain': '地形',
      'battleDetail.battleType': '类型',
      'battleDetail.pacing': '节奏：',
      'battleDetail.timeOfDay': '时间：',
      'battleDetail.turningPoints': '关键转折点',
      'battleDetail.sources': '参考资料',
      'battleDetail.similarBattles': '相似战役',
      'battleDetail.similarBattlesDesc': '你可能还感兴趣的战役',
      'battleDetail.similarBattleItem': '查看',
      'battleDetail.noSimilarBattles': '暂无相似战役',
      'battleDetail.attackerWin': '进攻方胜利',
      'battleDetail.defenderWin': '防守方胜利',
      'battleDetail.unknown': '未知',
      'battles.changping': '长平之战',
      'battles.feiji': '肥之战',
      'battles.gaixia': '垓下之战',
      'battles.xiang': '项羽',
      'battles.liu': '刘邦',
    };
    return map[key] ?? key;
  },
}));

// Mock useEscapeKey
vi.mock('@/lib/history/useBattleHooks', () => ({
  useEscapeKey: vi.fn(),
}));

// Mock findSimilarBattles
const mockFindSimilarBattles = vi.fn();
vi.mock('@/lib/history/battleComparison', () => ({
  findSimilarBattles: (...args: any[]) => mockFindSimilarBattles(...args),
}));

// Mock battle helpers
vi.mock('@/lib/history/battles', () => ({
  getBattleResultLabel: vi.fn(() => '进攻方胜利'),
  getBattleImpactLabel: vi.fn(() => '决定性'),
  getBattleTypeName: vi.fn(() => '征服'),
}));

vi.mock('@/lib/history/battlePacing', () => ({
  getPacingLabel: vi.fn(() => '快节奏'),
  getTimeOfDayLabel: vi.fn(() => '白天'),
}));

import { BattleDetail } from './BattleDetail';

const createMockBattle = (overrides: Partial<Event> = {}): Event => ({
  id: 'battle-1',
  entityId: 'qin-zhao',
  year: -260,
  month: 7,
  titleKey: 'battles.changping',
  summaryKey: 'battles.changping.summary',
  tags: ['war'],
  location: { lon: 113.5, lat: 35.5, label: '长平' },
  battle: {
    belligerents: { attacker: '秦国', defender: '赵国' },
    result: 'attacker_win',
    battleType: 'conquest',
    scale: 'massive',
    impact: 'decisive',
    commanders: { attacker: ['白起'], defender: ['赵括'] },
  },
  ...overrides,
});

describe('BattleDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFindSimilarBattles.mockReset();
  });

  const mockOnClose = vi.fn();

  describe('similar battles feature', () => {
    it('does not render similar battles section when allEvents is not provided', () => {
      mockFindSimilarBattles.mockReturnValue([]);
      const battle = createMockBattle();
      render(<BattleDetail battle={battle} onClose={mockOnClose} />);
      expect(screen.queryByText(/相似战役/)).not.toBeInTheDocument();
    });

    it('does not render similar battles section when allEvents is empty', () => {
      mockFindSimilarBattles.mockReturnValue([]);
      const battle = createMockBattle();
      render(<BattleDetail battle={battle} onClose={mockOnClose} allEvents={[]} />);
      expect(screen.queryByText(/相似战役/)).not.toBeInTheDocument();
    });

    it('renders similar battles heading when results are found', () => {
      const similarBattle1 = createMockBattle({ id: 'similar-1', titleKey: 'battles.feiji', year: -257 });
      const similarBattle2 = createMockBattle({ id: 'similar-2', titleKey: 'battles.gaixia', year: -202 });
      mockFindSimilarBattles.mockReturnValue([
        { battle: similarBattle1, similarity: 0.85 },
        { battle: similarBattle2, similarity: 0.42 },
      ]);

      const battle = createMockBattle();
      render(<BattleDetail battle={battle} onClose={mockOnClose} allEvents={[battle, similarBattle1, similarBattle2]} />);

      // The heading contains the emoji prefix + text
      expect(screen.getByRole('heading', { name: /相似战役/ })).toBeInTheDocument();
    });

    it('renders similar battle rows with title, year, and location', () => {
      const similarBattle = createMockBattle({
        id: 'similar-1',
        titleKey: 'battles.feiji',
        year: -257,
        location: { lon: 115, lat: 36, label: '肥' },
      });
      mockFindSimilarBattles.mockReturnValue([
        { battle: similarBattle, similarity: 0.75 },
      ]);

      const battle = createMockBattle();
      render(<BattleDetail battle={battle} onClose={mockOnClose} allEvents={[battle, similarBattle]} />);

      // Title (rendered with ⚔️ prefix)
      expect(screen.getByText(/肥之战/)).toBeInTheDocument();
      // Year - formatYear(-257) = "257 BCE"
      expect(screen.getByText(/257 BCE/)).toBeInTheDocument();
      // Location label appears as a distinct span
      const locationSpans = screen.getAllByText(/肥/);
      expect(locationSpans.length).toBeGreaterThanOrEqual(1);
    });

    it('renders similarity percentage badge', () => {
      const similarBattle = createMockBattle({ id: 'similar-1', titleKey: 'battles.feiji' });
      mockFindSimilarBattles.mockReturnValue([
        { battle: similarBattle, similarity: 0.758 },
      ]);

      const battle = createMockBattle();
      render(<BattleDetail battle={battle} onClose={mockOnClose} allEvents={[battle, similarBattle]} />);

      // 75.8% rounded → 76%
      expect(screen.getByText('76%')).toBeInTheDocument();
    });

    it('renders high similarity badge in green when >= 70%', () => {
      const similarBattle = createMockBattle({ id: 'similar-1', titleKey: 'battles.feiji' });
      mockFindSimilarBattles.mockReturnValue([
        { battle: similarBattle, similarity: 0.72 },
      ]);

      const battle = createMockBattle();
      const { container } = render(<BattleDetail battle={battle} onClose={mockOnClose} allEvents={[battle, similarBattle]} />);

      // The badge span should have green background class
      const badge = container.querySelector('span[class*="bg-green"]');
      expect(badge).toBeInTheDocument();
    });

    it('renders medium similarity badge when >= 40% and < 70%', () => {
      const similarBattle = createMockBattle({ id: 'similar-1', titleKey: 'battles.feiji' });
      mockFindSimilarBattles.mockReturnValue([
        { battle: similarBattle, similarity: 0.55 },
      ]);

      const battle = createMockBattle();
      const { container } = render(<BattleDetail battle={battle} onClose={mockOnClose} allEvents={[battle, similarBattle]} />);

      const badge = container.querySelector('span[class*="bg-zinc"]');
      expect(badge).toBeInTheDocument();
    });

    it('renders result label for similar battle', () => {
      const similarBattle = createMockBattle({
        id: 'similar-1',
        titleKey: 'battles.feiji',
        battle: {
          ...createMockBattle().battle!,
          result: 'attacker_win',
          belligerents: { attacker: '秦', defender: '赵' },
        },
      });
      mockFindSimilarBattles.mockReturnValue([
        { battle: similarBattle, similarity: 0.75 },
      ]);

      const battle = createMockBattle();
      render(<BattleDetail battle={battle} onClose={mockOnClose} allEvents={[battle, similarBattle]} />);

      // Both the main result badge and the similar battle row show "进攻方胜利"
      // Use getAllByText since there may be multiple
      const resultLabels = screen.getAllByText('进攻方胜利');
      expect(resultLabels.length).toBeGreaterThanOrEqual(1);
    });

    it('calls findSimilarBattles with correct arguments', () => {
      mockFindSimilarBattles.mockReturnValue([]);
      const battle = createMockBattle({ id: 'target-battle' });
      const allEvents = [battle, createMockBattle({ id: 'other-1' }), createMockBattle({ id: 'other-2' })];

      render(<BattleDetail battle={battle} onClose={mockOnClose} allEvents={allEvents} />);

      expect(mockFindSimilarBattles).toHaveBeenCalledWith(battle, allEvents, 3);
    });

    it('calls onBattleClick when a similar battle is clicked', () => {
      const similarBattle = createMockBattle({
        id: 'similar-1',
        titleKey: 'battles.feiji',
        battle: {
          ...createMockBattle().battle!,
          result: 'attacker_win',
          belligerents: { attacker: '秦', defender: '赵' },
        },
      });
      mockFindSimilarBattles.mockReturnValue([
        { battle: similarBattle, similarity: 0.8 },
      ]);

      const onBattleClick = vi.fn();
      const battle = createMockBattle();
      render(
        <BattleDetail
          battle={battle}
          onClose={mockOnClose}
          allEvents={[battle, similarBattle]}
          onBattleClick={onBattleClick}
        />
      );

      // Find the similar battle row (it has role="button" and contains the translated title)
      const buttons = screen.getAllByRole('button');
      const similarBattleRow = buttons.find(btn => btn.textContent?.includes('肥之战'));
      expect(similarBattleRow).toBeDefined();

      fireEvent.click(similarBattleRow!);
      expect(onBattleClick).toHaveBeenCalledWith(similarBattle);
    });

    it('calls onBattleClick when a similar battle is activated via keyboard (Enter)', () => {
      const similarBattle = createMockBattle({
        id: 'similar-1',
        titleKey: 'battles.feiji',
        battle: {
          ...createMockBattle().battle!,
          result: 'attacker_win',
          belligerents: { attacker: '秦', defender: '赵' },
        },
      });
      mockFindSimilarBattles.mockReturnValue([
        { battle: similarBattle, similarity: 0.8 },
      ]);

      const onBattleClick = vi.fn();
      const battle = createMockBattle();
      render(
        <BattleDetail
          battle={battle}
          onClose={mockOnClose}
          allEvents={[battle, similarBattle]}
          onBattleClick={onBattleClick}
        />
      );

      const buttons = screen.getAllByRole('button');
      const similarBattleRow = buttons.find(btn => btn.textContent?.includes('肥之战'));
      expect(similarBattleRow).toBeDefined();

      fireEvent.keyDown(similarBattleRow!, { key: 'Enter' });
      expect(onBattleClick).toHaveBeenCalledWith(similarBattle);
    });

    it('calls onBattleClick when a similar battle is activated via keyboard (Space)', () => {
      const similarBattle = createMockBattle({
        id: 'similar-1',
        titleKey: 'battles.feiji',
        battle: {
          ...createMockBattle().battle!,
          result: 'attacker_win',
          belligerents: { attacker: '秦', defender: '赵' },
        },
      });
      mockFindSimilarBattles.mockReturnValue([
        { battle: similarBattle, similarity: 0.8 },
      ]);

      const onBattleClick = vi.fn();
      const battle = createMockBattle();
      render(
        <BattleDetail
          battle={battle}
          onClose={mockOnClose}
          allEvents={[battle, similarBattle]}
          onBattleClick={onBattleClick}
        />
      );

      const buttons = screen.getAllByRole('button');
      const similarBattleRow = buttons.find(btn => btn.textContent?.includes('肥之战'));
      expect(similarBattleRow).toBeDefined();

      fireEvent.keyDown(similarBattleRow!, { key: ' ' });
      expect(onBattleClick).toHaveBeenCalledWith(similarBattle);
    });

    it('shows "no similar battles" message when allEvents has multiple battles but none are similar', () => {
      mockFindSimilarBattles.mockReturnValue([]);

      const battle = createMockBattle({ id: 'target' });
      const otherBattle = createMockBattle({ id: 'other', year: -500, titleKey: 'battles.xiang' });

      render(<BattleDetail battle={battle} onClose={mockOnClose} allEvents={[battle, otherBattle]} />);

      expect(screen.getByText('暂无相似战役')).toBeInTheDocument();
    });

    it('does not show "no similar battles" message when allEvents has only the target battle', () => {
      mockFindSimilarBattles.mockReturnValue([]);

      const battle = createMockBattle({ id: 'target' });
      render(<BattleDetail battle={battle} onClose={mockOnClose} allEvents={[battle]} />);

      expect(screen.queryByText('暂无相似战役')).not.toBeInTheDocument();
    });

    it('renders "View" label for each similar battle', () => {
      const similarBattle = createMockBattle({ id: 'similar-1', titleKey: 'battles.feiji' });
      mockFindSimilarBattles.mockReturnValue([
        { battle: similarBattle, similarity: 0.8 },
      ]);

      const battle = createMockBattle();
      render(<BattleDetail battle={battle} onClose={mockOnClose} allEvents={[battle, similarBattle]} />);

      expect(screen.getByText(/查看/)).toBeInTheDocument();
    });
  });

  describe('basic rendering', () => {
    it('renders battle title via i18n', () => {
      mockFindSimilarBattles.mockReturnValue([]);
      // next-intl mock maps 'battles.changping' → '长平之战'
      const battle = createMockBattle({ titleKey: 'battles.changping' });
      render(<BattleDetail battle={battle} onClose={mockOnClose} />);
      expect(screen.getByText('长平之战')).toBeInTheDocument();
    });

    it('renders close button with aria-label', () => {
      mockFindSimilarBattles.mockReturnValue([]);
      const battle = createMockBattle();
      render(<BattleDetail battle={battle} onClose={mockOnClose} />);
      expect(screen.getByRole('button', { name: /关闭/ })).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
      mockFindSimilarBattles.mockReturnValue([]);
      const battle = createMockBattle();
      render(<BattleDetail battle={battle} onClose={mockOnClose} />);
      fireEvent.click(screen.getByRole('button', { name: /关闭/ }));
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('renders result badge', () => {
      mockFindSimilarBattles.mockReturnValue([]);
      const battle = createMockBattle();
      render(<BattleDetail battle={battle} onClose={mockOnClose} />);
      expect(screen.getByText('结果：')).toBeInTheDocument();
    });

    it('renders dialog role', () => {
      mockFindSimilarBattles.mockReturnValue([]);
      const battle = createMockBattle();
      render(<BattleDetail battle={battle} onClose={mockOnClose} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });
});
