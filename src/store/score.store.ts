import { create } from 'zustand';

import type { ScoreStore } from '@/store/score.type';

const INITIAL_LIVES = 3;
const COMBO_THRESHOLD_LEVEL_1 = 5;
const COMBO_THRESHOLD_LEVEL_2 = 10;
const COMBO_THRESHOLD_LEVEL_3 = 20;

function getComboMultiplier(combo: number): number {
  if (combo >= COMBO_THRESHOLD_LEVEL_3) {
    return 4;
  }
  if (combo >= COMBO_THRESHOLD_LEVEL_2) {
    return 3;
  }
  if (combo >= COMBO_THRESHOLD_LEVEL_1) {
    return 2;
  }
  return 1;
}

const INITIAL_SCORE_STATE = {
  score: 0,
  combo: 0,
  combo_multiplier: 1,
  lives: INITIAL_LIVES,
  high_score: 0,
};

export const useScoreStore = create<ScoreStore>((set) => ({
  ...INITIAL_SCORE_STATE,

  addScore: (base) => {
    set((state) => {
      const score_delta = Math.max(0, Math.floor(base)) * state.combo_multiplier;
      const next_score = state.score + score_delta;
      return {
        score: next_score,
        high_score: Math.max(state.high_score, next_score),
      };
    });
  },

  incrementCombo: () => {
    set((state) => {
      const next_combo = state.combo + 1;
      return {
        combo: next_combo,
        combo_multiplier: getComboMultiplier(next_combo),
      };
    });
  },

  resetCombo: () => {
    set({ combo: 0, combo_multiplier: 1 });
  },

  decrementLife: () => {
    set((state) => ({ lives: Math.max(0, state.lives - 1) }));
  },

  resetScore: () => {
    set((state) => ({
      ...INITIAL_SCORE_STATE,
      high_score: state.high_score,
    }));
  },
}));
