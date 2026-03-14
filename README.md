# History Atlas

<p align="center">
  <img src="https://img.shields.io/github/stars/Ruciazyt/history" alt="GitHub Stars">
  <img src="https://img.shields.io/github/license/Ruciazyt/history" alt="License">
  <img src="https://img.shields.io/badge/Next.js-14-black" alt="Next.js">
</p>

一个基于中国历史朝代/时期的学习探索工具，通过时间轴和地图直观呈现历史事件。

![History Atlas Preview](https://via.placeholder.com/800x400?text=History+Atlas+Preview)

## ✨ 特性

- 📜 **朝代选择** - 按朝代/时期分类浏览中国历史
- 📅 **时间轴** - 滑动时间窗口选择特定年份范围
- 📰 **事件查看** - 高质量历史事件精选
- 🗺️ **地图展示** - 将历史事件以点位形式呈现于地图上
- 🔍 **同期对比** - 对比同时期不同地区的事件

## 🛠️ 技术栈

- **框架**: Next.js 14
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **地图**: Leaflet / React-Leaflet
- **测试**: Vitest
- **部署**: Vercel

## 🚀 快速开始

### 克隆项目

```bash
git clone https://github.com/Ruciazyt/history.git
cd history
```

### 安装依赖

```bash
npm ci
```

### 开发模式

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 生产构建

```bash
npm run build
npm run start
```

## 📁 项目结构

```
src/
├── lib/
│   └── history/
│       └── data/           # 历史数据
│           ├── chinaEras.ts    # 朝代数据
│           └── chinaEvents.ts  # 历史事件数据
├── components/             # React 组件
├── app/                   # Next.js App Router
└── styles/                # 样式文件
```

## 📊 数据说明

历史数据存储在以下文件中：

| 文件 | 说明 |
|------|------|
| `src/lib/history/data/chinaEras.ts` | 中国朝代/时期数据 |
| `src/lib/history/data/chinaEvents.ts` | 历史事件数据 |

> ⚠️ **注意**: 日期和地理位置为近似值，仅用于 MVP 迭代。

## 📋 版本规划

### Phase 1 (当前)
- [x] 按朝代/时期分类组织
- [x] 时间轴选择年份窗口
- [x] 事件列表展示
- [x] 地图事件点位展示
- [ ] ~~动态疆域边界~~ (暂不做)

### Phase 2 (规划中)
- 动态疆域边界展示
- 更多朝代数据补充
- 事件详情页
- 搜索功能

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

<p align="center">Made with ❤️ by <a href="https://github.com/Ruciazyt">Ruciazyt</a></p>
