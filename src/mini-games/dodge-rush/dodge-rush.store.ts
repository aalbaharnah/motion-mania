import { create } from 'zustand';

import type { DodgeRushState, Obstacle } from '@/mini-games/dodge-rush/dodge-rush.type';

interface DodgeRushActions {
    setObstacles: (obstacles: Obstacle[]) => void;
    spawnObstacle: (obstacle: Obstacle) => void;
    removeObstacle: (obstacle_id: string) => void;
    setSpawnInterval: (spawn_interval_ms: number) => void;
    setLastSpawnMs: (last_spawn_ms: number) => void;
    applyNearMiss: () => void;
    decrementLife: () => void;
    resetDodgeRush: () => void;
}

export type DodgeRushStore = DodgeRushState & DodgeRushActions;

const INITIAL_STATE: DodgeRushState = {
    obstacles: [],
    lives: 3,
    near_miss_count: 0,
    last_spawn_ms: 0,
    spawn_interval_ms: 2000,
};

export const useDodgeRushStore = create<DodgeRushStore>((set) => ({
    ...INITIAL_STATE,

    setObstacles: (obstacles) => {
        set({ obstacles });
    },

    spawnObstacle: (obstacle) => {
        set((state) => ({ obstacles: [...state.obstacles, obstacle] }));
    },

    removeObstacle: (obstacle_id) => {
        set((state) => ({
            obstacles: state.obstacles.filter((obstacle) => obstacle.id !== obstacle_id),
        }));
    },

    setSpawnInterval: (spawn_interval_ms) => {
        set({ spawn_interval_ms: Math.max(400, Math.floor(spawn_interval_ms)) });
    },

    setLastSpawnMs: (last_spawn_ms) => {
        set({ last_spawn_ms: Math.max(0, Math.floor(last_spawn_ms)) });
    },

    applyNearMiss: () => {
        set((state) => ({ near_miss_count: state.near_miss_count + 1 }));
    },

    decrementLife: () => {
        set((state) => ({ lives: Math.max(0, state.lives - 1) }));
    },

    resetDodgeRush: () => {
        set(INITIAL_STATE);
    },
}));
