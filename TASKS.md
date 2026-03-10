# History Atlas 帝王关系可视化功能计划

## 当前任务
✅ 已完成：帝王关系可视化功能

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

## 下次迭代 ideas
- 添加更多朝代的帝王关系数据
- 战役/战争可视化功能
- 搜索功能
