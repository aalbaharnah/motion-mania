import type { PoseFrame } from '@/engine/pose/pose.type';
import type { SmackTarget } from '@/mini-games/smack-attack/smack-attack.type';
import type { GameDifficulty } from '@/store/game.store';

const LEFT_WRIST_INDEX = 9;
const RIGHT_WRIST_INDEX = 10;
const DEFAULT_HAND_RADIUS = 34;

function randomBetween(min_value: number, max_value: number): number {
    return min_value + Math.random() * (max_value - min_value);
}

function getDifficultyFactor(difficulty: GameDifficulty): number {
    switch (difficulty) {
        case 'easy':
            return 0.88;
        case 'hard':
            return 1.22;
        default:
            return 1;
    }
}

export function spawnTarget(screen_w: number, screen_h: number, difficulty: GameDifficulty): SmackTarget {
    const difficulty_factor = getDifficultyFactor(difficulty);
    const radius = randomBetween(28, 56);
    const margin = radius + 18;
    const min_x = margin;
    const max_x = Math.max(margin, screen_w - margin);
    const min_y = margin + 72;
    const max_y = Math.max(min_y, screen_h - margin - 60);

    const is_bonus = Math.random() < 0.18;
    const base_ttl = is_bonus ? 1100 : 1700;

    return {
        id: `${Date.now()}-${Math.round(Math.random() * 1_000_000)}`,
        x: randomBetween(min_x, max_x),
        y: randomBetween(min_y, max_y),
        radius,
        ttl_ms: Math.round(base_ttl / difficulty_factor),
        value: is_bonus ? 55 : 25,
        color: is_bonus ? '#FFD76A' : '#6CFF9E',
    };
}

export function getSpawnInterval(elapsed_ms: number): number {
    const start_ms = 1200;
    const end_ms = 360;
    const ramp_duration_ms = 55_000;
    const progress = Math.min(1, Math.max(0, elapsed_ms / ramp_duration_ms));
    return Math.round(start_ms - (start_ms - end_ms) * progress);
}

export function updateTargets(targets: SmackTarget[], delta_ms: number): SmackTarget[] {
    return targets
        .map((target) => ({
            ...target,
            ttl_ms: target.ttl_ms - delta_ms,
        }))
        .filter((target) => target.ttl_ms > 0);
}

export function getExpiredTargets(previous: SmackTarget[], next: SmackTarget[]): SmackTarget[] {
    const active_ids = new Set(next.map((target) => target.id));
    return previous.filter((target) => !active_ids.has(target.id));
}

export function getWristPoints(frame: PoseFrame | null, screen_w: number, screen_h: number): Array<{ x: number; y: number }> {
    if (frame == null) {
        return [];
    }

    const wrists = [frame.landmarks[LEFT_WRIST_INDEX], frame.landmarks[RIGHT_WRIST_INDEX]].filter(
        (landmark) => landmark != null && landmark.confidence >= 0.2,
    );

    return wrists.map((landmark) => ({
        x: landmark.x * screen_w,
        y: landmark.y * screen_h,
    }));
}

export function isTargetHit(target: SmackTarget, hand_x: number, hand_y: number): boolean {
    const dx = hand_x - target.x;
    const dy = hand_y - target.y;
    const distance_sq = dx * dx + dy * dy;
    const threshold = target.radius + DEFAULT_HAND_RADIUS;
    return distance_sq <= threshold * threshold;
}
