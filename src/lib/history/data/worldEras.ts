import type { Era } from '@/lib/history/types';

export const worldComparisonEra: Era = {
  id: 'world-comparison',
  nameKey: 'era.world-comparison',
  startYear: -2700,
  endYear: 1912,
  isParallelPolities: true,
  polities: [
    { id: 'wc-china', nameKey: 'polity.wc.china' },
    { id: 'wc-rome', nameKey: 'polity.wc.rome' },
    { id: 'wc-persia', nameKey: 'polity.wc.persia' },
    { id: 'wc-mongol', nameKey: 'polity.wc.mongol' },
    { id: 'wc-islam', nameKey: 'polity.wc.islam' },
    { id: 'wc-egypt', nameKey: 'polity.wc.egypt' },
    { id: 'wc-indus', nameKey: 'polity.wc.indus' },
    { id: 'wc-mesopotamia', nameKey: 'polity.wc.mesopotamia' },
    { id: 'wc-median', nameKey: 'polity.wc.median' },
    { id: 'wc-hellenistic', nameKey: 'polity.wc.hellenistic' },
    { id: 'wc-rus', nameKey: 'polity.wc.rus' },
    { id: 'wc-japan', nameKey: 'polity.wc.japan' },
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
