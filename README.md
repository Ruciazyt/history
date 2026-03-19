# History Atlas

中国历史年表地图 —— 探索朝代更替、重大战役与历史人物。

**在线访问**: https://history.ruciazyt.cn

## 功能

### 核心功能
- 📜 **时间线视图** - 按时代浏览历史事件
- ⚔️ **战役分析** - 查看战役详情、指挥官、战术、地理位置
- 🗺️ **地图展示** - 事件在地图上的分布
- ⊞ **多国并立矩阵** - 春秋战国、三国等乱世各国对比
- 🏛️ **地名演化** - 城市在不同历史时期的名称变迁
- 🌍 **欧亚对比** - 欧亚大陆各帝国/政权时间线对比
- ❤️ **收藏夹** - 收藏喜欢的战役

### 战役详情
- 参战方与指挥官
- 战术类型与地形
- 战役节奏与时间段
- 转折点分析
- 胜负因素洞察

### 技术特点
- Next.js 16 + TypeScript
- React-map-gl 地图展示
- 完整的单元测试（600+ 测试用例）
- 多语言支持（中/英/日）
- 响应式设计

## 本地开发

```bash
npm ci
npm run dev
```

## 构建

```bash
npm run lint    # 代码检查
npm run build   # 生产构建
npm run start   # 启动生产服务器
npm test        # 运行测试
```

## 项目结构

```
src/
├── app/[locale]/          # 页面路由
│   ├── battles/           # 战役页面
│   ├── favorites/         # 收藏夹
│   ├── grid/              # 欧亚对比网格
│   ├── matrix/            # 多国并立矩阵
│   ├── place-names/       # 地名演化
│   └── timeline/          # 时间线
├── components/            # React 组件
│   ├── battles/           # 战役相关组件
│   ├── common/            # 通用组件
│   ├── matrix/            # 矩阵视图
│   ├── timeline/          # 时间线组件
│   └── world/             # 世界/欧亚组件
└── lib/history/           # 核心逻辑
    ├── data/              # 历史数据
    ├── constants/         # 常量定义
    └── *.ts               # 分析模块
```

## 数据

主要数据文件：
- `src/lib/history/data/chinaEras.ts` - 中国时代数据
- `src/lib/history/data/chinaEvents.ts` - 历史事件
- `src/lib/history/data/chinaRulers.ts` - 帝王数据
- `src/lib/history/data/worldBoundaries.ts` - 世界帝国边界
- `src/lib/history/data/placeNameChanges.ts` - 地名演化数据
