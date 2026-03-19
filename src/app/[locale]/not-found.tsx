import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 text-center">
      <div className="max-w-md">
        <div className="mb-6 text-8xl">🗺️</div>
        <h1 className="mb-4 text-3xl font-bold text-zinc-800">404</h1>
        <h2 className="mb-4 text-xl font-semibold text-zinc-600">页面未找到</h2>
        <p className="mb-8 text-zinc-500">
          您访问的页面不存在或已被移除。
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/zh"
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            返回首页
          </Link>
          <Link
            href="/zh/timeline"
            className="rounded-lg border border-zinc-300 bg-white px-6 py-3 font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            查看时间线
          </Link>
        </div>
      </div>
    </div>
  );
}
