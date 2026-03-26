import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { locales, type Locale } from '@/i18n/routing';
import { Shell } from '@/components/Shell';

const localeNames: Record<string, string> = {
  zh: '战役知识问答',
  en: 'Battle Quiz',
  ja: '战役クイズ',
};

const localeDescriptions: Record<string, string> = {
  zh: '通过选择题测试你对古代战役知识的掌握程度',
  en: 'Test your knowledge of ancient battles with multiple-choice quizzes',
  ja: '中国古代戦争の知識をチェック',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const name = localeNames[locale] || localeNames.zh;
  const description = localeDescriptions[locale] || localeDescriptions.zh;

  return {
    title: `${name} | History Atlas`,
    description,
    openGraph: {
      title: name,
      description,
      type: 'website',
    },
  };
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) notFound();

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return <Shell messages={messages} />;
}
