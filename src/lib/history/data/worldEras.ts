import type { Era } from '@/lib/history/types';

export const worldComparisonEra: Era = {
  id: 'world-comparison',
  nameKey: 'era.world-comparison',
  startYear: -500,
  endYear: 1912,
  isParallelPolities: true,
  polities: [
    { id: 'wc-china', nameKey: 'polity.wc.china' },
    { id: 'wc-rome', nameKey: 'polity.wc.rome' },
    { id: 'wc-persia', nameKey: 'polity.wc.persia' },
    { id: 'wc-islam', nameKey: 'polity.wc.islam' },
  ],
};

export const eastAsiaComparisonEra: Era = {
  id: 'east-asia-comparison',
  nameKey: 'era.east-asia-comparison',
  startYear: -200,
  endYear: 1912,
  isParallelPolities: true,
  polities: [
    { id: 'ea-china', nameKey: 'polity.ea.china' },
    { id: 'ea-japan', nameKey: 'polity.ea.japan' },
    { id: 'ea-korea', nameKey: 'polity.ea.korea' },
    { id: 'ea-vietnam', nameKey: 'polity.ea.vietnam' },
  ],
};
