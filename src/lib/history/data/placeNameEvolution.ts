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
  // ==================== 四大古都 ====================
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
  // ==================== 开封（北宋都城） ====================
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
  // ==================== 杭州 ====================
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
  // ==================== 其他省会城市 ====================
  {
    modernName: '成都',
    coordinate: { lon: 104.07, lat: 30.67 },
    names: [
      { name: '成都', startYear: -311, endYear: 221, dynasty: '古蜀秦' },
      { name: '蜀郡', startYear: 221, endYear: 265, dynasty: '秦汉' },
      { name: '成都', startYear: 265, endYear: 907, dynasty: '魏晋隋唐' },
      { name: '成都', startYear: 907, endYear: 925, dynasty: '五代·前蜀' },
      { name: '成都', startYear: 925, endYear: 1368, dynasty: '五代·后蜀宋元' },
      { name: '成都府', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '成都', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '长沙',
    coordinate: { lon: 112.98, lat: 28.20 },
    names: [
      { name: '临湘', startYear: -202, endYear: 589, dynasty: '秦汉南北朝' },
      { name: '潭州', startYear: 589, endYear: 1104, dynasty: '隋唐宋' },
      { name: '长沙', startYear: 1104, endYear: 1912, dynasty: '宋明清' },
      { name: '长沙', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '广州',
    coordinate: { lon: 113.27, lat: 23.13 },
    names: [
      { name: '番禺', startYear: -214, endYear: 589, dynasty: '秦汉六朝' },
      { name: '广州', startYear: 589, endYear: 1912, dynasty: '隋唐宋元明清' },
      { name: '广州', startYear: 1912, endYear: 2026, dynasty: '现代' },
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
      { name: '沈阳', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  // ==================== 重要历史城市 ====================
  {
    modernName: '武汉',
    coordinate: { lon: 114.31, lat: 30.52 },
    names: [
      { name: '江夏', startYear: -206, endYear: 589, dynasty: '秦汉南北朝' },
      { name: '鄂州', startYear: 589, endYear: 958, dynasty: '隋唐五代' },
      { name: '武汉', startYear: 958, endYear: 1912, dynasty: '宋元明清' },
      { name: '武汉', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '郑州',
    coordinate: { lon: 113.65, lat: 34.76 },
    names: [
      { name: '荥阳', startYear: -500, endYear: 580, dynasty: '战国秦隋' },
      { name: '郑州', startYear: 580, endYear: 1912, dynasty: '隋唐宋明清' },
      { name: '郑州', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '济南',
    coordinate: { lon: 116.99, lat: 36.67 },
    names: [
      { name: '历下', startYear: -500, endYear: -200, dynasty: '战国' },
      { name: '济南', startYear: -200, endYear: 589, dynasty: '秦汉魏晋南北朝' },
      { name: '齐州', startYear: 589, endYear: 1000, dynasty: '隋唐宋' },
      { name: '济南府', startYear: 1000, endYear: 1368, dynasty: '宋金元' },
      { name: '济南', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '济南', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '太原',
    coordinate: { lon: 112.53, lat: 37.87 },
    names: [
      { name: '晋阳', startYear: -500, endYear: 979, dynasty: '战国唐' },
      { name: '太原', startYear: 979, endYear: 1912, dynasty: '宋元明清' },
      { name: '太原', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '合肥',
    coordinate: { lon: 117.28, lat: 31.86 },
    names: [
      { name: '合肥', startYear: -200, endYear: 580, dynasty: '秦汉南北朝' },
      { name: '庐州', startYear: 580, endYear: 1368, dynasty: '隋元' },
      { name: '合肥', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '合肥', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '南昌',
    coordinate: { lon: 115.89, lat: 28.68 },
    names: [
      { name: '豫章', startYear: -200, endYear: 589, dynasty: '秦汉南北朝' },
      { name: '南昌', startYear: 589, endYear: 1912, dynasty: '隋明清' },
      { name: '南昌', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '昆明',
    coordinate: { lon: 102.71, lat: 25.04 },
    names: [
      { name: '滇池', startYear: -100, endYear: 320, dynasty: '古滇' },
      { name: '昆明', startYear: 320, endYear: 1912, dynasty: '唐宋元明清' },
      { name: '昆明', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '贵阳',
    coordinate: { lon: 106.71, lat: 26.57 },
    names: [
      { name: '贵州', startYear: 1100, endYear: 1912, dynasty: '宋元明清' },
      { name: '贵阳', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '南宁',
    coordinate: { lon: 108.33, lat: 22.84 },
    names: [
      { name: '邕州', startYear: 600, endYear: 1324, dynasty: '隋元' },
      { name: '南宁', startYear: 1324, endYear: 1912, dynasty: '元明清' },
      { name: '南宁', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '福州',
    coordinate: { lon: 119.30, lat: 26.08 },
    names: [
      { name: '闽中', startYear: -200, endYear: 580, dynasty: '秦汉南北朝' },
      { name: '福州', startYear: 580, endYear: 1912, dynasty: '隋明清' },
      { name: '福州', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '哈尔滨',
    coordinate: { lon: 126.53, lat: 45.80 },
    names: [
      { name: '阿勒楚喀', startYear: 1700, endYear: 1900, dynasty: '清' },
      { name: '哈尔滨', startYear: 1900, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '长春',
    coordinate: { lon: 125.32, lat: 43.88 },
    names: [
      { name: '宽城子', startYear: 1800, endYear: 1900, dynasty: '清' },
      { name: '长春', startYear: 1900, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '石家庄',
    coordinate: { lon: 114.48, lat: 38.03 },
    names: [
      { name: '石门', startYear: 1925, endYear: 1947, dynasty: '民国' },
      { name: '石家庄', startYear: 1947, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '乌鲁木齐',
    coordinate: { lon: 87.62, lat: 43.83 },
    names: [
      { name: '迪化', startYear: 1755, endYear: 1954, dynasty: '清' },
      { name: '乌鲁木齐', startYear: 1954, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '兰州',
    coordinate: { lon: 103.83, lat: 36.06 },
    names: [
      { name: '金城', startYear: -200, endYear: 600, dynasty: '秦汉隋' },
      { name: '兰州', startYear: 600, endYear: 1912, dynasty: '隋唐宋元明清' },
      { name: '兰州', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '西宁',
    coordinate: { lon: 101.78, lat: 36.62 },
    names: [
      { name: '鄯州', startYear: 400, endYear: 1100, dynasty: '南北朝宋' },
      { name: '西宁', startYear: 1100, endYear: 1912, dynasty: '宋元明清' },
      { name: '西宁', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '呼和浩特',
    coordinate: { lon: 111.73, lat: 40.84 },
    names: [
      { name: '归化', startYear: 1581, endYear: 1912, dynasty: '明清' },
      { name: '呼和浩特', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '银川',
    coordinate: { lon: 106.23, lat: 38.47 },
    names: [
      { name: '兴庆', startYear: 1000, endYear: 1227, dynasty: '西夏' },
      { name: '宁夏', startYear: 1227, endYear: 1912, dynasty: '元明清' },
      { name: '银川', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '拉萨',
    coordinate: { lon: 91.11, lat: 29.65 },
    names: [
      { name: '逻些', startYear: 600, endYear: 1000, dynasty: '唐' },
      { name: '拉萨', startYear: 1000, endYear: 2026, dynasty: '宋元明清现代' },
    ],
  },
  {
    modernName: '苏州',
    coordinate: { lon: 120.62, lat: 31.30 },
    names: [
      { name: '吴县', startYear: -500, endYear: 589, dynasty: '战国南北朝' },
      { name: '苏州', startYear: 589, endYear: 1912, dynasty: '隋清' },
      { name: '苏州', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '扬州',
    coordinate: { lon: 119.42, lat: 32.39 },
    names: [
      { name: '广陵', startYear: -200, endYear: 600, dynasty: '秦汉南北朝' },
      { name: '扬州', startYear: 600, endYear: 1912, dynasty: '隋明清' },
      { name: '扬州', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '镇江',
    coordinate: { lon: 119.45, lat: 32.20 },
    names: [
      { name: '京口', startYear: -200, endYear: 589, dynasty: '秦汉南北朝' },
      { name: '润州', startYear: 589, endYear: 1120, dynasty: '隋宋' },
      { name: '镇江', startYear: 1120, endYear: 1912, dynasty: '宋明清' },
      { name: '镇江', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '常州',
    coordinate: { lon: 119.97, lat: 31.81 },
    names: [
      { name: '延陵', startYear: -500, endYear: 589, dynasty: '战国南北朝' },
      { name: '常州', startYear: 589, endYear: 1912, dynasty: '隋明清' },
      { name: '常州', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '无锡',
    coordinate: { lon: 120.30, lat: 31.57 },
    names: [
      { name: '无锡', startYear: -200, endYear: 1912, dynasty: '秦清' },
      { name: '无锡', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '青岛',
    coordinate: { lon: 120.38, lat: 36.07 },
    names: [
      { name: '胶州', startYear: -500, endYear: 1898, dynasty: '战国清' },
      { name: '青岛', startYear: 1898, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '大连',
    coordinate: { lon: 121.62, lat: 38.91 },
    names: [
      { name: '三山浦', startYear: 600, endYear: 1100, dynasty: '唐' },
      { name: '大连', startYear: 1100, endYear: 1898, dynasty: '宋明清' },
      { name: '大连', startYear: 1898, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '厦门',
    coordinate: { lon: 118.09, lat: 24.46 },
    names: [
      { name: '嘉禾', startYear: 1000, endYear: 1380, dynasty: '宋元' },
      { name: '厦门', startYear: 1380, endYear: 2026, dynasty: '明清现代' },
    ],
  },
  {
    modernName: '宁波',
    coordinate: { lon: 121.55, lat: 29.87 },
    names: [
      { name: '明州', startYear: 700, endYear: 1368, dynasty: '唐元' },
      { name: '宁波', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '宁波', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '桂林',
    coordinate: { lon: 110.28, lat: 25.27 },
    names: [
      { name: '桂林', startYear: -200, endYear: 1912, dynasty: '秦清' },
      { name: '桂林', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '保定',
    coordinate: { lon: 115.47, lat: 38.87 },
    names: [
      { name: '保定', startYear: 1000, endYear: 1912, dynasty: '宋明清' },
      { name: '保定', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '承德',
    coordinate: { lon: 117.93, lat: 40.97 },
    names: [
      { name: '热河', startYear: 1700, endYear: 1912, dynasty: '清' },
      { name: '承德', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '天津',
    coordinate: { lon: 117.20, lat: 39.13 },
    names: [
      { name: '海津', startYear: 1200, endYear: 1400, dynasty: '金元' },
      { name: '天津', startYear: 1400, endYear: 1912, dynasty: '明清' },
      { name: '天津', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  // ==================== 第一批新增城市 ====================
  {
    modernName: '海口',
    coordinate: { lon: 110.35, lat: 20.02 },
    names: [
      { name: '海口', startYear: 1100, endYear: 1368, dynasty: '宋元' },
      { name: '海口', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '海口', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '秦皇岛',
    coordinate: { lon: 119.60, lat: 39.93 },
    names: [
      { name: '秦皇岛', startYear: 1898, endYear: 1912, dynasty: '清' },
      { name: '秦皇岛', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '唐山',
    coordinate: { lon: 118.18, lat: 39.62 },
    names: [
      { name: '唐山', startYear: 1200, endYear: 1912, dynasty: '金明清' },
      { name: '唐山', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '沧州',
    coordinate: { lon: 116.83, lat: 38.30 },
    names: [
      { name: '浮阳', startYear: -200, endYear: 500, dynasty: '秦汉南北朝' },
      { name: '沧州', startYear: 500, endYear: 1912, dynasty: '南北朝明清' },
      { name: '沧州', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '廊坊',
    coordinate: { lon: 116.70, lat: 39.52 },
    names: [
      { name: '廊坊', startYear: 1900, endYear: 1912, dynasty: '清' },
      { name: '廊坊', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '邯郸',
    coordinate: { lon: 114.54, lat: 36.62 },
    names: [
      { name: '邯郸', startYear: -500, endYear: 1912, dynasty: '战国明清' },
      { name: '邯郸', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '邢台',
    coordinate: { lon: 114.50, lat: 37.07 },
    names: [
      { name: '邢台', startYear: -1500, endYear: 600, dynasty: '商隋' },
      { name: '邢州', startYear: 600, endYear: 1368, dynasty: '唐元' },
      { name: '邢台', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '邢台', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '衡水',
    coordinate: { lon: 115.67, lat: 37.74 },
    names: [
      { name: '衡水', startYear: 500, endYear: 1912, dynasty: '南北朝明清' },
      { name: '衡水', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '张家口',
    coordinate: { lon: 114.88, lat: 40.77 },
    names: [
      { name: '张家口', startYear: 1500, endYear: 1912, dynasty: '明清' },
      { name: '张家口', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '大同',
    coordinate: { lon: 113.29, lat: 40.09 },
    names: [
      { name: '平城', startYear: 398, endYear: 494, dynasty: '北魏' },
      { name: '云州', startYear: 550, endYear: 1040, dynasty: '北周宋' },
      { name: '大同', startYear: 1040, endYear: 1912, dynasty: '辽明清' },
      { name: '大同', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '朔州',
    coordinate: { lon: 112.43, lat: 39.33 },
    names: [
      { name: '马邑', startYear: -200, endYear: 600, dynasty: '秦汉隋' },
      { name: '朔州', startYear: 600, endYear: 1912, dynasty: '唐明清' },
      { name: '朔州', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '忻州',
    coordinate: { lon: 112.73, lat: 38.42 },
    names: [
      { name: '忻州', startYear: 600, endYear: 1912, dynasty: '隋明清' },
      { name: '忻州', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '阳泉',
    coordinate: { lon: 113.57, lat: 37.86 },
    names: [
      { name: '平定', startYear: 500, endYear: 1200, dynasty: '南北朝金' },
      { name: '平阳', startYear: 1200, endYear: 1912, dynasty: '元明清' },
      { name: '阳泉', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '晋城',
    coordinate: { lon: 112.85, lat: 35.49 },
    names: [
      { name: '晋城', startYear: -500, endYear: 600, dynasty: '战国隋' },
      { name: '泽州', startYear: 600, endYear: 1368, dynasty: '唐元' },
      { name: '晋城', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '晋城', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '晋中',
    coordinate: { lon: 112.75, lat: 37.68 },
    names: [
      { name: '榆次', startYear: -500, endYear: 1912, dynasty: '战国清' },
      { name: '晋中', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '长治',
    coordinate: { lon: 113.12, lat: 36.19 },
    names: [
      { name: '上党', startYear: -500, endYear: 600, dynasty: '战国隋' },
      { name: '潞州', startYear: 600, endYear: 1368, dynasty: '唐元' },
      { name: '潞安', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '长治', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '临汾',
    coordinate: { lon: 111.52, lat: 36.08 },
    names: [
      { name: '平阳', startYear: -500, endYear: 600, dynasty: '战国隋' },
      { name: '晋州', startYear: 600, endYear: 1000, dynasty: '唐宋' },
      { name: '平阳', startYear: 1000, endYear: 1368, dynasty: '金元' },
      { name: '临汾', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '临汾', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '运城',
    coordinate: { lon: 111.00, lat: 35.02 },
    names: [
      { name: '运城', startYear: 600, endYear: 1912, dynasty: '唐明清' },
      { name: '运城', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '吕梁',
    coordinate: { lon: 111.13, lat: 37.52 },
    names: [
      { name: '离石', startYear: -300, endYear: 600, dynasty: '战国隋' },
      { name: '石州', startYear: 600, endYear: 1368, dynasty: '唐元' },
      { name: '汾州', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '吕梁', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '柳州',
    coordinate: { lon: 109.43, lat: 24.33 },
    names: [
      { name: '柳州', startYear: 600, endYear: 1912, dynasty: '唐明清' },
      { name: '柳州', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '安庆',
    coordinate: { lon: 117.04, lat: 30.54 },
    names: [
      { name: '舒州', startYear: 600, endYear: 1217, dynasty: '唐宋' },
      { name: '安庆', startYear: 1217, endYear: 1912, dynasty: '宋明清' },
      { name: '安庆', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '蚌埠',
    coordinate: { lon: 117.38, lat: 32.92 },
    names: [
      { name: '蚌埠', startYear: 1900, endYear: 1912, dynasty: '清' },
      { name: '蚌埠', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '阜阳',
    coordinate: { lon: 115.82, lat: 32.89 },
    names: [
      { name: '颍州', startYear: 600, endYear: 1368, dynasty: '唐元' },
      { name: '阜阳', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '阜阳', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '淮北',
    coordinate: { lon: 116.80, lat: 33.97 },
    names: [
      { name: '相城', startYear: -500, endYear: 600, dynasty: '战国隋' },
      { name: '淮北', startYear: 1960, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '淮南',
    coordinate: { lon: 116.98, lat: 32.63 },
    names: [
      { name: '寿春', startYear: -300, endYear: 600, dynasty: '战国南北朝' },
      { name: '淮南', startYear: 600, endYear: 1912, dynasty: '唐明清' },
      { name: '淮南', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '宿州',
    coordinate: { lon: 116.97, lat: 33.65 },
    names: [
      { name: '宿州', startYear: 800, endYear: 1912, dynasty: '唐明清' },
      { name: '宿州', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '亳州',
    coordinate: { lon: 115.78, lat: 33.84 },
    names: [
      { name: '亳州', startYear: 600, endYear: 1912, dynasty: '唐明清' },
      { name: '亳州', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '黄山',
    coordinate: { lon: 118.34, lat: 29.72 },
    names: [
      { name: '徽州', startYear: 600, endYear: 1912, dynasty: '唐明清' },
      { name: '黄山', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '滁州',
    coordinate: { lon: 118.32, lat: 32.30 },
    names: [
      { name: '滁州', startYear: 600, endYear: 1912, dynasty: '唐明清' },
      { name: '滁州', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '九江',
    coordinate: { lon: 116.00, lat: 29.71 },
    names: [
      { name: '江州', startYear: 500, endYear: 1000, dynasty: '南北朝宋' },
      { name: '九江', startYear: 1000, endYear: 1912, dynasty: '宋明清' },
      { name: '九江', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '赣州',
    coordinate: { lon: 114.94, lat: 25.85 },
    names: [
      { name: '赣州', startYear: 600, endYear: 1912, dynasty: '唐明清' },
      { name: '赣州', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '吉安',
    coordinate: { lon: 114.98, lat: 27.11 },
    names: [
      { name: '吉州', startYear: 500, endYear: 1368, dynasty: '南北朝元' },
      { name: '吉安', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '吉安', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '景德镇',
    coordinate: { lon: 117.18, lat: 29.27 },
    names: [
      { name: '浮梁', startYear: 600, endYear: 1368, dynasty: '唐元' },
      { name: '景德镇', startYear: 1004, endYear: 1912, dynasty: '宋明清' },
      { name: '景德镇', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '上饶',
    coordinate: { lon: 117.94, lat: 28.47 },
    names: [
      { name: '信州', startYear: 600, endYear: 1368, dynasty: '唐元' },
      { name: '上饶', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '上饶', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '抚州',
    coordinate: { lon: 116.36, lat: 27.95 },
    names: [
      { name: '抚州', startYear: 500, endYear: 1912, dynasty: '南北朝明清' },
      { name: '抚州', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '宜春',
    coordinate: { lon: 114.42, lat: 27.81 },
    names: [
      { name: '袁州', startYear: 500, endYear: 1368, dynasty: '南北朝元' },
      { name: '宜春', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '宜春', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '珠海',
    coordinate: { lon: 113.58, lat: 22.27 },
    names: [
      { name: '珠海', startYear: 1953, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '汕头',
    coordinate: { lon: 116.68, lat: 23.35 },
    names: [
      { name: '汕头', startYear: 1860, endYear: 1912, dynasty: '清' },
      { name: '汕头', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '湛江',
    coordinate: { lon: 110.36, lat: 21.27 },
    names: [
      { name: '广州湾', startYear: 1898, endYear: 1945, dynasty: '清' },
      { name: '湛江', startYear: 1945, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '中山',
    coordinate: { lon: 113.38, lat: 22.52 },
    names: [
      { name: '香山', startYear: 1000, endYear: 1925, dynasty: '宋清' },
      { name: '中山', startYear: 1925, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '东莞',
    coordinate: { lon: 113.75, lat: 23.05 },
    names: [
      { name: '东莞', startYear: 1000, endYear: 1912, dynasty: '宋明清' },
      { name: '东莞', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '惠州',
    coordinate: { lon: 114.42, lat: 23.12 },
    names: [
      { name: '惠州', startYear: 1000, endYear: 1912, dynasty: '宋明清' },
      { name: '惠州', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '江门',
    coordinate: { lon: 113.08, lat: 22.58 },
    names: [
      { name: '江门', startYear: 1900, endYear: 1912, dynasty: '清' },
      { name: '江门', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '茂名',
    coordinate: { lon: 110.93, lat: 21.66 },
    names: [
      { name: '茂名', startYear: 500, endYear: 1912, dynasty: '南北朝明清' },
      { name: '茂名', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '肇庆',
    coordinate: { lon: 112.47, lat: 23.05 },
    names: [
      { name: '端州', startYear: 600, endYear: 1368, dynasty: '唐元' },
      { name: '肇庆', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '肇庆', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '韶关',
    coordinate: { lon: 113.60, lat: 24.81 },
    names: [
      { name: '韶州', startYear: 600, endYear: 1368, dynasty: '唐元' },
      { name: '韶关', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '韶关', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '清远',
    coordinate: { lon: 113.06, lat: 23.68 },
    names: [
      { name: '清远', startYear: 500, endYear: 1912, dynasty: '南北朝明清' },
      { name: '清远', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '梅州',
    coordinate: { lon: 116.12, lat: 24.29 },
    names: [
      { name: '梅州', startYear: 1000, endYear: 1912, dynasty: '宋明清' },
      { name: '梅州', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '潮州',
    coordinate: { lon: 116.63, lat: 23.66 },
    names: [
      { name: '潮州', startYear: 1000, endYear: 1912, dynasty: '宋明清' },
      { name: '潮州', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '揭阳',
    coordinate: { lon: 116.38, lat: 23.55 },
    names: [
      { name: '揭阳', startYear: 500, endYear: 1912, dynasty: '南北朝明清' },
      { name: '揭阳', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  // ==================== 第二批新增城市 ====================
  // ----- 山东 -----
  {
    modernName: '烟台',
    coordinate: { lon: 121.45, lat: 37.47 },
    names: [
      { name: '芝罘', startYear: 600, endYear: 1398, dynasty: '唐明' },
      { name: '烟台', startYear: 1398, endYear: 1912, dynasty: '明清' },
      { name: '烟台', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '威海',
    coordinate: { lon: 122.12, lat: 37.51 },
    names: [
      { name: '威海', startYear: 1398, endYear: 1898, dynasty: '明清' },
      { name: '威海', startYear: 1898, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '潍坊',
    coordinate: { lon: 119.17, lat: 36.71 },
    names: [
      { name: '潍州', startYear: 700, endYear: 1368, dynasty: '唐元' },
      { name: '潍县', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '潍坊', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '淄博',
    coordinate: { lon: 118.05, lat: 36.82 },
    names: [
      { name: '临淄', startYear: -800, endYear: 1000, dynasty: '春秋清' },
      { name: '淄博', startYear: 1955, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '临沂',
    coordinate: { lon: 118.36, lat: 35.11 },
    names: [
      { name: '琅琊', startYear: -300, endYear: 580, dynasty: '战国南北朝' },
      { name: '临沂', startYear: 580, endYear: 1912, dynasty: '隋明清' },
      { name: '临沂', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '济宁',
    coordinate: { lon: 116.59, lat: 35.41 },
    names: [
      { name: '任城', startYear: -200, endYear: 600, dynasty: '秦汉魏晋' },
      { name: '济州', startYear: 600, endYear: 1368, dynasty: '唐宋元' },
      { name: '济宁', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '济宁', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '泰安',
    coordinate: { lon: 117.09, lat: 36.19 },
    names: [
      { name: '奉高', startYear: -100, endYear: 580, dynasty: '汉南北朝' },
      { name: '泰安', startYear: 580, endYear: 1000, dynasty: '隋宋' },
      { name: '泰安', startYear: 1000, endYear: 1912, dynasty: '金明清' },
      { name: '泰安', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '德州',
    coordinate: { lon: 116.36, lat: 37.44 },
    names: [
      { name: '安德', startYear: -200, endYear: 600, dynasty: '秦汉隋' },
      { name: '德州', startYear: 600, endYear: 1368, dynasty: '唐宋元' },
      { name: '德州', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '德州', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '聊城',
    coordinate: { lon: 115.99, lat: 36.46 },
    names: [
      { name: '东昌', startYear: 600, endYear: 1368, dynasty: '隋元' },
      { name: '聊城', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '聊城', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '滨州',
    coordinate: { lon: 117.97, lat: 37.38 },
    names: [
      { name: '渤海', startYear: -200, endYear: 500, dynasty: '秦汉南北朝' },
      { name: '滨州', startYear: 900, endYear: 1912, dynasty: '五代明清' },
      { name: '滨州', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '菏泽',
    coordinate: { lon: 115.44, lat: 35.23 },
    names: [
      { name: '曹州', startYear: 500, endYear: 1368, dynasty: '南北朝元' },
      { name: '菏泽', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '菏泽', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '枣庄',
    coordinate: { lon: 117.33, lat: 34.82 },
    names: [
      { name: '峄县', startYear: -200, endYear: 1200, dynasty: '秦金' },
      { name: '滕州', startYear: 1200, endYear: 1368, dynasty: '金元' },
      { name: '枣庄', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '枣庄', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '日照',
    coordinate: { lon: 119.53, lat: 35.42 },
    names: [
      { name: '日照', startYear: 1117, endYear: 1912, dynasty: '金明清' },
      { name: '日照', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '莱芜',
    coordinate: { lon: 117.66, lat: 36.21 },
    names: [
      { name: '莱芜', startYear: 1133, endYear: 1912, dynasty: '金明清' },
      { name: '莱芜', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  // ----- 江苏 -----
  {
    modernName: '南通',
    coordinate: { lon: 120.89, lat: 32.01 },
    names: [
      { name: '通州', startYear: 958, endYear: 1912, dynasty: '宋明清' },
      { name: '南通', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '徐州',
    coordinate: { lon: 117.28, lat: 34.21 },
    names: [
      { name: '彭城', startYear: -200, endYear: 589, dynasty: '秦汉魏晋南北朝' },
      { name: '徐州', startYear: 589, endYear: 1912, dynasty: '隋唐宋元明清' },
      { name: '徐州', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '连云港',
    coordinate: { lon: 119.22, lat: 34.60 },
    names: [
      { name: '海州', startYear: -200, endYear: 1912, dynasty: '秦清' },
      { name: '连云港', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '盐城',
    coordinate: { lon: 120.15, lat: 33.35 },
    names: [
      { name: '盐城', startYear: -200, endYear: 600, dynasty: '秦汉南北朝' },
      { name: '盐城', startYear: 600, endYear: 1912, dynasty: '隋唐宋元明清' },
      { name: '盐城', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '淮安',
    coordinate: { lon: 119.02, lat: 33.60 },
    names: [
      { name: '淮阴', startYear: -200, endYear: 589, dynasty: '秦汉魏晋南北朝' },
      { name: '楚州', startYear: 589, endYear: 1129, dynasty: '隋唐北宋' },
      { name: '淮安', startYear: 1129, endYear: 1912, dynasty: '南宋明清' },
      { name: '淮安', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '泰州',
    coordinate: { lon: 119.92, lat: 32.46 },
    names: [
      { name: '海陵', startYear: -200, endYear: 600, dynasty: '秦汉南北朝' },
      { name: '泰州', startYear: 600, endYear: 1912, dynasty: '唐宋元明清' },
      { name: '泰州', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '宿迁',
    coordinate: { lon: 118.30, lat: 33.97 },
    names: [
      { name: '宿迁', startYear: -200, endYear: 600, dynasty: '秦汉南北朝' },
      { name: '宿迁', startYear: 600, endYear: 1912, dynasty: '隋唐宋元明清' },
      { name: '宿迁', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  // ----- 浙江 -----
  {
    modernName: '温州',
    coordinate: { lon: 120.70, lat: 28.00 },
    names: [
      { name: '温州', startYear: 675, endYear: 1912, dynasty: '唐宋元明清' },
      { name: '温州', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '嘉兴',
    coordinate: { lon: 120.76, lat: 30.75 },
    names: [
      { name: '秀州', startYear: 600, endYear: 1120, dynasty: '唐宋' },
      { name: '嘉兴', startYear: 1120, endYear: 1912, dynasty: '宋明清' },
      { name: '嘉兴', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '湖州',
    coordinate: { lon: 120.09, lat: 30.87 },
    names: [
      { name: '乌程', startYear: -200, endYear: 589, dynasty: '秦汉魏晋南北朝' },
      { name: '湖州', startYear: 589, endYear: 1912, dynasty: '隋唐宋元明清' },
      { name: '湖州', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '绍兴',
    coordinate: { lon: 120.58, lat: 30.00 },
    names: [
      { name: '会稽', startYear: -200, endYear: 589, dynasty: '秦汉魏晋南北朝' },
      { name: '越州', startYear: 589, endYear: 1130, dynasty: '隋唐北宋' },
      { name: '绍兴府', startYear: 1130, endYear: 1912, dynasty: '南宋明清' },
      { name: '绍兴', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '金华',
    coordinate: { lon: 119.65, lat: 29.09 },
    names: [
      { name: '婺州', startYear: 600, endYear: 1368, dynasty: '隋元' },
      { name: '金华', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '金华', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '衢州',
    coordinate: { lon: 118.87, lat: 28.94 },
    names: [
      { name: '衢州', startYear: 600, endYear: 1912, dynasty: '唐宋元明清' },
      { name: '衢州', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '舟山',
    coordinate: { lon: 122.20, lat: 30.00 },
    names: [
      { name: '昌国', startYear: 1070, endYear: 1389, dynasty: '宋元' },
      { name: '定海', startYear: 1389, endYear: 1840, dynasty: '明清' },
      { name: '舟山', startYear: 1950, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '台州',
    coordinate: { lon: 121.13, lat: 28.66 },
    names: [
      { name: '临海', startYear: -200, endYear: 600, dynasty: '秦汉魏晋南北朝' },
      { name: '台州', startYear: 600, endYear: 1912, dynasty: '隋唐宋元明清' },
      { name: '台州', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '丽水',
    coordinate: { lon: 119.92, lat: 28.45 },
    names: [
      { name: '括苍', startYear: -100, endYear: 600, dynasty: '秦汉魏晋南北朝' },
      { name: '处州', startYear: 600, endYear: 1368, dynasty: '隋元' },
      { name: '处州', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '丽水', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  // ----- 福建 -----
  {
    modernName: '泉州',
    coordinate: { lon: 118.68, lat: 24.90 },
    names: [
      { name: '闽越', startYear: -200, endYear: 200, dynasty: '秦汉' },
      { name: '泉州', startYear: 711, endYear: 1000, dynasty: '唐宋' },
      { name: '泉州', startYear: 1000, endYear: 1368, dynasty: '宋元' },
      { name: '泉州府', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '泉州', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '漳州',
    coordinate: { lon: 117.65, lat: 24.52 },
    names: [
      { name: '漳州', startYear: 686, endYear: 1912, dynasty: '唐宋元明清' },
      { name: '漳州', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '莆田',
    coordinate: { lon: 119.01, lat: 25.46 },
    names: [
      { name: '莆田', startYear: 800, endYear: 1912, dynasty: '唐宋元明清' },
      { name: '莆田', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '宁德',
    coordinate: { lon: 119.55, lat: 26.67 },
    names: [
      { name: '宁德', startYear: 936, endYear: 1912, dynasty: '五代明清' },
      { name: '宁德', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '三明',
    coordinate: { lon: 117.64, lat: 26.27 },
    names: [
      { name: '三明', startYear: 1956, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '南平',
    coordinate: { lon: 118.17, lat: 26.65 },
    names: [
      { name: '南平', startYear: 200, endYear: 1912, dynasty: '汉明清' },
      { name: '南平', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '龙岩',
    coordinate: { lon: 117.02, lat: 25.08 },
    names: [
      { name: '龙岩', startYear: 736, endYear: 1912, dynasty: '唐宋元明清' },
      { name: '龙岩', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  // ----- 四川 -----
  {
    modernName: '绵阳',
    coordinate: { lon: 104.68, lat: 31.47 },
    names: [
      { name: '涪城', startYear: -200, endYear: 600, dynasty: '秦汉魏晋南北朝' },
      { name: '绵阳', startYear: 600, endYear: 1912, dynasty: '隋唐宋元明清' },
      { name: '绵阳', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '自贡',
    coordinate: { lon: 104.78, lat: 29.34 },
    names: [
      { name: '自贡', startYear: 1737, endYear: 1912, dynasty: '清' },
      { name: '自贡', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '攀枝花',
    coordinate: { lon: 101.72, lat: 26.59 },
    names: [
      { name: '攀枝花', startYear: 1965, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '泸州',
    coordinate: { lon: 105.44, lat: 28.87 },
    names: [
      { name: '江阳', startYear: -100, endYear: 600, dynasty: '秦汉南北朝' },
      { name: '泸州', startYear: 600, endYear: 1912, dynasty: '隋唐宋元明清' },
      { name: '泸州', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '德阳',
    coordinate: { lon: 104.40, lat: 31.13 },
    names: [
      { name: '德阳', startYear: 634, endYear: 1912, dynasty: '唐宋元明清' },
      { name: '德阳', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '广元',
    coordinate: { lon: 105.83, lat: 32.44 },
    names: [
      { name: '利州', startYear: 550, endYear: 1130, dynasty: '南北朝南宋' },
      { name: '广元', startYear: 1130, endYear: 1912, dynasty: '南宋明清' },
      { name: '广元', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '遂宁',
    coordinate: { lon: 105.59, lat: 30.53 },
    names: [
      { name: '遂宁', startYear: 1000, endYear: 1912, dynasty: '宋明清' },
      { name: '遂宁', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '内江',
    coordinate: { lon: 105.06, lat: 29.58 },
    names: [
      { name: '内江', startYear: 1000, endYear: 1912, dynasty: '宋明清' },
      { name: '内江', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '乐山',
    coordinate: { lon: 103.77, lat: 29.56 },
    names: [
      { name: '嘉州', startYear: 560, endYear: 1125, dynasty: '南北朝北宋' },
      { name: '乐山', startYear: 1125, endYear: 1912, dynasty: '南宋明清' },
      { name: '乐山', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '资阳',
    coordinate: { lon: 104.62, lat: 30.13 },
    names: [
      { name: '资中', startYear: -200, endYear: 600, dynasty: '秦汉魏晋南北朝' },
      { name: '资州', startYear: 600, endYear: 1368, dynasty: '唐元' },
      { name: '资阳', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '资阳', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '眉山',
    coordinate: { lon: 103.85, lat: 30.07 },
    names: [
      { name: '眉州', startYear: 600, endYear: 1368, dynasty: '隋元' },
      { name: '眉山', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '眉山', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '宜宾',
    coordinate: { lon: 104.63, lat: 28.77 },
    names: [
      { name: '戎州', startYear: 500, endYear: 1120, dynasty: '南北朝北宋' },
      { name: '宜宾', startYear: 1120, endYear: 1912, dynasty: '南宋明清' },
      { name: '宜宾', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '广安',
    coordinate: { lon: 106.63, lat: 30.48 },
    names: [
      { name: '广安', startYear: 1000, endYear: 1912, dynasty: '宋明清' },
      { name: '广安', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '达州',
    coordinate: { lon: 107.47, lat: 31.22 },
    names: [
      { name: '通州', startYear: 500, endYear: 600, dynasty: '南北朝' },
      { name: '达州', startYear: 600, endYear: 1912, dynasty: '唐宋元明清' },
      { name: '达州', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '雅安',
    coordinate: { lon: 103.00, lat: 30.01 },
    names: [
      { name: '雅州', startYear: 600, endYear: 1368, dynasty: '隋元' },
      { name: '雅安', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '雅安', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '巴中',
    coordinate: { lon: 106.77, lat: 31.87 },
    names: [
      { name: '巴州', startYear: 500, endYear: 1368, dynasty: '南北朝元' },
      { name: '巴中', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '巴中', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  // ==================== 第三批新增城市 ====================
  // ----- 云南 -----
  {
    modernName: '曲靖',
    coordinate: { lon: 103.80, lat: 25.49 },
    names: [
      { name: '味县', startYear: -200, endYear: 600, dynasty: '秦汉魏晋南北朝' },
      { name: '曲州', startYear: 600, endYear: 950, dynasty: '隋唐五代' },
      { name: '石城', startYear: 950, endYear: 1382, dynasty: '宋元' },
      { name: '曲靖', startYear: 1382, endYear: 1912, dynasty: '明清' },
      { name: '曲靖', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '玉溪',
    coordinate: { lon: 102.55, lat: 24.35 },
    names: [
      { name: '新兴', startYear: 600, endYear: 1000, dynasty: '隋宋' },
      { name: '玉溪', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '保山',
    coordinate: { lon: 99.17, lat: 25.11 },
    names: [
      { name: '永昌', startYear: -200, endYear: 900, dynasty: '秦汉唐' },
      { name: '保山', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '昭通',
    coordinate: { lon: 103.72, lat: 27.34 },
    names: [
      { name: '乌蒙', startYear: 500, endYear: 1329, dynasty: '南北朝元' },
      { name: '昭通', startYear: 1731, endYear: 1912, dynasty: '清' },
      { name: '昭通', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '丽江',
    coordinate: { lon: 100.23, lat: 26.88 },
    names: [
      { name: '丽江', startYear: 1253, endYear: 1382, dynasty: '元' },
      { name: '丽江', startYear: 1382, endYear: 1912, dynasty: '明清' },
      { name: '丽江', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '普洱',
    coordinate: { lon: 100.97, lat: 22.83 },
    names: [
      { name: '普洱', startYear: 1729, endYear: 1912, dynasty: '清' },
      { name: '普洱', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '临沧',
    coordinate: { lon: 100.09, lat: 23.89 },
    names: [
      { name: '缅宁', startYear: 1729, endYear: 1912, dynasty: '清' },
      { name: '临沧', startYear: 1954, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '红河',
    coordinate: { lon: 103.38, lat: 23.36 },
    names: [
      { name: '红河', startYear: 1957, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '文山',
    coordinate: { lon: 104.22, lat: 23.37 },
    names: [
      { name: '开化', startYear: 1000, endYear: 1912, dynasty: '宋明清' },
      { name: '文山', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '西双版纳',
    coordinate: { lon: 100.80, lat: 22.00 },
    names: [
      { name: '景咙', startYear: 600, endYear: 1180, dynasty: '唐宋' },
      { name: '车里', startYear: 1180, endYear: 1570, dynasty: '宋元' },
      { name: '车里宣慰司', startYear: 1570, endYear: 1913, dynasty: '明清' },
      { name: '西双版纳', startYear: 1953, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '大理',
    coordinate: { lon: 100.27, lat: 25.59 },
    names: [
      { name: '云南', startYear: -200, endYear: 320, dynasty: '秦汉魏晋' },
      { name: '大理', startYear: 737, endYear: 1253, dynasty: '南诏大理国' },
      { name: '大理', startYear: 1253, endYear: 1912, dynasty: '元明清' },
      { name: '大理', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '德宏',
    coordinate: { lon: 98.58, lat: 24.43 },
    names: [
      { name: '芒市', startYear: 1400, endYear: 1912, dynasty: '明清' },
      { name: '德宏', startYear: 1953, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '怒江',
    coordinate: { lon: 98.62, lat: 25.82 },
    names: [
      { name: '怒江', startYear: 1954, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '迪庆',
    coordinate: { lon: 99.71, lat: 27.82 },
    names: [
      { name: '中甸', startYear: 1400, endYear: 1912, dynasty: '明清' },
      { name: '迪庆', startYear: 1957, endYear: 2026, dynasty: '现代' },
    ],
  },
  // ----- 贵州 -----
  {
    modernName: '遵义',
    coordinate: { lon: 106.91, lat: 27.73 },
    names: [
      { name: '遵义', startYear: 600, endYear: 1100, dynasty: '隋宋' },
      { name: '遵义', startYear: 1100, endYear: 1368, dynasty: '宋元' },
      { name: '遵义府', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '遵义', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '六盘水',
    coordinate: { lon: 104.83, lat: 26.60 },
    names: [
      { name: '六盘水', startYear: 1978, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '安顺',
    coordinate: { lon: 105.93, lat: 26.25 },
    names: [
      { name: '安顺', startYear: 1000, endYear: 1912, dynasty: '宋明清' },
      { name: '安顺', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '毕节',
    coordinate: { lon: 105.28, lat: 27.30 },
    names: [
      { name: '毕节', startYear: 500, endYear: 1912, dynasty: '南北朝明清' },
      { name: '毕节', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '铜仁',
    coordinate: { lon: 109.19, lat: 27.72 },
    names: [
      { name: '铜仁', startYear: 500, endYear: 1912, dynasty: '南北朝明清' },
      { name: '铜仁', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '黔东南',
    coordinate: { lon: 107.98, lat: 26.58 },
    names: [
      { name: '镇远', startYear: 500, endYear: 1912, dynasty: '南北朝明清' },
      { name: '黔东南', startYear: 1956, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '黔南',
    coordinate: { lon: 107.52, lat: 26.26 },
    names: [
      { name: '都匀', startYear: 1000, endYear: 1912, dynasty: '宋明清' },
      { name: '黔南', startYear: 1956, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '黔西南',
    coordinate: { lon: 104.91, lat: 25.10 },
    names: [
      { name: '兴义', startYear: 1000, endYear: 1912, dynasty: '宋明清' },
      { name: '黔西南', startYear: 1982, endYear: 2026, dynasty: '现代' },
    ],
  },
  // ----- 湖南 -----
  {
    modernName: '株洲',
    coordinate: { lon: 113.13, lat: 27.84 },
    names: [
      { name: '株洲', startYear: 600, endYear: 1912, dynasty: '唐明清' },
      { name: '株洲', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '湘潭',
    coordinate: { lon: 112.95, lat: 27.83 },
    names: [
      { name: '湘潭', startYear: 600, endYear: 1912, dynasty: '唐明清' },
      { name: '湘潭', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '衡阳',
    coordinate: { lon: 112.57, lat: 26.89 },
    names: [
      { name: '衡阳', startYear: -200, endYear: 600, dynasty: '秦汉魏晋南北朝' },
      { name: '衡州', startYear: 600, endYear: 1368, dynasty: '唐元' },
      { name: '衡阳', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '衡阳', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '邵阳',
    coordinate: { lon: 111.47, lat: 27.24 },
    names: [
      { name: '邵阳', startYear: -200, endYear: 600, dynasty: '秦汉魏晋南北朝' },
      { name: '邵州', startYear: 600, endYear: 1368, dynasty: '唐元' },
      { name: '宝庆', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '邵阳', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '岳阳',
    coordinate: { lon: 113.13, lat: 29.36 },
    names: [
      { name: '岳阳', startYear: 600, endYear: 1000, dynasty: '隋宋' },
      { name: '岳州', startYear: 1000, endYear: 1368, dynasty: '宋元' },
      { name: '岳阳', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '岳阳', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '常德',
    coordinate: { lon: 111.70, lat: 29.03 },
    names: [
      { name: '常德', startYear: -200, endYear: 600, dynasty: '秦汉魏晋南北朝' },
      { name: '朗州', startYear: 600, endYear: 1100, dynasty: '唐宋' },
      { name: '常德', startYear: 1100, endYear: 1368, dynasty: '宋元' },
      { name: '常德', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '常德', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '张家界',
    coordinate: { lon: 110.48, lat: 29.12 },
    names: [
      { name: '大庸', startYear: 500, endYear: 1912, dynasty: '南北朝明清' },
      { name: '张家界', startYear: 1994, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '益阳',
    coordinate: { lon: 112.36, lat: 28.56 },
    names: [
      { name: '益阳', startYear: -200, endYear: 600, dynasty: '秦汉魏晋南北朝' },
      { name: '益阳', startYear: 600, endYear: 1912, dynasty: '隋唐宋元明清' },
      { name: '益阳', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '郴州',
    coordinate: { lon: 113.02, lat: 25.77 },
    names: [
      { name: '郴州', startYear: -200, endYear: 1368, dynasty: '秦汉魏晋南北朝隋唐宋元' },
      { name: '郴州', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '郴州', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '永州',
    coordinate: { lon: 111.62, lat: 26.43 },
    names: [
      { name: '零陵', startYear: -200, endYear: 589, dynasty: '秦汉魏晋南北朝' },
      { name: '永州', startYear: 589, endYear: 1912, dynasty: '隋唐宋元明清' },
      { name: '永州', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '怀化',
    coordinate: { lon: 110.00, lat: 27.55 },
    names: [
      { name: '沅陵', startYear: -200, endYear: 600, dynasty: '秦汉魏晋南北朝' },
      { name: '沅州', startYear: 600, endYear: 1368, dynasty: '唐元' },
      { name: '沅州', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '怀化', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '娄底',
    coordinate: { lon: 111.99, lat: 27.70 },
    names: [
      { name: '娄底', startYear: 1960, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '湘西',
    coordinate: { lon: 109.74, lat: 28.31 },
    names: [
      { name: '永顺', startYear: 500, endYear: 1912, dynasty: '南北朝明清' },
      { name: '湘西', startYear: 1952, endYear: 2026, dynasty: '现代' },
    ],
  },
  // ----- 湖北 -----
  {
    modernName: '黄石',
    coordinate: { lon: 115.04, lat: 30.20 },
    names: [
      { name: '黄石', startYear: 1000, endYear: 1912, dynasty: '宋明清' },
      { name: '黄石', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '十堰',
    coordinate: { lon: 110.80, lat: 32.65 },
    names: [
      { name: '十堰', startYear: 1000, endYear: 1912, dynasty: '宋明清' },
      { name: '十堰', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '宜昌',
    coordinate: { lon: 111.29, lat: 30.70 },
    names: [
      { name: '夷陵', startYear: -200, endYear: 600, dynasty: '秦汉魏晋南北朝' },
      { name: '峡州', startYear: 600, endYear: 1368, dynasty: '唐元' },
      { name: '宜昌', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '宜昌', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '襄阳',
    coordinate: { lon: 112.12, lat: 32.01 },
    names: [
      { name: '樊城', startYear: -500, endYear: 600, dynasty: '战国秦汉魏晋南北朝' },
      { name: '襄州', startYear: 600, endYear: 1368, dynasty: '唐元' },
      { name: '襄阳', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '襄阳', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '鄂州',
    coordinate: { lon: 114.89, lat: 30.39 },
    names: [
      { name: '鄂州', startYear: 500, endYear: 1912, dynasty: '南北朝明清' },
      { name: '鄂州', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '荆门',
    coordinate: { lon: 112.20, lat: 31.04 },
    names: [
      { name: '荆门', startYear: 600, endYear: 1912, dynasty: '唐宋元明清' },
      { name: '荆门', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '孝感',
    coordinate: { lon: 113.92, lat: 30.93 },
    names: [
      { name: '孝感', startYear: 500, endYear: 1912, dynasty: '南北朝明清' },
      { name: '孝感', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '荆州',
    coordinate: { lon: 112.24, lat: 30.33 },
    names: [
      { name: '江陵', startYear: -400, endYear: 600, dynasty: '战国秦汉魏晋南北朝' },
      { name: '荆州', startYear: 600, endYear: 1368, dynasty: '唐元' },
      { name: '荆州', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '荆州', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '黄冈',
    coordinate: { lon: 114.87, lat: 30.45 },
    names: [
      { name: '黄州', startYear: 500, endYear: 1368, dynasty: '南北朝元' },
      { name: '黄冈', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '黄冈', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '咸宁',
    coordinate: { lon: 114.32, lat: 29.84 },
    names: [
      { name: '咸宁', startYear: 500, endYear: 1912, dynasty: '南北朝明清' },
      { name: '咸宁', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '随州',
    coordinate: { lon: 113.38, lat: 31.69 },
    names: [
      { name: '随州', startYear: -500, endYear: 600, dynasty: '战国隋' },
      { name: '随州', startYear: 600, endYear: 1912, dynasty: '唐宋元明清' },
      { name: '随州', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '恩施',
    coordinate: { lon: 109.49, lat: 30.27 },
    names: [
      { name: '施州', startYear: 500, endYear: 1368, dynasty: '南北朝元' },
      { name: '施州', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '恩施', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  // ----- 河南 -----
  {
    modernName: '平顶山',
    coordinate: { lon: 113.30, lat: 33.77 },
    names: [
      { name: '汝州', startYear: 500, endYear: 1368, dynasty: '南北朝元' },
      { name: '平顶山', startYear: 1957, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '安阳',
    coordinate: { lon: 114.39, lat: 36.10 },
    names: [
      { name: '安阳', startYear: -1400, endYear: 600, dynasty: '商魏晋南北朝' },
      { name: '邺', startYear: -200, endYear: 580, dynasty: '秦汉魏晋南北朝' },
      { name: '相州', startYear: 580, endYear: 1100, dynasty: '隋唐宋' },
      { name: '彰德', startYear: 1100, endYear: 1368, dynasty: '金元' },
      { name: '安阳', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '安阳', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '鹤壁',
    coordinate: { lon: 114.30, lat: 35.75 },
    names: [
      { name: '鹤壁', startYear: 1957, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '新乡',
    coordinate: { lon: 113.93, lat: 35.30 },
    names: [
      { name: '新乡', startYear: 600, endYear: 1912, dynasty: '唐宋元明清' },
      { name: '新乡', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '焦作',
    coordinate: { lon: 113.25, lat: 35.22 },
    names: [
      { name: '山阳', startYear: -200, endYear: 600, dynasty: '秦汉魏晋南北朝' },
      { name: '怀州', startYear: 600, endYear: 1368, dynasty: '唐元' },
      { name: '怀庆', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '焦作', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '濮阳',
    coordinate: { lon: 115.03, lat: 35.76 },
    names: [
      { name: '濮阳', startYear: -500, endYear: 600, dynasty: '战国秦汉魏晋南北朝' },
      { name: '濮州', startYear: 600, endYear: 1368, dynasty: '唐元' },
      { name: '濮阳', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '濮阳', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '许昌',
    coordinate: { lon: 113.86, lat: 34.03 },
    names: [
      { name: '许昌', startYear: -200, endYear: 600, dynasty: '秦汉魏晋南北朝' },
      { name: '许州', startYear: 600, endYear: 1368, dynasty: '唐元' },
      { name: '许昌', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '许昌', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '漯河',
    coordinate: { lon: 114.02, lat: 33.58 },
    names: [
      { name: '漯河', startYear: 500, endYear: 1912, dynasty: '南北朝明清' },
      { name: '漯河', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '三门峡',
    coordinate: { lon: 111.20, lat: 34.77 },
    names: [
      { name: '陕州', startYear: 600, endYear: 1368, dynasty: '唐元' },
      { name: '陕州', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '三门峡', startYear: 1957, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '南阳',
    coordinate: { lon: 112.53, lat: 33.00 },
    names: [
      { name: '南阳', startYear: -200, endYear: 600, dynasty: '秦汉魏晋南北朝' },
      { name: '宛州', startYear: 600, endYear: 1368, dynasty: '唐元' },
      { name: '南阳', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '南阳', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '商丘',
    coordinate: { lon: 115.66, lat: 34.44 },
    names: [
      { name: '商丘', startYear: -1500, endYear: 600, dynasty: '商秦汉魏晋南北朝' },
      { name: '宋州', startYear: 600, endYear: 1000, dynasty: '唐宋' },
      { name: '应天府', startYear: 1000, endYear: 1368, dynasty: '宋金元' },
      { name: '归德', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '商丘', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '信阳',
    coordinate: { lon: 114.09, lat: 32.13 },
    names: [
      { name: '义阳', startYear: -200, endYear: 600, dynasty: '秦汉魏晋南北朝' },
      { name: '申州', startYear: 600, endYear: 1368, dynasty: '唐元' },
      { name: '信阳', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '信阳', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '周口',
    coordinate: { lon: 114.65, lat: 33.62 },
    names: [
      { name: '陈州', startYear: -500, endYear: 600, dynasty: '战国秦汉魏晋南北朝' },
      { name: '陈州', startYear: 600, endYear: 1368, dynasty: '唐元' },
      { name: '陈州', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '周口', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '驻马店',
    coordinate: { lon: 114.02, lat: 32.98 },
    names: [
      { name: '汝南', startYear: -100, endYear: 600, dynasty: '秦汉魏晋南北朝' },
      { name: '蔡州', startYear: 600, endYear: 1368, dynasty: '唐元' },
      { name: '汝宁', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '驻马店', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  // ----- 陕西 -----
  {
    modernName: '铜川',
    coordinate: { lon: 108.95, lat: 34.90 },
    names: [
      { name: '铜川', startYear: 500, endYear: 1912, dynasty: '南北朝明清' },
      { name: '铜川', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '宝鸡',
    coordinate: { lon: 107.24, lat: 34.36 },
    names: [
      { name: '陈仓', startYear: -200, endYear: 600, dynasty: '秦汉魏晋南北朝' },
      { name: '凤翔', startYear: 600, endYear: 1000, dynasty: '唐宋' },
      { name: '凤翔府', startYear: 1000, endYear: 1368, dynasty: '宋金元' },
      { name: '凤翔', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '宝鸡', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '咸阳',
    coordinate: { lon: 108.71, lat: 34.33 },
    names: [
      { name: '咸京', startYear: -350, endYear: -206, dynasty: '战国·秦' },
      { name: '新城', startYear: -206, endYear: 600, dynasty: '秦汉魏晋南北朝' },
      { name: '咸阳', startYear: 600, endYear: 1912, dynasty: '隋唐宋元明清' },
      { name: '咸阳', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '渭南',
    coordinate: { lon: 109.50, lat: 34.50 },
    names: [
      { name: '下邽', startYear: -200, endYear: 600, dynasty: '秦汉魏晋南北朝' },
      { name: '华州', startYear: 600, endYear: 1000, dynasty: '唐宋' },
      { name: '华州', startYear: 1000, endYear: 1368, dynasty: '金元' },
      { name: '渭南', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '渭南', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '延安',
    coordinate: { lon: 109.49, lat: 36.59 },
    names: [
      { name: '延安', startYear: -200, endYear: 600, dynasty: '秦汉魏晋南北朝' },
      { name: '延州', startYear: 600, endYear: 1000, dynasty: '唐宋' },
      { name: '延安府', startYear: 1000, endYear: 1368, dynasty: '宋金元' },
      { name: '延安', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '延安', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '榆林',
    coordinate: { lon: 109.74, lat: 38.29 },
    names: [
      { name: '上郡', startYear: -200, endYear: 600, dynasty: '秦汉魏晋南北朝' },
      { name: '夏州', startYear: 600, endYear: 1000, dynasty: '唐宋' },
      { name: '延安', startYear: 1000, endYear: 1368, dynasty: '宋金元' },
      { name: '榆林', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '榆林', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '汉中',
    coordinate: { lon: 106.95, lat: 33.02 },
    names: [
      { name: '汉中', startYear: -300, endYear: 600, dynasty: '战国秦汉魏晋南北朝' },
      { name: '梁州', startYear: 600, endYear: 1000, dynasty: '唐宋' },
      { name: '兴元', startYear: 1000, endYear: 1368, dynasty: '宋金元' },
      { name: '汉中', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '汉中', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '安康',
    coordinate: { lon: 109.03, lat: 32.69 },
    names: [
      { name: '金州', startYear: 500, endYear: 1000, dynasty: '南北朝宋' },
      { name: '金州', startYear: 1000, endYear: 1368, dynasty: '宋元' },
      { name: '兴安', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '安康', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '商洛',
    coordinate: { lon: 109.94, lat: 33.87 },
    names: [
      { name: '商州', startYear: 500, endYear: 1000, dynasty: '南北朝宋' },
      { name: '商州', startYear: 1000, endYear: 1368, dynasty: '宋元' },
      { name: '商州', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '商洛', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  // ==================== 第四批新增城市 ====================
  // ----- 黑龙江 -----
  {
    modernName: '齐齐哈尔',
    coordinate: { lon: 123.95, lat: 47.33 },
    names: [
      { name: '齐齐哈尔', startYear: 1691, endYear: 1912, dynasty: '清' },
      { name: '齐齐哈尔', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '牡丹江',
    coordinate: { lon: 129.63, lat: 44.55 },
    names: [
      { name: '牡丹江', startYear: 1903, endYear: 1912, dynasty: '清' },
      { name: '牡丹江', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '佳木斯',
    coordinate: { lon: 130.30, lat: 46.81 },
    names: [
      { name: '佳木斯', startYear: 1907, endYear: 1912, dynasty: '清' },
      { name: '佳木斯', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '大庆',
    coordinate: { lon: 125.01, lat: 46.59 },
    names: [
      { name: '大庆', startYear: 1960, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '绥化',
    coordinate: { lon: 126.97, lat: 46.64 },
    names: [
      { name: '绥化', startYear: 1885, endYear: 1912, dynasty: '清' },
      { name: '绥化', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '黑河',
    coordinate: { lon: 127.53, lat: 50.24 },
    names: [
      { name: '黑河', startYear: 1710, endYear: 1912, dynasty: '清' },
      { name: '黑河', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '大兴安岭',
    coordinate: { lon: 124.12, lat: 50.42 },
    names: [
      { name: '大兴安岭', startYear: 1966, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '伊春',
    coordinate: { lon: 128.84, lat: 47.73 },
    names: [
      { name: '伊春', startYear: 1952, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '七台河',
    coordinate: { lon: 130.96, lat: 45.77 },
    names: [
      { name: '七台河', startYear: 1958, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '鸡西',
    coordinate: { lon: 130.97, lat: 45.30 },
    names: [
      { name: '鸡西', startYear: 1906, endYear: 1912, dynasty: '清' },
      { name: '鸡西', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '双鸭山',
    coordinate: { lon: 131.16, lat: 46.65 },
    names: [
      { name: '双鸭山', startYear: 1954, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '鹤岗',
    coordinate: { lon: 130.30, lat: 47.35 },
    names: [
      { name: '鹤岗', startYear: 1918, endYear: 2026, dynasty: '现代' },
    ],
  },
  // ----- 辽宁 -----
  {
    modernName: '鞍山',
    coordinate: { lon: 122.99, lat: 41.11 },
    names: [
      { name: '鞍山', startYear: 1100, endYear: 1912, dynasty: '金明清' },
      { name: '鞍山', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '抚顺',
    coordinate: { lon: 123.99, lat: 41.88 },
    names: [
      { name: '抚顺', startYear: 1100, endYear: 1912, dynasty: '金明清' },
      { name: '抚顺', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '本溪',
    coordinate: { lon: 123.77, lat: 41.29 },
    names: [
      { name: '本溪', startYear: 1100, endYear: 1912, dynasty: '金明清' },
      { name: '本溪', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '丹东',
    coordinate: { lon: 124.35, lat: 40.00 },
    names: [
      { name: '安东', startYear: 1877, endYear: 1965, dynasty: '清' },
      { name: '丹东', startYear: 1965, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '锦州',
    coordinate: { lon: 121.13, lat: 41.10 },
    names: [
      { name: '锦州', startYear: 1200, endYear: 1912, dynasty: '金明清' },
      { name: '锦州', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '营口',
    coordinate: { lon: 122.23, lat: 40.67 },
    names: [
      { name: '营口', startYear: 1860, endYear: 1912, dynasty: '清' },
      { name: '营口', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '阜新',
    coordinate: { lon: 121.65, lat: 42.02 },
    names: [
      { name: '阜新', startYear: 1903, endYear: 1912, dynasty: '清' },
      { name: '阜新', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '辽阳',
    coordinate: { lon: 123.17, lat: 41.27 },
    names: [
      { name: '辽阳', startYear: -300, endYear: 1912, dynasty: '战国明清' },
      { name: '辽阳', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '盘锦',
    coordinate: { lon: 122.07, lat: 41.12 },
    names: [
      { name: '盘锦', startYear: 1984, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '铁岭',
    coordinate: { lon: 123.84, lat: 42.29 },
    names: [
      { name: '铁岭', startYear: 1200, endYear: 1912, dynasty: '金明清' },
      { name: '铁岭', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '朝阳',
    coordinate: { lon: 120.45, lat: 41.57 },
    names: [
      { name: '朝阳', startYear: 500, endYear: 1912, dynasty: '南北朝明清' },
      { name: '朝阳', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '葫芦岛',
    coordinate: { lon: 120.84, lat: 40.71 },
    names: [
      { name: '锦西', startYear: 1902, endYear: 1994, dynasty: '清' },
      { name: '葫芦岛', startYear: 1994, endYear: 2026, dynasty: '现代' },
    ],
  },
  // ----- 吉林 -----
  {
    modernName: '吉林',
    coordinate: { lon: 126.55, lat: 43.83 },
    names: [
      { name: '吉林乌拉', startYear: 1400, endYear: 1673, dynasty: '明清' },
      { name: '吉林', startYear: 1673, endYear: 1912, dynasty: '清' },
      { name: '吉林', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '四平',
    coordinate: { lon: 124.35, lat: 43.17 },
    names: [
      { name: '四平', startYear: 1902, endYear: 1912, dynasty: '清' },
      { name: '四平', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '松原',
    coordinate: { lon: 124.82, lat: 45.14 },
    names: [
      { name: '松原', startYear: 1992, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '白城',
    coordinate: { lon: 122.84, lat: 45.62 },
    names: [
      { name: '白城', startYear: 1905, endYear: 1912, dynasty: '清' },
      { name: '白城', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '辽源',
    coordinate: { lon: 125.15, lat: 42.90 },
    names: [
      { name: '辽源', startYear: 1902, endYear: 1912, dynasty: '清' },
      { name: '辽源', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '通化',
    coordinate: { lon: 125.94, lat: 41.73 },
    names: [
      { name: '通化', startYear: 1877, endYear: 1912, dynasty: '清' },
      { name: '通化', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '白山',
    coordinate: { lon: 126.42, lat: 41.94 },
    names: [
      { name: '白山', startYear: 1960, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '延边',
    coordinate: { lon: 129.51, lat: 42.89 },
    names: [
      { name: '延边', startYear: 1952, endYear: 2026, dynasty: '现代' },
    ],
  },
  // ----- 内蒙古 -----
  {
    modernName: '包头',
    coordinate: { lon: 109.83, lat: 40.65 },
    names: [
      { name: '包头', startYear: 1800, endYear: 1912, dynasty: '清' },
      { name: '包头', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '乌海',
    coordinate: { lon: 106.82, lat: 39.67 },
    names: [
      { name: '乌海', startYear: 1976, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '赤峰',
    coordinate: { lon: 118.88, lat: 42.26 },
    names: [
      { name: '赤峰', startYear: 1743, endYear: 1912, dynasty: '清' },
      { name: '赤峰', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '通辽',
    coordinate: { lon: 122.24, lat: 43.65 },
    names: [
      { name: '通辽', startYear: 1903, endYear: 1912, dynasty: '清' },
      { name: '通辽', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '鄂尔多斯',
    coordinate: { lon: 109.78, lat: 39.62 },
    names: [
      { name: '鄂尔多斯', startYear: 1648, endYear: 1912, dynasty: '清' },
      { name: '鄂尔多斯', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '呼伦贝尔',
    coordinate: { lon: 119.77, lat: 49.21 },
    names: [
      { name: '呼伦贝尔', startYear: 1734, endYear: 1912, dynasty: '清' },
      { name: '呼伦贝尔', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '巴彦淖尔',
    coordinate: { lon: 107.39, lat: 40.76 },
    names: [
      { name: '巴彦淖尔', startYear: 1958, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '乌兰察布',
    coordinate: { lon: 113.12, lat: 41.04 },
    names: [
      { name: '乌兰察布', startYear: 1954, endYear: 2026, dynasty: '现代' },
    ],
  },
  // ----- 宁夏 -----
  {
    modernName: '石嘴山',
    coordinate: { lon: 106.39, lat: 39.02 },
    names: [
      { name: '石嘴山', startYear: 1900, endYear: 1912, dynasty: '清' },
      { name: '石嘴山', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '吴忠',
    coordinate: { lon: 106.20, lat: 37.99 },
    names: [
      { name: '吴忠', startYear: 1900, endYear: 1912, dynasty: '清' },
      { name: '吴忠', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '固原',
    coordinate: { lon: 106.28, lat: 36.01 },
    names: [
      { name: '原州', startYear: 600, endYear: 1368, dynasty: '唐元' },
      { name: '固原', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '固原', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '中卫',
    coordinate: { lon: 105.19, lat: 37.50 },
    names: [
      { name: '中卫', startYear: 1902, endYear: 1912, dynasty: '清' },
      { name: '中卫', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  // ----- 青海 -----
  {
    modernName: '海东',
    coordinate: { lon: 102.40, lat: 36.50 },
    names: [
      { name: '海东', startYear: 1978, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '海北',
    coordinate: { lon: 100.90, lat: 36.96 },
    names: [
      { name: '海北', startYear: 1953, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '海南',
    coordinate: { lon: 100.62, lat: 36.29 },
    names: [
      { name: '海南', startYear: 1953, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '黄南',
    coordinate: { lon: 102.02, lat: 35.52 },
    names: [
      { name: '黄南', startYear: 1953, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '果洛',
    coordinate: { lon: 100.24, lat: 34.47 },
    names: [
      { name: '果洛', startYear: 1954, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '玉树',
    coordinate: { lon: 97.00, lat: 33.01 },
    names: [
      { name: '玉树', startYear: 1954, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '海西',
    coordinate: { lon: 97.37, lat: 37.37 },
    names: [
      { name: '海西', startYear: 1954, endYear: 2026, dynasty: '现代' },
    ],
  },
  // ----- 甘肃 -----
  {
    modernName: '嘉峪关',
    coordinate: { lon: 98.29, lat: 39.80 },
    names: [
      { name: '嘉峪关', startYear: 1372, endYear: 1912, dynasty: '明清' },
      { name: '嘉峪关', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '金昌',
    coordinate: { lon: 102.19, lat: 38.51 },
    names: [
      { name: '金川', startYear: 1961, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '白银',
    coordinate: { lon: 104.14, lat: 36.55 },
    names: [
      { name: '白银', startYear: 1956, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '天水',
    coordinate: { lon: 105.72, lat: 34.58 },
    names: [
      { name: '上邽', startYear: -200, endYear: 600, dynasty: '秦汉魏晋南北朝' },
      { name: '秦州', startYear: 600, endYear: 1000, dynasty: '唐宋' },
      { name: '天水', startYear: 1000, endYear: 1912, dynasty: '宋金元明清' },
      { name: '天水', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '武威',
    coordinate: { lon: 102.64, lat: 37.93 },
    names: [
      { name: '凉州', startYear: -200, endYear: 1000, dynasty: '秦汉魏晋南北朝隋唐五代' },
      { name: '西凉府', startYear: 1000, endYear: 1368, dynasty: '宋元' },
      { name: '凉州', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '武威', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '张掖',
    coordinate: { lon: 100.45, lat: 38.93 },
    names: [
      { name: '甘州', startYear: -200, endYear: 1000, dynasty: '秦汉魏晋南北朝隋唐五代' },
      { name: '张掖', startYear: 1000, endYear: 1912, dynasty: '宋金元明清' },
      { name: '张掖', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '平凉',
    coordinate: { lon: 106.67, lat: 35.54 },
    names: [
      { name: '平凉', startYear: 500, endYear: 1368, dynasty: '南北朝元' },
      { name: '平凉', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '平凉', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '酒泉',
    coordinate: { lon: 98.51, lat: 39.74 },
    names: [
      { name: '酒泉', startYear: -200, endYear: 600, dynasty: '秦汉魏晋南北朝' },
      { name: '肃州', startYear: 600, endYear: 1368, dynasty: '隋元' },
      { name: '酒泉', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '酒泉', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '庆阳',
    coordinate: { lon: 107.64, lat: 35.73 },
    names: [
      { name: '庆州', startYear: 500, endYear: 1368, dynasty: '南北朝元' },
      { name: '庆阳', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '庆阳', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '定西',
    coordinate: { lon: 104.63, lat: 35.58 },
    names: [
      { name: '定西', startYear: 1100, endYear: 1368, dynasty: '宋元' },
      { name: '定西', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '定西', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '陇南',
    coordinate: { lon: 104.92, lat: 33.40 },
    names: [
      { name: '阶州', startYear: 500, endYear: 1000, dynasty: '南北朝宋' },
      { name: '阶州', startYear: 1000, endYear: 1368, dynasty: '宋元' },
      { name: '巩昌', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '陇南', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '临夏',
    coordinate: { lon: 103.21, lat: 35.60 },
    names: [
      { name: '河州', startYear: 500, endYear: 1368, dynasty: '南北朝元' },
      { name: '临夏', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '临夏', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '甘南',
    coordinate: { lon: 102.91, lat: 34.98 },
    names: [
      { name: '甘南', startYear: 1953, endYear: 2026, dynasty: '现代' },
    ],
  },
  // ----- 新疆 -----
  {
    modernName: '克拉玛依',
    coordinate: { lon: 84.89, lat: 45.58 },
    names: [
      { name: '克拉玛依', startYear: 1958, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '吐鲁番',
    coordinate: { lon: 89.19, lat: 42.91 },
    names: [
      { name: '高昌', startYear: -100, endYear: 640, dynasty: '汉唐' },
      { name: '西州', startYear: 640, endYear: 1000, dynasty: '唐宋' },
      { name: '吐鲁番', startYear: 1000, endYear: 1912, dynasty: '宋元明清' },
      { name: '吐鲁番', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '哈密',
    coordinate: { lon: 93.52, lat: 42.83 },
    names: [
      { name: '伊州', startYear: 600, endYear: 1000, dynasty: '唐宋' },
      { name: '哈密', startYear: 1000, endYear: 1912, dynasty: '宋元明清' },
      { name: '哈密', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '昌吉',
    coordinate: { lon: 87.31, lat: 44.01 },
    names: [
      { name: '昌吉', startYear: 1755, endYear: 1912, dynasty: '清' },
      { name: '昌吉', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '博尔塔拉',
    coordinate: { lon: 82.07, lat: 44.91 },
    names: [
      { name: '博尔塔拉', startYear: 1755, endYear: 1912, dynasty: '清' },
      { name: '博尔塔拉', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '巴音郭楞',
    coordinate: { lon: 86.15, lat: 41.76 },
    names: [
      { name: '焉耆', startYear: -200, endYear: 600, dynasty: '秦汉魏晋南北朝' },
      { name: '焉耆', startYear: 600, endYear: 1000, dynasty: '隋唐五代' },
      { name: '巴音郭楞', startYear: 1755, endYear: 1912, dynasty: '清' },
      { name: '巴音郭楞', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '阿克苏',
    coordinate: { lon: 80.26, lat: 41.17 },
    names: [
      { name: '龟兹', startYear: -200, endYear: 600, dynasty: '秦汉魏晋南北朝' },
      { name: '龟兹', startYear: 600, endYear: 1000, dynasty: '隋唐五代' },
      { name: '阿克苏', startYear: 1755, endYear: 1912, dynasty: '清' },
      { name: '阿克苏', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '克孜勒苏',
    coordinate: { lon: 76.17, lat: 39.72 },
    names: [
      { name: '克孜勒苏', startYear: 1954, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '喀什',
    coordinate: { lon: 75.99, lat: 39.47 },
    names: [
      { name: '疏勒', startYear: -100, endYear: 1000, dynasty: '汉唐五代' },
      { name: '喀什', startYear: 1000, endYear: 1912, dynasty: '宋元明清' },
      { name: '喀什', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '和田',
    coordinate: { lon: 79.92, lat: 37.12 },
    names: [
      { name: '于阗', startYear: -100, endYear: 1000, dynasty: '汉唐五代' },
      { name: '和田', startYear: 1000, endYear: 1912, dynasty: '宋元明清' },
      { name: '和田', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '伊犁',
    coordinate: { lon: 81.32, lat: 43.92 },
    names: [
      { name: '伊犁', startYear: 1755, endYear: 1912, dynasty: '清' },
      { name: '伊犁', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '塔城',
    coordinate: { lon: 82.98, lat: 46.75 },
    names: [
      { name: '塔城', startYear: 1755, endYear: 1912, dynasty: '清' },
      { name: '塔城', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '阿勒泰',
    coordinate: { lon: 88.14, lat: 47.84 },
    names: [
      { name: '阿勒泰', startYear: 1755, endYear: 1912, dynasty: '清' },
      { name: '阿勒泰', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  // ----- 西藏 -----
  {
    modernName: '日喀则',
    coordinate: { lon: 88.88, lat: 29.27 },
    names: [
      { name: '溪谷', startYear: 1300, endYear: 1447, dynasty: '元' },
      { name: '日喀则', startYear: 1447, endYear: 2026, dynasty: '明清现代' },
    ],
  },
  {
    modernName: '昌都',
    coordinate: { lon: 97.18, lat: 31.14 },
    names: [
      { name: '昌都', startYear: 1400, endYear: 1912, dynasty: '明清' },
      { name: '昌都', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '林芝',
    coordinate: { lon: 94.37, lat: 29.56 },
    names: [
      { name: '工布', startYear: 600, endYear: 1912, dynasty: '唐明清' },
      { name: '林芝', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '山南',
    coordinate: { lon: 91.77, lat: 29.24 },
    names: [
      { name: '山南', startYear: 1400, endYear: 1912, dynasty: '明清' },
      { name: '山南', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '那曲',
    coordinate: { lon: 92.05, lat: 31.48 },
    names: [
      { name: '黑河', startYear: 1950, endYear: 1965, dynasty: '现代' },
      { name: '那曲', startYear: 1965, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '阿里',
    coordinate: { lon: 80.11, lat: 32.50 },
    names: [
      { name: '阿里', startYear: 1400, endYear: 1912, dynasty: '明清' },
      { name: '阿里', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  // ----- 海南 -----
  {
    modernName: '三亚',
    coordinate: { lon: 109.51, lat: 18.25 },
    names: [
      { name: '崖州', startYear: 600, endYear: 1368, dynasty: '唐元' },
      { name: '崖城', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '三亚', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '三沙',
    coordinate: { lon: 112.35, lat: 16.83 },
    names: [
      { name: '三沙', startYear: 2012, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '儋州',
    coordinate: { lon: 109.58, lat: 19.52 },
    names: [
      { name: '儋州', startYear: 600, endYear: 1368, dynasty: '唐元' },
      { name: '儋州', startYear: 1368, endYear: 1912, dynasty: '明清' },
      { name: '儋州', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  // ----- 广东 -----
  {
    modernName: '深圳',
    coordinate: { lon: 114.06, lat: 22.54 },
    names: [
      { name: '宝安', startYear: 600, endYear: 1912, dynasty: '唐宋元明清' },
      { name: '深圳', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
  {
    modernName: '佛山',
    coordinate: { lon: 113.12, lat: 23.02 },
    names: [
      { name: '佛山', startYear: 500, endYear: 1912, dynasty: '南北朝明清' },
      { name: '佛山', startYear: 1912, endYear: 2026, dynasty: '现代' },
    ],
  },
];

/**
 * 搜索地名演变
 */
export function searchPlaceEvolution(query: string): PlaceEvolution[] {
  const lowerQuery = query.toLowerCase();
  return PLACE_EVOLUTIONS.filter(
    (p) =>
      p.modernName.toLowerCase().includes(lowerQuery) ||
      p.names.some((n) => n.name.toLowerCase().includes(lowerQuery))
  ).slice(0, 20);
}

/**
 * 获取某地的名称演变时间线
 */
export function getPlaceEvolution(modernName: string): PlaceEvolution | undefined {
  return PLACE_EVOLUTIONS.find(
    (p) => p.modernName.toLowerCase() === modernName.toLowerCase()
  );
}
