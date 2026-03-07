import type { Era } from '../types';

// Year convention: negative = BCE, positive = CE.
export const CHINA_ERAS: Era[] = [
  { id: 'wz-western-zhou', name: 'Western Zhou', startYear: -1046, endYear: -771 },
  { id: 'period-spring-autumn', name: 'Spring and Autumn', startYear: -770, endYear: -476 },
  { id: 'period-warring-states', name: 'Warring States', startYear: -475, endYear: -221 },
  { id: 'qin', name: 'Qin', startYear: -221, endYear: -206 },
  { id: 'han-western', name: 'Western Han', startYear: -202, endYear: 8 },
  { id: 'xin', name: 'Xin (Wang Mang)', startYear: 9, endYear: 23 },
  { id: 'han-eastern', name: 'Eastern Han', startYear: 25, endYear: 220 },
  { id: 'three-kingdoms', name: 'Three Kingdoms', startYear: 220, endYear: 280 },
  { id: 'jin-western', name: 'Western Jin', startYear: 265, endYear: 316 },
  { id: 'jin-eastern-16k', name: 'Eastern Jin & Sixteen Kingdoms', startYear: 317, endYear: 420 },
  { id: 'southern-northern', name: 'Southern & Northern Dynasties', startYear: 420, endYear: 589 },
];
