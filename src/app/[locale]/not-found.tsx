import Link from 'next/link';

interface NotFoundProps {
  params: Promise<{ locale: string }>;
}

const LOCALE_CONTENT: Record<string, {
  title: string;
  subtitle: string;
  description: string;
  homeLabel: string;
  timelineLabel: string;
}> = {
  zh: {
    title: '404',
    subtitle: '页面未找到',
    description: '您访问的页面不存在或已被移除。',
    homeLabel: '返回首页',
    timelineLabel: '查看时间线',
  },
  en: {
    title: '404',
    subtitle: 'Page Not Found',
    description: 'The page you are looking for does not exist or has been removed.',
    homeLabel: 'Go Home',
    timelineLabel: 'View Timeline',
  },
  ja: {
    title: '404',
    subtitle: 'ページが見つかりません',
    description: 'お探しのページは存在しないか、削除された可能性があります。',
    homeLabel: 'ホームに戻る',
    timelineLabel: 'タイムラインを見る',
  },
};

const DEFAULT_CONTENT = LOCALE_CONTENT['zh']!;

export default async function NotFound({ params }: NotFoundProps) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale ?? 'zh';
  const content = LOCALE_CONTENT[locale] ?? DEFAULT_CONTENT;
  const homeHref = `/${locale}`;
  const timelineHref = `/${locale}/timeline`;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 text-center dark:bg-zinc-900">
      <div className="max-w-md">
        <div className="mb-6 text-8xl">🗺️</div>
        <h1 className="mb-4 text-3xl font-bold text-zinc-800 dark:text-zinc-100">{content.title}</h1>
        <h2 className="mb-4 text-xl font-semibold text-zinc-600 dark:text-zinc-400">{content.subtitle}</h2>
        <p className="mb-8 text-zinc-500 dark:text-zinc-500">
          {content.description}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={homeHref}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            {content.homeLabel}
          </Link>
          <Link
            href={timelineHref}
            className="rounded-lg border border-zinc-300 bg-white px-6 py-3 font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            {content.timelineLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
