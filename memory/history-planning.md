# History Atlas 项目规划分析

**分析日期**: 2026-03-22
**项目状态**: 活跃迭代中（第三十四轮刚完成，697 个测试用例，全部通过）

---

## 一、项目现状概览

### 架构
- Next.js 16 (App Router) + React 19 + TypeScript
- MapLibre GL 地图 + Tailwind CSS v4 + next-intl 国际化
- Vitest 测试框架，**697 个测试用例**，覆盖率极高
- 部署地址: https://history.ruciazyt.cn
- CI/CD: 每 6 小时自动构建

### 核心数据文件
- `battles.ts`: 2745 行，战役分析核心模块（按行数计最大文件）
- `chinaEvents.ts`: ~1100 行，~60+ 事件（西周/春秋/战国为主）
- `chinaRulers.ts`: 715 行，统治者数据
- `chinaEras.ts`: 西周、春秋（并行政权）、战国（并行政权）三大时代
- `placeNameEvolution.ts`: 2720 行，地名演变数据
- `commanderNetwork.ts`: 指挥官关系网络分析

### 核心页面路由
- `/[locale]/` — 主应用（地图+时间轴+事件侧边栏）
- `/[locale]/battles` — 战役列表页（BattlesClient）
- `/[locale]/commanders` — 指挥官关系网络（CommandersClient）
- `/[locale]/world` — 世界/帝国视图（WorldClient）
- `/[locale]/favorites` — 收藏夹（FavoritesClient）
- `/[locale]/matrix` — EurasianGrid 矩阵视图

### 已完成功能（近期迭代）
- **常量系统统一**: ~30+ 颜色常量集（HISTORY_APP_COLORS, BATTLE_DETAIL_COLORS 等）
- **i18n 完善**: WorldTimeline + BattleCompare + FavoritesClient 三语支持
- **战役收藏夹**: localStorage 持久化 + FavoritesClient 页面
- **今日战役**: getBattleOfTheDay() + getSameEraBattles() + BattleOfTheDayCard
- **战役搜索**: 基础搜索（标题/地点/指挥官）
- **分析模块**: 指挥官网络、因果链、战略、节奏、转折点、胜率关联、战争分析等 15+ 维度
- **键盘可访问性**: TimelineSlider 键盘导航支持

---

## 二、可改进点分析

### 优先级 1: 战役多维过滤与 URL 状态同步

**现状**: BattlesClient 已有时代过滤（era filter）和视图切换，但缺少：
- 按指挥官名称搜索过滤
- 按战役结果（胜/负/平）过滤
- 按战役规模（massive/large/medium/small）过滤
- 多维度组合过滤
- **URL 参数同步**（可分享过滤状态链接）

**改进方案**:
1. 扩展 `useBattleHooks.ts` 中的 `useBattleFilter` hook，支持多维度过滤
2. 在 BattlesClient 添加指挥官输入框、结果选择器、规模选择器
3. 使用 `nuqs` 或原生 `URLSearchParams` 实现 URL ↔ 过滤状态双向同步
4. 添加"保存/复制链接"按钮

**收益**: 用户体验显著提升，可分享的筛选链接是差异化功能。工作量中等。

---

### 优先级 2: "历史上的今天" 全功能页面

**现状**: `getBattlesOnThisDay()` 已存在（battles.ts），但：
- 没有独立页面，只在 BattleOfTheDayCard 中隐式使用
- 没有"查看更多历史今天"的功能入口
- 3 月 12 日刚添加了 `getBattlesOnThisDay`，但未集成到任何 UI

**改进方案**:
1. 创建 `/[locale]/on-this-day` 页面路由
2. 新增 `OnThisDayClient` 组件，显示"今天"发生的所有历史事件
3. 跨时代显示（春秋/战国/秦汉等所有时代）
4. 支持日期选择器（用户可查看任意日期）
5. 每个事件显示年代、类型（战役/非战役）、简要描述
6. 在主应用或导航中添加"历史上的今天"入口

**收益**: 提升日活和回访率，功能独特且用户价值高。

---

### 优先级 3: battles.ts 大型模块拆分

**问题**: `battles.ts` 达 2745 行，混合了数据层、过滤逻辑、排序、分析等多种职责。

**方案**: 按领域拆分为：
- `battles/core.ts` — 基础 CRUD、过滤、排序、搜索
- `battles/discovery.ts` — 今日战役、随机战役、同代战役、相似战役
- `battles/compare.ts` — 战役对比
- `battles/stats.ts` — 统计函数

**注意**: 工作量大但收益是长期可维护性。当前代码质量已很高，需权衡。

---

### 优先级 4: 时代详情页（Era Detail）

**现状**: WorldTimeline 刚完成 i18n，但各时代只有导航，没有详情页。

**改进方案**:
1. 创建 `/[locale]/era/[eraId]` 页面
2. 显示该时代所有统治者（按 polity 分组）
3. 显示该时代所有战役（按年份排序）
4. 显示该时代关键事件时间轴
5. 与 MatrixClient 联动

**收益**: 内容深度提升，与现有数据匹配。

---

### 优先级 5: 战役数据扩展

**现状**: chinaEvents 主要覆盖西周至战国初期。

**改进方案**:
- 补充秦汉时期：巨鹿之战、垓下之战、漠北之战
- 补充三国时期：官渡之战、赤壁之战、夷陵之战
- 补充淝水之战（五胡十六国/东晋）

**注意**: 数据扩展需同步更新 i18n messages 文件，且需确保测试覆盖。

---

### 优先级 6: 指挥官详情页

**现状**: CommandersClient 已有指挥官列表和关系网络，但点击指挥官只能看到侧边信息，无独立页面。

**改进方案**:
1. 创建 `/[locale]/commanders/[commanderId]` 页面
2. 显示该指挥官参与的所有战役列表
3. 显示该指挥官的胜率统计、指挥官协作关系
4. 与 BattleDetail 联动

---

## 三、本轮建议（优先级排序）

| 优先级 | 改进点 | 工作量 | 价值 | 风险 |
|--------|--------|--------|------|------|
| 1 | 战役多维过滤 + URL 状态同步 | 中 | 高（UX 提升） | 低 |
| 2 | "历史上的今天"全功能页面 | 中 | 高（日活/回访） | 低 |
| 3 | battles.ts 模块拆分 | 高 | 中（可维护性） | 中 |
| 4 | 时代详情页 | 中 | 中（内容深度） | 低 |
| 5 | 战役数据扩展 | 中 | 高（内容深度） | 低 |
| 6 | 指挥官详情页 | 低 | 中（功能完整） | 低 |

**推荐下一轮**: 优先级 1（战役多维过滤）+ 优先级 2（历史上的今天）可并行，但优先级 1 先做，因为它是其他功能的基础。

---

## 四、持续发现

- CI/CD 每 6 小时自动构建，但构建是否成功应有通知机制
- `tools/scrape_wikipedia_tang.py` 存在但未集成到构建流程，可用于未来数据扩展
- `constants/` 目录下可能有重复定义文件需清理
- `useHistoryAppColors.ts` 235 行较复杂，可考虑拆分
- `BattleOfTheDayCard` 已存在但"今日战役"没有专属页面入口（用户需滚动到特定位置才能看到）
- CommandersClient 中的 `COMMANDERS_COLORS` 是内联颜色常量，可迁移到 constants.ts

---

## 五、已识别但未启动的工作

以下内容来自上次规划，在本次迭代中被更优先的功能超越：

- ❌ 战役收藏夹导出/导入功能
- ❌ 战役统计仪表板独立页面
- ❌ 指挥官关系图可视化（已有 CommanderNetworkGraph 组件但仅限指挥官页面）
- ❌ TimelineClient 添加键盘导航快捷键

---

_本文件随项目迭代持续更新。每次重大功能完成后更新此文档。_
