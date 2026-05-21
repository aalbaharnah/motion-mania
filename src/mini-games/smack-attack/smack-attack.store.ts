import { create } from 'zustand';

import type { SmackAttackState, SmackTarget } from '@/mini-games/smack-attack/smack-attack.type';

interface SmackAttackActions {
    setTargets: (targets: SmackTarget[]) => void;
    spawnTarget: (target: SmackTarget) => void;
    removeTarget: (target_id: string) => void;
    setSpawnInterval: (spawn_interval_ms: number) => void;
    setLastSpawnMs: (last_spawn_ms: number) => void;
    applyHit: () => void;
    applyMiss: () => void;
    resetSmackAttack: () => void;
}

export type SmackAttackStore = SmackAttackState & SmackAttackActions;

const INITIAL_STATE: SmackAttackState = {
    targets: [],
    last_spawn_ms: 0,
    spawn_interval_ms: 1200,
    hit_count: 0,
    miss_count: 0,
};

export const useSmackAttackStore = create<SmackAttackStore>((set) => ({
    ...INITIAL_STATE,

    setTargets: (targets) => {
        set({ targets });
    },

    spawnTarget: (target) => {
        set((state) => ({ targets: [...state.targets, target] }));
    },

    removeTarget: (target_id) => {
        set((state) => ({ targets: state.targets.filter((target) => target.id !== target_id) }));
    },

    setSpawnInterval: (spawn_interval_ms) => {
        set({ spawn_interval_ms: Math.max(350, Math.floor(spawn_interval_ms)) });
    },

    setLastSpawnMs: (last_spawn_ms) => {
        set({ last_spawn_ms: Math.max(0, Math.floor(last_spawn_ms)) });
    },

    applyHit: () => {
        set((state) => ({ hit_count: state.hit_count + 1 }));
    },

    applyMiss: () => {
        set((state) => ({ miss_count: state.miss_count + 1 }));
    },

    resetSmackAttack: () => {
        set(INITIAL_STATE);
    },
}));
