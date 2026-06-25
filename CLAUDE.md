# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

History Atlas — an interactive Chinese history atlas with timeline, battles, maps, and multi-language support. Deployed at `https://history.ruciazyt.cn` via Vercel.

## Commands

```bash
npm ci              # Install dependencies
npm run dev         # Dev server (Next.js with Turbopack)
npm run build       # Production build (type-checking enforced, ignoreBuildErrors: false)
npm run lint        # ESLint (flat config, next/core-web-vitals + typescript)
npm test            # Vitest in watch mode
npm run test:run    # Vitest single run (CI mode)
```

Run a single test file: `npx vitest run src/lib/history/battles.test.ts`

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript 5** (strict mode)
- **Tailwind CSS v4** via `@tailwindcss/postcss` with extensive CSS custom properties for light/dark theming
- **next-intl 4.x** for i18n (locales: `zh`, `en`, `ja`; default: `zh`)
- **react-map-gl** + **maplibre-gl** for map rendering
- **Vitest 4** + **@testing-library/react** + **jsdom** for testing

## Architecture

### Routing & i18n

All pages live under `src/app/[locale]/` with locale-aware middleware (`middleware.ts` using `next-intl/middleware`). The root `page.tsx` redirects to `/zh`. Locale routing config is in `i18n/routing.ts` (exports `locales`, `defaultLocale`).

### Client-Side Shell Router

`Shell.tsx` acts as a client-side router using `matchPath()` on `usePathname()`, mapping URL segments to page components. Each `src/app/[locale]/*/page.tsx` renders `<Shell>` which then resolves the actual page component client-side. This is an intentional pattern — don't refactor pages to bypass Shell.

### Data Layer

All historical data is statically imported from TypeScript files in `src/lib/history/data/` — there is no API or database. Key files: `chinaEras.ts`, `chinaEvents.ts`, `chinaRulers.ts`, `worldBoundaries.ts`, `placeNameChanges.ts`.

### Core Library (`src/lib/history/`)

- `types.ts` — all TypeScript types (Era, Ruler, Event, Battle*, etc.)
- `battles.ts` — core battle query/label functions (~2800 lines, 84 exports). Known tech debt: candidate for decomposition into `queries.ts`, `labels.ts`, `statistics.ts`, etc.
- `battle*.ts` — specialized analysis modules (casualties, chain, comparison, pacing, scale, strategy, terrain, time, turningPoints)
- `commanderNetwork.ts` — commander relationship graph
- `constants/` — colors, labels, layout, animations (re-exported via `constants/index.ts`)
- `quiz.ts` — quiz logic
- Each `.ts` module has a colocated `.test.ts` file

### Theming

`globals.css` defines 100+ CSS custom properties for light/dark themes. `ThemeContext.tsx` in `src/components/common/` provides the theme toggle. Colors are centralized in `src/lib/history/constants/colors.ts`.

### i18n Pattern

All user-visible text uses dot-path i18n keys (e.g., `'battle.result.attacker_win'`) resolved at runtime from locale JSON files in `src/messages/`. When adding new text, add keys to all three locale files (`zh.json`, `en.json`, `ja.json`). Python scripts `check_i18n.py` / `check_i18n2.py` can validate key completeness.

### Components

- `src/components/common/` — shared UI (Badge, Button, Card, SearchBox, ThemeToggle, YearSlider, etc.)
- `src/components/battles/` — battle-related views (13 files)
- `src/components/commanders/` — commander network graph
- `src/components/world/` — world/comparison views (EurasianGrid, WorldEmpireMap, etc.)
- `src/components/timeline/` — timeline views

## Testing Conventions

- Tests colocated with source: `Foo.tsx` → `Foo.test.tsx` in the same directory
- Use `vi.mock()` for Next.js modules (`next/navigation`, `next-intl`) and data modules
- Use `vi.fn()` for mock return values that change per test
- Use `screen.getByTestId()` / `screen.getByText()` from `@testing-library/react`
- Clear mocks with `vi.clearAllMocks()` in `beforeEach`
- 693+ test cases currently passing

## TypeScript Strictness

The project enforces strict TypeScript: `noUncheckedIndexedAccess`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `noImplicitOverride`, `forceConsistentCasingInFileNames`. Build will fail on type errors.

## Path Aliases

`@/*` maps to `./src/*` (configured in tsconfig.json and vitest.config.ts).

## Design

开发时按照 `DESIGN.md` 进行设计。该文件定义了完整的 Figma 设计系统规范，包括色彩体系、排版层级、间距系统、圆角规范、组件变体和响应式行为。新增或修改 UI 组件时，必须参考其中的 token 命名和 Do's / Don'ts 约束。

## Deployment

### Vercel Git 集成（自动部署）

项目通过 Vercel Git 集成实现自动部署，无需 GitHub Actions。

**首次设置步骤：**

1. 登录 [vercel.com](https://vercel.com)
2. 点击 "Add New..." → "Project"
3. 导入 GitHub 仓库 `history`
4. Framework Preset 自动识别为 Next.js，无需修改
5. 点击 "Deploy"

**自动部署行为：**

| 触发条件 | 部署类型 | 说明 |
|---------|---------|------|
| Push 到 `main` 分支 | Production | 自动部署到 `history.ruciazyt.cn` |
| Pull Request | Preview | 生成预览 URL，方便测试 |
| Push 到其他分支 | Preview | 生成预览 URL |

**自定义域名配置：**

1. 在 Vercel 项目设置 → "Domains"
2. 添加 `history.ruciazyt.cn`
3. 按提示配置 DNS（CNAME 记录指向 `cname.vercel-dns.com`）

**Rewrite 规则：**

`vercel.json` 配置了 `/history/:path` → `/:path` 的 rewrite 规则，支持子路径部署。

**无环境变量** — 项目不需要在 Vercel 中配置额外的环境变量。
