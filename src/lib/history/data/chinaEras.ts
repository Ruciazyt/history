import type { Era } from '../types';

// Year convention: negative = BCE, positive = CE.
export const CHINA_ERAS: Era[] = [
  { id: 'wz-western-zhou', nameKey: 'era.westernZhou', startYear: -1046, endYear: -771 },
  { id: 'period-spring-autumn', nameKey: 'era.springAutumn', startYear: -770, endYear: -476 },
  { id: 'period-warring-states', nameKey: 'era.warringStates', startYear: -475, endYear: -221 },
  { id: 'qin', nameKey: 'era.qin', startYear: -221, endYear: -206 },
  { id: 'han-western', nameKey: 'era.westernHan', startYear: -202, endYear: 8 },
  { id: 'xin', nameKey: 'era.xin', startYear: 9, endYear: 23 },
  { id: 'han-eastern', nameKey: 'era.easternHan', startYear: 25, endYear: 220 },
  { id: 'three-kingdoms', nameKey: 'era.threeKingdoms', startYear: 220, endYear: 280 },
  { id: 'jin-western', nameKey: 'era.westernJin', startYear: 265, endYear: 316 },
  { id: 'jin-eastern-16k', nameKey: 'era.easternJin16', startYear: 317, endYear: 420 },
  { id: 'southern-northern', nameKey: 'era.southernNorthern', startYear: 420, endYear: 589 },
];
