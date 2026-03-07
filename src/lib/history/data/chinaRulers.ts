import type { Ruler } from '../types';

export const CHINA_RULERS: Ruler[] = [
  // Qin
  {
    id: 'qinshihuang',
    eraId: 'qin',
    nameKey: 'ruler.qinshihuang',
    startYear: -221,
    endYear: -210,
  },
  {
    id: 'qiner',
    eraId: 'qin',
    nameKey: 'ruler.qiner',
    startYear: -210,
    endYear: -207,
  },

  // Western Han (sample only)
  {
    id: 'hangaozu',
    eraId: 'han-western',
    nameKey: 'ruler.hangaozu',
    startYear: -202,
    endYear: -195,
  },
  {
    id: 'hanwudi',
    eraId: 'han-western',
    nameKey: 'ruler.hanwudi',
    startYear: -141,
    endYear: -87,
  }
];
