'use client';

import * as React from 'react';

const STORAGE_KEY = 'history_atlas_quiz_highscore';

export interface QuizHighScore {
  highScore: number;       // highest accuracy percentage (0-100)
  bestStreak: number;      // all-time best streak
  totalAnswered: number;   // total questions answered
}

function loadFromStorage(): QuizHighScore {
  if (typeof window === 'undefined') {
    return { highScore: 0, bestStreak: 0, totalAnswered: 0 };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as QuizHighScore;
  } catch {
    // ignore
  }
  return { highScore: 0, bestStreak: 0, totalAnswered: 0 };
}

function saveToStorage(data: QuizHighScore): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

/**
 * Persists quiz high score and best streak across sessions via localStorage.
 */
export function useQuizScore() {
  const [record, setRecord] = React.useState<QuizHighScore>({
    highScore: 0,
    bestStreak: 0,
    totalAnswered: 0,
  });

  // Load from localStorage on mount (client only)
  React.useEffect(() => {
    setRecord(loadFromStorage());
  }, []);

  /**
   * Call this after a quiz session ends to update the persisted record.
   * @param score - raw correct count
   * @param total - total questions in the session
   * @param maxStreak - best streak achieved in this session
   */
  const updateRecord = React.useCallback((score: number, total: number, maxStreak: number) => {
    const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;
    setRecord(prev => {
      const next: QuizHighScore = {
        highScore: Math.max(prev.highScore, accuracy),
        bestStreak: Math.max(prev.bestStreak, maxStreak),
        totalAnswered: prev.totalAnswered + total,
      };
      saveToStorage(next);
      return next;
    });
  }, []);

  return { record, updateRecord };
}
