// 历史事件时间线数据
// 每个进程包含一系列按时间顺序的事件

export interface TimelineLocation {
  nameKey: string;
  lat: number;
  lon: number;
}

export interface TimelineFaction {
  nameKey: string;
  color: string;
}

// 势力范围多边形（简化的 GeoJSON 格式）
export interface Territory {
  factionNameKey: string;
  color: string;
  // 多边形顶点坐标数组 [经度, 纬度]
  polygon: [number, number][];
}

export interface TimelineEvent {
  id: string;
  year: number;
  titleKey: string;
  descriptionKey: string;
  location: TimelineLocation;
  factions?: TimelineFaction[];
  // 该时间点的势力范围
  territories?: Territory[];
}

export interface TimelineProcess {
  id: string;
  nameKey: string;
  descriptionKey: string;
  events: TimelineEvent[];
}

// 势力范围数据（简化的多边形坐标）
const territories = {
  // 秦朝（统一时）
  qin: {
    factionNameKey: 'faction.qin',
    color: '#8B4513',
    polygon: [
      [75, 40], [110, 40], [122, 35], [122, 25], [110, 18], [95, 22], 
      [85, 35], [75, 40]
    ] as [number, number][]
  },
  // 楚（项羽）
  chu: {
    factionNameKey: 'faction.chu',
    color: '#9B59B6',
    polygon: [
      [110, 35], [120, 35], [122, 28], [115, 22], [105, 25], [110, 35]
    ] as [number, number][]
  },
  // 汉（刘邦）
  han: {
    factionNameKey: 'faction.han',
    color: '#E74C3C',
    polygon: [
      [105, 38], [112, 38], [112, 32], [105, 30], [105, 38]
    ] as [number, number][]
  },
  // 齐
  qi: {
    factionNameKey: 'faction.qi',
    color: '#F39C12',
    polygon: [
      [115, 38], [122, 38], [122, 34], [115, 34], [115, 38]
    ] as [number, number][]
  },
  // 赵
  zhao: {
    factionNameKey: 'faction.zhao',
    color: '#1ABC9C',
    polygon: [
      [112, 40], [120, 40], [120, 36], [112, 36], [112, 40]
    ] as [number, number][]
  },
  // 魏
  wei: {
    factionNameKey: 'faction.wei',
    color: '#3498DB',
    polygon: [
      [110, 36], [115, 36], [115, 32], [110, 32], [110, 36]
    ] as [number, number][]
  },
  // 韩
  han_state: {
    factionNameKey: 'faction.han-state',
    color: '#E67E22',
    polygon: [
      [110, 34], [115, 34], [115, 30], [110, 30], [110, 34]
    ] as [number, number][]
  },
  // 燕
  yan: {
    factionNameKey: 'faction.yan',
    color: '#2ECC71',
    polygon: [
      [115, 42], [125, 42], [125, 38], [115, 38], [115, 42]
    ] as [number, number][]
  },
};

export const timelineProcesses: TimelineProcess[] = [
  {
    id: 'anti-qin',
    nameKey: 'timeline.anti-qin',
    descriptionKey: 'timeline.anti-qin-desc',
    events: [
      {
        id: 'daze-agriculture',
        year: -209,
        titleKey: 'timeline.daze-uprising',
        descriptionKey: 'timeline.daze-uprising-desc',
        location: { nameKey: 'location.daze', lat: 33.93, lon: 117.25 },
        factions: [
          { nameKey: 'faction.qin', color: '#8B4513' },
          { nameKey: 'faction.rebels', color: '#CD5C5C' }
        ],
        territories: [
          territories.qin,
        ]
      },
      {
        id: 'chen-sheng-king',
        year: -209,
        titleKey: 'timeline.chen-sheng-king',
        descriptionKey: 'timeline.chen-sheng-king-desc',
        location: { nameKey: 'location.xianyang', lat: 34.34, lon: 108.95 },
        factions: [
          { nameKey: 'faction.chu', color: '#9B59B6' }
        ],
        territories: [
          { ...territories.chu, polygon: [[108, 32], [115, 32], [115, 28], [108, 28], [108, 32]] as [number, number][] },
          territories.qin,
        ]
      },
      {
        id: 'xiang-liang-uprising',
        year: -208,
        titleKey: 'timeline.xiang-liang-uprising',
        descriptionKey: 'timeline.xiang-liang-uprising-desc',
        location: { nameKey: 'location.xianyang', lat: 34.34, lon: 108.95 },
        factions: [
          { nameKey: 'faction.chu', color: '#9B59B6' }
        ],
        territories: [
          territories.chu,
          territories.qin,
        ]
      },
      {
        id: 'julu-battle',
        year: -207,
        titleKey: 'timeline.julu-battle',
        descriptionKey: 'timeline.julu-battle-desc',
        location: { nameKey: 'location.julu', lat: 37.06, lon: 114.88 },
        factions: [
          { nameKey: 'faction.qin', color: '#8B4513' },
          { nameKey: 'faction.chu', color: '#9B59B6' }
        ],
        territories: [
          { ...territories.chu, polygon: [[105, 38], [118, 38], [118, 26], [105, 26], [105, 38]] as [number, number][] },
          { ...territories.qin, polygon: [[108, 42], [115, 42], [115, 35], [108, 35], [108, 42]] as [number, number][] },
        ]
      },
      {
        id: 'qin-fall',
        year: -207,
        titleKey: 'timeline.qin-fall',
        descriptionKey: 'timeline.qin-fall-desc',
        location: { nameKey: 'location.xianyang', lat: 34.34, lon: 108.95 },
        territories: [
          territories.chu,
        ]
      },
      {
        id: 'xiang-enfeoff',
        year: -206,
        titleKey: 'timeline.xiang-enfeoff',
        descriptionKey: 'timeline.xiang-enfeoff-desc',
        location: { nameKey: 'location.xianyang', lat: 34.34, lon: 108.95 },
        territories: [
          territories.chu,
          territories.qi,
          territories.zhao,
          territories.wei,
          territories.han_state,
          territories.yan,
        ]
      },
      {
        id: 'chu-han-contention',
        year: -206,
        titleKey: 'timeline.chu-han-contention',
        descriptionKey: 'timeline.chu-han-contention-desc',
        location: { nameKey: 'location.gaixia', lat: 33.15, lon: 116.57 },
        territories: [
          territories.chu,
          territories.han,
        ]
      },
      {
        id: 'battle-of-gaixia',
        year: -202,
        titleKey: 'timeline.battle-of-gaixia',
        descriptionKey: 'timeline.battle-of-gaixia-desc',
        location: { nameKey: 'location.gaixia', lat: 33.15, lon: 116.57 },
        territories: [
          territories.chu,
          territories.han,
        ]
      },
      {
        id: 'han-unification',
        year: -202,
        titleKey: 'timeline.han-unification',
        descriptionKey: 'timeline.han-unification-desc',
        location: { nameKey: 'location.chang-an', lat: 34.34, lon: 108.95 },
        territories: [
          territories.han,
        ]
      }
    ]
  },
  {
    id: 'three-kingdoms',
    nameKey: 'timeline.three-kingdoms',
    descriptionKey: 'timeline.three-kingdoms-desc',
    events: [
      {
        id: 'dong-zhuo-enter',
        year: 189,
        titleKey: 'timeline.dong-zhuo-enter',
        descriptionKey: 'timeline.dong-zhuo-enter-desc',
        location: { nameKey: 'location.luoyang', lat: 34.62, lon: 112.45 },
        factions: [
          { nameKey: 'faction.dongzhuo', color: '#8B4513' }
        ]
      },
      {
        id: 'cao-cao-unites-north',
        year: 207,
        titleKey: 'timeline.cao-cao-unites-north',
        descriptionKey: 'timeline.cao-cao-unites-north-desc',
        location: { nameKey: 'location.ye', lat: 36.08, lon: 114.53 },
        factions: [
          { nameKey: 'faction.cao', color: '#3498DB' }
        ]
      },
      {
        id: 'battle-of-red-cliffs',
        year: 208,
        titleKey: 'timeline.battle-of-red-cliffs',
        descriptionKey: 'timeline.battle-of-red-cliffs-desc',
        location: { nameKey: 'location.red-cliffs', lat: 30.68, lon: 113.12 },
        factions: [
          { nameKey: 'faction.cao', color: '#3498DB' },
          { nameKey: 'faction.sun', color: '#27AE60' },
          { nameKey: 'faction.liu', color: '#E74C3C' }
        ]
      },
      {
        id: 'wei-founded',
        year: 220,
        titleKey: 'timeline.wei-founded',
        descriptionKey: 'timeline.wei-founded-desc',
        location: { nameKey: 'location.luoyang', lat: 34.62, lon: 112.45 },
        factions: [
          { nameKey: 'faction.wei', color: '#3498DB' }
        ]
      },
      {
        id: 'shu-founded',
        year: 221,
        titleKey: 'timeline.shu-founded',
        descriptionKey: 'timeline.shu-founded-desc',
        location: { nameKey: 'location.chengdu', lat: 30.67, lon: 104.07 },
        factions: [
          { nameKey: 'faction.shu', color: '#E74C3C' }
        ]
      },
      {
        id: 'wu-founded',
        year: 229,
        titleKey: 'timeline.wu-founded',
        descriptionKey: 'timeline.wu-founded-desc',
        location: { nameKey: 'location.jianye', lat: 32.06, lon: 118.79 },
        factions: [
          { nameKey: 'faction.wu', color: '#27AE60' }
        ]
      }
    ]
  }
];

export function getTimelineProcess(id: string): TimelineProcess | undefined {
  return timelineProcesses.find(p => p.id === id);
}

export function getTimelineEvent(processId: string, eventId: string): TimelineEvent | undefined {
  const process = getTimelineProcess(processId);
  return process?.events.find(e => e.id === eventId);
}
