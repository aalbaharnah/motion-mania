import { create } from 'zustand';

export type GamePhase = 'idle' | 'countdown' | 'playing' | 'paused' | 'gameover';
export type GameDifficulty = 'easy' | 'normal' | 'hard';

export interface GameState {
  active_game: string | null;
  game_phase: GamePhase;
  elapsed_ms: number;
  difficulty: GameDifficulty;
}

export interface GameActions {
  setActiveGame: (game_id: string | null) => void;
  setGamePhase: (phase: GamePhase) => void;
  setElapsedMs: (elapsed_ms: number) => void;
  incrementElapsedMs: (delta_ms: number) => void;
  setDifficulty: (difficulty: GameDifficulty) => void;
  resetGameState: () => void;
}

export type GameStore = GameState & GameActions;

const INITIAL_GAME_STATE: GameState = {
  active_game: null,
  game_phase: 'idle',
  elapsed_ms: 0,
  difficulty: 'normal',
};

export const useGameStore = create<GameStore>((set) => ({
  ...INITIAL_GAME_STATE,

  setActiveGame: (game_id) => {
    set({ active_game: game_id });
  },

  setGamePhase: (phase) => {
    set({ game_phase: phase });
  },

  setElapsedMs: (elapsed_ms) => {
    set({ elapsed_ms: Math.max(0, Math.floor(elapsed_ms)) });
  },

  incrementElapsedMs: (delta_ms) => {
    set((state) => ({
      elapsed_ms: Math.max(0, state.elapsed_ms + Math.floor(delta_ms)),
    }));
  },

  setDifficulty: (difficulty) => {
    set({ difficulty });
  },

  resetGameState: () => {
    set(INITIAL_GAME_STATE);
  },
}));
