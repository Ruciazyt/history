/**
 * 地名演化数据
 * 展示城市在不同历史时期的名称变化
 */

export interface PlaceNameChange {
  /** 现代城市名 */
  modernName: string;
  /** 城市类型 */
  type: 'capital' | 'major-city' | 'regional';
  /** 所属区域 */
  region: 'china' | 'korea' | 'japan' | 'central-asia' | 'west';
  /** 名称演变历史 */
  names: Array<{
    name: string;
    startYear: number;
    endYear: number;
    era?: string; // 所属朝代/时期
    note?: string; // 备注
  }>;
}

export const placeNameChanges: PlaceNameChange[] = [
  // ═══════════════════════════════════════════════════════
  // 中国城市
  // ═══════════════════════════════════════════════════════
  {
    modernName: '北京',
    type: 'capital',
    region: 'china',
    names: [
      { name: '蓟城', startYear: -1045, endYear: -440, era: '西周/春秋', note: '燕国都城' },
      { name: '燕京', startYear: -440, endYear: 938, era: '战国/秦/汉/南北朝/隋唐', note: '燕国/辽' },
      { name: '南京', startYear: 938, endYear: 1125, era: '辽', note: '辽南京' },
      { name: '燕京', startYear: 1125, endYear: 1215, era: '金', note: '金中都' },
      { name: '中都', startYear: 1153, endYear: 1215, era: '金', note: '金中都，1153年正式定名' },
      { name: '燕京', startYear: 1215, endYear: 1271, era: '蒙古/元' },
      { name: '大都', startYear: 1271, endYear: 1368, era: '元', note: '元朝首都' },
      { name: '北平', startYear: 1368, endYear: 1403, era: '明朝' },
      { name: '北京', startYear: 1403, endYear: 1912, era: '明朝/清朝', note: '1403年朱棣迁都后定名' },
      { name: '北平', startYear: 1912, endYear: 1949, era: '中华民国' },
      { name: '北京', startYear: 1949, endYear: 2100, era: '中华人民共和国' },
    ],
  },
  {
    modernName: '西安',
    type: 'capital',
    region: 'china',
    names: [
      { name: '镐京', startYear: -1046, endYear: -771, era: '西周', note: '西周首都' },
      { name: '雒邑', startYear: -771, endYear: -221, era: '东周/战国', note: '周平王东迁后' },
      { name: '咸阳', startYear: -221, endYear: -206, era: '秦', note: '秦朝首都' },
      { name: '长安', startYear: -206, endYear: 25, era: '西汉', note: '西汉首都，"长安"取长治久安之意' },
      { name: '常安', startYear: 9, endYear: 23, era: '新朝', note: '王莽改元' },
      { name: '长安', startYear: 25, endYear: 190, era: '东汉/三国', note: '东汉陪都' },
      { name: '长安', startYear: 190, endYear: 581, era: '魏晋南北朝', note: '各政权首都或重镇' },
      { name: '大兴城', startYear: 581, endYear: 618, era: '隋', note: '隋朝首都' },
      { name: '长安', startYear: 618, endYear: 904, era: '唐朝', note: '唐朝首都，世界最大城市' },
      { name: '长安', startYear: 904, endYear: 1354, era: '五代/宋/金/元', note: '唐昭宗迁都后仍称长安' },
      { name: '西安', startYear: 1368, endYear: 1912, era: '明朝/清朝', note: '明太祖改"西安府"，取西部安定之意' },
      { name: '西安', startYear: 1912, endYear: 2100, era: '近现代' },
    ],
  },
  {
    modernName: '洛阳',
    type: 'capital',
    region: 'china',
    names: [
      { name: '洛邑', startYear: -1046, endYear: -771, era: '西周', note: '周公营建' },
      { name: '雒阳', startYear: -202, endYear: 25, era: '西汉/东汉', note: '"雒"通"洛"' },
      { name: '洛阳', startYear: 25, endYear: 265, era: '东汉', note: '"河南有帝都之象"，东汉首都' },
      { name: '洛阳', startYear: 265, endYear: 494, era: '西晋/北魏', note: '魏晋首都之一' },
      { name: '洛阳', startYear: 494, endYear: 534, era: '北魏', note: '北魏孝文帝迁都后仍为重要城市' },
      { name: '洛阳', startYear: 534, endYear: 907, era: '东魏/西魏/北齐/北周/隋/唐', note: '陪都或首都' },
      { name: '洛阳', startYear: 907, endYear: 1368, era: '五代/宋/金/元', note: '中原重要城市' },
      { name: '洛阳', startYear: 1368, endYear: 1912, era: '明清', note: '河南省府' },
      { name: '洛阳', startYear: 1912, endYear: 2100, era: '近现代' },
    ],
  },
  {
    modernName: '南京',
    type: 'capital',
    region: 'china',
    names: [
      { name: '金陵', startYear: -333, endYear: -230, era: '战国/楚', note: '楚威王埋金以镇王气' },
      { name: '秣陵', startYear: -230, endYear: 229, era: '秦/汉/三国', note: '秦/孙权改为"秣陵"' },
      { name: '建业', startYear: 229, endYear: 317, era: '三国·吴', note: '孙权迁都' },
      { name: '建康', startYear: 317, endYear: 552, era: '东晋/南北朝', note: '东晋及南朝首都' },
      { name: '丹阳', startYear: 552, endYear: 589, era: '南朝陈', note: '陈朝短暂改称' },
      { name: '蒋州', startYear: 589, endYear: 762, era: '隋/唐', note: '隋唐时期' },
      { name: '升州', startYear: 762, endYear: 1018, era: '唐/南唐', note: '南唐首都' },
      { name: '江宁', startYear: 1018, endYear: 1368, era: '宋/元', note: '北宋设江宁府' },
      { name: '集庆', startYear: 1357, endYear: 1368, era: '元末', note: '朱元璋改元' },
      { name: '应天', startYear: 1368, endYear: 1420, era: '明朝', note: '明初首都' },
      { name: '南京', startYear: 1420, endYear: 1912, era: '明朝/清朝', note: '1420年迁都北京后为"南京"' },
      { name: '南京', startYear: 1912, endYear: 1949, era: '中华民国', note: '中华民国首都' },
      { name: '南京', startYear: 1949, endYear: 2100, era: '中华人民共和国', note: '江苏省省会' },
    ],
  },
  {
    modernName: '开封',
    type: 'capital',
    region: 'china',
    names: [
      { name: '大梁', startYear: -364, endYear: -225, era: '战国·魏', note: '魏国首都' },
      { name: '陈留', startYear: -225, endYear: 534, era: '秦/汉/魏/晋', note: '秦王政时改名' },
      { name: '汴州', startYear: 534, endYear: 960, era: '北朝/隋/唐', note: '隋唐时期' },
      { name: '开封', startYear: 960, endYear: 1127, era: '北宋', note: '北宋首都，世界最大城市' },
      { name: '汴京', startYear: 960, endYear: 1127, era: '北宋', note: '北宋首都别称' },
      { name: '南京', startYear: 1127, endYear: 1234, era: '金', note: '金朝陪都，称"南京"' },
      { name: '汴梁', startYear: 1234, endYear: 1368, era: '金/元', note: '元初仍称汴梁' },
      { name: '开封', startYear: 1368, endYear: 1912, era: '明清', note: '河南省会' },
      { name: '开封', startYear: 1912, endYear: 2100, era: '近现代' },
    ],
  },
  {
    modernName: '杭州',
    type: 'capital',
    region: 'china',
    names: [
      { name: '钱塘', startYear: -221, endYear: 591, era: '秦/汉/三国/晋/南朝', note: '秦始皇设县' },
      { name: '杭州', startYear: 591, endYear: 907, era: '隋/唐', note: '591年设杭州，始有"杭州"之名' },
      { name: '钱塘', startYear: 907, endYear: 1127, era: '五代·吴越', note: '吴越国首都' },
      { name: '临安', startYear: 1127, endYear: 1276, era: '南宋', note: '南宋首都，称"临安府"' },
      { name: '杭州', startYear: 1276, endYear: 1368, era: '元', note: '元朝设杭州路' },
      { name: '杭州', startYear: 1368, endYear: 1912, era: '明清', note: '浙江省会' },
      { name: '杭州', startYear: 1912, endYear: 2100, era: '近现代' },
    ],
  },
  {
    modernName: '成都',
    type: 'capital',
    region: 'china',
    names: [
      { name: '蜀都', startYear: -311, endYear: -106, era: '古蜀/战国', note: '古蜀国都城' },
      { name: '成都', startYear: -106, endYear: 7, era: '西汉/新', note: '公元前106年设县' },
      { name: '成都', startYear: 7, endYear: 221, era: '新/东汉', note: '两汉时期重要城市' },
      { name: '成都', startYear: 221, endYear: 263, era: '三国·蜀汉', note: '蜀汉首都' },
      { name: '成都', startYear: 263, endYear: 907, era: '西晋/成汉/隋唐', note: '成汉首都' },
      { name: '成都', startYear: 907, endYear: 925, era: '五代·前蜀', note: '前蜀首都' },
      { name: '成都', startYear: 934, endYear: 965, era: '五代·后蜀', note: '后蜀首都' },
      { name: '成都', startYear: 965, endYear: 1368, era: '宋/元', note: '北宋成都府' },
      { name: '成都', startYear: 1368, endYear: 1912, era: '明清', note: '四川省会' },
      { name: '成都', startYear: 1912, endYear: 2100, era: '近现代' },
    ],
  },
  {
    modernName: '广州',
    type: 'capital',
    region: 'china',
    names: [
      { name: '番禺', startYear: -214, endYear: 1050, era: '秦/汉/三国/南朝', note: '秦朝设南海郡治所' },
      { name: '广州', startYear: 5, endYear: 2100, era: '多朝', note: '"广州"之名始于三国' },
    ],
  },
  {
    modernName: '沈阳',
    type: 'capital',
    region: 'china',
    names: [
      { name: '侯城', startYear: -300, endYear: 500, era: '战国/汉', note: '沈阳最早建城' },
      { name: '沈州', startYear: 500, endYear: 1296, era: '南北朝/辽/金/元', note: '辽代设沈州' },
      { name: '沈阳路', startYear: 1296, endYear: 1657, era: '元/明/清', note: '元代设沈阳路' },
      { name: '盛京', startYear: 1657, endYear: 1912, era: '清朝', note: '清朝陪都，1657年设盛京' },
      { name: '沈阳', startYear: 1912, endYear: 2100, era: '近现代' },
    ],
  },
  {
    modernName: '郑州',
    type: 'capital',
    region: 'china',
    names: [
      { name: '荥阳', startYear: -500, endYear: 555, era: '春秋/战国/汉/南北朝', note: '军事重镇' },
      { name: '郑州', startYear: 555, endYear: 1368, era: '北周/隋/唐/宋/元', note: '555年北周设郑州' },
      { name: '郑州', startYear: 1368, endYear: 1912, era: '明清', note: '开封府下辖' },
      { name: '郑州', startYear: 1912, endYear: 2100, era: '近现代', note: '河南省会（1954年后）' },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // 朝鲜半岛城市
  // ═══════════════════════════════════════════════════════
  {
    modernName: '首尔（汉城）',
    type: 'capital',
    region: 'korea',
    names: [
      { name: '慰礼城', startYear: -18, endYear: 475, era: '三国时代', note: '百济开国君王温祚所建' },
      { name: '汉城', startYear: 1394, endYear: 1897, era: '朝鲜王朝', note: '李成桂迁都，命名"汉城府"' },
      { name: '京城', startYear: 1897, endYear: 1945, era: '日据时期', note: '日本殖民者改名' },
      { name: '首尔', startYear: 1945, endYear: 2100, era: '大韩民国', note: '1945年光复后恢复固有名称' },
    ],
  },
  {
    modernName: '开城',
    type: 'major-city',
    region: 'korea',
    names: [
      { name: '松岳城', startYear: 935, endYear: 1392, era: '高丽', note: '王建建立高丽后定为首都' },
      { name: '开城', startYear: 983, endYear: 1392, era: '高丽', note: '升为开京' },
      { name: '开城', startYear: 1392, endYear: 1910, era: '朝鲜王朝', note: '降为特别市' },
      { name: '开城', startYear: 1945, endYear: 2100, era: '南北分治', note: '现属朝鲜' },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // 日本城市
  // ═══════════════════════════════════════════════════════
  {
    modernName: '东京（ Edo / 江户）',
    type: 'capital',
    region: 'japan',
    names: [
      { name: '千代田城', startYear: 1457, endYear: 1868, era: '室町/战国/江户', note: '太田道灌筑城，后为德川幕府所在地' },
      { name: '江户', startYear: 1603, endYear: 1868, era: '江户时代', note: '德川幕府所在地，名称"江户"源自入道"江"父' },
      { name: '东京', startYear: 1868, endYear: 2100, era: '明治维新后', note: '1868年明治天皇迁都，改名"东京"' },
    ],
  },
  {
    modernName: '京都',
    type: 'capital',
    region: 'japan',
    names: [
      { name: '平安京', startYear: 794, endYear: 1868, era: '平安时代/室町/战国/江户', note: '桓武天皇迁都，千年首都' },
      { name: '京都', startYear: 1868, endYear: 2100, era: '明治后', note: '明治维新后改称"京都市"' },
    ],
  },
  {
    modernName: '奈良',
    type: 'capital',
    region: 'japan',
    names: [
      { name: '平城京', startYear: 710, endYear: 784, era: '奈良时代', note: '元明天皇迁都，仿长安格局' },
      { name: '奈良', startYear: 784, endYear: 2100, era: '江户后', note: '794年迁都平安京后仍为宗教文化中心' },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // 中亚/西域城市
  // ═══════════════════════════════════════════════════════
  {
    modernName: '撒马尔罕',
    type: 'major-city',
    region: 'central-asia',
    names: [
      { name: '马拉坎达', startYear: -329, endYear: 700, era: '亚历山大/希腊化/贵霜', note: '亚历山大大帝征服后建城' },
      { name: '撒马尔罕', startYear: 700, endYear: 1220, era: '阿拉伯/波斯', note: '伊斯兰化后改名撒马尔罕' },
      { name: '撒马尔罕', startYear: 1220, endYear: 1500, era: '花剌子模/蒙古/帖木儿', note: '帖木儿帝国首都，鼎盛时期' },
      { name: '撒马尔罕', startYear: 1500, endYear: 2100, era: '布哈拉/俄罗斯/乌兹别克', note: '乌兹别克斯坦城市' },
    ],
  },
  {
    modernName: '喀什噶尔（喀什）',
    type: 'major-city',
    region: 'central-asia',
    names: [
      { name: '疏勒', startYear: -100, endYear: 1350, era: '汉/唐/喀喇汗', note: '丝绸之路重镇，汉代已见记载' },
      { name: '喀什噶尔', startYear: 1350, endYear: 1883, era: '察合台/叶尔羌/清', note: '察合台汗国时期改名' },
      { name: '喀什', startYear: 1883, endYear: 2100, era: '清/近现代', note: '1883年设喀什噶尔道' },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // 西方城市
  // ═══════════════════════════════════════════════════════
  {
    modernName: '君士坦丁堡（伊斯坦布尔）',
    type: 'capital',
    region: 'west',
    names: [
      { name: '拜占庭', startYear: -667, endYear: 330, era: '古希腊/罗马', note: '希腊城邦拜占庭' },
      { name: '君士坦丁堡', startYear: 330, endYear: 1453, era: '拜占庭帝国', note: '330年君士坦丁大帝迁都' },
      { name: '伊斯坦布尔', startYear: 1453, endYear: 2100, era: '奥斯曼帝国/土耳其', note: '1453年奥斯曼苏丹穆罕默德二世攻克后改名' },
    ],
  },
  {
    modernName: '亚历山大',
    type: 'capital',
    region: 'west',
    names: [
      { name: '亚历山大', startYear: -331, endYear: 641, era: '希腊化/罗马/拜占庭', note: '亚历山大大帝建立' },
      { name: '亚历山大', startYear: 641, endYear: 1517, era: '阿拉伯帝国', note: '阿拉伯征服后' },
      { name: '亚历山大', startYear: 1517, endYear: 1882, era: '奥斯曼帝国', note: '奥斯曼帝国时期' },
      { name: '亚历山大', startYear: 1882, endYear: 1956, era: '英国保护国', note: '英国殖民时期' },
      { name: '亚历山大', startYear: 1956, endYear: 2100, era: '埃及', note: '埃及第二大城市' },
    ],
  },
  {
    modernName: '罗马',
    type: 'capital',
    region: 'west',
    names: [
      { name: '罗马', startYear: -753, endYear: 476, era: '罗马王国/共和国/帝国', note: '传说中罗慕路斯建城' },
      { name: '罗马', startYear: 476, endYear: 2100, era: '中世纪/文艺复兴/近现代', note: '教皇国首都/意大利首都' },
    ],
  },
];

/**
 * 根据年份获取某地的当时名称
 */
export function getPlaceNameAtYear(place: PlaceNameChange, year: number): string | null {
  for (const nameEntry of place.names) {
    if (year >= nameEntry.startYear && year <= nameEntry.endYear) {
      return nameEntry.name;
    }
  }
  return null;
}

/**
 * 获取某地在特定年份范围内的所有曾用名
 */
export function getPlaceNamesInRange(place: PlaceNameChange, startYear: number, endYear: number): string[] {
  const result: string[] = [];
  let lastName: string | null = null;
  
  for (const nameEntry of place.names) {
    if (nameEntry.endYear < startYear || nameEntry.startYear > endYear) continue;
    if (nameEntry.name !== lastName) {
      result.push(nameEntry.name);
      lastName = nameEntry.name;
    }
  }
  
  return result;
}
