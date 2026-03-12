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

/** 战役天气类型 */
export type BattleWeather = 
  | 'clear'         // 晴天
  | 'rainy'         // 雨天
  | 'snowy'         // 雪天
  | 'windy'         // 大风
  | 'foggy'         // 雾天
  | 'stormy'        // 暴风雨
  | 'cloudy'        // 多云
  | 'hot'           // 炎热
  | 'cold'          // 寒冷
  | 'unknown';

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

/** 联盟类型 */
export type AllianceType = 
  | 'offensive'      // 进攻联盟
  | 'defensive'      // 防御联盟
  | 'cooperative'    // 合作/协同作战
  | 'temporary'      // 临时联盟
  | 'unknown';

/** 联盟参与者 */
export type AllianceParticipant = {
  /** 参与者名称 */
  name: string;
  /** 在联盟中的角色 */
  role: 'leader' | 'member';
  /** 联盟中的贡献/重要性 (可选) */
  contribution?: 'major' | 'minor' | 'unknown';
};

/** 战役联盟数据 */
export type BattleAlliance = {
  /** 联盟ID */
  id: string;
  /** 联盟名称（可选） */
  name?: string;
  /** 联盟类型 */
  type: AllianceType;
  /** 联盟参与者 */
  participants: AllianceParticipant[];
  /** 联盟持续时间（年）- 可选 */
  duration?: number;
  /** 联盟结果 */
  outcome?: 'victory' | 'defeat' | 'draw' | 'dissolved' | 'unknown';
  /** 联盟形成原因（可选） */
  reason?: string;
};

/** 战役后果/影响类型 */
export type AftermathType =
  | 'territorial-change'    // 领土变化
  | 'political-upheaval'   // 政治动荡
  | 'dynastic-change'      // 朝代更替
  | 'military-weakening'  // 军事衰弱
  | 'military-strengthening' // 军事增强
  | 'economic-decline'    // 经济衰退
  | 'economic-growth'     // 经济发展
  | 'population-displacement' // 人口迁移
  | 'cultural-shift'      // 文化变迁
  | 'treaty-signed'       // 条约签订
  | 'system-collapse'     // 制度崩溃
  | 'unification'          // 统一
  | 'fragmentation'       // 分裂
  | 'unknown';

/** 战役后果严重程度 */
export type AftermathSeverity = 'massive' | 'significant' | 'moderate' | 'minor' | 'unknown';

/** 战役后果影响范围 */
export type AftermathScope = 'continental' | 'regional' | 'local' | 'unknown';

/** 战役具体后果 */
export type BattleAftermath = {
  /** 后果类型 */
  type: AftermathType;
  /** 后果描述 */
  description: string;
  /** 影响的国家/势力 */
  affectedParties?: string[];
  /** 严重程度 */
  severity?: AftermathSeverity;
  /** 影响范围 */
  scope?: AftermathScope;
  /** 持续时间（年）- 可选 */
  duration?: number;
  /** 是否为长期影响 */
  isLongTerm?: boolean;
};

/** 战役情报活动类型 */
export type IntelligenceType =
  | 'espionage'      // 间谍活动/卧底
  | 'infiltration'   // 渗透/内应
  | 'deception'      // 欺诈/诱敌
  | 'counter-intelligence' // 反间谍
  | 'reconnaissance' // 侦察
  | 'propaganda'     // 宣传/心理战
  | 'defection'      // 倒戈/投诚
  | 'sabotage'       // 破坏活动
  | 'unknown';

/** 情报活动结果 */
export type IntelligenceResult =
  | 'success'        // 成功
  | 'failure'        // 失败
  | 'partial'       // 部分成功
  | 'unknown';

/** 战役情报活动数据 */
export type BattleIntelligence = {
  /** 情报活动类型 */
  type: IntelligenceType;
  /** 情报活动描述 */
  description: string;
  /** 哪方开展的情报活动 */
  side: 'attacker' | 'defender' | 'both' | 'unknown';
  /** 情报活动结果 */
  result: IntelligenceResult;
  /** 哪方从中受益 */
  benefit?: 'attacker' | 'defender' | 'both' | 'unknown';
  /** 附加说明 */
  notes?: string;
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
    /** 战役天气条件 */
    weather?: BattleWeather[];
    /** 战役转折点/关键事件 */
    turningPoints?: BattleTurningPoint[];
    /** 战役联盟数据 */
    alliance?: BattleAlliance;
    /** 战役后果/长期影响 */
    aftermath?: BattleAftermath[];
    /** 战役情报活动 */
    intelligence?: BattleIntelligence[];
  };
};
