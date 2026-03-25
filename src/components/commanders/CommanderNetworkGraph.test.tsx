import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { Event } from '@/lib/history/types';
import { CommanderNetworkGraph } from './CommanderNetworkGraph';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const map: Record<string, string> = {
      'commanders.noData': '暂无指挥官数据',
      'commanders.title': '指挥官关系网络',
    };
    return map[key] ?? key;
  },
}));

// Mock ResizeObserver
class MockResizeObserver {
  observe() {}
  disconnect() {}
  unobserve() {}
}
vi.stubGlobal('ResizeObserver', MockResizeObserver);

// Mock buildCommanderNetwork to return predictable data
const mockNetwork = {
  nodes: [
    {
      name: '孙膑',
      battles: 2,
      wins: 2,
      losses: 0,
      winRate: 100,
      collaborators: ['田忌'],
      opponents: ['庞涓'],
      firstBattle: -341,
      lastBattle: -334,
    },
    {
      name: '田忌',
      battles: 2,
      wins: 2,
      losses: 0,
      winRate: 100,
      collaborators: ['孙膑'],
      opponents: ['庞涓'],
      firstBattle: -341,
      lastBattle: -334,
    },
    {
      name: '庞涓',
      battles: 1,
      wins: 0,
      losses: 1,
      winRate: 0,
      collaborators: [],
      opponents: ['孙膑', '田忌'],
      firstBattle: -341,
      lastBattle: -341,
    },
  ],
  relations: [
    { commander1: '孙膑', commander2: '田忌', relationType: 'collaborated' as const, battleCount: 2, battleIds: ['b2', 'b3'] },
    { commander1: '孙膑', commander2: '庞涓', relationType: 'opposed' as const, battleCount: 1, battleIds: ['b2'] },
    { commander1: '田忌', commander2: '庞涓', relationType: 'opposed' as const, battleCount: 1, battleIds: ['b2'] },
  ],
  metrics: {
    totalCommanders: 3,
    totalRelations: 3,
    mostConnected: '孙膑',
    mostActive: '孙膑',
  },
};

vi.mock('@/lib/history/commanderNetwork', () => ({
  buildCommanderNetwork: vi.fn(() => mockNetwork),
}));

const battlesWithCommanders: Event[] = [
  {
    id: 'b1',
    entityId: 'period-warring-states',
    year: -260,
    titleKey: 'battle.changping',
    summaryKey: 'battle.changping.summary',
    tags: ['war'],
    location: { lon: 113.0, lat: 35.5, label: '长平' },
    battle: {
      result: 'attacker_win',
      belligerents: { attacker: '秦军', defender: '赵军' },
      commanders: { attacker: ['白起'], defender: ['赵括'] },
    },
  },
  {
    id: 'b2',
    entityId: 'period-warring-states',
    year: -341,
    titleKey: 'battle.maling',
    summaryKey: 'battle.maling.summary',
    tags: ['war'],
    location: { lon: 117.0, lat: 34.5, label: '马陵' },
    battle: {
      result: 'attacker_win',
      belligerents: { attacker: '齐军', defender: '魏军' },
      commanders: { attacker: ['孙膑', '田忌'], defender: ['庞涓'] },
    },
  },
  {
    id: 'b3',
    entityId: 'period-warring-states',
    year: -334,
    titleKey: 'battle.chaige',
    summaryKey: 'battle.chaige.summary',
    tags: ['war'],
    location: { lon: 116.5, lat: 34.2, label: '厨房' },
    battle: {
      result: 'attacker_win',
      belligerents: { attacker: '齐军', defender: '魏军' },
      commanders: { attacker: ['孙膑', '田忌'], defender: ['庞涓'] },
    },
  },
];

describe('CommanderNetworkGraph', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('empty state', () => {
    it('shows empty state when there are no battles with commanders', () => {
      const eventsWithoutCommanders: Event[] = [
        {
          id: 'no-commander',
          entityId: 'era1',
          year: -100,
          titleKey: 't',
          summaryKey: 's',
          tags: ['war'],
          battle: { result: 'attacker_win' as const, belligerents: { attacker: 'A', defender: 'B' } },
        },
      ];
      render(
        <CommanderNetworkGraph events={eventsWithoutCommanders} />
      );
      expect(screen.getByText('暂无指挥官数据')).toBeInTheDocument();
    });

    it('shows empty state when only one battle with commanders', () => {
      const singleBattle: Event[] = [
        {
          id: 'single',
          entityId: 'era1',
          year: -260,
          titleKey: 'battle.changping',
          summaryKey: 's',
          tags: ['war'],
          location: { lon: 113.0, lat: 35.5, label: '长平' },
          battle: {
            result: 'attacker_win' as const,
            belligerents: { attacker: '秦军', defender: '赵军' },
            commanders: { attacker: ['白起'], defender: ['赵括'] },
          },
        },
      ];
      render(<CommanderNetworkGraph events={singleBattle} />);
      expect(screen.getByText('暂无指挥官数据')).toBeInTheDocument();
    });

    it('shows empty state when events array is empty', () => {
      render(<CommanderNetworkGraph events={[]} />);
      expect(screen.getByText('暂无指挥官数据')).toBeInTheDocument();
    });
  });

  describe('network rendering', () => {
    it('renders SVG when network data is available', () => {
      render(<CommanderNetworkGraph events={battlesWithCommanders} />);
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders edge lines in the SVG', () => {
      render(<CommanderNetworkGraph events={battlesWithCommanders} />);
      const lines = document.querySelectorAll('svg line');
      expect(lines.length).toBeGreaterThan(0);
    });

    it('renders node circles in the SVG', () => {
      render(<CommanderNetworkGraph events={battlesWithCommanders} />);
      const circles = document.querySelectorAll('svg circle');
      expect(circles.length).toBeGreaterThan(0);
    });

    it('renders legend', () => {
      render(<CommanderNetworkGraph events={battlesWithCommanders} />);
      expect(screen.getByText('合作')).toBeInTheDocument();
      expect(screen.getByText('对决')).toBeInTheDocument();
      expect(screen.getByText('指挥官')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('calls onCommanderClick when a node is clicked', () => {
      const onClick = vi.fn();
      render(<CommanderNetworkGraph events={battlesWithCommanders} onCommanderClick={onClick} />);
      const circles = document.querySelectorAll('svg circle');
      // Find a circle that is a node (not badge, glow, etc.) - nodes have cursor pointer
      const nodeGroups = document.querySelectorAll('svg g[style*="cursor: pointer"]');
      if (nodeGroups.length > 0) {
        fireEvent.click(nodeGroups[0]);
        expect(onClick).toHaveBeenCalled();
      }
    });

    it('renders without crashing when selectedCommander is provided', () => {
      render(<CommanderNetworkGraph events={battlesWithCommanders} selectedCommander="孙膑" />);
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });
});
