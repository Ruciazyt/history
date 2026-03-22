# History Atlas 项目规划分析

**更新时间**: 2026-03-23 00:05

## 项目现状

### 项目规模
- **核心数据**: chinaEvents.ts (1100行), placeNameEvolution.ts (2720行), chinaRulers.ts (715行)
- **核心库**: battles.ts (2806行, 84个导出函数), battles.test.ts (1841行)
- **总lib代码**: 约18680行
- **组件数**: 16个battle组件, 12+个common组件, 6个world组件
- **单元测试**: 693个测试用例全部通过
- **部署**: https://history.ruciazyt.cn

### 当前迭代进度 (第三十四轮 - 2026-03-21)
- ✅ 测试修复 (i18n key返回改造)
- ✅ Lint 0错误 0警告
- ✅ 单元测试 693个全部通过
- ✅ 构建验证通过

### 近期完成的主要工作
1. **常量系统重构** (二十余轮): 将硬编码颜色值统一到constants.ts
2. **i18n国际化**: 战役详情、对比、收藏夹、时间线等组件完成国际化
3. **今日战役功能**: getBattleOfTheDay, getRandomBattle, getSameEraBattles
4. **战役收藏夹**: FavoritesClient 组件, localStorage持久化

---

## 可改进点分析

### 1. battles.ts 巨型文件重构 (优先级: 高)

**问题**:
- 单文件 2806 行, 84 个导出函数
- 混合了: 数据查询(i18n key获取)、统计分析、推荐算法、时间处理、收藏夹推荐
- 维护困难, 测试文件 1841 行也在膨胀

**改进方案**: 拆分为职责明确的多个文件

```
lib/history/battles/
├── queries.ts       # getBattles, getBattlesByYearRange, searchBattles, sortBattles...
├── labels.ts        # getBattleResultLabel, getBattleImpactLabel, getPacingLabel...
├── statistics.ts    # getBattleStats, getUniqueParticipants, getParticipantStats...
├── recommendation.ts # getRecommendedBattles (收藏夹推荐算法)
├── time.ts          # getBattleOfTheDay, getRandomBattle, getSameEraBattles...
├── seasonality.ts   # getBattleSeasonality, getMostActiveSeason...
├── index.ts         # re-export everything for backward compatibility
```

**收益**:
- 每个文件 <500行, 职责清晰
- 便于单独测试和维护
- 新功能开发时只需修改对应文件

---

### 2. WorldTimeline 页面功能增强 (优先级: 中)

**现状**:
- WorldTimeline 已完成基础i18n化
- 仅显示活跃政权数量, 功能较简单

**增强方向**:
1. **文明对比统计**: 显示同一时期东西方主要政权对比 (如 汉朝 vs 罗马帝国)
2. **世界战役分布**: 在时间轴上标注重要世界性战役
3. **文明兴衰预览**: 显示各区域疆域变化热力图
4. **快速跳转**: 选择时代后跳转至对应Timeline页面

**收益**:
- 提升用户"宏观看历史"的体验
- 与现有的BattleOfTheDay功能形成互补 (微观 ↔ 宏观)

---

## 暂不推进的方向

- **朝代/文明数据扩展**: 当前以中国史为主, 扩展世界史数据工程量大
- **3D地图/动画效果**: 好看但ROI低, 当前敏捷迭代优先实用功能
- **多语言扩展**: 已支持中英日, 其他语言暂无必要

---

## 建议下一步

1. **短期 (1-2轮)**: battles.ts 重构拆分
   - 先拆 queries.ts + labels.ts (风险低)
   - 保持 index.ts 重新导出, 零Breaking Change

2. **中期**: WorldTimeline 功能增强
   - 添加文明对比卡片
   - 与现有 TimelineClient 联动

---
