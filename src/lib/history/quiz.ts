/**
 * Quiz system for History Atlas
 * Generates quiz questions from battle data
 */

import type { Event } from './types';
import { getBattles } from './battles';

export type QuizType = 'commander' | 'result' | 'year' | 'terrain' | 'scale' | 'chronology';
export type QuizDifficulty = 'easy' | 'normal' | 'hard';

export type QuizQuestion = {
  id: string;
  type: QuizType;
  difficulty: QuizDifficulty;
  battle: Event;
  questionKey: string;       // i18n key for the question
  questionArgs?: Record<string, string>;
  options: string[];        // option display strings
  correctIndex: number;
  explanationKey: string;  // i18n key for explanation after answer
};

export type QuizConfig = {
  count: number;            // number of questions to generate
  difficulty: QuizDifficulty;
  types?: QuizType[];       // which question types to include
};

type BattleWithData = Event & { battle: NonNullable<Event['battle']> };

function isBattle(e: Event): e is BattleWithData {
  return e.battle != null;
}

function shuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    const tmp = a[i]!;
    a[i] = a[j]!;
    a[j] = tmp;
  }
  return a;
}

function getWrongOptions(
  battles: BattleWithData[],
  type: QuizType,
  correct: string,
  count: number
): string[] {
  const seen = new Set([correct]);
  const candidates: string[] = [];

  for (const b of battles) {
    let val: string | undefined;
    switch (type) {
      case 'commander':
        val = b.battle.commanders?.attacker?.[0] ?? b.battle.commanders?.defender?.[0];
        break;
      case 'result':
        val = b.battle.result;
        break;
      case 'year':
        val = String(b.year);
        break;
      case 'terrain':
        val = b.battle.terrain?.[0];
        break;
      case 'scale':
        val = b.battle.scale;
        break;
      case 'chronology':
        // Not used for wrong options
        break;
    }
    if (val && !seen.has(val)) {
      seen.add(val);
      candidates.push(val);
    }
  }

  return candidates.slice(0, count);
}

// --- Question generators ---

function makeCommanderQuestion(
  battle: BattleWithData,
  seed: number,
  askAttacker: boolean
): QuizQuestion | null {
  const commanders = askAttacker
    ? battle.battle.commanders?.attacker
    : battle.battle.commanders?.defender;
  if (!commanders || commanders.length === 0) return null;

  const correct = commanders[0]!;
  const options: string[] = [correct, ...getWrongOptions([battle], 'commander', correct, 3)];
  const shuffled = shuffle(options, seed);

  return {
    id: `${battle.id}-commander-${askAttacker ? 'att' : 'def'}`,
    type: 'commander',
    difficulty: 'normal',
    battle,
    questionKey: askAttacker ? 'quiz.question.commander.attacker' : 'quiz.question.commander.defender',
    questionArgs: { battle: battle.titleKey },
    options: shuffled,
    correctIndex: shuffled.indexOf(correct),
    explanationKey: 'quiz.explanation.commander',
  };
}

function makeResultQuestion(
  battle: BattleWithData,
  seed: number
): QuizQuestion | null {
  if (!battle.battle.result) return null;

  const resultLabels: Record<string, string> = {
    attacker_win: 'quiz.option.attacker_win',
    defender_win: 'quiz.option.defender_win',
    draw: 'quiz.option.draw',
    inconclusive: 'quiz.option.inconclusive',
  };

  const correct = resultLabels[battle.battle.result] ?? 'quiz.option.unknown';

  const options = [correct, ...getWrongOptions([battle], 'result', correct, 3).map(r => resultLabels[r] ?? r)];
  // Ensure 4 unique options
  const uniqueOptions = options.filter((o, i) => options.indexOf(o) === i);
  while (uniqueOptions.length < 4) uniqueOptions.push('quiz.option.unknown');
  const shuffled = shuffle(uniqueOptions.slice(0, 4), seed);

  return {
    id: `${battle.id}-result`,
    type: 'result',
    difficulty: 'easy',
    battle,
    questionKey: 'quiz.question.result',
    questionArgs: { battle: battle.titleKey, attacker: battle.battle.belligerents?.attacker ?? '', defender: battle.battle.belligerents?.defender ?? '' },
    options: shuffled,
    correctIndex: shuffled.indexOf(correct),
    explanationKey: 'quiz.explanation.result',
  };
}

function makeYearQuestion(
  battle: BattleWithData,
  seed: number
): QuizQuestion | null {
  const correct = String(battle.year);
  const wrongYears = getWrongOptions([battle], 'year', correct, 3);
  const options = shuffle([correct, ...wrongYears], seed);

  // Determine era context
  let eraLabel = 'quiz.era.springAutumn';
  if (battle.year <= -770 && battle.year >= -1046) eraLabel = 'quiz.era.westernZhou';
  else if (battle.year < -475) eraLabel = 'quiz.era.springAutumn';
  else if (battle.year < -221) eraLabel = 'quiz.era.warringStates';
  else if (battle.year < -207) eraLabel = 'quiz.era.chenhan';
  else if (battle.year < 220) eraLabel = 'quiz.era.threeKingdoms';

  return {
    id: `${battle.id}-year`,
    type: 'year',
    difficulty: 'normal',
    battle,
    questionKey: 'quiz.question.year',
    questionArgs: { battle: battle.titleKey, era: eraLabel },
    options,
    correctIndex: options.indexOf(correct),
    explanationKey: 'quiz.explanation.year',
  };
}

function makeTerrainQuestion(
  battle: BattleWithData,
  seed: number
): QuizQuestion | null {
  if (!battle.battle.terrain || battle.battle.terrain.length === 0) return null;

  const terrainLabels: Record<string, string> = {
    plains: 'quiz.terrain.plains',
    mountains: 'quiz.terrain.mountains',
    hills: 'quiz.terrain.hills',
    water: 'quiz.terrain.water',
    desert: 'quiz.terrain.desert',
    plateau: 'quiz.terrain.plateau',
    forest: 'quiz.terrain.forest',
    marsh: 'quiz.terrain.marsh',
    coastal: 'quiz.terrain.coastal',
    urban: 'quiz.terrain.urban',
    pass: 'quiz.terrain.pass',
    unknown: 'quiz.terrain.unknown',
  };

  const correct = terrainLabels[battle.battle.terrain[0]!] ?? 'quiz.terrain.unknown';
  const allTerrains = Object.values(terrainLabels);
  const options = shuffle([correct, ...allTerrains.filter(t => t !== correct).slice(0, 3)], seed);

  return {
    id: `${battle.id}-terrain`,
    type: 'terrain',
    difficulty: 'easy',
    battle,
    questionKey: 'quiz.question.terrain',
    questionArgs: { battle: battle.titleKey },
    options,
    correctIndex: options.indexOf(correct),
    explanationKey: 'quiz.explanation.terrain',
  };
}

function makeScaleQuestion(
  battle: BattleWithData,
  seed: number
): QuizQuestion | null {
  if (!battle.battle.scale) return null;

  const scaleLabels: Record<string, string> = {
    massive: 'quiz.scale.massive',
    large: 'quiz.scale.large',
    medium: 'quiz.scale.medium',
    small: 'quiz.scale.small',
    unknown: 'quiz.scale.unknown',
  };

  const correct = scaleLabels[battle.battle.scale] ?? 'quiz.scale.unknown';
  const options = shuffle([correct, ...Object.values(scaleLabels).filter(s => s !== correct).slice(0, 3)], seed);

  return {
    id: `${battle.id}-scale`,
    type: 'scale',
    difficulty: 'easy',
    battle,
    questionKey: 'quiz.question.scale',
    questionArgs: { battle: battle.titleKey },
    options,
    correctIndex: options.indexOf(correct),
    explanationKey: 'quiz.explanation.scale',
  };
}

function makeChronologyQuestion(
  battles: BattleWithData[],
  seed: number
): QuizQuestion | null {
  if (battles.length < 4) return null;

  // Pick 4 distinct random battles
  const sortedBattles = [...battles].sort((a, b) => a.year - b.year);
  const minIdx = 0;
  const maxIdx = sortedBattles.length - 4;

  const startIdx = Math.abs((seed * 1664525 + 1013904223) & 0xffffffff) % (maxIdx - minIdx + 1) + minIdx;
  const selectedBattles = sortedBattles.slice(startIdx, startIdx + 4);

  // Build options: each option is a titleKey of a battle
  const shuffledOptions = shuffle(selectedBattles, seed);
  const options = shuffledOptions.map(b => b.titleKey);

  // Correct answer: find which option is the earliest
  const earliestBattle = selectedBattles.reduce((earliest, b) => b.year < earliest.year ? b : earliest);
  const correctIndex = options.indexOf(earliestBattle.titleKey);

  return {
    id: `chronology-${selectedBattles[0]!.id}-${selectedBattles[1]!.id}-${selectedBattles[2]!.id}-${selectedBattles[3]!.id}`,
    type: 'chronology',
    difficulty: 'normal',
    battle: selectedBattles[0]!,
    questionKey: 'quiz.question.chronology',
    questionArgs: {
      b1: shuffledOptions[0]!.titleKey,
      b2: shuffledOptions[1]!.titleKey,
      b3: shuffledOptions[2]!.titleKey,
      b4: shuffledOptions[3]!.titleKey,
      year: String(earliestBattle.year),
    },
    options,
    correctIndex,
    explanationKey: 'quiz.explanation.chronology',
  };
}

/**
 * Generate a batch of quiz questions from battle events.
 * Each question has 4 options (1 correct, 3 wrong).
 */
export function generateQuizQuestions(
  events: Event[],
  config: QuizConfig
): QuizQuestion[] {
  const battles = getBattles(events).filter(isBattle);
  if (battles.length === 0) return [];

  const { count = 10, difficulty = 'normal', types } = config;

  const allTypes: QuizType[] = types ?? ['commander', 'result', 'year', 'terrain', 'scale'];
  const questions: QuizQuestion[] = [];
  let idx = 0;

  while (questions.length < count && idx < battles.length * 5) {
    const battleIdx = idx % battles.length;
    const battle = battles[battleIdx]!;
    const seed = battle.year * 1000 + battleIdx * 37 + questions.length * 13;
    const typeIdx = (seed + questions.length) % allTypes.length;
    const type = allTypes[typeIdx];

    let q: QuizQuestion | null = null;

    switch (type) {
      case 'commander':
        // Try attacker first, then defender
        q = makeCommanderQuestion(battle, seed, true) ?? makeCommanderQuestion(battle, seed + 1, false);
        break;
      case 'result':
        q = makeResultQuestion(battle, seed);
        break;
      case 'year':
        q = makeYearQuestion(battle, seed);
        break;
      case 'terrain':
        q = makeTerrainQuestion(battle, seed);
        break;
      case 'scale':
        q = makeScaleQuestion(battle, seed);
        break;
      case 'chronology':
        q = makeChronologyQuestion(battles, seed);
        break;
    }

    if (q && !questions.find(existing => existing.id === q!.id)) {
      questions.push({ ...q, difficulty });
    }

    idx++;
  }

  return questions.slice(0, count);
}

export type QuizSession = {
  questions: QuizQuestion[];
  currentIndex: number;
  answers: (number | null)[];
  score: number;
  streak: number;
  maxStreak: number;
};

export function startQuizSession(questions: QuizQuestion[]): QuizSession {
  return {
    questions,
    currentIndex: 0,
    answers: new Array(questions.length).fill(null),
    score: 0,
    streak: 0,
    maxStreak: 0,
  };
}

export function answerQuestion(
  session: QuizSession,
  answerIndex: number
): QuizSession {
  const q = session.questions[session.currentIndex]!;
  const isCorrect = answerIndex === q.correctIndex;
  const newAnswers = [...session.answers];
  newAnswers[session.currentIndex] = answerIndex;

  const scoreDelta = isCorrect ? 1 : 0;
  const streakDelta = isCorrect ? session.streak + 1 : 0;

  return {
    ...session,
    answers: newAnswers,
    score: session.score + scoreDelta,
    streak: streakDelta,
    maxStreak: Math.max(session.maxStreak, streakDelta),
  };
}

export function nextQuestion(session: QuizSession): QuizSession {
  return {
    ...session,
    currentIndex: Math.min(session.currentIndex + 1, session.questions.length - 1),
  };
}

export function prevQuestion(session: QuizSession): QuizSession {
  return {
    ...session,
    currentIndex: Math.max(session.currentIndex - 1, 0),
  };
}
