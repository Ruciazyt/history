# History Atlas 帝王关系可视化功能计划

## 当前任务
✅ 已完成：战役/战争可视化功能迭代

## 功能设计
1. **关系类型**: 父子、兄弟、叔侄、祖孙
2. **数据格式**: 在 Ruler 类型中添加 parentId, siblingIds, childrenIds 字段
3. **可视化**: 帝王卡片上显示关系链接

## 技术方案
- [x] 修改 types.ts 添加关系字段
- [x] 添加帝王关系数据 (周天子、齐国)
- [x] 创建 rulerRelations 工具函数
- [x] 创建 RulerRelations 组件
- [x] 集成到 HistoryApp
- [x] 单元测试 (5 passed)
- [x] 构建验证
- [x] 提交代码 (commit 5635fb5)
- [x] 部署到 Vercel ✅ https://history.ruciazyt.cn

---

## 战役/战争可视化功能迭代 (2026-03-10)

### 新增功能
1. **战役详情弹窗** - 点击战役卡片显示详细信息
   - 战役名称、年代、地理位置
   - 参战双方（进攻方/防守方）
   - 战役结果
   - 战役概述
   - 战场位置坐标
   
2. **扩展 battles.ts 工具函数**
   - sortBattlesByYear - 按年代排序
   - getBattlesByYearRange - 按年代范围筛选
   - getBattleParties - 获取参战方信息
   - isBattleComplete - 检查战役信息完整性

3. **完善战役数据**
   - 城濮之战 (晋 vs 楚)
   - 马陵之战 (齐 vs 魏)
   - 乐毅伐齐 (燕 vs 齐)
   - 秦拔郢 (秦 vs 楚)
   - 秦灭六国系列战役

### 技术实现
- [x] 创建 BattleDetail 组件
- [x] 修改 BattleCard 支持点击显示详情
- [x] 扩展 battles.ts 工具函数
- [x] 完善战役数据（添加位置、参战方、结果）
- [x] 单元测试 (18 tests passed)
- [x] 构建验证
- [x] 提交代码 (commit 0e12ba3, 0ddd654)
- [x] 部署到 Vercel ✅ https://history.ruciazyt.cn

## 下次迭代 ideas
- 添加更多朝代的帝王关系数据
- 战役地图可视化（地图上显示战役位置）
- 搜索功能
