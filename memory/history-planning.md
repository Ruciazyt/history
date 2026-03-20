# History Atlas 项目规划分析

**分析日期**: 2026-03-20
**项目地址**: https://history.ruciazyt.cn
**当前迭代**: 第三十二轮 (UI优化与架构完善)

---

## 一、项目现状概览

### 测试与质量
- 单元测试: 642 个测试用例全部通过
- Lint 检查: 0 错误, 0 警告
- 构建验证: 通过

### 技术架构
- 框架: Next.js (App Router, TypeScript)
- 样式: Tailwind CSS + CSS Variables/Constants 系统
- 国际化: next-intl (中/英/日三语)
- 状态管理: React Hooks (useBattleHooks, useHistoryData 等)
- 地图: 动态 SVG 地图渲染

### 核心数据
- 中国历史事件/战役: `chinaEvents.ts` (~1100 行)
- 时代数据: `chinaEras.ts`, `worldEras.ts`
- 统治者: `chinaRulers.ts`, `springAutumnRulers.ts`, `worldRulers.ts`
- 地理: `worldBoundaries.ts`, `placeNameEvolution.ts`

### 分析模块 (已实现)
| 模块 | 行数 | 功能 |
|------|------|------|
| battles.ts | 2700 | 核心战役数据与查询 |
| commanderNetwork.ts | 617 | 指挥官关系网络 |
| battles.test.ts | 1750 | 核心测试 |
| outcomeCorrelation.ts | 460 | 战役结果关联分析 |
| battleScale.ts | 437 | 战役规模分析 |
| battleStrategy.ts | 376 | 战术类型分析 |
| battleChain.ts | 412 | 战役因果链 |
| battlePacing.ts | 362 | 战役节奏分析 |
| battleComparison.ts | 383 | 战役对比分析 |
| battleTurningPoints.ts | 343 | 战役转折点 |
| warAnalysis.ts | 331 | 战争分析 |
| commander.ts | - | 指挥官统计 |
| battleTerrain.ts | 323 | 地形分析 |
| battleTimeAnalysis.ts | 306 | 世纪/时代分析 |
| impact.ts | - | 影响力分析 |
| seasonality.ts | - | 季节性分析 |
| faction.ts | - | 阵营分析 |

---

## 二、可改进点分析

### 改进 1: 战役推荐系统 ("你可能感兴趣的战役")

**现状**: 
- `battleComparison.ts` 中已有 `findSimilarBattles()` 函数，可基于多个维度（年代、季节、地域、类型、规模、指挥官等）找相似战役
- FavoritesClient 已实现收藏功能，但收藏页面较简单，只有清空和列表

**问题**: 
- 用户收藏战役后，没有基于收藏的个性化推荐
- 首页/battles 页面缺少"猜你喜欢"类推荐

**实现方案**:
1. 新增 `battleRecommendation.ts` 分析模块
   - 基于用户收藏的指挥官类型、地理区域、时代偏好进行推荐
   - 使用协同过滤思路：喜欢 A 战役的人也喜欢 B
   - `getRecommendedBattles(events, favoriteBattles, limit?)` 
   - `getCommanderBasedRecommendations(commanders, events, limit?)`
   - `getEraBasedRecommendations(entityId, events, limit?)`

2. 在 FavoritesClient 中新增"推荐战役"区块
   - 当收藏 ≥3 场战役时，显示基于收藏的推荐
   - 当收藏为空时，显示"热门战役"作为引导

3. 优点:
   - 盘活现有分析模块（commanderNetwork, battleComparison, seasonality 等）
   - 提升用户粘性和内容发现性
   - 可以在 1-2 轮迭代内完成

---

### 改进 2: 指挥官专属页面 (Commander Profile)

**现状**:
- `commanderNetwork.ts` (617 行) 已实现指挥官关系网络分析
- `commander.ts` 已实现指挥官统计数据
- 战役卡片和详情页显示指挥官，但无独立指挥官页面
- 数据中包含姬发、姜子牙、帝辛等指挥官

**问题**:
- 指挥官信息分散在各个战役中，无法一览某指挥官的全部战役
- 指挥官关系网络（合作/对手）只能在战役详情中看到

**实现方案**:
1. 新增 `/commanders/[id]` 页面路由
   - 路径: `/[locale]/commanders/:commanderId`
   - 页面内容:
     - 指挥官名称、活跃年代、所属势力
     - 战役统计卡片（总战役数、胜率、最常用战术、最常出没地域）
     - 参与的战役列表（可点击跳转）
     - 指挥官关系网络图（合作者 vs 对手）
     - 历史洞察（"该指挥官以 XXX 著称"）

2. 在 BattlesClient 中新增"指挥官"tab 或入口
   - 显示所有有数据的指挥官列表
   - 可按时代、势力筛选

3. 在 BattleCard/BattleDetail 中将指挥官名字链接到指挥官页面

4. 优点:
   - 利用现有 commanderNetwork.ts 和 commander.ts 的分析能力
   - 提供新的浏览维度，丰富产品体验
   - 2-3 轮迭代可完成

---

## 三、不建议近期推进的方向

### 数据层扩展（世界历史）
- `worldEras.ts`, `worldRulers.ts`, `worldBoundaries.ts` 数据文件存在但未被 UI 使用
- 扩展世界历史数据工作量巨大，且 UI 架构完全围绕中国历史设计
- 建议作为长期规划

### 战役天气/自然因素
- 天气对战役的影响需要专业历史数据支撑
- 属于锦上添花，可放在 commander profile 之后

---

## 四、建议优先级

| 优先级 | 改进点 | 工作量 | 价值 |
|--------|--------|--------|------|
| 高 | 战役推荐系统 | 中 | 高 - 提升发现性 |
| 中 | 指挥官页面 | 中高 | 中 - 丰富内容维度 |

---

## 五、其他观察

1. **constants/colors.ts 臃肿**: 1494 行的颜色常量文件，后续可以考虑按组件拆分为独立文件
2. **constants.ts 只有 13 行**: 主入口只做重导出，实际逻辑在 `constants/` 子目录
3. **i18n 完善度**: BattleCompare 和 FavoritesClient 刚完成三语化，其他组件可能还有遗漏
4. **BattleOfTheDayCard**: 组件已实现但导航入口不明显，可考虑在首页增加展示
