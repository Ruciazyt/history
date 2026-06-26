/** 地图友好的疆域配色（对齐设计稿 pastel 色系，相邻色可区分） */
const CHGIS_ERA_FILL_PALETTE = [
  '#a8c48a',
  '#7eb8da',
  '#e8b86d',
  '#c5b0f4',
  '#efd4d4',
  '#c8e6cd',
  '#f3c9b6',
  '#9ec5e8',
  '#d4a5e8',
  '#b8d99a',
  '#f0c987',
  '#a8b5e0',
  '#e8a8b8',
  '#88c9b8',
  '#d8c4a0',
  '#b0a8d8',
] as const;

export const CHGIS_DEFAULT_BOUNDARY_COLORS = {
  fillColor: '#a8c48a',
  strokeColor: '#8aab6e',
} as const;

function darkenHex(hex: string, amount = 0.28): string {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  const f = 1 - amount;
  const to = (n: number) => Math.round(n * f).toString(16).padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`;
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/** 按朝代 id 稳定分配 fill / stroke；同一朝代内所有府州同色 */
export function getChgisEraColors(eraId: string): { fillColor: string; strokeColor: string } {
  const fillColor = CHGIS_ERA_FILL_PALETTE[hashString(eraId) % CHGIS_ERA_FILL_PALETTE.length]!;
  return { fillColor, strokeColor: darkenHex(fillColor) };
}
