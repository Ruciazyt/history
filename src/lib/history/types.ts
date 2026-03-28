export type Era = {
  id: string;
  nameKey: string; // i18n key
  startYear: number; // negative for BCE
  endYear: number;

  /**
   * Multi-polity (parallel states) era such as Warring States / Five Dynasties.
   * When true, UI may render rulers grouped by polities instead of a single list.
   */
  isParallelPolities?: boolean;
  polities?: { id: string; nameKey: string }[];
};

export type RulerRelation = 'father' | 'mother' | 'son' | 'daughter' | 'brother' | 'sister' | 'uncle' | 'nephew' | 'grandfather' | 'grandson' | 'cousin';

export type Ruler = {
  id: string;
  eraId: string;
  /** Optional: used when era.isParallelPolities is true */
  polityId?: string;
  nameKey: string; // i18n key
  startYear: number;
  endYear: number;
  bioKey?: string; // i18n key
  highlightKey?: string; // i18n key
  /** If true, this is a dynasty/empire block (long background band), not an individual ruler */
  isDynastyBlock?: boolean;
  /** Era name (年号) for Chinese emperors */
  eraNameKey?: string; // i18n key
  /** Parent ruler ID */
  parentId?: string;
  /** Sibling ruler IDs (brothers) */
  siblingIds?: string[];
  /** Children ruler IDs */
  childrenIds?: string[];
};

export type Entity = {
  id: string;
  name: string;
  kind: 'country' | 'dynasty' | 'empire' | 'state' | 'region';
  parentId?: string; // e.g. dynasty -> country
  startYear: number;
  endYear: number;
  center?: { lon: number; lat: number };
};

/** 战役影响力级别 */
export type BattleImpact = 'decisive' | 'major' | 'minor' | 'unknown';

/** 战役规模级别 */
export type BattleScale = 'massive' | 'large' | 'medium' | 'small' | 'unknown';

/** 战役类型 */
export type BattleType = 
  | 'founding'       // 开国之战
  | 'unification'    // 统一战争
  | 'conquest'       // 征服战
  | 'defense'        // 防御战
  | 'rebellion'      // 叛乱/起义
  | 'civil-war'      // 内战
  | 'frontier'       // 边疆战役
  | 'invasion'       // 入侵/外敌
  | 'unknown';

/** 战役战略/战术类型 */
export type BattleStrategy = 
  | 'ambush'         // 伏击
  | 'fire'           // 火攻
  | 'water'          // 水攻/水淹
  | 'encirclement'   // 包围
  | 'siege'          // 攻城
  | 'pincer'         // 钳形攻势
  | 'feigned-retreat' // 诱敌深入/假装撤退
  | 'alliance'       // 联盟作战
  | 'defensive'      // 防御作战
  | 'offensive'      // 进攻作战
  | 'guerrilla'      // 游击战
  | 'unknown';

/** 战役地形类型 */
export type BattleTerrain = 
  | 'plains'         // 平原
  | 'mountains'      // 山地
  | 'hills'          // 丘陵
  | 'water'          // 水域（江河湖泊）
  | 'desert'         // 沙漠
  | 'plateau'        // 高原
  | 'forest'         // 森林
  | 'marsh'          // 沼泽
  | 'coastal'        // 沿海
  | 'urban'          // 城市/城镇
  | 'pass'           // 关隘/峡谷
  | 'unknown';

/** 战役突发性类型 */
export type BattlePacing = 
  | 'surprise'       // 突袭战
  | 'rapid'          // 快速决战
  | 'extended'       // 持久战
  | 'siege'          // 围城战
  | 'unknown';

/** 战役作战时间段 */
export type BattleTimeOfDay =
  | 'dawn'           // 黎明
  | 'morning'        // 上午
  | 'afternoon'      // 下午
  | 'evening'        // 傍晚
  | 'night'          // 夜间
  | 'unknown';

/** 战役伤亡估算数据 */
export type BattleCasualties = {
  /** 进攻方伤亡人数 */
  attacker?: number;
  /** 防守方伤亡人数 */
  defender?: number;
  /** 进攻方伤亡类型 */
  attackerCasualtyType?: 'killed' | 'wounded' | 'captured' | 'missing' | 'combined';
  /** 防守方伤亡类型 */
  defenderCasualtyType?: 'killed' | 'wounded' | 'captured' | 'missing' | 'combined';
  /** 伤亡估算依据 */
  source?: string;
  /** 估算可靠程度 */
  reliability?: 'high' | 'medium' | 'low';
};

/** 战役转折点类型 */
export type BattleTurningPointType = 
  | 'commander-death'       // 指挥官阵亡
  | 'commander-captured'    // 指挥官被俘
  | 'flank-collapse'        // 侧翼崩溃
  | 'reinforcement-arrival' // 援军到达
  | 'supply-disruption'     // 补给中断
  | 'weather-change'        // 天气突变
  | 'defection'            // 倒戈/背叛
  | 'strategic-mistake'     // 战略失误
  | 'fortification-breach' // 防线突破
  | 'ambush-triggered'      // 伏击触发
  | 'morale-collapse'       // 士气崩溃
  | 'trap-triggered'        // 陷阱触发
  | 'fire-attack'           // 火攻成功
  | 'encirclement'       // 包围
  | 'moral-boost'         // 士气提振
  | 'flood-attack'          // 水攻成功
  | 'unknown';

/** 战役关键转折点 */
export type BattleTurningPoint = {
  /** 转折点类型 */
  type: BattleTurningPointType;
  /** 转折点描述 */
  description: string;
  /** 涉及的战役方 */
  party?: 'attacker' | 'defender' | 'both' | 'unknown';
  /** 发生的阶段/回合 (可选) */
  phase?: string;
  /** 对谁有利 */
  impact?: 'positive' | 'negative' | 'neutral';
};

export type Event = {
  id: string;
  entityId: string; // eraId
  year: number;
  /** Month of the event (1-12), used for seasonality analysis */
  month?: number;
  titleKey: string; // i18n key
  summaryKey: string; // i18n key
  tags?: string[];
  location?: { lon: number; lat: number; label?: string };
  sources?: { label: string; url?: string }[];
  // Battle-specific fields
  battle?: {
    /** 参战方 */
    belligerents?: {
      /** 进攻方/挑战方 */
      attacker: string;
      /** 防守方/被挑战方 */
      defender: string;
    };
    /** 战役结果 */
    result?: 'attacker_win' | 'defender_win' | 'draw' | 'inconclusive';
    /** 战争名称（如果有独立名称） */
    warNameKey?: string;
    /** 指挥官/将领 */
    commanders?: {
      /** 进攻方指挥官 */
      attacker?: string[];
      /** 防守方指挥官 */
      defender?: string[];
    };
    /** 战役影响力级别 */
    impact?: BattleImpact;
    /** 战役规模级别 */
    scale?: BattleScale;
    /** 战役类型 */
    battleType?: BattleType;
    /** 战役战略/战术 */
    strategy?: BattleStrategy[];
    /** 战役地形 */
    terrain?: BattleTerrain[];
    /** 战役伤亡估算 */
    casualties?: BattleCasualties;
    /** 战役突发性/节奏 */
    pacing?: BattlePacing;
    /** 战役作战时间段 */
    timeOfDay?: BattleTimeOfDay;
    /** 战役转折点/关键事件 */
    turningPoints?: BattleTurningPoint[];
  };
};
