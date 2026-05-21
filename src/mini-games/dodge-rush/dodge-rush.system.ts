import type { BodyBounds } from '@/engine/pose/pose.type';
import type { Obstacle } from '@/mini-games/dodge-rush/dodge-rush.type';
import type { GameDifficulty } from '@/store/game.store';

const LANE_COUNT = 3;
const MIN_OBSTACLE_WIDTH = 86;
const MAX_OBSTACLE_WIDTH = 128;
const OBSTACLE_HEIGHT_RATIO = 0.24;

function randomBetween(min_value: number, max_value: number): number {
    return min_value + Math.random() * (max_value - min_value);
}

function getDifficultyFactor(difficulty: GameDifficulty): number {
    switch (difficulty) {
        case 'easy':
            return 0.85;
        case 'hard':
            return 1.2;
        default:
            return 1;
    }
}

export function spawnObstacle(screen_w: number, screen_h: number, difficulty: GameDifficulty): Obstacle {
    const difficulty_factor = getDifficultyFactor(difficulty);
    const lane = Math.floor(Math.random() * LANE_COUNT);
    const lane_height = screen_h / LANE_COUNT;

    const width = randomBetween(MIN_OBSTACLE_WIDTH, MAX_OBSTACLE_WIDTH);
    const height = lane_height * OBSTACLE_HEIGHT_RATIO;
    const y_center = lane_height * lane + lane_height / 2;

    // Speed in px/ms, equivalent to 0.3..0.8 of screen width per second.
    const min_speed = (0.3 * screen_w) / 1000;
    const max_speed = (0.8 * screen_w) / 1000;
    const speed = randomBetween(min_speed, max_speed) * difficulty_factor;

    return {
        id: `${Date.now()}-${Math.round(Math.random() * 1_000_000)}`,
        x: screen_w + width,
        y: y_center - height / 2,
        width,
        height,
        speed,
        lane,
    };
}

export function updateObstacles(obstacles: Obstacle[], delta_ms: number, screen_w: number): Obstacle[] {
    return obstacles
        .map((obstacle) => ({
            ...obstacle,
            x: obstacle.x - obstacle.speed * delta_ms,
        }))
        .filter((obstacle) => obstacle.x + obstacle.width > -screen_w * 0.2);
}

export function checkNearMiss(obstacle: Obstacle, body_bounds: BodyBounds): boolean {
    const body_left = body_bounds.center_x - body_bounds.width / 2;
    const body_right = body_bounds.center_x + body_bounds.width / 2;
    const body_top = body_bounds.center_y - body_bounds.height / 2;
    const body_bottom = body_bounds.center_y + body_bounds.height / 2;

    const obstacle_right = obstacle.x + obstacle.width;
    const obstacle_top = obstacle.y;
    const obstacle_bottom = obstacle.y + obstacle.height;

    const has_passed = obstacle_right < body_left;
    const vertical_overlap = obstacle_top < body_bottom && obstacle_bottom > body_top;
    const horizontal_gap = body_left - obstacle_right;

    return has_passed && vertical_overlap && horizontal_gap < 44 && obstacle_right > body_left - 70;
}

export function getSpawnInterval(elapsed_ms: number): number {
    const start_ms = 2000;
    const end_ms = 400;
    const ramp_duration_ms = 45_000;
    const progress = Math.min(1, Math.max(0, elapsed_ms / ramp_duration_ms));
    return Math.round(start_ms - (start_ms - end_ms) * progress);
}
