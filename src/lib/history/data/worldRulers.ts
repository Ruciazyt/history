import type { Ruler } from '@/lib/history/types';

export const worldComparisonRulers: Ruler[] = [
  // ── China (dynasties as blocks) ────────────────────────
  { id: 'wc-cn-qin', eraId: 'world-comparison', polityId: 'wc-china', nameKey: 'ruler.wc-cn-qin-dyn', bioKey: 'rulerBio.wc-cn-qin', startYear: -221, endYear: -206 , isDynastyBlock: true },
  { id: 'wc-cn-han', eraId: 'world-comparison', polityId: 'wc-china', nameKey: 'ruler.wc-cn-han-dyn', bioKey: 'rulerBio.wc-cn-han', startYear: -206, endYear: 220 , isDynastyBlock: true },
  { id: 'wc-cn-3k', eraId: 'world-comparison', polityId: 'wc-china', nameKey: 'ruler.wc-cn-3k-dyn', bioKey: 'rulerBio.wc-cn-3k', startYear: 220, endYear: 280 , isDynastyBlock: true },
  { id: 'wc-cn-jin', eraId: 'world-comparison', polityId: 'wc-china', nameKey: 'ruler.wc-cn-jin-dyn', bioKey: 'rulerBio.wc-cn-jin', startYear: 280, endYear: 589 , isDynastyBlock: true },
  { id: 'wc-cn-sui-tang', eraId: 'world-comparison', polityId: 'wc-china', nameKey: 'ruler.wc-cn-sui-dyn', bioKey: 'rulerBio.wc-cn-sui-tang', startYear: 581, endYear: 907 , isDynastyBlock: true },
  { id: 'wc-cn-song', eraId: 'world-comparison', polityId: 'wc-china', nameKey: 'ruler.wc-cn-song-dyn', bioKey: 'rulerBio.wc-cn-song', startYear: 960, endYear: 1279 , isDynastyBlock: true },
  { id: 'wc-cn-yuan', eraId: 'world-comparison', polityId: 'wc-china', nameKey: 'ruler.wc-cn-yuan-dyn', bioKey: 'rulerBio.wc-cn-yuan', startYear: 1271, endYear: 1368 , isDynastyBlock: true },
  { id: 'wc-cn-ming', eraId: 'world-comparison', polityId: 'wc-china', nameKey: 'ruler.wc-cn-ming-dyn', bioKey: 'rulerBio.wc-cn-ming', startYear: 1368, endYear: 1644 , isDynastyBlock: true },
  { id: 'wc-cn-qing', eraId: 'world-comparison', polityId: 'wc-china', nameKey: 'ruler.wc-cn-qing-dyn', bioKey: 'rulerBio.wc-cn-qing', startYear: 1644, endYear: 1912 , isDynastyBlock: true },

  // ── Rome / Byzantine / Ottoman ─────────────────────────
  { id: 'wc-ro-republic', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-republic-dyn', bioKey: 'rulerBio.wc-ro-republic', startYear: -500, endYear: -44 , isDynastyBlock: true },
  { id: 'wc-ro-caesar', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-caesar', bioKey: 'rulerBio.wc-ro-caesar', highlightKey: 'rulerHighlight.wc-ro-caesar', startYear: -44, endYear: -27 },
  { id: 'wc-ro-augustus', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-augustus', bioKey: 'rulerBio.wc-ro-augustus', highlightKey: 'rulerHighlight.wc-ro-augustus', startYear: -27, endYear: 14 },
  { id: 'wc-ro-nerva-antonine', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-nerva-antonine', bioKey: 'rulerBio.wc-ro-nerva-antonine', startYear: 96, endYear: 192 },
  { id: 'wc-ro-constantine', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-constantine', bioKey: 'rulerBio.wc-ro-constantine', highlightKey: 'rulerHighlight.wc-ro-constantine', startYear: 306, endYear: 337 },
  { id: 'wc-ro-west-fall', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-west-dyn', bioKey: 'rulerBio.wc-ro-west-fall', startYear: 395, endYear: 476 , isDynastyBlock: true },
  { id: 'wc-ro-justinian', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-justinian', bioKey: 'rulerBio.wc-ro-justinian', highlightKey: 'rulerHighlight.wc-ro-justinian', startYear: 527, endYear: 565 },
  { id: 'wc-ro-heraclius', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-heraclius', bioKey: 'rulerBio.wc-ro-heraclius', startYear: 610, endYear: 641 },
  { id: 'wc-ro-byzantine-mid', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-byzantine-dyn', bioKey: 'rulerBio.wc-ro-byzantine-mid', startYear: 800, endYear: 1100 , isDynastyBlock: true },
  { id: 'wc-ro-byz-fall', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-byz-fall-dyn', bioKey: 'rulerBio.wc-ro-byz-fall', startYear: 1100, endYear: 1453 , isDynastyBlock: true },
  { id: 'wc-ro-suleiman', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-suleiman', bioKey: 'rulerBio.wc-ro-suleiman', highlightKey: 'rulerHighlight.wc-ro-suleiman', startYear: 1520, endYear: 1566 },
  { id: 'wc-ro-ottoman-late', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-ottoman-dyn', bioKey: 'rulerBio.wc-ro-ottoman-late', startYear: 1566, endYear: 1912 , isDynastyBlock: true },

  // ── Egypt ─────────────────────────────────────────────────────────────
  { id: 'wc-eg-old-kingdom', eraId: 'world-comparison', polityId: 'wc-egypt', nameKey: 'ruler.wc-eg-old-kingdom', bioKey: 'rulerBio.wc-eg-old-kingdom', startYear: -2686, endYear: -2181 , isDynastyBlock: true },
  { id: 'wc-eg-middle-kingdom', eraId: 'world-comparison', polityId: 'wc-egypt', nameKey: 'ruler.wc-eg-middle-kingdom', bioKey: 'rulerBio.wc-eg-middle-kingdom', startYear: -2055, endYear: -1650 , isDynastyBlock: true },
  { id: 'wc-eg-new-kingdom', eraId: 'world-comparison', polityId: 'wc-egypt', nameKey: 'ruler.wc-eg-new-kingdom', bioKey: 'rulerBio.wc-eg-new-kingdom', startYear: -1550, endYear: -1069 , isDynastyBlock: true },
  { id: 'wc-eg-ramesses', eraId: 'world-comparison', polityId: 'wc-egypt', nameKey: 'ruler.wc-eg-ramesses', bioKey: 'rulerBio.wc-eg-ramesses', highlightKey: 'rulerHighlight.wc-eg-ramesses', startYear: -1279, endYear: -1213 },
  { id: 'wc-eg-late-ptolemaic', eraId: 'world-comparison', polityId: 'wc-egypt', nameKey: 'ruler.wc-eg-ptolemaic', bioKey: 'rulerBio.wc-eg-ptolemaic', startYear: -332, endYear: -30 , isDynastyBlock: true },

  // ── Mesopotamia (Assyria / Babylon) ──────────────────────────────────
  { id: 'wc-me-akkadian', eraId: 'world-comparison', polityId: 'wc-mesopotamia', nameKey: 'ruler.wc-me-akkadian', bioKey: 'rulerBio.wc-me-akkadian', startYear: -2334, endYear: -2279 , isDynastyBlock: true },
  { id: 'wc-me-hammurabi', eraId: 'world-comparison', polityId: 'wc-mesopotamia', nameKey: 'ruler.wc-me-hammurabi', bioKey: 'rulerBio.wc-me-hammurabi', highlightKey: 'rulerHighlight.wc-me-hammurabi', startYear: -1792, endYear: -1750 },
  { id: 'wc-me-assyrian', eraId: 'world-comparison', polityId: 'wc-mesopotamia', nameKey: 'ruler.wc-me-assyrian-dyn', bioKey: 'rulerBio.wc-me-assyrian', startYear: -1363, endYear: -609 , isDynastyBlock: true },
  { id: 'wc-me-ashurbanipal', eraId: 'world-comparison', polityId: 'wc-mesopotamia', nameKey: 'ruler.wc-me-ashurbanipal', bioKey: 'rulerBio.wc-me-ashurbanipal', highlightKey: 'rulerHighlight.wc-me-ashurbanipal', startYear: -669, endYear: -627 },
  { id: 'wc-me-nebuchadnezzar', eraId: 'world-comparison', polityId: 'wc-mesopotamia', nameKey: 'ruler.wc-me-nebuchadnezzar', bioKey: 'rulerBio.wc-me-nebuchadnezzar', highlightKey: 'rulerHighlight.wc-me-nebuchadnezzar', startYear: -605, endYear: -562 },

  // ── Indus Valley / Maurya ──────────────────────────────────────────────
  { id: 'wc-iv-indus', eraId: 'world-comparison', polityId: 'wc-indus', nameKey: 'ruler.wc-iv-indus', bioKey: 'rulerBio.wc-iv-indus', startYear: -2600, endYear: -1900 , isDynastyBlock: true },
  { id: 'wc-iv-maurya', eraId: 'world-comparison', polityId: 'wc-indus', nameKey: 'ruler.wc-iv-maurya', bioKey: 'rulerBio.wc-iv-maurya', startYear: -322, endYear: -185 , isDynastyBlock: true },
  { id: 'wc-iv-chandragupta', eraId: 'world-comparison', polityId: 'wc-indus', nameKey: 'ruler.wc-iv-chandragupta', bioKey: 'rulerBio.wc-iv-chandragupta', highlightKey: 'rulerHighlight.wc-iv-chandragupta', startYear: -322, endYear: -298 },
  { id: 'wc-iv-ashoka', eraId: 'world-comparison', polityId: 'wc-indus', nameKey: 'ruler.wc-iv-ashoka', bioKey: 'rulerBio.wc-iv-ashoka', highlightKey: 'rulerHighlight.wc-iv-ashoka', startYear: -268, endYear: -232 },

  // ── Gupta Empire (India) ───────────────────────────────────────────────
  { id: 'wc-iv-gupta', eraId: 'world-comparison', polityId: 'wc-indus', nameKey: 'ruler.wc-iv-gupta-dyn', bioKey: 'rulerBio.wc-iv-gupta', startYear: 320, endYear: 550 , isDynastyBlock: true },
  { id: 'wc-iv-samudragupta', eraId: 'world-comparison', polityId: 'wc-indus', nameKey: 'ruler.wc-iv-samudragupta', bioKey: 'rulerBio.wc-iv-samudragupta', highlightKey: 'rulerHighlight.wc-iv-samudragupta', startYear: 335, endYear: 380 },
  { id: 'wc-iv-chandragupta-ii', eraId: 'world-comparison', polityId: 'wc-indus', nameKey: 'ruler.wc-iv-chandragupta-ii', bioKey: 'rulerBio.wc-iv-chandragupta-ii', highlightKey: 'rulerHighlight.wc-iv-chandragupta-ii', startYear: 375, endYear: 415 },

  // ── Kushan Empire (India/Central Asia) ──────────────────────────────────
  { id: 'wc-iv-kushan', eraId: 'world-comparison', polityId: 'wc-indus', nameKey: 'ruler.wc-iv-kushan-dyn', bioKey: 'rulerBio.wc-iv-kushan', startYear: 30, endYear: 375 , isDynastyBlock: true },
  { id: 'wc-iv-kanishka', eraId: 'world-comparison', polityId: 'wc-indus', nameKey: 'ruler.wc-iv-kanishka', bioKey: 'rulerBio.wc-iv-kanishka', highlightKey: 'rulerHighlight.wc-iv-kanishka', startYear: 127, endYear: 150 },
  // ── Satavahana Kingdom (India) ────────────────────────────────
  { id: 'wc-iv-satavahana', eraId: 'world-comparison', polityId: 'wc-indus', nameKey: 'ruler.wc-iv-satavahana-dyn', bioKey: 'rulerBio.wc-iv-satavahana', startYear: -200, endYear: 220 , isDynastyBlock: true },
  { id: 'wc-iv-gautamiputra', eraId: 'world-comparison', polityId: 'wc-indus', nameKey: 'ruler.wc-iv-gautamiputra', bioKey: 'rulerBio.wc-iv-gautamiputra', highlightKey: 'rulerHighlight.wc-iv-gautamiputra', startYear: 106, endYear: 130 },

  // ── Srivijaya Empire (Maritime SE Asia) ──────────────────────
  { id: 'wc-iv-srivijaya', eraId: 'world-comparison', polityId: 'wc-indus', nameKey: 'ruler.wc-iv-srivijaya-dyn', bioKey: 'rulerBio.wc-iv-srivijaya', startYear: 600, endYear: 1295 , isDynastyBlock: true },

  // ── Persia ─────────────────────────────────────────────
  { id: 'wc-pe-cyrus', eraId: 'world-comparison', polityId: 'wc-persia', nameKey: 'ruler.wc-pe-cyrus', bioKey: 'rulerBio.wc-pe-cyrus', highlightKey: 'rulerHighlight.wc-pe-cyrus', startYear: -550, endYear: -530 },
  { id: 'wc-pe-darius', eraId: 'world-comparison', polityId: 'wc-persia', nameKey: 'ruler.wc-pe-darius', bioKey: 'rulerBio.wc-pe-darius', highlightKey: 'rulerHighlight.wc-pe-darius', startYear: -522, endYear: -486 },
  { id: 'wc-pe-xerxes', eraId: 'world-comparison', polityId: 'wc-persia', nameKey: 'ruler.wc-pe-xerxes', bioKey: 'rulerBio.wc-pe-xerxes', startYear: -486, endYear: -330 },
  { id: 'wc-pe-seleucid', eraId: 'world-comparison', polityId: 'wc-persia', nameKey: 'ruler.wc-pe-seleucid-dyn', bioKey: 'rulerBio.wc-pe-seleucid', startYear: -312, endYear: -63 , isDynastyBlock: true },
  { id: 'wc-pe-parthian', eraId: 'world-comparison', polityId: 'wc-persia', nameKey: 'ruler.wc-pe-parthian-dyn', bioKey: 'rulerBio.wc-pe-parthian', startYear: -247, endYear: 224 , isDynastyBlock: true },
  { id: 'wc-pe-ardashir', eraId: 'world-comparison', polityId: 'wc-persia', nameKey: 'ruler.wc-pe-ardashir', bioKey: 'rulerBio.wc-pe-ardashir', startYear: 224, endYear: 241 },
  { id: 'wc-pe-shapur', eraId: 'world-comparison', polityId: 'wc-persia', nameKey: 'ruler.wc-pe-shapur', bioKey: 'rulerBio.wc-pe-shapur', highlightKey: 'rulerHighlight.wc-pe-shapur', startYear: 241, endYear: 651 },
  { id: 'wc-pe-safavid', eraId: 'world-comparison', polityId: 'wc-persia', nameKey: 'ruler.wc-pe-safavid', bioKey: 'rulerBio.wc-pe-safavid', startYear: 1501, endYear: 1736 },

  // ── Hellenistic Greece ─────────────────────────────────
  { id: 'wc-he-alexander', eraId: 'world-comparison', polityId: 'wc-hellenistic', nameKey: 'ruler.wc-he-alexander', bioKey: 'rulerBio.wc-he-alexander', highlightKey: 'rulerHighlight.wc-he-alexander', startYear: -336, endYear: -323 },
  { id: 'wc-he-seleucid', eraId: 'world-comparison', polityId: 'wc-hellenistic', nameKey: 'ruler.wc-he-seleucid-dyn', bioKey: 'rulerBio.wc-he-seleucid', startYear: -312, endYear: -63 , isDynastyBlock: true },
  { id: 'wc-he-antigonid', eraId: 'world-comparison', polityId: 'wc-hellenistic', nameKey: 'ruler.wc-he-antigonid-dyn', bioKey: 'rulerBio.wc-he-antigonid', startYear: -306, endYear: -168 , isDynastyBlock: true },
  { id: 'wc-he-ptolemaic', eraId: 'world-comparison', polityId: 'wc-hellenistic', nameKey: 'ruler.wc-he-ptolemaic-dyn', bioKey: 'rulerBio.wc-he-ptolemaic', startYear: -305, endYear: -30 , isDynastyBlock: true },

  // ── Islam ──────────────────────────────────────────────
  { id: 'wc-is-muhammad', eraId: 'world-comparison', polityId: 'wc-islam', nameKey: 'ruler.wc-is-muhammad', bioKey: 'rulerBio.wc-is-muhammad', highlightKey: 'rulerHighlight.wc-is-muhammad', startYear: 610, endYear: 632 },
  { id: 'wc-is-rashidun', eraId: 'world-comparison', polityId: 'wc-islam', nameKey: 'ruler.wc-is-rashidun-dyn', bioKey: 'rulerBio.wc-is-rashidun', startYear: 632, endYear: 661 , isDynastyBlock: true },
  { id: 'wc-is-umayyad', eraId: 'world-comparison', polityId: 'wc-islam', nameKey: 'ruler.wc-is-umayyad', bioKey: 'rulerBio.wc-is-umayyad', startYear: 661, endYear: 750 },
  { id: 'wc-is-harun', eraId: 'world-comparison', polityId: 'wc-islam', nameKey: 'ruler.wc-is-harun', bioKey: 'rulerBio.wc-is-harun', highlightKey: 'rulerHighlight.wc-is-harun', startYear: 786, endYear: 833 },
  { id: 'wc-is-abbasid-late', eraId: 'world-comparison', polityId: 'wc-islam', nameKey: 'ruler.wc-is-abbasid-dyn', bioKey: 'rulerBio.wc-is-abbasid-late', startYear: 833, endYear: 1258 , isDynastyBlock: true },
  { id: 'wc-is-saladin', eraId: 'world-comparison', polityId: 'wc-islam', nameKey: 'ruler.wc-is-saladin', bioKey: 'rulerBio.wc-is-saladin', highlightKey: 'rulerHighlight.wc-is-saladin', startYear: 1174, endYear: 1193 },
  { id: 'wc-is-genghis', eraId: 'world-comparison', polityId: 'wc-islam', nameKey: 'ruler.wc-is-genghis', bioKey: 'rulerBio.wc-is-genghis', highlightKey: 'rulerHighlight.wc-is-genghis', startYear: 1206, endYear: 1227 },
  { id: 'wc-is-ilkhanate', eraId: 'world-comparison', polityId: 'wc-islam', nameKey: 'ruler.wc-is-mongol-dyn', bioKey: 'rulerBio.wc-is-ilkhanate', startYear: 1256, endYear: 1370 , isDynastyBlock: true },
  { id: 'wc-is-timur', eraId: 'world-comparison', polityId: 'wc-islam', nameKey: 'ruler.wc-is-timur', bioKey: 'rulerBio.wc-is-timur', highlightKey: 'rulerHighlight.wc-is-timur', startYear: 1370, endYear: 1405 },
  { id: 'wc-is-timurid-late', eraId: 'world-comparison', polityId: 'wc-islam', nameKey: 'ruler.wc-is-timurid-dyn', bioKey: 'rulerBio.wc-is-timurid-late', startYear: 1405, endYear: 1526 , isDynastyBlock: true },
  { id: 'wc-is-akbar', eraId: 'world-comparison', polityId: 'wc-islam', nameKey: 'ruler.wc-is-akbar', bioKey: 'rulerBio.wc-is-akbar', highlightKey: 'rulerHighlight.wc-is-akbar', startYear: 1556, endYear: 1605 },
];

// ══ East Asia Comparison ═══════════════════════════════════════════════════

export const eastAsiaRulers: import('@/lib/history/types').Ruler[] = [
  // ── China (same blocks, ea- prefix) ────────────────────────────────────
  { id: 'ea-cn-han', eraId: 'east-asia-comparison', polityId: 'ea-china', nameKey: 'ruler.wc-cn-han-dyn', bioKey: 'rulerBio.wc-cn-han', startYear: -206, endYear: 220 , isDynastyBlock: true },
  { id: 'ea-cn-3k-jin', eraId: 'east-asia-comparison', polityId: 'ea-china', nameKey: 'ruler.wc-cn-3k-dyn', bioKey: 'rulerBio.wc-cn-3k', startYear: 220, endYear: 589 , isDynastyBlock: true },
  { id: 'ea-cn-sui-tang', eraId: 'east-asia-comparison', polityId: 'ea-china', nameKey: 'ruler.wc-cn-sui-dyn', bioKey: 'rulerBio.wc-cn-sui-tang', startYear: 581, endYear: 907 , isDynastyBlock: true },
  { id: 'ea-cn-song', eraId: 'east-asia-comparison', polityId: 'ea-china', nameKey: 'ruler.wc-cn-song-dyn', bioKey: 'rulerBio.wc-cn-song', startYear: 960, endYear: 1279 , isDynastyBlock: true },
  { id: 'ea-cn-yuan', eraId: 'east-asia-comparison', polityId: 'ea-china', nameKey: 'ruler.wc-cn-yuan-dyn', bioKey: 'rulerBio.wc-cn-yuan', startYear: 1271, endYear: 1368 , isDynastyBlock: true },
  { id: 'ea-cn-ming', eraId: 'east-asia-comparison', polityId: 'ea-china', nameKey: 'ruler.wc-cn-ming-dyn', bioKey: 'rulerBio.wc-cn-ming', startYear: 1368, endYear: 1644 , isDynastyBlock: true },
  { id: 'ea-cn-qing', eraId: 'east-asia-comparison', polityId: 'ea-china', nameKey: 'ruler.wc-cn-qing-dyn', bioKey: 'rulerBio.wc-cn-qing', startYear: 1644, endYear: 1912 , isDynastyBlock: true },

  // ── Japan ──────────────────────────────────────────────────────────────
  { id: 'ea-jp-yayoi', eraId: 'east-asia-comparison', polityId: 'ea-japan', nameKey: 'ruler.ea-jp-yayoi', bioKey: 'rulerBio.ea-jp-yayoi', startYear: -200, endYear: 250 , isDynastyBlock: true },
  { id: 'ea-jp-yamato', eraId: 'east-asia-comparison', polityId: 'ea-japan', nameKey: 'ruler.ea-jp-yamato', bioKey: 'rulerBio.ea-jp-yamato', startYear: 250, endYear: 710 , isDynastyBlock: true },
  { id: 'ea-jp-nara', eraId: 'east-asia-comparison', polityId: 'ea-japan', nameKey: 'ruler.ea-jp-nara', bioKey: 'rulerBio.ea-jp-nara', startYear: 710, endYear: 794 , isDynastyBlock: true },
  { id: 'ea-jp-heian', eraId: 'east-asia-comparison', polityId: 'ea-japan', nameKey: 'ruler.ea-jp-heian', bioKey: 'rulerBio.ea-jp-heian', highlightKey: 'rulerHighlight.ea-jp-heian', startYear: 794, endYear: 1185 , isDynastyBlock: true },
  { id: 'ea-jp-kamakura', eraId: 'east-asia-comparison', polityId: 'ea-japan', nameKey: 'ruler.ea-jp-kamakura', bioKey: 'rulerBio.ea-jp-kamakura', startYear: 1185, endYear: 1333 , isDynastyBlock: true },
  { id: 'ea-jp-yoritomo', eraId: 'east-asia-comparison', polityId: 'ea-japan', nameKey: 'ruler.ea-jp-yoritomo', bioKey: 'rulerBio.ea-jp-yoritomo', highlightKey: 'rulerHighlight.ea-jp-yoritomo', startYear: 1185, endYear: 1199 },
  { id: 'ea-jp-muromachi', eraId: 'east-asia-comparison', polityId: 'ea-japan', nameKey: 'ruler.ea-jp-muromachi', bioKey: 'rulerBio.ea-jp-muromachi', startYear: 1336, endYear: 1573 , isDynastyBlock: true },
  { id: 'ea-jp-sengoku', eraId: 'east-asia-comparison', polityId: 'ea-japan', nameKey: 'ruler.ea-jp-sengoku', bioKey: 'rulerBio.ea-jp-sengoku', highlightKey: 'rulerHighlight.ea-jp-sengoku', startYear: 1467, endYear: 1615 , isDynastyBlock: true },
  { id: 'ea-jp-hideyoshi', eraId: 'east-asia-comparison', polityId: 'ea-japan', nameKey: 'ruler.ea-jp-hideyoshi', bioKey: 'rulerBio.ea-jp-hideyoshi', highlightKey: 'rulerHighlight.ea-jp-hideyoshi', startYear: 1582, endYear: 1598 },
  { id: 'ea-jp-ieru', eraId: 'east-asia-comparison', polityId: 'ea-japan', nameKey: 'ruler.ea-jp-ieru', bioKey: 'rulerBio.ea-jp-ieru', highlightKey: 'rulerHighlight.ea-jp-ieru', startYear: 1603, endYear: 1616 },
  { id: 'ea-jp-edo', eraId: 'east-asia-comparison', polityId: 'ea-japan', nameKey: 'ruler.ea-jp-edo', bioKey: 'rulerBio.ea-jp-edo', highlightKey: 'rulerHighlight.ea-jp-edo', startYear: 1603, endYear: 1868 , isDynastyBlock: true },
  { id: 'ea-jp-meiji', eraId: 'east-asia-comparison', polityId: 'ea-japan', nameKey: 'ruler.ea-jp-meiji', bioKey: 'rulerBio.ea-jp-meiji', highlightKey: 'rulerHighlight.ea-jp-meiji', startYear: 1868, endYear: 1912 },

  // ── Korea ──────────────────────────────────────────────────────────────
  { id: 'ea-kr-three', eraId: 'east-asia-comparison', polityId: 'ea-korea', nameKey: 'ruler.ea-kr-three', bioKey: 'rulerBio.ea-kr-three', startYear: -200, endYear: 668 , isDynastyBlock: true },
  { id: 'ea-kr-silla', eraId: 'east-asia-comparison', polityId: 'ea-korea', nameKey: 'ruler.ea-kr-silla', bioKey: 'rulerBio.ea-kr-silla', highlightKey: 'rulerHighlight.ea-kr-silla', startYear: 668, endYear: 935 , isDynastyBlock: true },
  { id: 'ea-kr-goryeo', eraId: 'east-asia-comparison', polityId: 'ea-korea', nameKey: 'ruler.ea-kr-goryeo', bioKey: 'rulerBio.ea-kr-goryeo', highlightKey: 'rulerHighlight.ea-kr-goryeo', startYear: 918, endYear: 1392 , isDynastyBlock: true },
  { id: 'ea-kr-joseon', eraId: 'east-asia-comparison', polityId: 'ea-korea', nameKey: 'ruler.ea-kr-joseon', bioKey: 'rulerBio.ea-kr-joseon', highlightKey: 'rulerHighlight.ea-kr-joseon', startYear: 1392, endYear: 1897 , isDynastyBlock: true },
  { id: 'ea-kr-empire', eraId: 'east-asia-comparison', polityId: 'ea-korea', nameKey: 'ruler.ea-kr-empire', bioKey: 'rulerBio.ea-kr-empire', startYear: 1897, endYear: 1912 , isDynastyBlock: true },

  // ── Vietnam ────────────────────────────────────────────────────────────
  { id: 'ea-vn-china-rule', eraId: 'east-asia-comparison', polityId: 'ea-vietnam', nameKey: 'ruler.ea-vn-china-rule', bioKey: 'rulerBio.ea-vn-china-rule', startYear: -200, endYear: 939 , isDynastyBlock: true },
  { id: 'ea-vn-dinh-le', eraId: 'east-asia-comparison', polityId: 'ea-vietnam', nameKey: 'ruler.ea-vn-dinh-le', bioKey: 'rulerBio.ea-vn-dinh-le', startYear: 939, endYear: 1009 , isDynastyBlock: true },
  { id: 'ea-vn-ly', eraId: 'east-asia-comparison', polityId: 'ea-vietnam', nameKey: 'ruler.ea-vn-ly', bioKey: 'rulerBio.ea-vn-ly', startYear: 1009, endYear: 1225 , isDynastyBlock: true },
  { id: 'ea-vn-tran', eraId: 'east-asia-comparison', polityId: 'ea-vietnam', nameKey: 'ruler.ea-vn-tran', bioKey: 'rulerBio.ea-vn-tran', highlightKey: 'rulerHighlight.ea-vn-tran', startYear: 1225, endYear: 1400 , isDynastyBlock: true },
  { id: 'ea-vn-le', eraId: 'east-asia-comparison', polityId: 'ea-vietnam', nameKey: 'ruler.ea-vn-le', bioKey: 'rulerBio.ea-vn-le', highlightKey: 'rulerHighlight.ea-vn-le', startYear: 1428, endYear: 1788 , isDynastyBlock: true },
  { id: 'ea-vn-nguyen', eraId: 'east-asia-comparison', polityId: 'ea-vietnam', nameKey: 'ruler.ea-vn-nguyen', bioKey: 'rulerBio.ea-vn-nguyen', startYear: 1802, endYear: 1912 , isDynastyBlock: true },
];
