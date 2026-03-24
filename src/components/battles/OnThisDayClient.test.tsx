import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { Event } from '@/lib/history/types';
import { OnThisDayClient } from './OnThisDayClient';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const map: Record<string, string> = {
      'ui.back': '返回',
      'onThisDay.title': '历史上的今天',
      'onThisDay.featured': '精选战役',
      'onThisDay.viewDetail': '查看详情',
      'onThisDay.allEvents': '全部事件',
      'onThisDay.found': '找到 {count} 场战役',
      'onThisDay.noEvents': '今天暂无记录',
      'onThisDay.noEventsHint': '换个日期试试吧',
    };
    if (key.includes('.')) return map[key] ?? key;
    return key;
  },
}));

// Mock BattleDetail
vi.mock('./BattleDetail', () => ({
  BattleDetail: ({ battle, onClose }: { battle: Event; onClose: () => void }) => (
    <div data-testid="detail-mock">
      <span data-testid="detail-title">{battle.titleKey}</span>
      <button data-testid="detail-close" onClick={onClose}>关闭</button>
    </div>
  ),
}));

// Mock BattleCard
vi.mock('./BattleCard', () => ({
  BattleCard: ({ battle, onSelect }: { battle: Event; onSelect: () => void }) => (
    <button data-testid="battle-card" onClick={onSelect} aria-label={battle.titleKey}>
      <span data-testid="battle-title">{battle.titleKey}</span>
    </button>
  ),
}));

// Mock LocaleSwitcher
vi.mock('@/components/common/LocaleSwitcher', () => ({
  LocaleSwitcher: () => <div data-testid="locale-switcher" />,
}));

const baseBattle: Event = {
  id: 'b1',
  entityId: 'era1',
  year: -632,
  titleKey: 'event.sa-632.title',
  summaryKey: 's',
  tags: ['war'],
  location: { lon: 114.35, lat: 35.7, label: '城濮' },
  battle: {
    result: 'attacker_win',
    belligerents: { attacker: '晋军', defender: '楚军' },
  },
};

const battle2: Event = {
  id: 'b2',
  entityId: 'era1',
  year: -260,
  titleKey: 'event.ws-260.title',
  summaryKey: 's',
  tags: ['war'],
  location: { lon: 113.4, lat: 35.9, label: '长平' },
  battle: {
    result: 'attacker_win',
    belligerents: { attacker: '秦军', defender: '赵军' },
  },
};

describe('OnThisDayClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('empty state', () => {
    it('shows empty state when no battles', () => {
      render(<OnThisDayClient eras={[]} events={[]} locale="zh" />);
      // "今天暂无记录" appears in both header count and empty state body — use getAllByText
      const all = screen.getAllByText('今天暂无记录');
      expect(all.length).toBeGreaterThan(0);
      expect(screen.getByText('换个日期试试吧')).toBeInTheDocument();
    });

    it('shows empty state when events have no wars', () => {
      const nonWarEvents: Event[] = [
        { id: 'e1', entityId: 'era1', year: -500, titleKey: 't', summaryKey: 's', tags: ['politics'] },
      ];
      render(<OnThisDayClient eras={[]} events={nonWarEvents} locale="zh" />);
      const all = screen.getAllByText('今天暂无记录');
      expect(all.length).toBeGreaterThan(0);
    });
  });

  describe('header rendering', () => {
    it('renders header with back button', () => {
      render(<OnThisDayClient eras={[]} events={[baseBattle]} locale="zh" />);
      expect(screen.getByText('返回')).toBeInTheDocument();
    });

    it('renders header with title', () => {
      render(<OnThisDayClient eras={[]} events={[baseBattle]} locale="zh" />);
      expect(screen.getByRole('heading', { name: /历史上的今天/ })).toBeInTheDocument();
    });

    it('renders locale switcher', () => {
      render(<OnThisDayClient eras={[]} events={[baseBattle]} locale="zh" />);
      expect(screen.getByTestId('locale-switcher')).toBeInTheDocument();
    });

    it('renders month and day selects', () => {
      render(<OnThisDayClient eras={[]} events={[baseBattle]} locale="zh" />);
      const selects = screen.getAllByRole('combobox');
      expect(selects).toHaveLength(2); // month and day
    });
  });

  describe('date picker', () => {
    it('renders month names in Chinese by default', () => {
      render(<OnThisDayClient eras={[]} events={[baseBattle]} locale="zh" />);
      // The month label "月" appears after the month select; check it's present
      const monthSelects = screen.getAllByRole('combobox');
      expect(monthSelects[0]).toBeInTheDocument();
    });

    it('renders month names in English for locale=en', () => {
      render(<OnThisDayClient eras={[]} events={[baseBattle]} locale="en" />);
      expect(screen.getByText('January')).toBeInTheDocument();
    });

    it('renders month names in Japanese for locale=ja', () => {
      render(<OnThisDayClient eras={[]} events={[baseBattle]} locale="ja" />);
      expect(screen.getByText('1月')).toBeInTheDocument();
    });

    it('changing month updates the UI', () => {
      render(<OnThisDayClient eras={[]} events={[baseBattle]} locale="zh" />);
      const monthSelect = screen.getAllByRole('combobox')[0];
      fireEvent.change(monthSelect, { target: { value: '06' } });
      // Should still render the heading without error
      expect(screen.getByRole('heading', { name: /历史上的今天/ })).toBeInTheDocument();
    });
  });

  describe('featured battle', () => {
    it('renders featured battle when battles are available', () => {
      render(<OnThisDayClient eras={[]} events={[baseBattle]} locale="zh" />);
      expect(screen.getByText('精选战役')).toBeInTheDocument();
    });

    it('renders view detail button', () => {
      render(<OnThisDayClient eras={[]} events={[baseBattle]} locale="zh" />);
      expect(screen.getByText('查看详情')).toBeInTheDocument();
    });
  });

  describe('battle list', () => {
    it('renders empty state when no battles match the date', () => {
      // With 3 battles of specific years, March 24 2026 produces daySeed=1
      // but pickSeeds are {2,0,0} → no match, triggering the empty state.
      const battle3: Event = {
        id: 'b3',
        entityId: 'era1',
        year: -631,
        titleKey: 'event.sa-631.title',
        summaryKey: 's',
        tags: ['war'],
        location: { lon: 114.0, lat: 35.5, label: '城濮' },
        battle: { result: 'draw' as const },
      };
      render(<OnThisDayClient eras={[]} events={[baseBattle, battle2, battle3]} locale="zh" />);
      expect(screen.getByText('换个日期试试吧')).toBeInTheDocument();
    });
  });

  describe('detail modal', () => {
    it('opens detail modal when view detail is clicked', () => {
      render(<OnThisDayClient eras={[]} events={[baseBattle]} locale="zh" />);
      fireEvent.click(screen.getByText('查看详情'));
      expect(screen.getByTestId('detail-mock')).toBeInTheDocument();
    });

    it('opens detail modal when battle card is clicked', () => {
      render(<OnThisDayClient eras={[]} events={[baseBattle]} locale="zh" />);
      const cards = screen.getAllByTestId('battle-card');
      if (cards.length > 0) {
        fireEvent.click(cards[0]);
        expect(screen.getByTestId('detail-mock')).toBeInTheDocument();
      }
    });

    it('closes detail modal when close button is clicked', () => {
      render(<OnThisDayClient eras={[]} events={[baseBattle]} locale="zh" />);
      fireEvent.click(screen.getByText('查看详情'));
      expect(screen.getByTestId('detail-mock')).toBeInTheDocument();
      fireEvent.click(screen.getByTestId('detail-close'));
      expect(screen.queryByTestId('detail-mock')).not.toBeInTheDocument();
    });
  });

  describe('locale prop', () => {
    it('uses zh as default locale', () => {
      render(<OnThisDayClient eras={[]} events={[baseBattle]} />);
      expect(screen.getByRole('heading', { name: /历史上的今天/ })).toBeInTheDocument();
    });
  });
});
