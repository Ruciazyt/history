import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import type { Event, Ruler } from '@/lib/history/types';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const map: Record<string, string> = {
      'nav.battles': 'Battles',
      'ui.events': 'Events',
      'ui.clearSearch': 'Clear search',
      'event.sa-632.title': 'Battle of Sinhara',
      'event.sa-600.title': 'Event Title',
    };
    return map[key] ?? key;
  },
  useMessages: () => ({}),
}));

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock useBattleHooks
vi.mock('@/lib/history/useBattleHooks', () => ({
  useDebounce: vi.fn((value: string) => value),
  useClickOutside: vi.fn(),
}));

// Mock constants
vi.mock('@/lib/history/constants', () => ({
  Z_INDEX: { dropdown: 1000 },
}));

import { SearchBox } from './SearchBox';

const baseEvents: Event[] = [
  {
    id: 'e1',
    entityId: 'era1',
    year: -632,
    titleKey: 'event.sa-632.title',
    tags: [],
    location: { lon: 1, lat: 1, label: 'Sinhara' },
    battle: {
      result: 'attacker_win',
      belligerents: { attacker: 'Army A', defender: 'Army B' },
    },
  },
  {
    id: 'e2',
    entityId: 'era1',
    year: -600,
    titleKey: 'event.sa-600.title',
    tags: [],
    location: { lon: 2, lat: 2, label: 'Somewhere' },
  },
];

const baseRulers: Ruler[] = [
  {
    id: 'r1',
    nameKey: 'ruler.ashoka',
    eraNameKey: 'era.ashoka',
    startYear: -268,
    endYear: -232,
    entityId: 'era_maurya',
  },
  {
    id: 'r2',
    nameKey: 'ruler.wang',
    eraNameKey: 'era.han',
    startYear: -206,
    endYear: -220,
    entityId: 'era_han',
  },
];

describe('SearchBox', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders search input with Chinese placeholder', () => {
      render(<SearchBox events={[]} rulers={[]} locale="zh" />);
      expect(screen.getByRole('combobox')).toHaveAttribute('placeholder', '搜索帝王、战役...');
    });

    it('renders search input with English placeholder', () => {
      render(<SearchBox events={[]} rulers={[]} locale="en" />);
      expect(screen.getByRole('combobox')).toHaveAttribute('placeholder', 'Search rulers, battles...');
    });

    it('renders search input with Japanese placeholder', () => {
      render(<SearchBox events={[]} rulers={[]} locale="ja" />);
      expect(screen.getByRole('combobox')).toHaveAttribute('placeholder', '帝王・戦いを検索...');
    });

    it('input is not expanded initially', () => {
      render(<SearchBox events={[]} rulers={[]} />);
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('search behavior', () => {
    it('shows results listbox when query is typed', async () => {
      render(<SearchBox events={baseEvents} rulers={baseRulers} locale="zh" />);
      const input = screen.getByRole('combobox');
      fireEvent.change(input, { target: { value: 'ash' } });

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });

    it('does not show results when query is empty', () => {
      render(<SearchBox events={baseEvents} rulers={baseRulers} />);
      const input = screen.getByRole('combobox');
      fireEvent.change(input, { target: { value: '' } });
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('shows no results message for unmatched query in Chinese', async () => {
      render(<SearchBox events={baseEvents} rulers={baseRulers} locale="zh" />);
      const input = screen.getByRole('combobox');
      fireEvent.change(input, { target: { value: 'xyznonexistent' } });

      await waitFor(() => {
        expect(screen.getByText('未找到相关结果')).toBeInTheDocument();
      });
    });

    it('shows no results message in English', async () => {
      render(<SearchBox events={baseEvents} rulers={baseRulers} locale="en" />);
      const input = screen.getByRole('combobox');
      fireEvent.change(input, { target: { value: 'xyznonexistent' } });

      await waitFor(() => {
        expect(screen.getByText('No results found')).toBeInTheDocument();
      });
    });

    it('shows no results message in Japanese', async () => {
      render(<SearchBox events={baseEvents} rulers={baseRulers} locale="ja" />);
      const input = screen.getByRole('combobox');
      fireEvent.change(input, { target: { value: 'xyznonexistent' } });

      await waitFor(() => {
        expect(screen.getByText('結果が見つかりません')).toBeInTheDocument();
      });
    });
  });

  describe('navigation on select', () => {
    it('navigates to home page when ruler result is selected', async () => {
      render(<SearchBox events={baseEvents} rulers={baseRulers} locale="zh" />);
      const input = screen.getByRole('combobox');
      fireEvent.change(input, { target: { value: 'ash' } });

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      const listbox = screen.getByRole('listbox');
      fireEvent.click(listbox.querySelector('button')!);

      expect(mockPush).toHaveBeenCalledWith('/zh');
    });

    it('navigates to home page when event result is selected', async () => {
      render(<SearchBox events={baseEvents} rulers={baseRulers} locale="zh" />);
      const input = screen.getByRole('combobox');
      fireEvent.change(input, { target: { value: 'sa-600' } });

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      const listbox = screen.getByRole('listbox');
      fireEvent.click(listbox.querySelector('button')!);

      expect(mockPush).toHaveBeenCalledWith('/zh');
    });

    it('navigates to battles page when battle event is selected', async () => {
      render(<SearchBox events={baseEvents} rulers={baseRulers} locale="zh" />);
      const input = screen.getByRole('combobox');
      // Search by the battle ID directly
      fireEvent.change(input, { target: { value: 'sa-632' } });

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      const listbox = screen.getByRole('listbox');
      fireEvent.click(listbox.querySelector('button')!);

      expect(mockPush).toHaveBeenCalledWith('/zh/battles');
    });
  });

  describe('clear button', () => {
    it('shows clear button when query is not empty', () => {
      render(<SearchBox events={[]} rulers={[]} locale="zh" />);
      const input = screen.getByRole('combobox');
      fireEvent.change(input, { target: { value: 'test' } });
      expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument();
    });

    it('clears query when clear button is clicked', async () => {
      render(<SearchBox events={[]} rulers={[]} locale="zh" />);
      const input = screen.getByRole('combobox') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'test' } });

      const clearBtn = screen.getByRole('button', { name: 'Clear search' });
      fireEvent.click(clearBtn);

      await waitFor(() => {
        expect(input.value).toBe('');
      });
    });

    it('re-focuses input after clearing', async () => {
      render(<SearchBox events={[]} rulers={[]} />);
      const input = screen.getByRole('combobox') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'test' } });

      const clearBtn = screen.getByRole('button', { name: 'Clear search' });
      fireEvent.click(clearBtn);

      await waitFor(() => {
        expect(document.activeElement).toBe(input);
      });
    });
  });

  describe('keyboard navigation', () => {
    it('closes dropdown on Escape key', async () => {
      render(<SearchBox events={baseEvents} rulers={baseRulers} locale="zh" />);
      const input = screen.getByRole('combobox');
      fireEvent.change(input, { target: { value: 'ash' } });

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      fireEvent.keyDown(input, { key: 'Escape' });

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });
  });

  describe('focus behavior', () => {
    it('sets aria-expanded to true on focus with query', async () => {
      render(<SearchBox events={baseEvents} rulers={baseRulers} locale="zh" />);
      const input = screen.getByRole('combobox');
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'a' } });

      await waitFor(() => {
        expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true');
      });
    });
  });

  describe('result display', () => {
    it('limits results to 8 items', async () => {
      const manyEvents: Event[] = Array.from({ length: 15 }, (_, i) => ({
        id: `e${i}`,
        entityId: 'era1',
        year: -600 + i,
        titleKey: `event.test-${i}.title`,
        tags: [],
        location: { lon: 1, lat: 1, label: 'Test' },
      }));
      const manyRulers: Ruler[] = Array.from({ length: 15 }, (_, i) => ({
        id: `r${i}`,
        nameKey: `ruler.test-${i}`,
        eraNameKey: `era.test-${i}`,
        startYear: -200 + i,
        entityId: 'era1',
      }));

      render(<SearchBox events={manyEvents} rulers={manyRulers} locale="zh" />);
      const input = screen.getByRole('combobox');
      fireEvent.change(input, { target: { value: 'test' } });

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      const listbox = screen.getByRole('listbox');
      const buttons = listbox.querySelectorAll('button');
      expect(buttons.length).toBeLessThanOrEqual(8);
    });

    it('searches rulers by raw name key fragment match', async () => {
      render(<SearchBox events={[]} rulers={baseRulers} locale="zh" />);
      const input = screen.getByRole('combobox');
      fireEvent.change(input, { target: { value: 'ashoka' } });

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      const listbox = screen.getByRole('listbox');
      expect(listbox.querySelectorAll('button').length).toBeGreaterThan(0);
    });

    it('shows battle subtitle for battle-type results', async () => {
      render(<SearchBox events={baseEvents} rulers={[]} locale="zh" />);
      const input = screen.getByRole('combobox');
      fireEvent.change(input, { target: { value: 'sa-632' } });

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      expect(screen.getByText(/⚔️/)).toBeInTheDocument();
    });

    it('shows event subtitle for non-battle results', async () => {
      render(<SearchBox events={baseEvents} rulers={[]} locale="zh" />);
      const input = screen.getByRole('combobox');
      fireEvent.change(input, { target: { value: 'sa-600' } });

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      expect(screen.getByText(/📅/)).toBeInTheDocument();
    });
  });
});
