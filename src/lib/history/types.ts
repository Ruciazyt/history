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
    /** 战役原因/导火索 */
    causes?: BattleCause[];
    /** 战役军力对比 */
    forceComparison?: BattleForceComparison;
    /** 战役持续时间（天数） */
    duration?: number;
    /** 战役兵器/武器使用 */
    armaments?: BattleArmament[];
    /** 战役典籍记载 */
    literature?: BattleLiterature[];
    /** 战役阵型数据 */
    formations?: BattleFormationData[];
    /** 战役士气因素 */
    moraleFactors?: BattleMoraleFactor[];
    /** 战役初始士气水平 */
    initialMorale?: {
      attacker?: InitialMoraleLevel;
      defender?: InitialMoraleLevel;
    };
    /** 战役士气变化事件 */
    moraleShifts?: MoraleShiftEvent[];
    /** 战役将领损失数据 */
    commandersLoss?: BattleCommanderLoss[];
    /** 战役投降/改编数据 */
    surrender?: BattleSurrender[];
  };
};

/** 投降/改编类型 */
export type SurrenderType =
  | 'surrender'           // 投降
  | 'capitulation'       // 投降（正式）
  | 'defection'          // 倒戈/投诚
  | 'surrender-after-wound'  // 受伤后投降
  | 'mass-surrender'     // 大规模投降
  | 'surrender-pursuit' // 投降后追击
  | 'refused-surrender'  // 拒绝投降
  | 'negotiated-surrender' // 谈判投降
  | 'unknown';

/** 投降方阵营 */
export type SurrenderSide = 'attacker' | 'defender' | 'both' | 'unknown';

/** 投降/改编严重程度 */
export type SurrenderSeverity = 'massive' | 'significant' | 'moderate' | 'minor' | 'unknown';

/** 战役投降/改编数据 */
export type BattleSurrender = {
  /** 投降/改编类型 */
  type: SurrenderType;
  /** 描述 */
  description: string;
  /** 投降方 */
  side: SurrenderSide;
  /** 严重程度 */
  severity?: SurrenderSeverity;
  /** 投降的人数规模（可选） */
  number?: number;
  /** 投降后的人员处理 */
  treatment?: 'enslaved' | 'integrated' | 'released' | 'executed' | 'unknown';
  /** 是否涉及关键人物 */
  involvesKeyPerson?: boolean;
  /** 投降后对战役结果的影响 */
  impact?: 'decisive' | 'significant' | 'minor' | 'unknown';
};

/** 战役阵型类型 */
export type BattleFormation =
  | 'long-wedge'          // 锥形阵/楔形阵
  | 'frontal-attack'      // 正面突击
  | 'flanking'            // 侧翼攻击
  | 'encirclement'        // 包围阵型
  | 'defensive'           // 防御阵型
  | 'retreating'          // 撤退阵型/诱敌
  | 'center-break'        // 中央突破
  | 'skirmish'            // 散兵阵型
  | 'cavalry-flank'       // 骑兵侧翼
  | 'chariot-charge'      // 战车冲击
  | 'mixed-formation'     // 混合阵型
  | 'unknown';

/** 阵型角色 */
export type FormationRole = 'attacker' | 'defender' | 'both';

/** 战役阵型数据 */
export type BattleFormationData = {
  /** 使用的阵型 */
  formation: BattleFormation;
  /** 描述 */
  description?: string;
  /** 使用方 */
  side: FormationRole;
  /** 阵型特点 */
  characteristics?: string[];
  /** 是否为该方首次使用/创新 */
  isInnovative?: boolean;
};

/** 历史典籍类型 */
export type LiteratureType = 
  | 'shiji'           // 史记
  | 'zizhitongjian'   // 资治通鉴
  | 'zuozhuan'        // 左传
  | 'guoyu'           // 国语
  | 'chunqiu'         // 春秋
  | 'shangshu'        // 尚书
  | 'zhoushu'         // 周书
  | 'hanshu'          // 汉书
  | 'houhanshu'       // 后汉书
  | 'sanguozhi'       // 三国志
  | 'jinshu'          // 晋书
  | 'liangshu'        // 梁书
  | 'beishi'          // 北史
  | 'nanshi'          // 南史
  | 'tongzhi'         // 通志
  | 'tongkao'         // 通考
  | 'other';          // 其他

/** 典籍记载信息 */
export type BattleLiterature = {
  /** 典籍名称/类型 */
  source: LiteratureType;
  /** 具体章节/卷 */
  chapter?: string;
  /** 记载的简要描述 */
  description?: string;
  /** 记载可信度评估 */
  reliability?: 'high' | 'medium' | 'low';
  /** 记载特点 */
  characteristics?: string[];
};

/** 战役原因类型 */
export type BattleCauseType =
  | 'territorial-dispute'    // 领土争端
  | 'political-rivalry'      // 政治 rivalry/权力斗争
  | 'revenge'                // 复仇
  | 'succession-dispute'     // 继承权争夺
  | 'economic-interest'      // 经济利益
  | 'ideological-conflict'   // 意识形态冲突
  | 'preemptive-attack'      // 先发制人攻击
  | 'defensive-war'          // 自卫战争
  | 'expansionism'           // 扩张主义
  | 'dynastic-conflict'      // 朝代冲突
  | 'tributary-dispute'      // 朝贡体系争议
  | 'border-incident'        // 边境冲突
  | 'alliance-obligation'    // 联盟义务
  | 'usurpation'             // 篡位/叛变
  | 'rebellion'              // 叛乱/起义
  | 'unknown';

/** 战役原因严重程度 */
export type CauseSeverity = 'critical' | 'major' | 'minor' | 'unknown';

/** 战役原因数据 */
export type BattleCause = {
  /** 原因类型 */
  type: BattleCauseType;
  /** 原因描述 */
  description: string;
  /** 涉及的势力/国家 */
  parties?: string[];
  /** 严重程度 */
  severity?: CauseSeverity;
  /** 持续时间（年）- 可选，表示该原因积累了多久 */
  duration?: number;
};

/** 军力单位类型 */
export type ForceUnitType =
  | 'infantry'        // 步兵
  | 'cavalry'         // 骑兵
  | 'chariot'         // 战车
  | 'navy'            // 水军
  | 'archer'          // 弓箭手
  | 'mixed'           // 混合部队
  | 'unknown';

/** 军力数据 */
export type BattleForce = {
  /** 军力规模 */
  strength: number;
  /** 军力单位 */
  unitType?: ForceUnitType;
  /** 军力估算依据 */
  source?: string;
  /** 估算可靠程度 */
  reliability?: 'high' | 'medium' | 'low';
};

/** 战役军力对比数据 */
export type BattleForceComparison = {
  /** 进攻方军力 */
  attacker: BattleForce;
  /** 防守方军力 */
  defender: BattleForce;
  /** 优势方 */
  advantage?: 'attacker' | 'defender' | 'balanced' | 'unknown';
  /** 军力差距描述 */
  difference?: string;
};

/** 战役兵器/武器类型 */
export type BattleArmamentType =
  | 'sword'           // 剑
  | 'spear'          // 矛/枪
  | 'dagger-axe'     // 戈
  | 'halberd'        // 戟
  | 'bow'            // 弓
  | 'crossbow'       // 弩
  | 'chariot'        // 战车
  | 'cavalry'        // 骑兵
  | 'infantry'       // 步兵
  | 'navy'           // 水军
  | 'siege-weapon'   // 攻城器械
  | 'fire-weapon'    // 火攻器械
  | 'shield'         // 盾牌/防御
  | 'armor'          // 铠甲
  | 'horse'          // 战马
  | 'unknown';

/** 兵器使用方 */
export type ArmamentSide = 'attacker' | 'defender' | 'both' | 'unknown';

/** 战役兵器使用数据 */
export type BattleArmament = {
  /** 兵器类型 */
  type: BattleArmamentType;
  /** 兵器描述 */
  description?: string;
  /** 使用方 */
  side: ArmamentSide;
  /** 数量（可选） */
  count?: number;
  /** 是否为主要兵器 */
  isPrimary?: boolean;
  /** 备注 */
  notes?: string;
};

/** 战役持续时间分类 */
export type BattleDurationCategory = 
  | 'daily'          // 一天内的战役
  | 'short'          // 1-3天
  | 'medium'         // 4-7天
  | 'extended'       // 8-30天
  | 'protracted'     // 30天以上
  | 'unknown';

/** 战役士气因素类型 */
export type MoraleFactorType =
  | 'leadership'       // 领导力/统帅能力
  | 'discipline'       // 纪律性
  | 'motivation'       // 战斗动机/士气激励
  | 'experience'      // 作战经验
  | 'training'        // 训练水平
  | 'loyalty'         // 忠诚度
  | 'morale-boost'    // 士气提升事件
  | 'morale-crisis'   // 士气危机
  | 'fatigue'         // 疲劳/厌战
  | 'fear'            // 恐惧
  | 'unknown';

/** 士气因素影响方向 */
export type MoraleImpact = 'positive' | 'negative' | 'neutral';

/** 士气因素严重程度 */
export type MoraleSeverity = 'critical' | 'major' | 'minor' | 'unknown';

/** 战役士气因素数据 */
export type BattleMoraleFactor = {
  /** 因素类型 */
  type: MoraleFactorType;
  /** 因素描述 */
  description: string;
  /** 涉及的阵营 */
  side: 'attacker' | 'defender' | 'both' | 'unknown';
  /** 影响方向 */
  impact: MoraleImpact;
  /** 严重程度 */
  severity?: MoraleSeverity;
  /** 发生的阶段（可选） */
  phase?: string;
  /** 备注 */
  notes?: string;
};

/** 战役初始士气水平 */
export type InitialMoraleLevel = 'high' | 'medium' | 'low' | 'unknown';

/** 战役士气变化事件 */
export type MoraleShiftEvent = {
  /** 变化描述 */
  description: string;
  /** 发生的阶段 */
  phase: string;
  /** 变化方向 */
  direction: 'up' | 'down' | 'stable';
  /** 对哪方产生影响 */
  side: 'attacker' | 'defender' | 'both';
  /** 影响幅度 */
  magnitude?: 'large' | 'moderate' | 'small';
};

/** 将领损失类型 */
export type CommanderLossType =
  | 'killed-in-action'     // 阵亡
  | 'captured'            // 被俘
  | 'defected'            // 倒戈/投诚
  | 'deserted'            // 逃亡/开小差
  | 'executed'            // 被处决
  | 'wounded-died'        // 受伤后死亡
  | 'suicide'             // 自杀
  | 'unknown';

/** 将领损失严重程度 */
export type LossSeverity = 'critical' | 'major' | 'minor' | 'unknown';

/** 将领损失阵营 */
export type LossSide = 'attacker' | 'defender' | 'both' | 'unknown';

/** 战役将领损失数据 */
export type BattleCommanderLoss = {
  /** 将领名称 */
  name: string;
  /** 损失类型 */
  type: CommanderLossType;
  /** 描述 */
  description?: string;
  /** 所属阵营 */
  side: LossSide;
  /** 严重程度 */
  severity?: LossSeverity;
  /** 发生在哪个阶段 */
  phase?: string;
  /** 是否为关键将领（对战役有重大影响） */
  isKeyCommander?: boolean;
};
