import { CHINA_ERAS } from '@/lib/history/data/chinaEras';
import { CHINA_EVENTS } from '@/lib/history/data/chinaEvents';
import { CHINA_RULERS } from '@/lib/history/data/chinaRulers';
import { HistoryApp } from '@/components/HistoryApp';

export default function Home() {
  return <HistoryApp eras={CHINA_ERAS} events={CHINA_EVENTS} rulers={CHINA_RULERS} />;
}
