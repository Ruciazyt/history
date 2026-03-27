import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { Shell } from './Shell';
import type { Era } from '@/lib/history/types';

// Mock next/navigation
const mockUseParams = vi.fn();
const mockUsePathname = vi.fn();
vi.mock('next/navigation', () => ({
  useParams: () => mockUseParams(),
  usePathname: () => mockUsePathname(),
}));

// Mock next-intl
vi.mock('next-intl', () => ({
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="intl-provider">{children}</div>
  ),
  useTranslations: () => (key: string) => {
    // Returns the last segment of the i18n key as a simple mock
    // e.g., 'ui.pageNotFound' -> 'pageNotFound'
    return key.split('.').pop() ?? key;
  },
}));

// Mock page components
vi.mock('@/components/HistoryApp', () => ({
  HistoryApp: ({ locale }: { locale: string }) => (
    <div data-testid="history-app" data-locale={locale}>HistoryApp</div>
  ),
}));

vi.mock('@/components/common/ThemeContext', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}));

vi.mock('@/components/timeline/TimelineClient', () => ({
  TimelineClient: ({ locale }: { locale: string }) => (
    <div data-testid="timeline-client" data-locale={locale}>TimelineClient</div>
  ),
}));

vi.mock('@/components/battles/BattlesClient', () => ({
  BattlesClient: ({ locale }: { locale: string }) => (
    <div data-testid="battles-client" data-locale={locale}>BattlesClient</div>
  ),
}));

vi.mock('@/components/commanders/CommandersClient', () => ({
  CommandersClient: ({ locale }: { locale: string }) => (
    <div data-testid="commanders-client" data-locale={locale}>CommandersClient</div>
  ),
}));

vi.mock('@/components/battles/FavoritesClient', () => ({
  FavoritesClient: ({ locale }: { locale: string }) => (
    <div data-testid="favorites-client" data-locale={locale}>FavoritesClient</div>
  ),
}));

vi.mock('@/components/battles/OnThisDayClient', () => ({
  OnThisDayClient: ({ locale }: { locale: string }) => (
    <div data-testid="on-this-day-client" data-locale={locale}>OnThisDayClient</div>
  ),
}));

vi.mock('@/components/battles/QuizClient', () => ({
  QuizClient: ({ locale }: { locale: string }) => (
    <div data-testid="quiz-client" data-locale={locale}>QuizClient</div>
  ),
}));

vi.mock('@/components/world/WorldClient', () => ({
  WorldClient: ({ locale, minYear, maxYear }: { locale: string; minYear: number; maxYear: number }) => (
    <div data-testid="world-client" data-locale={locale} data-min={minYear} data-max={maxYear}>WorldClient</div>
  ),
}));

vi.mock('@/components/matrix/MatrixClient', () => ({
  MatrixClient: ({ locale }: { locale: string }) => (
    <div data-testid="matrix-client" data-locale={locale}>MatrixClient</div>
  ),
}));

vi.mock('@/components/world/EurasianGrid', () => ({
  EurasianGrid: () => <div data-testid="eurasian-grid">EurasianGrid</div>,
}));

vi.mock('@/components/world/PlaceNameEvolution', () => ({
  PlaceNameEvolution: () => <div data-testid="place-name-evolution">PlaceNameEvolution</div>,
}));

vi.mock('@/components/location/LocationClient', () => ({
  LocationClient: ({ locale }: { locale: string }) => (
    <div data-testid="location-client" data-locale={locale}>LocationClient</div>
  ),
}));

// Mock data modules for bounds
vi.mock('@/lib/history/data/worldBoundaries', () => ({
  getWorldEraBounds: (region: string) => {
    if (region === 'eurasian') return { min: -3000, max: 2000 };
    return { min: -3000, max: 2000 };
  },
}));

vi.mock('@/lib/history/data/chinaEras', () => ({
  CHINA_ERAS: [],
}));

vi.mock('@/lib/history/data/chinaEvents', () => ({
  CHINA_EVENTS: [],
}));

vi.mock('@/lib/history/data/chinaRulers', () => ({
  CHINA_RULERS: [],
}));

const defaultMessages = {};

describe('Shell', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({ locale: 'zh' });
  });

  it('renders NextIntlClientProvider wrapper', () => {
    mockUsePathname.mockReturnValue('/zh');
    render(<Shell messages={defaultMessages} />);
    expect(screen.getByTestId('intl-provider')).toBeInTheDocument();
  });

  it('renders home page for root path', () => {
    mockUsePathname.mockReturnValue('/zh');
    render(<Shell messages={defaultMessages} />);
    expect(screen.getByTestId('history-app')).toBeInTheDocument();
  });

  it('renders home page for trailing slash path', () => {
    mockUsePathname.mockReturnValue('/zh/');
    render(<Shell messages={defaultMessages} />);
    expect(screen.getByTestId('history-app')).toBeInTheDocument();
  });

  it('renders TimelineClient for /timeline path', () => {
    mockUsePathname.mockReturnValue('/zh/timeline');
    render(<Shell messages={defaultMessages} />);
    expect(screen.getByTestId('timeline-client')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-client')).toHaveAttribute('data-locale', 'zh');
  });

  it('renders BattlesClient for /battles path', () => {
    mockUsePathname.mockReturnValue('/zh/battles');
    render(<Shell messages={defaultMessages} />);
    expect(screen.getByTestId('battles-client')).toBeInTheDocument();
  });

  it('renders CommandersClient for /commanders path', () => {
    mockUsePathname.mockReturnValue('/zh/commanders');
    render(<Shell messages={defaultMessages} />);
    expect(screen.getByTestId('commanders-client')).toBeInTheDocument();
  });

  it('renders FavoritesClient for /favorites path', () => {
    mockUsePathname.mockReturnValue('/zh/favorites');
    render(<Shell messages={defaultMessages} />);
    expect(screen.getByTestId('favorites-client')).toBeInTheDocument();
  });

  it('renders OnThisDayClient for /on-this-day path', () => {
    mockUsePathname.mockReturnValue('/zh/on-this-day');
    render(<Shell messages={defaultMessages} />);
    expect(screen.getByTestId('on-this-day-client')).toBeInTheDocument();
  });

  it('renders QuizClient for /quiz path', () => {
    mockUsePathname.mockReturnValue('/zh/quiz');
    render(<Shell messages={defaultMessages} />);
    expect(screen.getByTestId('quiz-client')).toBeInTheDocument();
  });

  it('renders WorldClient for /world path', () => {
    mockUsePathname.mockReturnValue('/zh/world');
    render(<Shell messages={defaultMessages} />);
    expect(screen.getByTestId('world-client')).toBeInTheDocument();
  });

  it('passes minYear and maxYear props to WorldClient', () => {
    mockUsePathname.mockReturnValue('/zh/world');
    render(<Shell messages={defaultMessages} minYear={-1000} maxYear={1900} />);
    expect(screen.getByTestId('world-client')).toHaveAttribute('data-min', '-1000');
    expect(screen.getByTestId('world-client')).toHaveAttribute('data-max', '1900');
  });

  it('renders MatrixClient for /matrix path', () => {
    mockUsePathname.mockReturnValue('/zh/matrix');
    render(<Shell messages={defaultMessages} />);
    expect(screen.getByTestId('matrix-client')).toBeInTheDocument();
  });

  it('renders EurasianGrid for /grid path', () => {
    mockUsePathname.mockReturnValue('/zh/grid');
    render(<Shell messages={defaultMessages} />);
    expect(screen.getByTestId('eurasian-grid')).toBeInTheDocument();
  });

  it('renders PlaceNameEvolution for /place-names path', () => {
    mockUsePathname.mockReturnValue('/zh/place-names');
    render(<Shell messages={defaultMessages} />);
    expect(screen.getByTestId('place-name-evolution')).toBeInTheDocument();
  });

  it('renders LocationClient for /location path', () => {
    mockUsePathname.mockReturnValue('/zh/location');
    render(<Shell messages={defaultMessages} />);
    expect(screen.getByTestId('location-client')).toBeInTheDocument();
  });

  it('renders 404 for unknown path', () => {
    mockUsePathname.mockReturnValue('/zh/unknown-page');
    render(<Shell messages={defaultMessages} />);
    expect(screen.getByText('pageNotFound')).toBeInTheDocument();
  });

  it('prefers children over pathname-based rendering when provided', () => {
    mockUsePathname.mockReturnValue('/zh/battles');
    render(
      <Shell messages={defaultMessages}>
        <div data-testid="custom-children">Custom Children Content</div>
      </Shell>
    );
    expect(screen.getByTestId('custom-children')).toBeInTheDocument();
    expect(screen.queryByTestId('battles-client')).not.toBeInTheDocument();
  });

  it('renders MatrixClient with eras prop when passed', () => {
    mockUsePathname.mockReturnValue('/zh/matrix');
    const mockEras = [{ id: 'era1', name: 'Test Era' }];
    render(<Shell messages={defaultMessages} eras={mockEras as Era[]} />);
    // MatrixClient should still render (eras passed through)
    expect(screen.getByTestId('matrix-client')).toBeInTheDocument();
  });

  it('uses locale from params', () => {
    mockUsePathname.mockReturnValue('/en');
    mockUseParams.mockReturnValue({ locale: 'en' });
    render(<Shell messages={defaultMessages} />);
    // HistoryApp should receive 'en' as locale
    expect(screen.getByTestId('history-app')).toHaveAttribute('data-locale', 'en');
  });

  it('uses ja locale from params', () => {
    mockUsePathname.mockReturnValue('/ja');
    mockUseParams.mockReturnValue({ locale: 'ja' });
    render(<Shell messages={defaultMessages} />);
    expect(screen.getByTestId('history-app')).toHaveAttribute('data-locale', 'ja');
  });

  it('uses zh as default locale when params.locale is undefined but pathname matches zh root', () => {
    // When params.locale is undefined, locale defaults to 'zh'.
    // Pathname must match the zh root path for HistoryApp to render.
    mockUsePathname.mockReturnValue('/zh');
    mockUseParams.mockReturnValue({});
    render(<Shell messages={defaultMessages} />);
    expect(screen.getByTestId('history-app')).toHaveAttribute('data-locale', 'zh');
  });

  it('WorldClient uses default bounds when minYear/maxYear not provided', () => {
    mockUsePathname.mockReturnValue('/zh/world');
    render(<Shell messages={defaultMessages} />);
    expect(screen.getByTestId('world-client')).toHaveAttribute('data-min', '-3000');
    expect(screen.getByTestId('world-client')).toHaveAttribute('data-max', '2000');
  });
});
