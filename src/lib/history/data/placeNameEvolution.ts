/**
 * 地名演变数据
 * 记录重要城市/地区的古代名称变迁
 * 年份规则：负数=公元前，正数=公元后
 */

export interface PlaceNameRecord {
  name: string;           // 名称
  startYear: number;     // 开始年份
  endYear: number;       // 结束年份
  dynasty?: string;      // 朝代（可选）
  notes?: string;        // 备注（可选）
}

export interface PlaceEvolution {
  modernName: string;     // 现代名称
  coordinate: {            // 现代坐标
    lon: number;
    lat: number;
  };
  names: PlaceNameRecord[];
}

// 主要城市地名演变数据
export const PLACE_EVOLUTIONS: PlaceEvolution[] = [
  {
    modernName: '西安',
    coordinate: { lon: 108.94, lat: 34.34 },
    names: [
      { name: '丰京', startYear: -1050, endYear: -1046, dynasty: '西周' },
      { name: '镐京', startYear: -1046, endYear: -771, dynasty: '西周' },
      { name: '咸阳', startYear: -350, endYear: -206, dynasty: '战国·秦' },
      { name: '长安', startYear: -202, endYear: 9, dynasty: '西汉' },
      { name: '常安', startYear: 581, endYear: 618, dynasty: '隋' },
      { name: '长安', startYear: 618, endYear: 904, dynasty: '唐' },
      { name: '奉天', startYear: 904, endYear: 907, dynasty: '唐' },
      { name: '长安', startYear: 907, endYear: 957, dynasty: '五代·后唐' },
      { name: '永昌', startYear: 957, endYear: 958, dynasty: '五代·后晋' },
      { name: '长安', startYear: 958, endYear: 960, dynasty: '五代·后周' },
      { name: '京兆', startYear: 960, endYear: 1368, dynasty: '宋金元' },
      { name: '西安', startYear: 1369, endYear: 1912, dynasty: '明' },
      { name: '西安', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '洛阳',
    coordinate: { lon: 112.45, lat: 34.62 },
    names: [
      { name: '洛阳', startYear: -770, endYear: -256, dynasty: '东周' },
      { name: '雒阳', startYear: -206, endYear: 25, dynasty: '秦汉' },
      { name: '洛阳', startYear: 25, endYear: 190, dynasty: '东汉' },
      { name: '洛阳', startYear: 220, endYear: 534, dynasty: '魏晋南北朝' },
      { name: '洛阳', startYear: 618, endYear: 907, dynasty: '唐' },
      { name: '洛阳', startYear: 960, endYear: 1279, dynasty: '宋' },
      { name: '洛阳', startYear: 1279, endYear: 1912, dynasty: '元明清' },
    ],
  },
  {
    modernName: '北京',
    coordinate: { lon: 116.40, lat: 39.90 },
    names: [
      { name: '蓟', startYear: -1000, endYear: -226, dynasty: '燕' },
      { name: '广阳', startYear: -226, endYear: -202, dynasty: '秦' },
      { name: '蓟县', startYear: -202, endYear: 580, dynasty: '汉' },
      { name: '幽州', startYear: 580, endYear: 938, dynasty: '隋唐' },
      { name: '燕京', startYear: 938, endYear: 1150, dynasty: '辽' },
      { name: '中都', startYear: 1150, endYear: 1267, dynasty: '金' },
      { name: '大都', startYear: 1267, endYear: 1368, dynasty: '元' },
      { name: '北平', startYear: 1368, endYear: 1403, dynasty: '明初' },
      { name: '北京', startYear: 1403, endYear: 1912, dynasty: '明' },
      { name: '北平', startYear: 1912, endYear: 1949, dynasty: '民国' },
      { name: '北京', startYear: 1949, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '南京',
    coordinate: { lon: 118.78, lat: 32.07 },
    names: [
      { name: '金陵', startYear: -333, endYear: -210, dynasty: '战国·楚' },
      { name: '秣陵', startYear: -210, endYear: 229, dynasty: '秦汉' },
      { name: '建业', startYear: 229, endYear: 317, dynasty: '三国·吴' },
      { name: '建康', startYear: 317, endYear: 589, dynasty: '东晋南北朝' },
      { name: '蒋州', startYear: 589, endYear: 618, dynasty: '隋' },
      { name: '升州', startYear: 618, endYear: 907, dynasty: '唐' },
      { name: '金陵', startYear: 907, endYear: 979, dynasty: '五代' },
      { name: '江宁', startYear: 979, endYear: 1357, dynasty: '宋元' },
      { name: '应天', startYear: 1357, endYear: 1368, dynasty: '元末' },
      { name: '南京', startYear: 1368, endYear: 1421, dynasty: '明初' },
      { name: '应天', startYear: 1421, endYear: 1449, dynasty: '明' },
      { name: '南京', startYear: 1449, endYear: 1912, dynasty: '明' },
      { name: '金陵', startYear: 1912, endYear: 1949, dynasty: '民国' },
      { name: '南京', startYear: 1949, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '开封',
    coordinate: { lon: 114.35, lat: 34.79 },
    names: [
      { name: '大梁', startYear: -360, endYear: -206, dynasty: '战国·魏' },
      { name: '陈留', startYear: -206, endYear: 534, dynasty: '秦汉魏晋' },
      { name: '汴州', startYear: 534, endYear: 960, dynasty: '南北朝隋唐' },
      { name: '开封', startYear: 960, endYear: 1127, dynasty: '北宋' },
      { name: '汴京', startYear: 1127, endYear: 1234, dynasty: '金' },
      { name: '开封', startYear: 1234, endYear: 1912, dynasty: '元明清' },
    ],
  },
  {
    modernName: '杭州',
    coordinate: { lon: 120.15, lat: 30.29 },
    names: [
      { name: '钱塘', startYear: -221, endYear: 590, dynasty: '秦汉南北朝' },
      { name: '杭州', startYear: 590, endYear: 1130, dynasty: '隋唐五代' },
      { name: '临安', startYear: 1130, endYear: 1276, dynasty: '南宋' },
      { name: '杭州', startYear: 1276, endYear: 1912, dynasty: '元明清' },
    ],
  },
  {
    modernName: '成都',
    coordinate: { lon: 104.07, lat: 30.67 },
    names: [
      { name: '成都', startYear: -311, endYear: 907, dynasty: '古蜀秦汉隋唐' },
      { name: '南京', startYear: 907, endYear: 925, dynasty: '五代·前蜀' },
      { name: '成都', startYear: 925, endYear: 1368, dynasty: '五代·后蜀宋元' },
      { name: '成都', startYear: 1368, endYear: 1912, dynasty: '明清' },
    ],
  },
  {
    modernName: '长沙',
    coordinate: { lon: 112.98, lat: 28.20 },
    names: [
      { name: '临湘', startYear: -202, endYear: 589, dynasty: '秦汉南北朝' },
      { name: '潭州', startYear: 589, endYear: 1104, dynasty: '隋唐宋' },
      { name: '长沙', startYear: 1104, endYear: 1912, dynasty: '宋明清' },
    ],
  },
  {
    modernName: '广州',
    coordinate: { lon: 113.27, lat: 23.13 },
    names: [
      { name: '番禺', startYear: -214, endYear: 589, dynasty: '秦汉六朝' },
      { name: '广州', startYear: 589, endYear: 1912, dynasty: '隋唐宋元明清' },
    ],
  },
  {
    modernName: '沈阳',
    coordinate: { lon: 123.43, lat: 41.80 },
    names: [
      { name: '候城', startYear: -300, endYear: 200, dynasty: '战国燕' },
      { name: '沈阳', startYear: 200, endYear: 1625, dynasty: '汉晋元' },
      { name: '盛京', startYear: 1625, endYear: 1657, dynasty: '清初' },
      { name: '沈阳', startYear: 1657, endYear: 1912, dynasty: '清' },
    ],
  },
];

/**
 * 搜索地名演变
 */
export function searchPlaceEvolution(
  query: string
): PlaceEvolution[] {
  const lowerQuery = query.toLowerCase();
  return PLACE_EVOLUTIONS.filter((p) =>
    p.modernName.toLowerCase().includes(lowerQuery) ||
    p.names.some((n) => n.name.toLowerCase().includes(lowerQuery))
  ).slice(0, 10);
}

/**
 * 获取某地的名称演变时间线
 */
export function getPlaceEvolution(
  modernName: string
): PlaceEvolution | undefined {
  return PLACE_EVOLUTIONS.find(
    (p) => p.modernName.toLowerCase() === modernName.toLowerCase()
  );
}
