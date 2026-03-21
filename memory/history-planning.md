# History Atlas 项目规划分析

**分析日期**: 2026-03-21
**项目地址**: https://history.ruciazyt.cn
**当前迭代**: 第三十三轮 (UI优化与架构完善 - i18n国际化完善)
**上次分析**: 2026-03-20

---

## 一、项目现状概览

### 测试与质量
- 单元测试: 693 个测试用例全部通过 (较昨日 +51)
- Lint 检查: 0 错误, 0 警告
- 构建验证: 通过
- 代码已推送至仓库

### 技术架构
- 框架: Next.js 16 (App Router, TypeScript)
- 样式: Tailwind CSS + 模块化 Constants 系统
- 国际化: next-intl (中/英/日三语)
- 状态管理: React Hooks (useBattleHooks, useHistoryData 等)
- 地图: 动态 SVG 地图渲染
- 测试: Vitest + React Testing Library

### 项目规模
- 源码文件: 70+ 个 .ts/.tsx 文件
- 分析模块: 20+ 个独立分析模块
- 代码行数: lib/history/ 目录下超过 15,000 行

### 核心数据
- 中国历史事件/战役: `chinaEvents.ts` (~1100 行)
- 时代数据: `chinaEras.ts`, `worldEras.ts`
- 统治者: `chinaRulers.ts`, `springAutumnRulers.ts`, `worldRulers.ts`
- 地理: `worldBoundaries.ts`, `placeNameEvolution.ts`

### 分析模块一览
| 模块 | 功能 | 备注 |
|------|------|------|
| battles.ts | 核心战役数据查询与统计 | ~2700行，枢纽模块 |
| commanderNetwork.ts | 指挥官关系网络 | 617行，10个导出函数 |
| battleCasualties.ts | 战役伤亡分析 | 完整但UI未展示 |
| outcomeCorrelation.ts | 战役结果关联分析 | 460行 |
| battleScale.ts | 战役规模分析 | 437行 |
| battleStrategy.ts | 战术类型分析 | 376行 |
| battleChain.ts | 战役因果链 | 412行 |
| battlePacing.ts | 战役节奏/时段分析 | 362行 |
| battleComparison.ts | 战役对比分析 | 383行 |
| battleTurningPoints.ts | 战役转折点 | 343行 |
| warAnalysis.ts | 战争分组分析 | 331行 |
| battleTerrain.ts | 地形分析 | 323行 |
| battleTimeAnalysis.ts | 世纪/时代分析 | 306行 |
| seasonality.ts | 季节性分析 | 完整 |
| impact.ts | 影响力分析 | 完整 |
| faction.ts | 阵营分析 | 完整 |
| rulerRelations.ts | 帝王关系可视化 | 完整 |
| rulerDisplay.ts | 统治者显示 | 完整 |

### 页面路由
- `/[locale]/` - 首页 (HistoryApp + BattleOfTheDayCard)
- `/[locale]/battles` - 战役列表与 BattleOfTheDayCard
- `/[locale]/favorites` - 收藏夹 (第三十二轮新增)
- `/[locale]/commanders` - 指挥官网络
- `/[locale]/location` - 地名演变
- `/[locale]/timeline` - 时间线
- `/[locale]/world` - 世界视图
- `/[locale]/matrix` - 矩阵视图
- `/[locale]/grid` - 网格视图
- `/[locale]/place-names` - 地名

---

## 二、已识别待推进的改进点 (上轮规划)

### 改进 1: 战役推荐系统 (优先级: 高)
- 现状: `battleComparison.ts` 中已有 `findSimilarBattles()` 函数
- 方案: 基于收藏/指挥官/时代偏好的推荐系统
- 在 FavoritesClient 中新增推荐区块

### 改进 2: 指挥官专属页面 `/commanders/[id]` (优先级: 中)
- 现状: `commanders/page.tsx` 只有指挥官网络总览
- 方案: 新增独立指挥官详情页 (战役统计、合作/对手列表)

---

## 三、本轮新识别的改进点

### 改进 3: 战役伤亡可视化面板 (优先级: 中)

**现状**:
- `battleCasualties.ts` (407行) 实现了完整的伤亡分析功能:
  - `getBloodiestBattles` - 最血腥战役
  - `getCasualtyStats` - 伤亡统计
  - `getCasualtyTrendByYear` - 伤亡趋势
  - `getOutcomeCasualtyAnalysis` - 胜负与伤亡关联
  - `getCasualtyInsights` - 生成历史洞察
  - `getCasualtySummary` - 完整摘要
- 但这些数据**完全没有在 UI 中展示**

**问题**:
- 伤亡数据是最直观的历史叙述工具（"长平之战坑杀40万赵军"）
- 用户无法看到哪些战役是最惨烈的
- 无法按时代/规模分析伤亡对比

**实现方案**:
1. 新增 `BattleCasualtiesPanel` 组件（可复用于 BattleDetail 页面）
2. 在 BattleDetail 底部添加伤亡统计卡片（当战役有伤亡数据时）
3. 新增 `/battles/insights` 或在 `/battles` 页面添加"伤亡洞察"Tab:
   - 最血腥战役 Top 10 列表
   - 伤亡趋势图（按世纪/时代）
   - 进攻方 vs 防守方平均伤亡对比
   - 伤亡与胜负关联洞察

**工作量**: 中等（1-2轮），主要工作是 UI 组件开发

---

### 改进 4: 世界视图 (World Timeline) 交互增强 (优先级: 中低)

**现状**:
- `WorldTimeline.tsx` 刚完成 i18n 改造（第三十三轮）
- `WorldEmpireMap.tsx` 显示世界帝国疆域
- 页面较静态，无用户交互功能

**问题**:
- 世界视图展示的是"世界历史"但数据有限（worldEras, worldRulers 未被充分使用）
- 缺乏时间轴播放、政权筛选等功能

**实现方案**:
1. 添加"时代播放"按钮（类似 TimelineClient 的播放功能）
2. 添加政权筛选器（按大陆/类型筛选）
3. 悬停显示政权详情弹窗
4. 连接 `/commanders` 和 `/battles` 数据到世界视图中的对应政权

**注意**: 考虑到 world 数据有限，此改进需与"世界历史数据扩展"配合，否则增强 UI 意义不大。优先级可降低。

---

## 四、持续优化建议 (本期不推进)

### 建议 A: 战役分享功能
- 生成分享链接 / 图片
- 战役对比结果可分享
- 战役海报生成（类似 BattleCard 样式）

### 建议 B: 地图标注增强
- 战役地图增加箭头表示进军路线
- 战役地图增加防御/进攻方阵地标识
- 地形类型对战役影响的说明

### 建议 C: 数据导出
- 导出战役数据为 CSV/JSON
- 导出个人收藏
- 导出战役对比结果

---

## 五、建议优先级（综合更新）

| 优先级 | 改进点 | 工作量 | 价值 | 状态 |
|--------|--------|--------|------|------|
| 高 | 战役推荐系统 | 中 | 高 | 上轮已识别 |
| 中 | 指挥官专属页面 | 中高 | 中 | 上轮已识别 |
| 中 | 战役伤亡可视化 | 中 | 中 | **本轮新增** |
| 中低 | 世界视图交互增强 | 中 | 中低 | 本轮新增，待评估 |
| 低 | 战役分享功能 | 中 | 低 | 远期 |
| 低 | 地图标注增强 | 高 | 中 | 远期 |

---

## 六、本轮核心建议

**战役伤亡可视化** 是本轮最值得推进的新方向：
1. `battleCasualties.ts` 已有完整分析逻辑，无需数据层工作
2. UI 展示价值高，伤亡数据是用户最关心的历史数据之一
3. 可与 BattleDetail 页面自然整合，不破坏现有结构
4. 完成后可生成"伤亡洞察"内容，丰富 /battles 页面

---

## 七、其他观察

1. **常量系统已趋近完成**: 过去十几轮持续推进颜色常量提取，constants/colors.ts 已包含 1494 行，基本覆盖所有组件
2. **i18n 接近收尾**: BattleCompare, FavoritesClient, WorldTimeline 刚完成三语化，预计还有少量组件需要 i18n 改造
3. **BattleOfTheDayCard 已集成**: 在 BattlesClient 和 HistoryApp 两处都有展示，入口问题已解决
4. **测试覆盖率高**: 693 个测试用例，覆盖所有核心分析模块
5. **项目稳定性高**: 多轮迭代后仍保持 0 lint 错误、0 警告
