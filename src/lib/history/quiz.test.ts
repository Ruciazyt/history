import { describe, it, expect } from 'vitest';
import {
  generateQuizQuestions,
  startQuizSession,
  answerQuestion,
  nextQuestion,
  prevQuestion,
} from './quiz';
import type { Event } from './types';

const mockBattleEvent = (overrides: {
  id: string;
  year: number;
  commanders?: { attacker?: string[]; defender?: string[] };
  result?: Event['battle']['result'];
  terrain?: string[];
  scale?: string;
  belligerents?: { attacker: string; defender: string };
}): Event => ({
  id: overrides.id,
  entityId: 'era1',
  year: overrides.year,
  titleKey: `event.${overrides.id}.title`,
  summaryKey: `event.${overrides.id}.summary`,
  tags: ['war'],
  location: { lon: 114.35, lat: 35.7, label: 'Test' },
  battle: {
    belligerents: overrides.belligerents ?? { attacker: '晋军', defender: '楚军' },
    result: overrides.result ?? 'attacker_win',
    commanders: overrides.commanders ?? { attacker: ['先轸'], defender: ['子玉'] },
    terrain: overrides.terrain ?? ['plains'],
    scale: overrides.scale ?? 'large',
  },
});

const nonBattleEvent: Event = {
  id: 'non-battle',
  entityId: 'era1',
  year: -500,
  titleKey: 'event.non-battle.title',
  summaryKey: 'event.non-battle.summary',
  tags: ['politics'],
};

// Rich set of battles with varied commanders, results, terrains, scales
const richBattleEvents: Event[] = [
  mockBattleEvent({ id: 'b1', year: -632, commanders: { attacker: ['先轸'], defender: ['子玉'] }, result: 'attacker_win', terrain: ['plains'], scale: 'large' }),
  mockBattleEvent({ id: 'b2', year: -260, commanders: { attacker: ['白起'], defender: ['赵括'] }, result: 'attacker_win', terrain: ['mountains'], scale: 'massive' }),
  mockBattleEvent({ id: 'b3', year: -270, commanders: { attacker: ['王翦'], defender: ['李牧'] }, result: 'defender_win', terrain: ['hills'], scale: 'large' }),
  mockBattleEvent({ id: 'b4', year: -207, commanders: { attacker: ['韩信'], defender: ['项羽'] }, result: 'attacker_win', terrain: ['plains'], scale: 'medium' }),
  mockBattleEvent({ id: 'b5', year: 200, commanders: { attacker: ['曹操'], defender: ['刘备'] }, result: 'draw', terrain: ['water'], scale: 'large' }),
  mockBattleEvent({ id: 'b6', year: -220, commanders: { attacker: ['王离'], defender: ['刘邦'] }, result: 'attacker_win', terrain: ['plains'], scale: 'small' }),
];

describe('quiz', () => {
  describe('startQuizSession', () => {
    it('should initialize session with correct number of answers', () => {
      const questions = generateQuizQuestions(richBattleEvents, { count: 5 });
      expect(questions.length).toBeGreaterThan(0);
      const session = startQuizSession(questions);
      expect(session.answers).toHaveLength(questions.length);
      expect(session.answers.every(a => a === null)).toBe(true);
    });

    it('should start at index 0', () => {
      const questions = generateQuizQuestions(richBattleEvents, { count: 5 });
      const session = startQuizSession(questions);
      expect(session.currentIndex).toBe(0);
    });

    it('should start with score 0 and streak 0', () => {
      const questions = generateQuizQuestions(richBattleEvents, { count: 1 });
      const session = startQuizSession(questions);
      expect(session.score).toBe(0);
      expect(session.streak).toBe(0);
      expect(session.maxStreak).toBe(0);
    });
  });

  describe('answerQuestion', () => {
    it('should record the answer', () => {
      const questions = generateQuizQuestions(richBattleEvents, { count: 5 });
      const session = startQuizSession(questions);
      const _q = session.questions[session.currentIndex]!;
      const newSession = answerQuestion(session, 1);
      expect(newSession.answers[session.currentIndex]).toBe(1);
    });

    it('should increment score when answer is correct', () => {
      const questions = generateQuizQuestions(richBattleEvents, { count: 5 });
      const session = startQuizSession(questions);
      const q = session.questions[session.currentIndex]!;
      const newSession = answerQuestion(session, q.correctIndex);
      expect(newSession.score).toBe(1);
    });

    it('should not increment score when answer is wrong', () => {
      const questions = generateQuizQuestions(richBattleEvents, { count: 5 });
      const session = startQuizSession(questions);
      const q = session.questions[session.currentIndex]!;
      // find a wrong index (option value different from correct)
      void q.options[q.correctIndex]; // confirm the correct option exists
      const wrongIndex = q.options.findIndex((opt, i) => i !== q.correctIndex);
      const newSession = answerQuestion(session, wrongIndex);
      expect(newSession.score).toBe(0);
    });

    it('should increment streak on correct answer', () => {
      const questions = generateQuizQuestions(richBattleEvents, { count: 5 });
      const session = startQuizSession(questions);
      const q = session.questions[session.currentIndex]!;
      const newSession = answerQuestion(session, q.correctIndex);
      expect(newSession.streak).toBe(1);
    });

    it('should reset streak on wrong answer', () => {
      const questions = generateQuizQuestions(richBattleEvents, { count: 5 });
      const session = startQuizSession(questions);
      const q = session.questions[session.currentIndex]!;
      const wrongIndex = q.options.findIndex((opt, i) => i !== q.correctIndex);
      const newSession = answerQuestion(session, wrongIndex);
      expect(newSession.streak).toBe(0);
    });

    it('should update maxStreak when current streak exceeds it', () => {
      const questions = generateQuizQuestions(richBattleEvents, { count: 5 });
      let session = startQuizSession(questions);
      const q = session.questions[session.currentIndex]!;
      session = answerQuestion(session, q.correctIndex);
      expect(session.maxStreak).toBe(1);
      expect(session.streak).toBe(1);
    });

    it('should not affect other answers', () => {
      const questions = generateQuizQuestions(richBattleEvents, { count: 5 });
      const session = startQuizSession(questions);
      const q0 = session.questions[0]!;
      let s = answerQuestion(session, q0.correctIndex);
      // move to next question so we answer a different question
      s = nextQuestion(s);
      const q1 = s.questions[s.currentIndex]!;
      const wrongIndex = q1.options.findIndex((opt, i) => i !== q1.correctIndex);
      s = answerQuestion(s, wrongIndex);
      // first answer should still be recorded
      expect(s.answers[0]).toBe(q0.correctIndex);
    });

    it('should overwrite previous answer at same index', () => {
      const questions = generateQuizQuestions(richBattleEvents, { count: 5 });
      const session = startQuizSession(questions);
      const q = session.questions[session.currentIndex]!;
      const wrongIndex = q.options.findIndex((opt, i) => i !== q.correctIndex);
      let s = answerQuestion(session, wrongIndex);
      expect(s.score).toBe(0);
      s = answerQuestion(s, q.correctIndex);
      expect(s.score).toBe(1);
      expect(s.answers[session.currentIndex]).toBe(q.correctIndex);
    });
  });

  describe('nextQuestion', () => {
    it('should increment currentIndex when more than one question', () => {
      const questions = generateQuizQuestions(richBattleEvents, { count: 5 });
      const session = startQuizSession(questions);
      const s = nextQuestion(session);
      expect(s.currentIndex).toBe(1);
    });

    it('should not exceed questions length - 1', () => {
      const questions = generateQuizQuestions(richBattleEvents, { count: 1 });
      const session = startQuizSession(questions);
      const s = nextQuestion(session);
      expect(s.currentIndex).toBe(0);
    });
  });

  describe('prevQuestion', () => {
    it('should decrement currentIndex', () => {
      let session = startQuizSession(generateQuizQuestions(richBattleEvents, { count: 5 }));
      session = nextQuestion(session);
      session = prevQuestion(session);
      expect(session.currentIndex).toBe(0);
    });

    it('should not go below 0', () => {
      const questions = generateQuizQuestions(richBattleEvents, { count: 1 });
      const session = startQuizSession(questions);
      const s = prevQuestion(session);
      expect(s.currentIndex).toBe(0);
    });
  });

  describe('generateQuizQuestions', () => {
    it('should return empty array when no events', () => {
      const result = generateQuizQuestions([], { count: 5 });
      expect(result).toHaveLength(0);
    });

    it('should return empty array when no battles', () => {
      const result = generateQuizQuestions([nonBattleEvent], { count: 5 });
      expect(result).toHaveLength(0);
    });

    it('should return requested number of questions (up to available)', () => {
      const result = generateQuizQuestions(richBattleEvents, { count: 3 });
      expect(result.length).toBeLessThanOrEqual(3);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should filter by specified question types', () => {
      const result = generateQuizQuestions(richBattleEvents, { count: 5, types: ['result'] });
      result.forEach(q => {
        expect(q.type).toBe('result');
      });
    });

    it('should have 4 options per question for result/terrain/scale types', () => {
      // commander questions can have fewer options when unique commanders are limited
      const result = generateQuizQuestions(richBattleEvents, { count: 10, types: ['result', 'terrain', 'scale'] });
      result.forEach(q => {
        expect(q.options).toHaveLength(4);
      });
    });

    it('should have valid correctIndex within options range', () => {
      const result = generateQuizQuestions(richBattleEvents, { count: 5 });
      result.forEach(q => {
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(q.options.length);
      });
    });

    it('should include i18n question and explanation keys', () => {
      const result = generateQuizQuestions(richBattleEvents, { count: 1 });
      expect(result[0]!.questionKey).toBeTruthy();
      expect(result[0]!.explanationKey).toBeTruthy();
    });

    it('should apply difficulty from config', () => {
      const result = generateQuizQuestions(richBattleEvents, { count: 1, difficulty: 'hard' });
      expect(result[0]!.difficulty).toBe('hard');
    });

    it('should return unique question ids', () => {
      const result = generateQuizQuestions(richBattleEvents, { count: 5 });
      const ids = result.map(q => q.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should include battle data in each question', () => {
      const result = generateQuizQuestions(richBattleEvents, { count: 1 });
      expect(result[0]!.battle).toBeTruthy();
    });

    it('should include questionArgs with battle title', () => {
      const result = generateQuizQuestions(richBattleEvents, { count: 1 });
      expect(result[0]!.questionArgs?.battle).toBeTruthy();
    });

    it('should generate commander questions when commanders available', () => {
      const result = generateQuizQuestions(richBattleEvents, { count: 10, types: ['commander'] });
      expect(result.length).toBeGreaterThan(0);
      result.forEach(q => expect(q.type).toBe('commander'));
    });

    it('should generate result questions with proper result labels', () => {
      const result = generateQuizQuestions(richBattleEvents, { count: 10, types: ['result'] });
      expect(result.length).toBeGreaterThan(0);
      result.forEach(q => {
        expect(q.type).toBe('result');
        expect(q.options.every(o => typeof o === 'string')).toBe(true);
      });
    });

    it('should generate terrain questions with terrain labels', () => {
      const result = generateQuizQuestions(richBattleEvents, { count: 10, types: ['terrain'] });
      expect(result.length).toBeGreaterThan(0);
      result.forEach(q => {
        expect(q.type).toBe('terrain');
        expect(q.options.every(o => o.startsWith('quiz.terrain.'))).toBe(true);
      });
    });

    it('should generate scale questions with scale labels', () => {
      const result = generateQuizQuestions(richBattleEvents, { count: 10, types: ['scale'] });
      expect(result.length).toBeGreaterThan(0);
      result.forEach(q => {
        expect(q.type).toBe('scale');
        expect(q.options.every(o => o.startsWith('quiz.scale.'))).toBe(true);
      });
    });
  });
});
