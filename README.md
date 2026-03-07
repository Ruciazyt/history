# History Atlas (MVP)

A "history learning" prototype focused on **China eras/periods**, with a simple loop:

- Select an **Era / period**
- Pick a **year window** on a timeline
- See **events** (few but high-signal)
- See events as **points on a map** (no dynamic borders in phase 1)

## Phase 1 scope (agreed)

- **Organization**: by Era/period (Spring & Autumn / Warring States are treated as periods inside the same Era system)
- **Map**: event points/regions + same-window comparison; **no dynamic territorial borders yet**

## Local dev

```bash
npm ci
npm run dev
```

## Build

```bash
npm run build
npm run start
```

## Data

Seed data lives here:

- `src/lib/history/data/chinaEras.ts`
- `src/lib/history/data/chinaEvents.ts`

Dates/locations are approximate and intended for MVP iteration.
