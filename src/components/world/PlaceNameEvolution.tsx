'use client';

import * as React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { PLACE_EVOLUTIONS, type PlaceEvolution } from '@/lib/history/data/placeNameEvolution';
import { formatYear } from '@/lib/history/utils';

// 城市区域分类（基于地理和行政区划）
function getCityRegion(cityName: string): string {
  const cityRegionMap: Record<string, string> = {
    // 华北
    '北京': '华北', '天津': '华北', '石家庄': '华北', '保定': '华北', '唐山': '华北',
    '邯郸': '华北', '邢台': '华北', '张家口': '华北', '承德': '华北', '沧州': '华北',
    '廊坊': '华北', '衡水': '华北', '秦皇岛': '华北', '太原': '华北', '大同': '华北',
    '阳泉': '华北', '晋城': '华北', '朔州': '华北', '忻州': '华北', '吕梁': '华北',
    '晋中': '华北', '临汾': '华北', '运城': '华北', '长治': '华北', '呼和浩特': '华北',
    '包头': '华北', '乌海': '华北', '赤峰': '华北', '通辽': '华北', '鄂尔多斯': '华北',
    '呼伦贝尔': '华北', '巴彦淖尔': '华北', '乌兰察布': '华北',
    // 东北
    '沈阳': '东北', '大连': '东北', '鞍山': '东北', '抚顺': '东北', '本溪': '东北',
    '丹东': '东北', '锦州': '东北', '营口': '东北', '阜新': '东北', '辽阳': '东北',
    '盘锦': '东北', '铁岭': '东北', '朝阳': '东北', '葫芦岛': '东北', '长春': '东北',
    '吉林': '东北', '四平': '东北', '辽源': '东北', '通化': '东北', '白山': '东北',
    '松原': '东北', '白城': '东北', '延边': '东北', '哈尔滨': '东北', '齐齐哈尔': '东北',
    '牡丹江': '东北', '佳木斯': '东北', '大庆': '东北', '绥化': '东北', '黑河': '东北',
    '大兴安岭': '东北', '伊春': '东北', '七台河': '东北', '鸡西': '东北', '双鸭山': '东北', '鹤岗': '东北',
    // 华东
    '上海': '华东', '南京': '华东', '苏州': '华东', '扬州': '华东', '镇江': '华东',
    '常州': '华东', '无锡': '华东', '南通': '华东', '徐州': '华东', '连云港': '华东',
    '盐城': '华东', '淮安': '华东', '泰州': '华东', '宿迁': '华东', '杭州': '华东',
    '宁波': '华东', '温州': '华东', '嘉兴': '华东', '湖州': '华东', '绍兴': '华东',
    '金华': '华东', '衢州': '华东', '舟山': '华东', '台州': '华东', '丽水': '华东',
    '合肥': '华东', '芜湖': '华东', '蚌埠': '华东', '淮南': '华东', '马鞍山': '华东',
    '淮北': '华东', '铜陵': '华东', '安庆': '华东', '黄山': '华东', '滁州': '华东',
    '阜阳': '华东', '宿州': '华东', '六安': '华东', '亳州': '华东', '池州': '华东', '宣城': '华东',
    '福州': '华东', '厦门': '华东', '泉州': '华东', '漳州': '华东', '莆田': '华东',
    '宁德': '华东', '三明': '华东', '南平': '华东', '龙岩': '华东',
    '南昌': '华东', '景德镇': '华东', '九江': '华东', '赣州': '华东', '吉安': '华东',
    '宜春': '华东', '抚州': '华东', '上饶': '华东', '萍乡': '华东', '新余': '华东', '鹰潭': '华东',
    '济南': '华东', '青岛': '华东', '烟台': '华东', '威海': '华东', '潍坊': '华东',
    '淄博': '华东', '临沂': '华东', '济宁': '华东', '泰安': '华东', '德州': '华东',
    '聊城': '华东', '滨州': '华东', '菏泽': '华东', '枣庄': '华东', '日照': '华东', '莱芜': '华东',
    '郑州': '华中', '开封': '华中', '洛阳': '华中', '平顶山': '华中', '安阳': '华中',
    '鹤壁': '华中', '新乡': '华中', '焦作': '华中', '濮阳': '华中', '许昌': '华中',
    '漯河': '华中', '三门峡': '华中', '南阳': '华中', '商丘': '华中', '信阳': '华中',
    '周口': '华中', '驻马店': '华中',
    '武汉': '华中', '黄石': '华中', '十堰': '华中', '宜昌': '华中', '襄阳': '华中',
    '鄂州': '华中', '荆门': '华中', '孝感': '华中', '荆州': '华中', '黄冈': '华中',
    '咸宁': '华中', '随州': '华中', '恩施': '华中',
    '长沙': '华中', '株洲': '华中', '湘潭': '华中', '衡阳': '华中', '邵阳': '华中',
    '岳阳': '华中', '常德': '华中', '张家界': '华中', '益阳': '华中', '郴州': '华中',
    '永州': '华中', '怀化': '华中', '娄底': '华中', '湘西': '华中',
    // 华南
    '广州': '华南', '深圳': '华南', '珠海': '华南', '汕头': '华南', '佛山': '华南',
    '韶关': '华南', '湛江': '华南', '肇庆': '华南', '江门': '华南', '茂名': '华南',
    '惠州': '华南', '梅州': '华南', '汕尾': '华南', '河源': '华南', '阳江': '华南',
    '清远': '华南', '东莞': '华南', '中山': '华南', '潮州': '华南', '揭阳': '华南', '云浮': '华南',
    '南宁': '华南', '柳州': '华南', '桂林': '华南', '梧州': '华南', '北海': '华南',
    '防城港': '华南', '钦州': '华南', '贵港': '华南', '玉林': '华南', '百色': '华南',
    '贺州': '华南', '河池': '华南', '来宾': '华南', '崇左': '华南',
    '海口': '华南', '三亚': '华南', '三沙': '华南', '儋州': '华南',
    // 西南
    '成都': '西南', '绵阳': '西南', '自贡': '西南', '攀枝花': '西南', '泸州': '西南',
    '德阳': '西南', '广元': '西南', '遂宁': '西南', '内江': '西南', '乐山': '西南',
    '南充': '西南', '眉山': '西南', '宜宾': '西南', '广安': '西南', '达州': '西南',
    '雅安': '西南', '巴中': '西南', '资阳': '西南', '昆明': '西南', '曲靖': '西南',
    '玉溪': '西南', '保山': '西南', '昭通': '西南', '丽江': '西南', '普洱': '西南',
    '临沧': '西南', '红河': '西南', '文山': '西南', '西双版纳': '西南', '大理': '西南',
    '德宏': '西南', '怒江': '西南', '迪庆': '西南', '贵阳': '西南', '遵义': '西南',
    '六盘水': '西南', '安顺': '西南', '毕节': '西南', '铜仁': '西南', '黔东南': '西南', '黔南': '西南', '黔西南': '西南',
    '拉萨': '西南', '日喀则': '西南', '昌都': '西南', '林芝': '西南', '山南': '西南', '那曲': '西南', '阿里': '西南',
    '重庆': '西南',
    // 西北
    '西安': '西北', '铜川': '西北', '宝鸡': '西北', '咸阳': '西北', '渭南': '西北',
    '延安': '西北', '榆林': '西北', '汉中': '西北', '安康': '西北', '商洛': '西北',
    '兰州': '西北', '嘉峪关': '西北', '金昌': '西北', '白银': '西北', '天水': '西北',
    '武威': '西北', '张掖': '西北', '平凉': '西北', '酒泉': '西北', '庆阳': '西北',
    '定西': '西北', '陇南': '西北', '临夏': '西北', '甘南': '西北',
    '西宁': '西北', '海东': '西北', '海北': '西北', '海南': '西北', '黄南': '西北',
    '果洛': '西北', '玉树': '西北', '海西': '西北',
    '银川': '西北', '石嘴山': '西北', '吴忠': '西北', '固原': '西北', '中卫': '西北',
    '乌鲁木齐': '西北', '克拉玛依': '西北', '吐鲁番': '西北', '哈密': '西北', '昌吉': '西北',
    '博尔塔拉': '西北', '巴音郭楞': '西北', '阿克苏': '西北', '克孜勒苏': '西北',
    '喀什': '西北', '和田': '西北', '伊犁': '西北', '塔城': '西北', '阿勒泰': '西北',
  };
  return cityRegionMap[cityName] || '其他';
}

const REGION_ORDER = ['华北', '东北', '华东', '华中', '华南', '西南', '西北', '其他'];
const REGION_COLORS: Record<string, string> = {
  '华北': 'bg-red-100 dark:bg-red-950 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200',
  '东北': 'bg-blue-100 dark:bg-blue-950 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200',
  '华东': 'bg-green-100 dark:bg-green-950 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200',
  '华中': 'bg-yellow-100 dark:bg-yellow-950 border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200',
  '华南': 'bg-orange-100 dark:bg-orange-950 border-orange-300 dark:border-orange-700 text-orange-800 dark:text-orange-200',
  '西南': 'bg-purple-100 dark:bg-purple-950 border-purple-300 dark:border-purple-700 text-purple-800 dark:text-purple-200',
  '西北': 'bg-pink-100 dark:bg-pink-950 border-pink-300 dark:border-pink-700 text-pink-800 dark:text-pink-200',
  '其他': 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200',
};

function PlaceCard({ place, t }: { place: PlaceEvolution; t: ReturnType<typeof useTranslations> }) {
  const [expanded, setExpanded] = React.useState(false);

  const allStart = Math.min(...place.names.map(n => n.startYear));
  const allEnd = Math.max(...place.names.map(n => n.endYear));
  const totalSpan = allEnd - allStart;

  const currentYear = new Date().getFullYear();
  const currentName = place.names.find(n => currentYear >= n.startYear && currentYear <= n.endYear);

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden transition-all duration-200">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-2.5 flex items-center justify-between gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          <h3 className="font-medium text-zinc-900 dark:text-zinc-100">{place.modernName}</h3>
          {currentName && currentName.name !== place.modernName && (
            <span className="text-sm text-red-600 dark:text-red-400">({currentName.name})</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            {place.names.length} {t('placeNames.eraNames')} · {formatYear(allStart)}–{formatYear(allEnd)}
          </span>
          <span className="text-zinc-400 dark:text-zinc-500">{expanded ? '▲' : '▼'}</span>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-zinc-100 dark:border-zinc-800">
          <div className="relative mt-3 mb-4">
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-zinc-200 dark:bg-zinc-700" />
            <div className="relative flex items-center justify-between py-2 overflow-x-auto">
              {place.names.map((nameEntry, index) => {
                const startPos = ((nameEntry.startYear - allStart) / totalSpan) * 100;
                const endPos = ((nameEntry.endYear - allStart) / totalSpan) * 100;
                const width = Math.max(endPos - startPos, 3);
                const isCurrent = currentYear >= nameEntry.startYear && currentYear <= nameEntry.endYear;

                return (
                  <div
                    key={index}
                    className="absolute flex flex-col items-center"
                    style={{ left: `${startPos}%`, width: `${width}%` }}
                  >
                    <div
                      className={`h-6 rounded-full flex items-center justify-center text-xs font-medium truncate px-1 w-full min-w-[40px] ${
                        isCurrent ? 'bg-red-500 dark:bg-red-600 text-white dark:text-zinc-100' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'
                      }`}
                    >
                      {nameEntry.name}
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-1 whitespace-nowrap">
                      {formatYear(nameEntry.startYear)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            {place.names.map((nameEntry, index) => {
              const isCurrent = currentYear >= nameEntry.startYear && currentYear <= nameEntry.endYear;
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-2 rounded-lg text-sm ${
                    isCurrent ? 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800' : 'bg-zinc-50 dark:bg-zinc-800/50'
                  }`}
                >
                  <div className="w-28 text-zinc-600 dark:text-zinc-400 shrink-0">
                    {formatYear(nameEntry.startYear)} - {formatYear(nameEntry.endYear)}
                  </div>
                  <div className={`flex-1 font-medium ${isCurrent ? 'text-red-600 dark:text-red-400' : 'text-zinc-800 dark:text-zinc-200'}`}>
                    {nameEntry.name}
                  </div>
                  {nameEntry.dynasty && (
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 shrink-0">{nameEntry.dynasty}</div>
                  )}
                  {isCurrent && (
                    <span className="text-xs bg-red-500 dark:bg-red-600 text-white dark:text-zinc-100 px-1.5 py-0.5 rounded shrink-0">{t('placeNames.currentIndicator')}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function RegionSection({ region, places, t }: { region: string; places: PlaceEvolution[]; t: ReturnType<typeof useTranslations> }) {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <section className="mb-6">
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg border ${REGION_COLORS[region] || REGION_COLORS['其他']} mb-3`}
      >
        <span className="font-semibold">{region}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm opacity-75">{t('placeNames.regionCities', { count: places.length })}</span>
          <span>{collapsed ? '▶' : '▼'}</span>
        </div>
      </button>

      {!collapsed && (
        <div className="grid gap-2">
          {places.map(place => (
            <PlaceCard key={place.modernName} place={place} t={t} />
          ))}
        </div>
      )}
    </section>
  );
}

export function PlaceNameEvolution({}: { initialPlaceId?: string }) {
  const t = useTranslations();
  const locale = useLocale();
  const [searchQuery, setSearchQuery] = React.useState('');

  // 按区域分组
  const groupedPlaces = React.useMemo(() => {
    const groups: Record<string, PlaceEvolution[]> = {};
    for (const place of PLACE_EVOLUTIONS) {
      const region = getCityRegion(place.modernName);
      if (!groups[region]) groups[region] = [];
      groups[region].push(place);
    }
    // 按预定顺序排序
    const sortedGroups: Record<string, PlaceEvolution[]> = {};
    for (const region of REGION_ORDER) {
      if (groups[region]) {
        sortedGroups[region] = groups[region].sort((a, b) => a.modernName.localeCompare(b.modernName, 'zh'));
      }
    }
    return sortedGroups;
  }, []);

  // 过滤后的区域
  const filteredGroups = React.useMemo(() => {
    if (!searchQuery) return groupedPlaces;
    const query = searchQuery.toLowerCase();
    const filtered: Record<string, PlaceEvolution[]> = {};

    for (const [region, places] of Object.entries(groupedPlaces)) {
      const matched = places.filter(place => {
        const matchesName = place.names.some(n => n.name.toLowerCase().includes(query));
        const matchesModern = place.modernName.toLowerCase().includes(query);
        return matchesName || matchesModern;
      });
      if (matched.length > 0) {
        filtered[region] = matched;
      }
    }
    return filtered;
  }, [searchQuery, groupedPlaces]);

  const totalCities = Object.values(filteredGroups).reduce((sum, places) => sum + places.length, 0);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="bg-white dark:bg-zinc-900 border-b dark:border-zinc-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                🏛️ {t('placeNames.title')}
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                {t('placeNames.pageDescription')}
              </p>
            </div>
            <button
              onClick={() => {
                const nextLocale = locale === 'zh' ? 'en' : 'zh';
                const pathname = window.location.pathname;
                const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`);
                window.location.href = newPath;
              }}
              className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              {locale === 'zh' ? t('placeNames.toggleLocale') : t('placeNames.toggleLocaleAlt')}
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('placeNames.searchPlaceholder')}
              className="w-full px-4 py-2 pl-10 rounded-lg bg-zinc-50 border border-zinc-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">🔍</span>
          </div>

          <div className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            {t('placeNames.activeEmpires', { count: totalCities })}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {Object.keys(filteredGroups).length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🏛️</div>
            <p className="text-zinc-500 dark:text-zinc-400">
              {t('placeNames.noResults')}
            </p>
          </div>
        ) : (
          Object.entries(filteredGroups).map(([region, places]) => (
            <RegionSection key={region} region={region} places={places} t={t} />
          ))
        )}
      </main>
    </div>
  );
}
