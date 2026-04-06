'use client';

import * as React from 'react';
import Link from 'next/link';
import type { Event } from '@/lib/history/types';
import type { QuizSession } from '@/lib/history/quiz';
import { generateQuizQuestions, startQuizSession, answerQuestion, nextQuestion } from '@/lib/history/quiz';
import { LocaleSwitcher } from '@/components/common/LocaleSwitcher';
import { BATTLES_CLIENT_COLORS, QUIZ_COLORS } from '@/lib/history/constants';
import { useTranslations } from 'next-intl';


type QuizPhase = 'setup' | 'playing' | 'result';

interface QuizTypeOption {
  value: string;
  labelKey: string;
}

const QUIZ_TYPE_OPTIONS: QuizTypeOption[] = [
  { value: 'commander', labelKey: 'quiz.type.commander' },
  { value: 'result', labelKey: 'quiz.type.result' },
  { value: 'year', labelKey: 'quiz.type.year' },
  { value: 'terrain', labelKey: 'quiz.type.terrain' },
  { value: 'scale', labelKey: 'quiz.type.scale' },
  { value: 'chronology', labelKey: 'quiz.type.chronology' },
  { value: 'mixed', labelKey: 'quiz.type.mixed' },
];

export function QuizClient({ events, locale }: { events: Event[]; locale?: string }) {
  const t = useTranslations();
  const currentLocale = locale || 'zh';
  const [phase, setPhase] = React.useState<QuizPhase>('setup');
  const [session, setSession] = React.useState<QuizSession | null>(null);
  const [selectedType, setSelectedType] = React.useState('mixed');
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<'easy' | 'normal' | 'hard'>('normal');
  const [selectedAnswer, setSelectedAnswer] = React.useState<number | null>(null);
  const [answered, setAnswered] = React.useState(false);
  const [_history, _setHistory] = React.useState<QuizSession[]>([]);

  const currentQ = session?.questions[session.currentIndex];

  function handleStart() {
    const types = selectedType === 'mixed' ? undefined : [selectedType as 'commander' | 'result' | 'year' | 'terrain' | 'scale' | 'chronology'];
    const questions = generateQuizQuestions(events, {
      count: 10,
      difficulty: selectedDifficulty,
      types,
    });
    if (questions.length === 0) return;
    const newSession = startQuizSession(questions);
    setSession(newSession);
    setPhase('playing');
    setSelectedAnswer(null);
    setAnswered(false);
  }

  function handleAnswer(idx: number) {
    if (!session || answered) return;
    setSelectedAnswer(idx);
    setAnswered(true);
    const updated = answerQuestion(session, idx);
    setSession(updated);
  }

  function handleNext() {
    if (!session) return;
    if (session.currentIndex < session.questions.length - 1) {
      const next = nextQuestion(session);
      setSession(next);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      // Finished all questions
      if (session) _setHistory(h => [...h, session]);
      setPhase('result');
    }
  }

  function handleRestart() {
    setPhase('setup');
    setSession(null);
    setSelectedAnswer(null);
    setAnswered(false);
  }

  const accuracy = session ? Math.round((session.score / session.questions.length) * 100) : 0;

  return (
    <div className={`min-h-screen ${QUIZ_COLORS.page.background}`}>
      {/* Header */}
      <header className={`sticky top-0 z-10 border-b ${QUIZ_COLORS.header.border} ${QUIZ_COLORS.header.background} ${QUIZ_COLORS.header.backdrop}`}>
        <div className="flex w-full items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              href={`/${currentLocale}`}
              className={`flex items-center gap-1 text-sm font-medium ${QUIZ_COLORS.backButton.text} ${QUIZ_COLORS.backButton.hover} transition-colors`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t('ui.back')}
            </Link>
            <div className={`w-px h-5 ${QUIZ_COLORS.divider}`}></div>
            <h1 className={`text-lg font-bold ${QUIZ_COLORS.title}`}>🧠 {t('quiz.title')}</h1>
          </div>
          <LocaleSwitcher />
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-8">

        {/* Setup Phase */}
        {phase === 'setup' && (
          <div className={`rounded-xl border ${QUIZ_COLORS.card.border} ${QUIZ_COLORS.card.shadow} p-6 ${QUIZ_COLORS.card.bg}`}>
            <h2 className={`text-xl font-bold mb-2 ${QUIZ_COLORS.title}`}>{t('quiz.setup.title')}</h2>
            <p className={`text-sm mb-6 ${BATTLES_CLIENT_COLORS.badge.text}`}>{t('quiz.setup.description')}</p>

            {/* Type selector */}
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${BATTLES_CLIENT_COLORS.badge.text}`}>
                {t('quiz.setup.questionType')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {QUIZ_TYPE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedType(opt.value)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                      selectedType === opt.value
                        ? QUIZ_COLORS.typeSelector.selected
                        : QUIZ_COLORS.option.default
                    }`}
                  >
                    {t(opt.labelKey)}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty selector */}
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${BATTLES_CLIENT_COLORS.badge.text}`}>
                {t('quiz.setup.difficulty')}
              </label>
              <div className="flex gap-2">
                {(['easy', 'normal', 'hard'] as const).map(d => (
                  <button
                    key={d}
                    onClick={() => setSelectedDifficulty(d)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                      selectedDifficulty === d
                        ? d === 'easy' ? QUIZ_COLORS.difficulty.easy.selected
                        : d === 'normal' ? QUIZ_COLORS.difficulty.normal.selected
                        : QUIZ_COLORS.difficulty.hard.selected
                        : QUIZ_COLORS.option.default
                    }`}
                  >
                    {t(`quiz.difficulty.${d}`)}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleStart}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg transition-colors shadow-sm"
            >
              {t('quiz.setup.start')}
            </button>
          </div>
        )}

        {/* Playing Phase */}
        {phase === 'playing' && session && currentQ && (
          <div className="space-y-4">
            {/* Progress bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-zinc-500">
                <span>{t('quiz.progress', { current: session.currentIndex + 1, total: session.questions.length })}</span>
                <span className={`font-bold ${session.streak >= 3 ? QUIZ_COLORS.streak.fire : 'text-zinc-600'}`}>
                  🔥 {session.streak} {t('quiz.streak')}
                </span>
              </div>
              <div className={`h-2 rounded-full ${QUIZ_COLORS.progress.track}`}>
                <div
                  className={`h-2 rounded-full ${QUIZ_COLORS.progress.bar} transition-all`}
                  style={{ width: `${((session.currentIndex + 1) / session.questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Score chip */}
            <div className="flex gap-2">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${QUIZ_COLORS.score.badge}`}>
                {t('quiz.score')}: {session.score}/{session.questions.length}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${QUIZ_COLORS.streak.badge}`}>
                🔥 {session.maxStreak} {t('quiz.bestStreak')}
              </span>
            </div>

            {/* Question card */}
            <div className={`rounded-xl border ${QUIZ_COLORS.card.border} ${QUIZ_COLORS.card.shadow} p-6 ${QUIZ_COLORS.card.bg}`}>
              {/* Question type badge */}
              <div className="mb-3">
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${QUIZ_COLORS.typeBadge}`}>
                  {t(`quiz.type.${currentQ.type}`)}
                </span>
              </div>

              <p className={`text-base font-semibold mb-4 leading-relaxed ${QUIZ_COLORS.questionText}`}>
                {t(currentQ.questionKey, { battle: t(currentQ.battle.titleKey), ...currentQ.questionArgs })}
              </p>

              {/* Options */}
              <div className="space-y-2">
                {currentQ.options.map((option, idx) => {
                  let cls: string = QUIZ_COLORS.option.default;
                  if (answered) {
                    if (idx === currentQ.correctIndex) cls = QUIZ_COLORS.option.correct;
                    else if (idx === selectedAnswer) cls = QUIZ_COLORS.option.wrong;
                  } else if (selectedAnswer === idx) {
                    cls = `${QUIZ_COLORS.option.default} ${QUIZ_COLORS.option.selected}`;
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => !answered && handleAnswer(idx)}
                      disabled={answered}
                      className={`w-full text-left px-4 py-3 rounded-lg border text-sm font-medium transition-all ${cls} ${answered ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      <span className="mr-2 opacity-50">{String.fromCharCode(65 + idx)}.</span>
                      {t(option)}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {answered && (
                <div className={`mt-4 p-3 rounded-lg text-sm ${selectedAnswer === currentQ.correctIndex ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                  {selectedAnswer === currentQ.correctIndex
                    ? `✅ ${t('quiz.feedback.correct')}`
                    : `❌ ${t('quiz.feedback.wrong')}`}
                  <p className="mt-1 opacity-80">{t(currentQ.explanationKey, { battle: t(currentQ.battle.titleKey) })}</p>
                </div>
              )}
            </div>

            {/* Next button */}
            {answered && (
              <button
                onClick={handleNext}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-base transition-colors shadow-sm"
              >
                {session.currentIndex < session.questions.length - 1
                  ? t('quiz.next')
                  : t('quiz.finish')}
              </button>
            )}
          </div>
        )}

        {/* Result Phase */}
        {phase === 'result' && session && (
          <div className="space-y-4">
            <div className={`rounded-xl border ${QUIZ_COLORS.card.border} ${QUIZ_COLORS.card.shadow} p-8 ${QUIZ_COLORS.card.bg} text-center`}>
              <div className="text-5xl mb-3">
                {accuracy >= 80 ? '🏆' : accuracy >= 60 ? '👍' : accuracy >= 40 ? '💪' : '📚'}
              </div>
              <h2 className={`text-2xl font-bold mb-1 ${QUIZ_COLORS.title}`}>
                {t('quiz.result.title')}
              </h2>
              <p className={`text-4xl font-black my-4 ${accuracy >= 80 ? QUIZ_COLORS.accuracyResult.high : accuracy >= 60 ? QUIZ_COLORS.accuracyResult.medium : QUIZ_COLORS.accuracyResult.low}`}>
                {accuracy}%
              </p>
              <p className={`text-sm mb-2 ${BATTLES_CLIENT_COLORS.badge.text}`}>
                {t('quiz.result.score', { correct: session.score, total: session.questions.length })}
              </p>
              <p className={`text-sm ${BATTLES_CLIENT_COLORS.badge.text}`}>
                🔥 {t('quiz.result.bestStreak', { streak: session.maxStreak })}
              </p>
            </div>

            <button
              onClick={handleRestart}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-base transition-colors shadow-sm"
            >
              {t('quiz.result.playAgain')}
            </button>

            <Link
              href={`/${currentLocale}`}
              className="block w-full py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium text-center transition-colors"
            >
              {t('ui.back')}
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
