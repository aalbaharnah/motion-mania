export interface ScoreState {
    score: number;
    combo: number;
    combo_multiplier: number;
    lives: number;
    high_score: number;
}

export interface ScoreActions {
    addScore: (base: number) => void;
    incrementCombo: () => void;
    resetCombo: () => void;
    decrementLife: () => void;
    resetScore: () => void;
}

export type ScoreStore = ScoreState & ScoreActions;
