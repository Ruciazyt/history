import type { Ruler } from '@/lib/history/types';

export const worldComparisonRulers: Ruler[] = [

  // ── Göktürk Khaganate (Central Asia) ─────────────────────────────────────
  { id: 'wc-gokturk-dyn', eraId: 'world-comparison', polityId: 'wc-gokturk', nameKey: 'ruler.wc-gokturk-dyn', bioKey: 'rulerBio.wc-gokturk-dyn', startYear: 552, endYear: 744 , isDynastyBlock: true },
  { id: 'wc-gokturk-tardu', eraId: 'world-comparison', polityId: 'wc-gokturk', nameKey: 'ruler.wc-gokturk-tardu', bioKey: 'rulerBio.wc-gokturk-tardu', highlightKey: 'rulerHighlight.wc-gokturk-tardu', startYear: 572, endYear: 603 },

  // ── China (dynasties as blocks) ────────────────────────
  { id: 'wc-cn-qin', eraId: 'world-comparison', polityId: 'wc-china', nameKey: 'ruler.wc-cn-qin-dyn', bioKey: 'rulerBio.wc-cn-qin', startYear: -221, endYear: -206 , isDynastyBlock: true },
  { id: 'wc-cn-han', eraId: 'world-comparison', polityId: 'wc-china', nameKey: 'ruler.wc-cn-han-dyn', bioKey: 'rulerBio.wc-cn-han', startYear: -206, endYear: 220 , isDynastyBlock: true },
  { id: 'wc-cn-wuhan', eraId: 'world-comparison', polityId: 'wc-china', nameKey: 'ruler.wc-cn-wuhan', bioKey: 'rulerBio.wc-cn-wuhan', highlightKey: 'rulerHighlight.wc-cn-wuhan', startYear: -141, endYear: -87 },
  { id: 'wc-cn-3k', eraId: 'world-comparison', polityId: 'wc-china', nameKey: 'ruler.wc-cn-3k-dyn', bioKey: 'rulerBio.wc-cn-3k', startYear: 220, endYear: 280 , isDynastyBlock: true },
  { id: 'wc-cn-jin', eraId: 'world-comparison', polityId: 'wc-china', nameKey: 'ruler.wc-cn-jin-dyn', bioKey: 'rulerBio.wc-cn-jin', startYear: 280, endYear: 589 , isDynastyBlock: true },
  { id: 'wc-cn-sui-tang', eraId: 'world-comparison', polityId: 'wc-china', nameKey: 'ruler.wc-cn-sui-dyn', bioKey: 'rulerBio.wc-cn-sui-tang', startYear: 581, endYear: 907 , isDynastyBlock: true },
  { id: 'wc-cn-taizong', eraId: 'world-comparison', polityId: 'wc-china', nameKey: 'ruler.wc-cn-taizong', bioKey: 'rulerBio.wc-cn-taizong', highlightKey: 'rulerHighlight.wc-cn-taizong', startYear: 626, endYear: 649 },
  { id: 'wc-cn-song', eraId: 'world-comparison', polityId: 'wc-china', nameKey: 'ruler.wc-cn-song-dyn', bioKey: 'rulerBio.wc-cn-song', startYear: 960, endYear: 1279 , isDynastyBlock: true },
  { id: 'wc-cn-yuan', eraId: 'world-comparison', polityId: 'wc-china', nameKey: 'ruler.wc-cn-yuan-dyn', bioKey: 'rulerBio.wc-cn-yuan', startYear: 1271, endYear: 1368 , isDynastyBlock: true },
  { id: 'wc-cn-ming', eraId: 'world-comparison', polityId: 'wc-china', nameKey: 'ruler.wc-cn-ming-dyn', bioKey: 'rulerBio.wc-cn-ming', startYear: 1368, endYear: 1644 , isDynastyBlock: true },
  { id: 'wc-cn-qing', eraId: 'world-comparison', polityId: 'wc-china', nameKey: 'ruler.wc-cn-qing-dyn', bioKey: 'rulerBio.wc-cn-qing', startYear: 1644, endYear: 1912 , isDynastyBlock: true },

  // ── Rome / Byzantine / Ottoman ─────────────────────────
  { id: 'wc-ro-republic', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-republic-dyn', bioKey: 'rulerBio.wc-ro-republic', startYear: -500, endYear: -44 , isDynastyBlock: true },
  { id: 'wc-ro-caesar', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-caesar', bioKey: 'rulerBio.wc-ro-caesar', highlightKey: 'rulerHighlight.wc-ro-caesar', startYear: -44, endYear: -27 },
  { id: 'wc-ro-augustus', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-augustus', bioKey: 'rulerBio.wc-ro-augustus', highlightKey: 'rulerHighlight.wc-ro-augustus', startYear: -27, endYear: 14 },
  { id: 'wc-ro-nerva-antonine', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-nerva-antonine', bioKey: 'rulerBio.wc-ro-nerva-antonine', startYear: 96, endYear: 192 },
  { id: 'wc-ro-trajan', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-trajan', bioKey: 'rulerBio.wc-ro-trajan', highlightKey: 'rulerHighlight.wc-ro-trajan', startYear: 98, endYear: 117 },
  { id: 'wc-ro-hadrian', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-hadrian', bioKey: 'rulerBio.wc-ro-hadrian', highlightKey: 'rulerHighlight.wc-ro-hadrian', startYear: 117, endYear: 138 },
  { id: 'wc-ro-antoninus', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-antoninus', bioKey: 'rulerBio.wc-ro-antoninus', highlightKey: 'rulerHighlight.wc-ro-antoninus', startYear: 138, endYear: 161 },
  { id: 'wc-ro-marcus-aurelius', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-marcus-aurelius', bioKey: 'rulerBio.wc-ro-marcus-aurelius', highlightKey: 'rulerHighlight.wc-ro-marcus-aurelius', startYear: 161, endYear: 180 },
  { id: 'wc-ro-diocletian', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-diocletian', bioKey: 'rulerBio.wc-ro-diocletian', highlightKey: 'rulerHighlight.wc-ro-diocletian', startYear: 284, endYear: 305 },
  { id: 'wc-ro-constantine', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-constantine', bioKey: 'rulerBio.wc-ro-constantine', highlightKey: 'rulerHighlight.wc-ro-constantine', startYear: 306, endYear: 337 },
  { id: 'wc-ro-theodosius', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-theodosius', bioKey: 'rulerBio.wc-ro-theodosius', highlightKey: 'rulerHighlight.wc-ro-theodosius', startYear: 379, endYear: 395 },
  { id: 'wc-ro-west-fall', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-west-dyn', bioKey: 'rulerBio.wc-ro-west-fall', startYear: 395, endYear: 476 , isDynastyBlock: true },
  { id: 'wc-ro-justinian', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-justinian', bioKey: 'rulerBio.wc-ro-justinian', highlightKey: 'rulerHighlight.wc-ro-justinian', startYear: 527, endYear: 565 },
  { id: 'wc-ro-heraclius', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-heraclius', bioKey: 'rulerBio.wc-ro-heraclius', highlightKey: 'rulerHighlight.wc-ro-heraclius', startYear: 610, endYear: 641 },
  { id: 'wc-ro-byzantine-mid', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-byzantine-dyn', bioKey: 'rulerBio.wc-ro-byzantine-mid', startYear: 800, endYear: 1100 , isDynastyBlock: true },
  { id: 'wc-ro-basil', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-basil', bioKey: 'rulerBio.wc-ro-basil', highlightKey: 'rulerHighlight.wc-ro-basil', startYear: 976, endYear: 1025 },
  { id: 'wc-ro-byz-fall', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-byz-fall-dyn', bioKey: 'rulerBio.wc-ro-byz-fall', startYear: 1100, endYear: 1453 , isDynastyBlock: true },
  // ── Holy Roman Empire (Frederick Barbarossa) ─────────────────────────
  { id: 'wc-ro-frederick', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-frederick', bioKey: 'rulerBio.wc-ro-frederick', highlightKey: 'rulerHighlight.wc-ro-frederick', startYear: 1152, endYear: 1190 },
  { id: 'wc-ro-suleiman', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-suleiman', bioKey: 'rulerBio.wc-ro-suleiman', highlightKey: 'rulerHighlight.wc-ro-suleiman', startYear: 1520, endYear: 1566 },
  // ── Holy Roman Empire / Spanish Empire (Charles V) ────────────────────
  { id: 'wc-ro-charles-v', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-charles-v', bioKey: 'rulerBio.wc-ro-charles-v', highlightKey: 'rulerHighlight.wc-ro-charles-v', startYear: 1519, endYear: 1556 },
  // ── Ottoman Empire (Mehmed II, Selim I, Bayezid II) ──────────────────
  { id: 'wc-ro-mehmed-ii', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-mehmed-ii', bioKey: 'rulerBio.wc-ro-mehmed-ii', highlightKey: 'rulerHighlight.wc-ro-mehmed-ii', startYear: 1451, endYear: 1481 },
  { id: 'wc-ro-bayezid-ii', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-bayezid-ii', bioKey: 'rulerBio.wc-ro-bayezid-ii', highlightKey: 'rulerHighlight.wc-ro-bayezid-ii', startYear: 1481, endYear: 1512 },
  { id: 'wc-ro-selim-i', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-selim-i', bioKey: 'rulerBio.wc-ro-selim-i', highlightKey: 'rulerHighlight.wc-ro-selim-i', startYear: 1512, endYear: 1520 },
  { id: 'wc-ro-ottoman-late', eraId: 'world-comparison', polityId: 'wc-rome', nameKey: 'ruler.wc-ro-ottoman-dyn', bioKey: 'rulerBio.wc-ro-ottoman-late', startYear: 1566, endYear: 1912 , isDynastyBlock: true },

  // ── Egypt ─────────────────────────────────────────────────────────────
  { id: 'wc-eg-old-kingdom', eraId: 'world-comparison', polityId: 'wc-egypt', nameKey: 'ruler.wc-eg-old-kingdom', bioKey: 'rulerBio.wc-eg-old-kingdom', startYear: -2686, endYear: -2181 , isDynastyBlock: true },
  { id: 'wc-eg-middle-kingdom', eraId: 'world-comparison', polityId: 'wc-egypt', nameKey: 'ruler.wc-eg-middle-kingdom', bioKey: 'rulerBio.wc-eg-middle-kingdom', startYear: -2055, endYear: -1650 , isDynastyBlock: true },
  { id: 'wc-eg-new-kingdom', eraId: 'world-comparison', polityId: 'wc-egypt', nameKey: 'ruler.wc-eg-new-kingdom', bioKey: 'rulerBio.wc-eg-new-kingdom', startYear: -1550, endYear: -1069 , isDynastyBlock: true },
  { id: 'wc-eg-hatshepsut', eraId: 'world-comparison', polityId: 'wc-egypt', nameKey: 'ruler.wc-eg-hatshepsut', bioKey: 'rulerBio.wc-eg-hatshepsut', highlightKey: 'rulerHighlight.wc-eg-hatshepsut', startYear: -1478, endYear: -1458 },
  { id: 'wc-eg-akhenaten', eraId: 'world-comparison', polityId: 'wc-egypt', nameKey: 'ruler.wc-eg-akhenaten', bioKey: 'rulerBio.wc-eg-akhenaten', highlightKey: 'rulerHighlight.wc-eg-akhenaten', startYear: -1353, endYear: -1336 },
  { id: 'wc-eg-ramesses', eraId: 'world-comparison', polityId: 'wc-egypt', nameKey: 'ruler.wc-eg-ramesses', bioKey: 'rulerBio.wc-eg-ramesses', highlightKey: 'rulerHighlight.wc-eg-ramesses', startYear: -1279, endYear: -1213 },
  { id: 'wc-eg-cleopatra', eraId: 'world-comparison', polityId: 'wc-egypt', nameKey: 'ruler.wc-eg-cleopatra', bioKey: 'rulerBio.wc-eg-cleopatra', highlightKey: 'rulerHighlight.wc-eg-cleopatra', startYear: -51, endYear: -30 },
  { id: 'wc-eg-late-ptolemaic', eraId: 'world-comparison', polityId: 'wc-egypt', nameKey: 'ruler.wc-eg-ptolemaic', bioKey: 'rulerBio.wc-eg-ptolemaic', startYear: -332, endYear: -30 , isDynastyBlock: true },

  // ── Mesopotamia (Assyria / Babylon) ──────────────────────────────────
  { id: 'wc-me-akkadian', eraId: 'world-comparison', polityId: 'wc-mesopotamia', nameKey: 'ruler.wc-me-akkadian', bioKey: 'rulerBio.wc-me-akkadian', startYear: -2334, endYear: -2279 , isDynastyBlock: true },
  { id: 'wc-me-sargon', eraId: 'world-comparison', polityId: 'wc-mesopotamia', nameKey: 'ruler.wc-me-sargon', bioKey: 'rulerBio.wc-me-sargon', highlightKey: 'rulerHighlight.wc-me-sargon', startYear: -2334, endYear: -2279 },
  { id: 'wc-me-hammurabi', eraId: 'world-comparison', polityId: 'wc-mesopotamia', nameKey: 'ruler.wc-me-hammurabi', bioKey: 'rulerBio.wc-me-hammurabi', highlightKey: 'rulerHighlight.wc-me-hammurabi', startYear: -1792, endYear: -1750 },
  { id: 'wc-me-assyrian', eraId: 'world-comparison', polityId: 'wc-mesopotamia', nameKey: 'ruler.wc-me-assyrian-dyn', bioKey: 'rulerBio.wc-me-assyrian', startYear: -1363, endYear: -609 , isDynastyBlock: true },
  { id: 'wc-me-ashurbanipal', eraId: 'world-comparison', polityId: 'wc-mesopotamia', nameKey: 'ruler.wc-me-ashurbanipal', bioKey: 'rulerBio.wc-me-ashurbanipal', highlightKey: 'rulerHighlight.wc-me-ashurbanipal', startYear: -669, endYear: -627 },
  { id: 'wc-me-nebuchadnezzar', eraId: 'world-comparison', polityId: 'wc-mesopotamia', nameKey: 'ruler.wc-me-nebuchadnezzar', bioKey: 'rulerBio.wc-me-nebuchadnezzar', highlightKey: 'rulerHighlight.wc-me-nebuchadnezzar', startYear: -605, endYear: -562 },

  { id: 'wc-me-hittite', eraId: 'world-comparison', polityId: 'wc-mesopotamia', nameKey: 'ruler.wc-me-hittite', bioKey: 'rulerBio.wc-me-hittite', highlightKey: 'rulerHighlight.wc-me-hittite', startYear: -1650, endYear: -1178 , isDynastyBlock: true },

  // ── Median Empire (Ancient Iran) ────────────────────────────────────────
  { id: 'wc-me-median', eraId: 'world-comparison', polityId: 'wc-median', nameKey: 'ruler.wc-me-median', bioKey: 'rulerBio.wc-me-median', startYear: -678, endYear: -549 , isDynastyBlock: true },
  { id: 'wc-me-cyaxares', eraId: 'world-comparison', polityId: 'wc-median', nameKey: 'ruler.wc-me-cyaxares', bioKey: 'rulerBio.wc-me-cyaxares', highlightKey: 'rulerHighlight.wc-me-cyaxares', startYear: -625, endYear: -585 },
  // ── Kievan Rus (Eastern Europe) ────────────────────────────────────────
  { id: 'wc-rus-rurik', eraId: 'world-comparison', polityId: 'wc-rus', nameKey: 'ruler.wc-rus-rurik', bioKey: 'rulerBio.wc-rus-rurik', startYear: 862, endYear: 879 , isDynastyBlock: true },
  { id: 'wc-rus-vladimir', eraId: 'world-comparison', polityId: 'wc-rus', nameKey: 'ruler.wc-rus-vladimir', bioKey: 'rulerBio.wc-rus-vladimir', highlightKey: 'rulerHighlight.wc-rus-vladimir', startYear: 980, endYear: 1015 },
  { id: 'wc-rus-yaroslav', eraId: 'world-comparison', polityId: 'wc-rus', nameKey: 'ruler.wc-rus-yaroslav', bioKey: 'rulerBio.wc-rus-yaroslav', highlightKey: 'rulerHighlight.wc-rus-yaroslav', startYear: 1019, endYear: 1054 },
  { id: 'wc-rus-nevsky', eraId: 'world-comparison', polityId: 'wc-rus', nameKey: 'ruler.wc-rus-nevsky', bioKey: 'rulerBio.wc-rus-nevsky', highlightKey: 'rulerHighlight.wc-rus-nevsky', startYear: 1221, endYear: 1263 },
  { id: 'wc-rus-apogee', eraId: 'world-comparison', polityId: 'wc-rus', nameKey: 'ruler.wc-rus-dyn', bioKey: 'rulerBio.wc-rus-apogee', startYear: 882, endYear: 1240 , isDynastyBlock: true },

  // ── Indus Valley / Maurya ──────────────────────────────────────────────
  { id: 'wc-iv-indus', eraId: 'world-comparison', polityId: 'wc-indus', nameKey: 'ruler.wc-iv-indus', bioKey: 'rulerBio.wc-iv-indus', startYear: -2600, endYear: -1900 , isDynastyBlock: true },
  { id: 'wc-iv-maurya', eraId: 'world-comparison', polityId: 'wc-indus', nameKey: 'ruler.wc-iv-maurya', bioKey: 'rulerBio.wc-iv-maurya', startYear: -322, endYear: -185 , isDynastyBlock: true },
  { id: 'wc-iv-chandragupta', eraId: 'world-comparison', polityId: 'wc-indus', nameKey: 'ruler.wc-iv-chandragupta', bioKey: 'rulerBio.wc-iv-chandragupta', highlightKey: 'rulerHighlight.wc-iv-chandragupta', startYear: -322, endYear: -298 },
  { id: 'wc-iv-ashoka', eraId: 'world-comparison', polityId: 'wc-indus', nameKey: 'ruler.wc-iv-ashoka', bioKey: 'rulerBio.wc-iv-ashoka', highlightKey: 'rulerHighlight.wc-iv-ashoka', startYear: -268, endYear: -232 },
  // ── Greco-Bactrian Kingdom (India) ─────────────────────────────────────
  { id: 'wc-iv-menander', eraId: 'world-comparison', polityId: 'wc-indus', nameKey: 'ruler.wc-iv-menander', bioKey: 'rulerBio.wc-iv-menander', highlightKey: 'rulerHighlight.wc-iv-menander', startYear: -165, endYear: -130 },

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
  // ── Chola Empire (South India) ────────────────────────────────────────
  { id: 'wc-iv-rajaraja', eraId: 'world-comparison', polityId: 'wc-indus', nameKey: 'ruler.wc-iv-rajaraja', bioKey: 'rulerBio.wc-iv-rajaraja', highlightKey: 'rulerHighlight.wc-iv-rajaraja', startYear: 985, endYear: 1014 },
  // ── Delhi Sultanate (North India) ────────────────────────────────────
  { id: 'wc-iv-delhi', eraId: 'world-comparison', polityId: 'wc-indus', nameKey: 'ruler.wc-iv-delhi', bioKey: 'rulerBio.wc-iv-delhi', startYear: 1206, endYear: 1526 , isDynastyBlock: true },
  { id: 'wc-iv-alauddin', eraId: 'world-comparison', polityId: 'wc-indus', nameKey: 'ruler.wc-iv-alauddin', bioKey: 'rulerBio.wc-iv-alauddin', highlightKey: 'rulerHighlight.wc-iv-alauddin', startYear: 1296, endYear: 1316 },
  // ── Vijayanagara Empire (South India) ───────────────────────────────
  { id: 'wc-iv-vijayanagara', eraId: 'world-comparison', polityId: 'wc-indus', nameKey: 'ruler.wc-iv-vijayanagara', bioKey: 'rulerBio.wc-iv-vijayanagara', startYear: 1336, endYear: 1646 , isDynastyBlock: true },
  { id: 'wc-iv-krishna', eraId: 'world-comparison', polityId: 'wc-indus', nameKey: 'ruler.wc-iv-krishna', bioKey: 'rulerBio.wc-iv-krishna', highlightKey: 'rulerHighlight.wc-iv-krishna', startYear: 1509, endYear: 1529 },

  // ── Mughal Empire (North India) ───────────────────────────────
  { id: 'wc-iv-mughal', eraId: 'world-comparison', polityId: 'wc-indus', nameKey: 'ruler.wc-iv-mughal-dyn', bioKey: 'rulerBio.wc-iv-mughal-dyn', startYear: 1526, endYear: 1857 , isDynastyBlock: true },
  { id: 'wc-iv-babur', eraId: 'world-comparison', polityId: 'wc-indus', nameKey: 'ruler.wc-iv-babur', bioKey: 'rulerBio.wc-iv-babur', highlightKey: 'rulerHighlight.wc-iv-babur', startYear: 1526, endYear: 1530 },
  { id: 'wc-iv-humayun', eraId: 'world-comparison', polityId: 'wc-indus', nameKey: 'ruler.wc-iv-humayun', bioKey: 'rulerBio.wc-iv-humayun', highlightKey: 'rulerHighlight.wc-iv-humayun', startYear: 1530, endYear: 1556 },
  { id: 'wc-iv-akbar', eraId: 'world-comparison', polityId: 'wc-indus', nameKey: 'ruler.wc-iv-akbar', bioKey: 'rulerBio.wc-iv-akbar', highlightKey: 'rulerHighlight.wc-iv-akbar', startYear: 1556, endYear: 1605 },
  { id: 'wc-iv-jahangir', eraId: 'world-comparison', polityId: 'wc-indus', nameKey: 'ruler.wc-iv-jahangir', bioKey: 'rulerBio.wc-iv-jahangir', highlightKey: 'rulerHighlight.wc-iv-jahangir', startYear: 1605, endYear: 1627 },
  { id: 'wc-iv-shahjahan', eraId: 'world-comparison', polityId: 'wc-indus', nameKey: 'ruler.wc-iv-shahjahan', bioKey: 'rulerBio.wc-iv-shahjahan', highlightKey: 'rulerHighlight.wc-iv-shahjahan', startYear: 1628, endYear: 1658 },
  { id: 'wc-iv-aurangzeb', eraId: 'world-comparison', polityId: 'wc-indus', nameKey: 'ruler.wc-iv-aurangzeb', bioKey: 'rulerBio.wc-iv-aurangzeb', highlightKey: 'rulerHighlight.wc-iv-aurangzeb', startYear: 1658, endYear: 1707 },

  // ── Persia ─────────────────────────────────────────────
  { id: 'wc-pe-cyrus', eraId: 'world-comparison', polityId: 'wc-persia', nameKey: 'ruler.wc-pe-cyrus', bioKey: 'rulerBio.wc-pe-cyrus', highlightKey: 'rulerHighlight.wc-pe-cyrus', startYear: -550, endYear: -530 },
  { id: 'wc-pe-darius', eraId: 'world-comparison', polityId: 'wc-persia', nameKey: 'ruler.wc-pe-darius', bioKey: 'rulerBio.wc-pe-darius', highlightKey: 'rulerHighlight.wc-pe-darius', startYear: -522, endYear: -486 },
  { id: 'wc-pe-xerxes', eraId: 'world-comparison', polityId: 'wc-persia', nameKey: 'ruler.wc-pe-xerxes', bioKey: 'rulerBio.wc-pe-xerxes', highlightKey: 'rulerHighlight.wc-pe-xerxes', startYear: -486, endYear: -330 },
  { id: 'wc-pe-darius-iii', eraId: 'world-comparison', polityId: 'wc-persia', nameKey: 'ruler.wc-pe-darius-iii', bioKey: 'rulerBio.wc-pe-darius-iii', highlightKey: 'rulerHighlight.wc-pe-darius-iii', startYear: -336, endYear: -330 },
  { id: 'wc-pe-seleucid', eraId: 'world-comparison', polityId: 'wc-persia', nameKey: 'ruler.wc-pe-seleucid-dyn', bioKey: 'rulerBio.wc-pe-seleucid', startYear: -312, endYear: -63 , isDynastyBlock: true },
  { id: 'wc-pe-parthian', eraId: 'world-comparison', polityId: 'wc-persia', nameKey: 'ruler.wc-pe-parthian-dyn', bioKey: 'rulerBio.wc-pe-parthian', startYear: -247, endYear: 224 , isDynastyBlock: true },
  { id: 'wc-pe-ardashir', eraId: 'world-comparison', polityId: 'wc-persia', nameKey: 'ruler.wc-pe-ardashir', bioKey: 'rulerBio.wc-pe-ardashir', highlightKey: 'rulerHighlight.wc-pe-ardashir', startYear: 224, endYear: 241 },
  { id: 'wc-pe-sassanid', eraId: 'world-comparison', polityId: 'wc-persia', nameKey: 'ruler.wc-pe-sassanid-dyn', bioKey: 'rulerBio.wc-pe-sassanid', startYear: 224, endYear: 651 , isDynastyBlock: true },
  { id: 'wc-pe-shapur', eraId: 'world-comparison', polityId: 'wc-persia', nameKey: 'ruler.wc-pe-shapur', bioKey: 'rulerBio.wc-pe-shapur', highlightKey: 'rulerHighlight.wc-pe-shapur', startYear: 241, endYear: 272 },
  { id: 'wc-pe-shapur-ii', eraId: 'world-comparison', polityId: 'wc-persia', nameKey: 'ruler.wc-pe-shapur-ii', bioKey: 'rulerBio.wc-pe-shapur-ii', highlightKey: 'rulerHighlight.wc-pe-shapur-ii', startYear: 309, endYear: 379 },
  { id: 'wc-pe-bahram-v', eraId: 'world-comparison', polityId: 'wc-persia', nameKey: 'ruler.wc-pe-bahram-v', bioKey: 'rulerBio.wc-pe-bahram-v', highlightKey: 'rulerHighlight.wc-pe-bahram-v', startYear: 420, endYear: 438 },
  { id: 'wc-pe-khosrow', eraId: 'world-comparison', polityId: 'wc-persia', nameKey: 'ruler.wc-pe-khosrow', bioKey: 'rulerBio.wc-pe-khosrow', highlightKey: 'rulerHighlight.wc-pe-khosrow', startYear: 531, endYear: 579 },
  { id: 'wc-pe-khosrow-ii', eraId: 'world-comparison', polityId: 'wc-persia', nameKey: 'ruler.wc-pe-khosrow-ii', bioKey: 'rulerBio.wc-pe-khosrow-ii', highlightKey: 'rulerHighlight.wc-pe-khosrow-ii', startYear: 590, endYear: 628 },
  { id: 'wc-pe-yazdegerd', eraId: 'world-comparison', polityId: 'wc-persia', nameKey: 'ruler.wc-pe-yazdegerd', bioKey: 'rulerBio.wc-pe-yazdegerd', highlightKey: 'rulerHighlight.wc-pe-yazdegerd', startYear: 632, endYear: 651 },
  { id: 'wc-pe-safavid', eraId: 'world-comparison', polityId: 'wc-persia', nameKey: 'ruler.wc-pe-safavid', bioKey: 'rulerBio.wc-pe-safavid', highlightKey: 'rulerHighlight.wc-pe-safavid', startYear: 1501, endYear: 1736 },
  { id: 'wc-pe-shah-abbas', eraId: 'world-comparison', polityId: 'wc-persia', nameKey: 'ruler.wc-pe-shah-abbas', bioKey: 'rulerBio.wc-pe-shah-abbas', highlightKey: 'rulerHighlight.wc-pe-shah-abbas', startYear: 1588, endYear: 1629 },

  // ── Mongol Empire (Great Khans) ───────────────────────
  { id: 'wc-mo-genghis', eraId: 'world-comparison', polityId: 'wc-mongol', nameKey: 'ruler.wc-mo-genghis', bioKey: 'rulerBio.wc-mo-genghis', highlightKey: 'rulerHighlight.wc-mo-genghis', startYear: 1206, endYear: 1227 },
  { id: 'wc-mo-ogedei', eraId: 'world-comparison', polityId: 'wc-mongol', nameKey: 'ruler.wc-mo-ogedei', bioKey: 'rulerBio.wc-mo-ogedei', highlightKey: 'rulerHighlight.wc-mo-ogedei', startYear: 1229, endYear: 1241 },
  { id: 'wc-mo-mongke', eraId: 'world-comparison', polityId: 'wc-mongol', nameKey: 'ruler.wc-mo-mongke', bioKey: 'rulerBio.wc-mo-mongke', highlightKey: 'rulerHighlight.wc-mo-mongke', startYear: 1251, endYear: 1259 },
  { id: 'wc-mo-kublai', eraId: 'world-comparison', polityId: 'wc-mongol', nameKey: 'ruler.wc-mo-kublai', bioKey: 'rulerBio.wc-mo-kublai', highlightKey: 'rulerHighlight.wc-mo-kublai', startYear: 1260, endYear: 1294 },

  // ── Hellenistic Greece ─────────────────────────────────
  { id: 'wc-he-philip-ii', eraId: 'world-comparison', polityId: 'wc-hellenistic', nameKey: 'ruler.wc-he-philip-ii', bioKey: 'rulerBio.wc-he-philip-ii', highlightKey: 'rulerHighlight.wc-he-philip-ii', startYear: -359, endYear: -336 },
  { id: 'wc-he-alexander', eraId: 'world-comparison', polityId: 'wc-hellenistic', nameKey: 'ruler.wc-he-alexander', bioKey: 'rulerBio.wc-he-alexander', highlightKey: 'rulerHighlight.wc-he-alexander', startYear: -336, endYear: -323 },
  { id: 'wc-he-antigonus', eraId: 'world-comparison', polityId: 'wc-hellenistic', nameKey: 'ruler.wc-he-antigonus', bioKey: 'rulerBio.wc-he-antigonus', highlightKey: 'rulerHighlight.wc-he-antigonus', startYear: -306, endYear: -301 },
  { id: 'wc-he-seleucid', eraId: 'world-comparison', polityId: 'wc-hellenistic', nameKey: 'ruler.wc-he-seleucid-dyn', bioKey: 'rulerBio.wc-he-seleucid', startYear: -312, endYear: -63 , isDynastyBlock: true },
  { id: 'wc-he-antigonid', eraId: 'world-comparison', polityId: 'wc-hellenistic', nameKey: 'ruler.wc-he-antigonid-dyn', bioKey: 'rulerBio.wc-he-antigonid', startYear: -306, endYear: -168 , isDynastyBlock: true },
  { id: 'wc-he-ptolemaic', eraId: 'world-comparison', polityId: 'wc-hellenistic', nameKey: 'ruler.wc-he-ptolemaic-dyn', bioKey: 'rulerBio.wc-he-ptolemaic', startYear: -305, endYear: -30 , isDynastyBlock: true },

  // ── Islam ──────────────────────────────────────────────
  { id: 'wc-is-muhammad', eraId: 'world-comparison', polityId: 'wc-islam', nameKey: 'ruler.wc-is-muhammad', bioKey: 'rulerBio.wc-is-muhammad', highlightKey: 'rulerHighlight.wc-is-muhammad', startYear: 610, endYear: 632 },
  { id: 'wc-is-rashidun', eraId: 'world-comparison', polityId: 'wc-islam', nameKey: 'ruler.wc-is-rashidun-dyn', bioKey: 'rulerBio.wc-is-rashidun', startYear: 632, endYear: 661 , isDynastyBlock: true },
  { id: 'wc-is-umayyad', eraId: 'world-comparison', polityId: 'wc-islam', nameKey: 'ruler.wc-is-umayyad', bioKey: 'rulerBio.wc-is-umayyad', startYear: 661, endYear: 750 },
  { id: 'wc-is-mansur', eraId: 'world-comparison', polityId: 'wc-islam', nameKey: 'ruler.wc-is-mansur', bioKey: 'rulerBio.wc-is-mansur', startYear: 754, endYear: 775 },
  { id: 'wc-is-harun', eraId: 'world-comparison', polityId: 'wc-islam', nameKey: 'ruler.wc-is-harun', bioKey: 'rulerBio.wc-is-harun', highlightKey: 'rulerHighlight.wc-is-harun', startYear: 786, endYear: 833 },
  { id: 'wc-is-abbasid-late', eraId: 'world-comparison', polityId: 'wc-islam', nameKey: 'ruler.wc-is-abbasid-dyn', bioKey: 'rulerBio.wc-is-abbasid-late', startYear: 833, endYear: 1258 , isDynastyBlock: true },
  { id: 'wc-is-saladin', eraId: 'world-comparison', polityId: 'wc-islam', nameKey: 'ruler.wc-is-saladin', bioKey: 'rulerBio.wc-is-saladin', highlightKey: 'rulerHighlight.wc-is-saladin', startYear: 1174, endYear: 1193 },
  { id: 'wc-is-timur', eraId: 'world-comparison', polityId: 'wc-islam', nameKey: 'ruler.wc-is-timur', bioKey: 'rulerBio.wc-is-timur', highlightKey: 'rulerHighlight.wc-is-timur', startYear: 1370, endYear: 1405 },
  { id: 'wc-is-timurid-late', eraId: 'world-comparison', polityId: 'wc-islam', nameKey: 'ruler.wc-is-timurid-dyn', bioKey: 'rulerBio.wc-is-timurid-late', startYear: 1405, endYear: 1526 , isDynastyBlock: true },
  { id: 'wc-is-mughal-dyn', eraId: 'world-comparison', polityId: 'wc-islam', nameKey: 'ruler.wc-is-mughal-dyn', bioKey: 'rulerBio.wc-is-mughal-dyn', startYear: 1526, endYear: 1857 , isDynastyBlock: true },
  { id: 'wc-is-akbar', eraId: 'world-comparison', polityId: 'wc-islam', nameKey: 'ruler.wc-is-akbar', bioKey: 'rulerBio.wc-is-akbar', highlightKey: 'rulerHighlight.wc-is-akbar', startYear: 1556, endYear: 1605 },
  { id: 'wc-is-aurangzeb', eraId: 'world-comparison', polityId: 'wc-islam', nameKey: 'ruler.wc-is-aurangzeb', bioKey: 'rulerBio.wc-is-aurangzeb', highlightKey: 'rulerHighlight.wc-is-aurangzeb', startYear: 1658, endYear: 1707 },
  // ═══ 日本 — World Comparison (绳文/弥生/飞鸟/奈良/幕府将军) ═══
  { id: 'wc-jp-jomon', eraId: 'world-comparison', polityId: 'wc-japan', nameKey: 'ruler.ea-jp-jomon', bioKey: 'rulerBio.ea-jp-jomon', startYear: -10000, endYear: -300 , isDynastyBlock: true },
  { id: 'wc-jp-yayoi', eraId: 'world-comparison', polityId: 'wc-japan', nameKey: 'ruler.ea-jp-yayoi', bioKey: 'rulerBio.ea-jp-yayoi', startYear: -300, endYear: 250 , isDynastyBlock: true },
  { id: 'wc-jp-yamato', eraId: 'world-comparison', polityId: 'wc-japan', nameKey: 'ruler.ea-jp-yamato', bioKey: 'rulerBio.ea-jp-yamato', startYear: 250, endYear: 592 , isDynastyBlock: true },
  { id: 'wc-jp-asuka', eraId: 'world-comparison', polityId: 'wc-japan', nameKey: 'ruler.ea-jp-asuka', bioKey: 'rulerBio.ea-jp-asuka', startYear: 592, endYear: 710 , isDynastyBlock: true },
  { id: 'wc-jp-nara', eraId: 'world-comparison', polityId: 'wc-japan', nameKey: 'ruler.ea-jp-nara', bioKey: 'rulerBio.ea-jp-nara', startYear: 710, endYear: 794 , isDynastyBlock: true },
  { id: 'wc-jp-kanmu', eraId: 'world-comparison', polityId: 'wc-japan', nameKey: 'ruler.ea-jp-kanmu', bioKey: 'rulerBio.ea-jp-kanmu', highlightKey: 'rulerHighlight.ea-jp-kanmu', startYear: 781, endYear: 806 },
  { id: 'wc-jp-yoritomo', eraId: 'world-comparison', polityId: 'wc-japan', nameKey: 'ruler.ea-jp-yoritomo', bioKey: 'rulerBio.ea-jp-yoritomo', highlightKey: 'rulerHighlight.ea-jp-yoritomo', startYear: 1185, endYear: 1199 },
  { id: 'wc-jp-ashikaga', eraId: 'world-comparison', polityId: 'wc-japan', nameKey: 'ruler.ea-jp-ashikaga', bioKey: 'rulerBio.ea-jp-ashikaga', highlightKey: 'rulerHighlight.ea-jp-ashikaga', startYear: 1336, endYear: 1358 },
  { id: 'wc-jp-muromachi', eraId: 'world-comparison', polityId: 'wc-japan', nameKey: 'ruler.ea-jp-muromachi', bioKey: 'rulerBio.ea-jp-muromachi', startYear: 1336, endYear: 1573 , isDynastyBlock: true },
  { id: 'wc-jp-hideyoshi', eraId: 'world-comparison', polityId: 'wc-japan', nameKey: 'ruler.ea-jp-hideyoshi', bioKey: 'rulerBio.ea-jp-hideyoshi', highlightKey: 'rulerHighlight.ea-jp-hideyoshi', startYear: 1582, endYear: 1598 },
  { id: 'wc-jp-ieru', eraId: 'world-comparison', polityId: 'wc-japan', nameKey: 'ruler.ea-jp-ieru', bioKey: 'rulerBio.ea-jp-ieru', highlightKey: 'rulerHighlight.ea-jp-ieru', startYear: 1603, endYear: 1616 },

  // ── Korea ──────────────────────────────────────────────────────────────
  { id: 'wc-kr-three', eraId: 'world-comparison', polityId: 'wc-korea', nameKey: 'ruler.wc-kr-three', bioKey: 'rulerBio.wc-kr-three', startYear: -57, endYear: 668 , isDynastyBlock: true },
  { id: 'wc-kr-goguryeo', eraId: 'world-comparison', polityId: 'wc-korea', nameKey: 'ruler.wc-kr-goguryeo', bioKey: 'rulerBio.wc-kr-goguryeo', highlightKey: 'rulerHighlight.wc-kr-goguryeo', startYear: 37, endYear: 668 , isDynastyBlock: true },
  { id: 'wc-kr-silla', eraId: 'world-comparison', polityId: 'wc-korea', nameKey: 'ruler.wc-kr-silla', bioKey: 'rulerBio.wc-kr-silla', highlightKey: 'rulerHighlight.wc-kr-silla', startYear: 668, endYear: 935 , isDynastyBlock: true },
  { id: 'wc-kr-wang', eraId: 'world-comparison', polityId: 'wc-korea', nameKey: 'ruler.wc-kr-wang', bioKey: 'rulerBio.wc-kr-wang', highlightKey: 'rulerHighlight.wc-kr-wang', startYear: 918, endYear: 1259 },
  { id: 'wc-kr-goryeo', eraId: 'world-comparison', polityId: 'wc-korea', nameKey: 'ruler.wc-kr-goryeo', bioKey: 'rulerBio.wc-kr-goryeo', startYear: 918, endYear: 1392 , isDynastyBlock: true },
  { id: 'wc-kr-sejong', eraId: 'world-comparison', polityId: 'wc-korea', nameKey: 'ruler.wc-kr-sejong', bioKey: 'rulerBio.wc-kr-sejong', highlightKey: 'rulerHighlight.wc-kr-sejong', startYear: 1418, endYear: 1450 },
  { id: 'wc-kr-joseon', eraId: 'world-comparison', polityId: 'wc-korea', nameKey: 'ruler.wc-kr-joseon', bioKey: 'rulerBio.wc-kr-joseon', startYear: 1392, endYear: 1897 , isDynastyBlock: true },

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
  { id: 'ea-jp-jomon', eraId: 'east-asia-comparison', polityId: 'ea-japan', nameKey: 'ruler.ea-jp-jomon', bioKey: 'rulerBio.ea-jp-jomon', startYear: -10000, endYear: -300 , isDynastyBlock: true },
  { id: 'ea-jp-yayoi', eraId: 'east-asia-comparison', polityId: 'ea-japan', nameKey: 'ruler.ea-jp-yayoi', bioKey: 'rulerBio.ea-jp-yayoi', startYear: -300, endYear: 250 , isDynastyBlock: true },
  { id: 'ea-jp-yamato', eraId: 'east-asia-comparison', polityId: 'ea-japan', nameKey: 'ruler.ea-jp-yamato', bioKey: 'rulerBio.ea-jp-yamato', startYear: 250, endYear: 710 , isDynastyBlock: true },
  { id: 'ea-jp-asuka', eraId: 'east-asia-comparison', polityId: 'ea-japan', nameKey: 'ruler.ea-jp-asuka', bioKey: 'rulerBio.ea-jp-asuka', startYear: 592, endYear: 710 , isDynastyBlock: true },
  { id: 'ea-jp-shotoku', eraId: 'east-asia-comparison', polityId: 'ea-japan', nameKey: 'ruler.ea-jp-shotoku', bioKey: 'rulerBio.ea-jp-shotoku', highlightKey: 'rulerHighlight.ea-jp-shotoku', startYear: 593, endYear: 622 },
  { id: 'ea-jp-nara', eraId: 'east-asia-comparison', polityId: 'ea-japan', nameKey: 'ruler.ea-jp-nara', bioKey: 'rulerBio.ea-jp-nara', startYear: 710, endYear: 794 , isDynastyBlock: true },
  { id: 'ea-jp-kanmu', eraId: 'east-asia-comparison', polityId: 'ea-japan', nameKey: 'ruler.ea-jp-kanmu', bioKey: 'rulerBio.ea-jp-kanmu', highlightKey: 'rulerHighlight.ea-jp-kanmu', startYear: 781, endYear: 806 },
  { id: 'ea-jp-heian', eraId: 'east-asia-comparison', polityId: 'ea-japan', nameKey: 'ruler.ea-jp-heian', bioKey: 'rulerBio.ea-jp-heian', highlightKey: 'rulerHighlight.ea-jp-heian', startYear: 794, endYear: 1185 , isDynastyBlock: true },
  { id: 'ea-jp-kamakura', eraId: 'east-asia-comparison', polityId: 'ea-japan', nameKey: 'ruler.ea-jp-kamakura', bioKey: 'rulerBio.ea-jp-kamakura', startYear: 1185, endYear: 1333 , isDynastyBlock: true },
  { id: 'ea-jp-yoritomo', eraId: 'east-asia-comparison', polityId: 'ea-japan', nameKey: 'ruler.ea-jp-yoritomo', bioKey: 'rulerBio.ea-jp-yoritomo', highlightKey: 'rulerHighlight.ea-jp-yoritomo', startYear: 1185, endYear: 1199 },
  { id: 'ea-jp-ashikaga', eraId: 'east-asia-comparison', polityId: 'ea-japan', nameKey: 'ruler.ea-jp-ashikaga', bioKey: 'rulerBio.ea-jp-ashikaga', highlightKey: 'rulerHighlight.ea-jp-ashikaga', startYear: 1336, endYear: 1358 },
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
