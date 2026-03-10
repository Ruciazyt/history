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
    /** 战役类型 */
    battleType?: BattleType;
  };
};
