import { CHINA_ERAS } from '@/lib/history/data/chinaEras';
import { CHINA_EVENTS } from '@/lib/history/data/chinaEvents';
import { HistoryApp } from '@/components/HistoryApp';

export default function Home() {
  return <HistoryApp eras={CHINA_ERAS} events={CHINA_EVENTS} />;
}
