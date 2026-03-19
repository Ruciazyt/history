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
      { name: '成都', startYear: -311, endYear: 907, dynasty: '古蜀秦汉隋唐' },
      { name: '南京', startYear: 907, endYear: 925, dynasty: '五代·前蜀' },
      { name: '成都', startYear: 925, endYear: 1368, dynasty: '五代·后蜀宋元' },
      { name: '成都', startYear: 1368, endYear: 1912, dynasty: '明清' },
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
      { name: '历下', startYear: -500, endYear: 400, dynasty: '战国晋' },
      { name: '济南', startYear: 400, endYear: 1912, dynasty: '南北朝明清' },
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
