import type { Event } from '../types';

// NOTE: This is intentionally "few but high-signal" seed data for the MVP.
// Coordinates are approximate.
export const CHINA_EVENTS: Event[] = [
  // Spring & Autumn
  {
    id: 'sa-770-zhou-east',
    entityId: 'period-spring-autumn',
    year: -770,
    title: 'Zhou court moves east to Luoyi (Luoyang)',
    summary:
      'The royal court relocates east after turmoil, marking the conventional start of the Spring and Autumn period.',
    tags: ['politics', 'zhou'],
    location: { lon: 112.45, lat: 34.62, label: 'Luoyang' },
  },
  {
    id: 'sa-656-qihuan',
    entityId: 'period-spring-autumn',
    year: -656,
    title: 'Duke Huan of Qi rises as hegemon',
    summary:
      'Qi, assisted by Guan Zhong’s reforms, becomes a leading power among the states under the hegemon system.',
    tags: ['reform', 'hegemony'],
    location: { lon: 118.05, lat: 36.80, label: 'Linzi (Qi)' },
  },
  {
    id: 'sa-632-chengpu',
    entityId: 'period-spring-autumn',
    year: -632,
    title: 'Battle of Chengpu',
    summary:
      'Jin defeats Chu in a major battle, shaping the balance of power among competing states.',
    tags: ['war'],
    location: { lon: 114.35, lat: 35.70, label: 'Chengpu (approx.)' },
  },
  {
    id: 'sa-551-confucius',
    entityId: 'period-spring-autumn',
    year: -551,
    title: 'Birth of Confucius (trad.)',
    summary:
      'Confucius, later central to East Asian political and ethical thought, is traditionally dated to this year.',
    tags: ['culture', 'philosophy'],
    location: { lon: 116.99, lat: 35.59, label: 'Qufu' },
  },
  {
    id: 'sa-506-boju',
    entityId: 'period-spring-autumn',
    year: -506,
    title: 'Battle of Boju',
    summary:
      'Wu defeats Chu and briefly captures Chu’s capital, showing the volatility of interstate rivalry.',
    tags: ['war'],
    location: { lon: 114.30, lat: 30.59, label: 'Near Wuhan (approx.)' },
  },

  // Warring States
  {
    id: 'ws-453-three-jin',
    entityId: 'period-warring-states',
    year: -453,
    title: 'Partition of Jin (Three Jin)',
    summary:
      'Power consolidates into Han, Zhao, and Wei, accelerating the Warring States order of territorial states.',
    tags: ['politics'],
    location: { lon: 112.43, lat: 37.87, label: 'Taiyuan region (approx.)' },
  },
  {
    id: 'ws-356-shangyang-reform',
    entityId: 'period-warring-states',
    year: -356,
    title: 'Shang Yang reforms in Qin (begins)',
    summary:
      'Legalist reforms strengthen Qin’s institutions, military, and agriculture—key foundations for unification.',
    tags: ['reform', 'qin'],
    location: { lon: 108.95, lat: 34.27, label: 'Xianyang area' },
  },
  {
    id: 'ws-341-maling',
    entityId: 'period-warring-states',
    year: -341,
    title: 'Battle of Maling',
    summary:
      'Qi defeats Wei using deception and ambush tactics, remembered for Sun Bin’s strategy.',
    tags: ['war'],
    location: { lon: 115.65, lat: 35.45, label: 'Maling (approx.)' },
  },
  {
    id: 'ws-260-changping',
    entityId: 'period-warring-states',
    year: -260,
    title: 'Battle of Changping',
    summary:
      'Qin’s decisive victory over Zhao signals Qin’s dominance and foreshadows imperial unification.',
    tags: ['war', 'qin'],
    location: { lon: 112.80, lat: 35.49, label: 'Gaoping (approx.)' },
  },
  {
    id: 'ws-221-unification',
    entityId: 'qin',
    year: -221,
    title: 'Qin unifies the warring states',
    summary:
      'Qin conquers rival states; Ying Zheng proclaims himself First Emperor (Qin Shi Huang).',
    tags: ['unification', 'empire'],
    location: { lon: 109.00, lat: 34.33, label: 'Xianyang' },
  },

  // Qin
  {
    id: 'qin-214-lingqu',
    entityId: 'qin',
    year: -214,
    title: 'Lingqu Canal constructed (trad. date)',
    summary:
      'A major canal project links river systems, supporting logistics and consolidation in the south.',
    tags: ['infrastructure'],
    location: { lon: 110.99, lat: 25.33, label: 'Guilin region' },
  },
  {
    id: 'qin-210-first-emperor-death',
    entityId: 'qin',
    year: -210,
    title: 'Death of Qin Shi Huang',
    summary:
      'The First Emperor dies during an eastern tour; succession crises and revolts soon follow.',
    tags: ['politics'],
    location: { lon: 118.48, lat: 35.05, label: 'Sand Hill / Shaqiu (approx.)' },
  },
  {
    id: 'qin-209-dazexiang',
    entityId: 'qin',
    year: -209,
    title: 'Dazexiang Uprising',
    summary:
      'Chen Sheng and Wu Guang lead a rebellion; it becomes a symbol of widespread anti-Qin unrest.',
    tags: ['revolt'],
    location: { lon: 116.60, lat: 33.64, label: 'Dazexiang (approx.)' },
  },

  // Han
  {
    id: 'han-206-han-founded',
    entityId: 'han-western',
    year: -202,
    title: 'Liu Bang establishes the Han dynasty',
    summary:
      'After the Chu–Han contention, Liu Bang becomes Emperor Gaozu, founding the Han imperial order.',
    tags: ['founding', 'empire'],
    location: { lon: 108.94, lat: 34.34, label: 'Chang’an (Xi’an)' },
  },
  {
    id: 'han-154-seven-states',
    entityId: 'han-western',
    year: -154,
    title: 'Rebellion of the Seven States',
    summary:
      'A major revolt by regional kings is suppressed, strengthening central authority.',
    tags: ['revolt', 'politics'],
    location: { lon: 117.28, lat: 34.21, label: 'Jiangsu/Anhui region (approx.)' },
  },
  {
    id: 'han-141-wudi',
    entityId: 'han-western',
    year: -141,
    title: 'Emperor Wu of Han begins reign',
    summary:
      'A transformative reign marked by expansion, state monopolies, and Confucian statecraft.',
    tags: ['politics', 'culture'],
    location: { lon: 108.94, lat: 34.34, label: 'Chang’an' },
  },
  {
    id: 'han-138-zhangqian',
    entityId: 'han-western',
    year: -138,
    title: 'Zhang Qian sent to the Western Regions',
    summary:
      'Diplomatic missions open routes and knowledge that later underpin Silk Road connections.',
    tags: ['diplomacy', 'trade'],
  },
  {
    id: 'han-60-protectorate',
    entityId: 'han-western',
    year: -60,
    title: 'Protectorate of the Western Regions established',
    summary:
      'Han administration in the Tarim Basin formalizes influence and security on key trade corridors.',
    tags: ['administration', 'frontier'],
    location: { lon: 87.62, lat: 43.82, label: 'Xinjiang region (approx.)' },
  },

  // Eastern Han
  {
    id: 'eh-105-paper',
    entityId: 'han-eastern',
    year: 105,
    title: 'Cai Lun improves papermaking (trad.)',
    summary:
      'Paper production is associated with Cai Lun’s improvements, aiding administration and culture.',
    tags: ['technology', 'culture'],
    location: { lon: 113.62, lat: 34.75, label: 'Luoyang' },
  },
  {
    id: 'eh-184-yellow-turbans',
    entityId: 'han-eastern',
    year: 184,
    title: 'Yellow Turban Rebellion',
    summary:
      'A massive uprising highlights social strain and weakens central control, paving the way to fragmentation.',
    tags: ['revolt'],
    location: { lon: 114.30, lat: 36.10, label: 'Hebei/Henan region (approx.)' },
  },
  {
    id: 'eh-220-han-ends',
    entityId: 'han-eastern',
    year: 220,
    title: 'End of Eastern Han',
    summary:
      'Emperor Xian abdicates; Cao Pi founds Wei, beginning the Three Kingdoms era.',
    tags: ['politics'],
    location: { lon: 113.65, lat: 34.76, label: 'Xuchang / Luoyang region' },
  },
];
