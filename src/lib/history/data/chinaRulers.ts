import type { Ruler } from '../types';

export const CHINA_RULERS: Ruler[] = [
  // Qin
  {
    id: 'qinshihuang',
    eraId: 'qin',
    nameKey: 'ruler.qinshihuang',
    bioKey: 'rulerBio.qinshihuang',
    highlightKey: 'rulerHighlight.qinshihuang',
    startYear: -221,
    endYear: -210,
  },
  {
    id: 'qiner',
    eraId: 'qin',
    nameKey: 'ruler.qiner',
    bioKey: 'rulerBio.qiner',
    highlightKey: 'rulerHighlight.qiner',
    startYear: -210,
    endYear: -207,
  },

  // Western Han (sample)
  {
    id: 'hangaozu',
    eraId: 'han-western',
    nameKey: 'ruler.hangaozu',
    bioKey: 'rulerBio.hangaozu',
    highlightKey: 'rulerHighlight.hangaozu',
    startYear: -202,
    endYear: -195,
  },
  {
    id: 'hanwudi',
    eraId: 'han-western',
    nameKey: 'ruler.hanwudi',
    bioKey: 'rulerBio.hanwudi',
    highlightKey: 'rulerHighlight.hanwudi',
    startYear: -141,
    endYear: -87,
  }
];
