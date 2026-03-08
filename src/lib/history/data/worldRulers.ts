import type { Ruler } from '@/lib/history/types';

export const worldComparisonRulers: Ruler[] = [
  // ── China (dynasties as blocks) ────────────────────────
  { id: 'wc-cn-qin', eraId: 'world-comparison', polityId: 'wc-china', nameKey: 'ruler.wc-cn-qin', bioKey: 'rulerBio.wc-cn-qin', startYear: -221, endYear: -206 },
  { id: 'wc-cn-han', eraId: 'world-comparison', polityId: 'wc-china', nameKey: 'ruler.wc-cn-han', bioKey: 'rulerBio.wc-cn-han', startYear: -206, endYear: 220 },
  { id: 'wc-cn-3k', eraId: 'world-comparison', polityId: 'wc-china', nameKey: 'ruler.wc-cn-3k', bioKey: 'rulerBio.wc-cn-3k', startYear: 220, endYear: 280 },
  { id: 'wc-cn-jin', eraId: 'world-comparison', polityId: 'wc-china', nameKey: 'ruler.wc-cn-jin', bioKey: 'rulerBio.wc-cn-jin', startYear: 280, endYear: 589 },
  { id: 'wc-cn-sui-tang', eraId: 'world-comparison', polityId: 'wc-china', nameKey: 'ruler.wc-cn-sui-tang', bioKey: 'rulerBio.wc-cn-sui-tang', startYear: 581, endYear: 907 },
  { id: 'wc-cn-song', eraId: 'world-comparison', polityId: 'wc-china', nameKey: 'ruler.wc-cn-song', bioKey: 'rulerBio.wc-cn-song', startYear: 960, endYear: 1279 },
  { id: 'wc-cn-yuan', eraId: 'world-comparison', polityId: 'wc-china', nameKey: 'ruler.wc-cn-yuan', bioKey: 'rulerBio.wc-cn-yuan', startYear: 1271, endYear: 1368 },
  { id: 'wc-cn-ming', eraId: 'world-comparison', polityId: 'wc-china', nameKey: 'ruler.wc-cn-ming', bioKey: 'rulerBio.wc-cn-ming', startYear: 1368, endYear: 1644 },
  { id: 'wc-cn-qing', eraId: 'world-comparison', polityId: 'wc-china', nameKey: 'ruler.wc-cn-qing', bioKey: 'rulerBio.wc-cn-qing', startYear: 1644, endYear: 1912 },

  // ── Rome / Byzantine / Ottoman ─────────────────────────
  { id: 'wc-ro-republic', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-republic', bioKey: 'rulerBio.wc-ro-republic', startYear: -500, endYear: -44 },
  { id: 'wc-ro-caesar', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-caesar', bioKey: 'rulerBio.wc-ro-caesar', highlightKey: 'rulerHighlight.wc-ro-caesar', startYear: -44, endYear: -27 },
  { id: 'wc-ro-augustus', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-augustus', bioKey: 'rulerBio.wc-ro-augustus', highlightKey: 'rulerHighlight.wc-ro-augustus', startYear: -27, endYear: 14 },
  { id: 'wc-ro-nerva-antonine', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-nerva-antonine', bioKey: 'rulerBio.wc-ro-nerva-antonine', startYear: 96, endYear: 192 },
  { id: 'wc-ro-constantine', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-constantine', bioKey: 'rulerBio.wc-ro-constantine', highlightKey: 'rulerHighlight.wc-ro-constantine', startYear: 306, endYear: 337 },
  { id: 'wc-ro-west-fall', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-west-fall', bioKey: 'rulerBio.wc-ro-west-fall', startYear: 395, endYear: 476 },
  { id: 'wc-ro-justinian', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-justinian', bioKey: 'rulerBio.wc-ro-justinian', highlightKey: 'rulerHighlight.wc-ro-justinian', startYear: 527, endYear: 565 },
  { id: 'wc-ro-heraclius', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-heraclius', bioKey: 'rulerBio.wc-ro-heraclius', startYear: 610, endYear: 641 },
  { id: 'wc-ro-byzantine-mid', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-byzantine-mid', bioKey: 'rulerBio.wc-ro-byzantine-mid', startYear: 800, endYear: 1100 },
  { id: 'wc-ro-byz-fall', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-byz-fall', bioKey: 'rulerBio.wc-ro-byz-fall', startYear: 1100, endYear: 1453 },
  { id: 'wc-ro-suleiman', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-suleiman', bioKey: 'rulerBio.wc-ro-suleiman', highlightKey: 'rulerHighlight.wc-ro-suleiman', startYear: 1520, endYear: 1566 },
  { id: 'wc-ro-ottoman-late', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-ottoman-late', bioKey: 'rulerBio.wc-ro-ottoman-late', startYear: 1566, endYear: 1912 },

  // ── Persia ─────────────────────────────────────────────
  { id: 'wc-pe-cyrus', eraId: 'world-comparison', polityId: 'wc-persia', nameKey: 'ruler.wc-pe-cyrus', bioKey: 'rulerBio.wc-pe-cyrus', highlightKey: 'rulerHighlight.wc-pe-cyrus', startYear: -550, endYear: -530 },
  { id: 'wc-pe-darius', eraId: 'world-comparison', polityId: 'wc-persia', nameKey: 'ruler.wc-pe-darius', bioKey: 'rulerBio.wc-pe-darius', highlightKey: 'rulerHighlight.wc-pe-darius', startYear: -522, endYear: -486 },
  { id: 'wc-pe-xerxes', eraId: 'world-comparison', polityId: 'wc-persia', nameKey: 'ruler.wc-pe-xerxes', bioKey: 'rulerBio.wc-pe-xerxes', startYear: -486, endYear: -330 },
  { id: 'wc-pe-seleucid', eraId: 'world-comparison', polityId: 'wc-persia', nameKey: 'ruler.wc-pe-seleucid', bioKey: 'rulerBio.wc-pe-seleucid', startYear: -312, endYear: -63 },
  { id: 'wc-pe-parthian', eraId: 'world-comparison', polityId: 'wc-persia', nameKey: 'ruler.wc-pe-parthian', bioKey: 'rulerBio.wc-pe-parthian', startYear: -247, endYear: 224 },
  { id: 'wc-pe-ardashir', eraId: 'world-comparison', polityId: 'wc-persia', nameKey: 'ruler.wc-pe-ardashir', bioKey: 'rulerBio.wc-pe-ardashir', startYear: 224, endYear: 241 },
  { id: 'wc-pe-shapur', eraId: 'world-comparison', polityId: 'wc-persia', nameKey: 'ruler.wc-pe-shapur', bioKey: 'rulerBio.wc-pe-shapur', highlightKey: 'rulerHighlight.wc-pe-shapur', startYear: 241, endYear: 651 },
  { id: 'wc-pe-safavid', eraId: 'world-comparison', polityId: 'wc-persia', nameKey: 'ruler.wc-pe-safavid', bioKey: 'rulerBio.wc-pe-safavid', startYear: 1501, endYear: 1736 },

  // ── Islam ──────────────────────────────────────────────
  { id: 'wc-is-muhammad', eraId: 'world-comparison', polityId: 'wc-islam', nameKey: 'ruler.wc-is-muhammad', bioKey: 'rulerBio.wc-is-muhammad', highlightKey: 'rulerHighlight.wc-is-muhammad', startYear: 610, endYear: 632 },
  { id: 'wc-is-rashidun', eraId: 'world-comparison', polityId: 'wc-islam', nameKey: 'ruler.wc-is-rashidun', bioKey: 'rulerBio.wc-is-rashidun', startYear: 632, endYear: 661 },
  { id: 'wc-is-umayyad', eraId: 'world-comparison', polityId: 'wc-islam', nameKey: 'ruler.wc-is-umayyad', bioKey: 'rulerBio.wc-is-umayyad', startYear: 661, endYear: 750 },
  { id: 'wc-is-harun', eraId: 'world-comparison', polityId: 'wc-islam', nameKey: 'ruler.wc-is-harun', bioKey: 'rulerBio.wc-is-harun', highlightKey: 'rulerHighlight.wc-is-harun', startYear: 786, endYear: 833 },
  { id: 'wc-is-abbasid-late', eraId: 'world-comparison', polityId: 'wc-islam', nameKey: 'ruler.wc-is-abbasid-late', bioKey: 'rulerBio.wc-is-abbasid-late', startYear: 833, endYear: 1258 },
  { id: 'wc-is-saladin', eraId: 'world-comparison', polityId: 'wc-islam', nameKey: 'ruler.wc-is-saladin', bioKey: 'rulerBio.wc-is-saladin', highlightKey: 'rulerHighlight.wc-is-saladin', startYear: 1174, endYear: 1193 },
  { id: 'wc-is-ilkhanate', eraId: 'world-comparison', polityId: 'wc-islam', nameKey: 'ruler.wc-is-ilkhanate', bioKey: 'rulerBio.wc-is-ilkhanate', startYear: 1256, endYear: 1370 },
  { id: 'wc-is-timur', eraId: 'world-comparison', polityId: 'wc-islam', nameKey: 'ruler.wc-is-timur', bioKey: 'rulerBio.wc-is-timur', highlightKey: 'rulerHighlight.wc-is-timur', startYear: 1370, endYear: 1405 },
  { id: 'wc-is-timurid-late', eraId: 'world-comparison', polityId: 'wc-islam', nameKey: 'ruler.wc-is-timurid-late', bioKey: 'rulerBio.wc-is-timurid-late', startYear: 1405, endYear: 1526 },
  { id: 'wc-is-akbar', eraId: 'world-comparison', polityId: 'wc-islam', nameKey: 'ruler.wc-is-akbar', bioKey: 'rulerBio.wc-is-akbar', highlightKey: 'rulerHighlight.wc-is-akbar', startYear: 1556, endYear: 1857 },
];

// ══ East Asia Comparison ═══════════════════════════════════════════════════

export const eastAsiaRulers: import('@/lib/history/types').Ruler[] = [
  // ── China (same blocks, ea- prefix) ────────────────────────────────────
  { id: 'ea-cn-han', eraId: 'east-asia-comparison', polityId: 'ea-china', nameKey: 'ruler.wc-cn-han', bioKey: 'rulerBio.wc-cn-han', startYear: -206, endYear: 220 },
  { id: 'ea-cn-3k-jin', eraId: 'east-asia-comparison', polityId: 'ea-china', nameKey: 'ruler.wc-cn-3k', bioKey: 'rulerBio.wc-cn-3k', startYear: 220, endYear: 589 },
  { id: 'ea-cn-sui-tang', eraId: 'east-asia-comparison', polityId: 'ea-china', nameKey: 'ruler.wc-cn-sui-tang', bioKey: 'rulerBio.wc-cn-sui-tang', startYear: 581, endYear: 907 },
  { id: 'ea-cn-song', eraId: 'east-asia-comparison', polityId: 'ea-china', nameKey: 'ruler.wc-cn-song', bioKey: 'rulerBio.wc-cn-song', startYear: 960, endYear: 1279 },
  { id: 'ea-cn-yuan', eraId: 'east-asia-comparison', polityId: 'ea-china', nameKey: 'ruler.wc-cn-yuan', bioKey: 'rulerBio.wc-cn-yuan', startYear: 1271, endYear: 1368 },
  { id: 'ea-cn-ming', eraId: 'east-asia-comparison', polityId: 'ea-china', nameKey: 'ruler.wc-cn-ming', bioKey: 'rulerBio.wc-cn-ming', startYear: 1368, endYear: 1644 },
  { id: 'ea-cn-qing', eraId: 'east-asia-comparison', polityId: 'ea-china', nameKey: 'ruler.wc-cn-qing', bioKey: 'rulerBio.wc-cn-qing', startYear: 1644, endYear: 1912 },

  // ── Japan ──────────────────────────────────────────────────────────────
  { id: 'ea-jp-yayoi', eraId: 'east-asia-comparison', polityId: 'ea-japan', nameKey: 'ruler.ea-jp-yayoi', bioKey: 'rulerBio.ea-jp-yayoi', startYear: -200, endYear: 250 },
  { id: 'ea-jp-yamato', eraId: 'east-asia-comparison', polityId: 'ea-japan', nameKey: 'ruler.ea-jp-yamato', bioKey: 'rulerBio.ea-jp-yamato', startYear: 250, endYear: 710 },
  { id: 'ea-jp-nara', eraId: 'east-asia-comparison', polityId: 'ea-japan', nameKey: 'ruler.ea-jp-nara', bioKey: 'rulerBio.ea-jp-nara', startYear: 710, endYear: 794 },
  { id: 'ea-jp-heian', eraId: 'east-asia-comparison', polityId: 'ea-japan', nameKey: 'ruler.ea-jp-heian', bioKey: 'rulerBio.ea-jp-heian', highlightKey: 'rulerHighlight.ea-jp-heian', startYear: 794, endYear: 1185 },
  { id: 'ea-jp-kamakura', eraId: 'east-asia-comparison', polityId: 'ea-japan', nameKey: 'ruler.ea-jp-kamakura', bioKey: 'rulerBio.ea-jp-kamakura', highlightKey: 'rulerHighlight.ea-jp-kamakura', startYear: 1185, endYear: 1333 },
  { id: 'ea-jp-muromachi', eraId: 'east-asia-comparison', polityId: 'ea-japan', nameKey: 'ruler.ea-jp-muromachi', bioKey: 'rulerBio.ea-jp-muromachi', startYear: 1336, endYear: 1573 },
  { id: 'ea-jp-sengoku', eraId: 'east-asia-comparison', polityId: 'ea-japan', nameKey: 'ruler.ea-jp-sengoku', bioKey: 'rulerBio.ea-jp-sengoku', highlightKey: 'rulerHighlight.ea-jp-sengoku', startYear: 1467, endYear: 1615 },
  { id: 'ea-jp-edo', eraId: 'east-asia-comparison', polityId: 'ea-japan', nameKey: 'ruler.ea-jp-edo', bioKey: 'rulerBio.ea-jp-edo', highlightKey: 'rulerHighlight.ea-jp-edo', startYear: 1603, endYear: 1868 },
  { id: 'ea-jp-meiji', eraId: 'east-asia-comparison', polityId: 'ea-japan', nameKey: 'ruler.ea-jp-meiji', bioKey: 'rulerBio.ea-jp-meiji', highlightKey: 'rulerHighlight.ea-jp-meiji', startYear: 1868, endYear: 1912 },

  // ── Korea ──────────────────────────────────────────────────────────────
  { id: 'ea-kr-three', eraId: 'east-asia-comparison', polityId: 'ea-korea', nameKey: 'ruler.ea-kr-three', bioKey: 'rulerBio.ea-kr-three', startYear: -200, endYear: 668 },
  { id: 'ea-kr-silla', eraId: 'east-asia-comparison', polityId: 'ea-korea', nameKey: 'ruler.ea-kr-silla', bioKey: 'rulerBio.ea-kr-silla', highlightKey: 'rulerHighlight.ea-kr-silla', startYear: 668, endYear: 935 },
  { id: 'ea-kr-goryeo', eraId: 'east-asia-comparison', polityId: 'ea-korea', nameKey: 'ruler.ea-kr-goryeo', bioKey: 'rulerBio.ea-kr-goryeo', highlightKey: 'rulerHighlight.ea-kr-goryeo', startYear: 918, endYear: 1392 },
  { id: 'ea-kr-joseon', eraId: 'east-asia-comparison', polityId: 'ea-korea', nameKey: 'ruler.ea-kr-joseon', bioKey: 'rulerBio.ea-kr-joseon', highlightKey: 'rulerHighlight.ea-kr-joseon', startYear: 1392, endYear: 1897 },
  { id: 'ea-kr-empire', eraId: 'east-asia-comparison', polityId: 'ea-korea', nameKey: 'ruler.ea-kr-empire', bioKey: 'rulerBio.ea-kr-empire', startYear: 1897, endYear: 1912 },

  // ── Vietnam ────────────────────────────────────────────────────────────
  { id: 'ea-vn-china-rule', eraId: 'east-asia-comparison', polityId: 'ea-vietnam', nameKey: 'ruler.ea-vn-china-rule', bioKey: 'rulerBio.ea-vn-china-rule', startYear: -200, endYear: 939 },
  { id: 'ea-vn-dinh-le', eraId: 'east-asia-comparison', polityId: 'ea-vietnam', nameKey: 'ruler.ea-vn-dinh-le', bioKey: 'rulerBio.ea-vn-dinh-le', startYear: 939, endYear: 1009 },
  { id: 'ea-vn-ly', eraId: 'east-asia-comparison', polityId: 'ea-vietnam', nameKey: 'ruler.ea-vn-ly', bioKey: 'rulerBio.ea-vn-ly', startYear: 1009, endYear: 1225 },
  { id: 'ea-vn-tran', eraId: 'east-asia-comparison', polityId: 'ea-vietnam', nameKey: 'ruler.ea-vn-tran', bioKey: 'rulerBio.ea-vn-tran', highlightKey: 'rulerHighlight.ea-vn-tran', startYear: 1225, endYear: 1400 },
  { id: 'ea-vn-le', eraId: 'east-asia-comparison', polityId: 'ea-vietnam', nameKey: 'ruler.ea-vn-le', bioKey: 'rulerBio.ea-vn-le', highlightKey: 'rulerHighlight.ea-vn-le', startYear: 1428, endYear: 1788 },
  { id: 'ea-vn-nguyen', eraId: 'east-asia-comparison', polityId: 'ea-vietnam', nameKey: 'ruler.ea-vn-nguyen', bioKey: 'rulerBio.ea-vn-nguyen', startYear: 1802, endYear: 1912 },
];
