import type { Era } from '../types';

// Year convention: negative = BCE, positive = CE.
export const CHINA_ERAS: Era[] = [
  { id: 'wz-western-zhou', nameKey: 'era.westernZhou', startYear: -1046, endYear: -771 },
  { id: 'period-spring-autumn', nameKey: 'era.springAutumn', startYear: -770, endYear: -476 },
  {
    id: 'period-warring-states',
    nameKey: 'era.warringStates',
    startYear: -475,
    endYear: -221,
    isParallelPolities: true,
    polities: [
      { id: 'ws-qin', nameKey: 'polity.ws.qin' },
      { id: 'ws-chu', nameKey: 'polity.ws.chu' },
      { id: 'ws-qi', nameKey: 'polity.ws.qi' },
      { id: 'ws-yan', nameKey: 'polity.ws.yan' },
      { id: 'ws-zhao', nameKey: 'polity.ws.zhao' },
      { id: 'ws-wei', nameKey: 'polity.ws.wei' },
      { id: 'ws-han', nameKey: 'polity.ws.han' }
    ]
  },

  { id: 'qin', nameKey: 'era.qin', startYear: -221, endYear: -206 },
  { id: 'han-western', nameKey: 'era.westernHan', startYear: -202, endYear: 8 },
  { id: 'xin', nameKey: 'era.xin', startYear: 9, endYear: 23 },
  { id: 'han-eastern', nameKey: 'era.easternHan', startYear: 25, endYear: 220 },
  { id: 'three-kingdoms', nameKey: 'era.threeKingdoms', startYear: 220, endYear: 280 },
  { id: 'jin-western', nameKey: 'era.westernJin', startYear: 265, endYear: 316 },
  { id: 'jin-eastern-16k', nameKey: 'era.easternJin16', startYear: 317, endYear: 420 },
  { id: 'southern-northern', nameKey: 'era.southernNorthern', startYear: 420, endYear: 589 },
  { id: 'sui', nameKey: 'era.sui', startYear: 581, endYear: 618 },
  { id: 'tang', nameKey: 'era.tang', startYear: 618, endYear: 907 },
  {
    id: 'five-dynasties-ten-kingdoms',
    nameKey: 'era.fiveDynastiesTenKingdoms',
    startYear: 907,
    endYear: 960,
    isParallelPolities: true,
    // MVP: start with the Five Dynasties; Ten Kingdoms can be added iteratively.
    polities: [
      { id: 'fdtk-later-liang', nameKey: 'polity.fdtk.laterLiang' },
      { id: 'fdtk-later-tang', nameKey: 'polity.fdtk.laterTang' },
      { id: 'fdtk-later-jin', nameKey: 'polity.fdtk.laterJin' },
      { id: 'fdtk-later-han', nameKey: 'polity.fdtk.laterHan' },
      { id: 'fdtk-later-zhou', nameKey: 'polity.fdtk.laterZhou' }
    ]
  },
  { id: 'song', nameKey: 'era.song', startYear: 960, endYear: 1279 },
  { id: 'yuan', nameKey: 'era.yuan', startYear: 1271, endYear: 1368 },
  { id: 'ming', nameKey: 'era.ming', startYear: 1368, endYear: 1644 },
  { id: 'qing', nameKey: 'era.qing', startYear: 1644, endYear: 1912 },
  { id: 'roc', nameKey: 'era.roc', startYear: 1912, endYear: 1949 },
  { id: 'prc', nameKey: 'era.prc', startYear: 1949, endYear: 2026 }
];
