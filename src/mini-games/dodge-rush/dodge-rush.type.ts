export interface Obstacle {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    lane: number;
}

export interface DodgeRushState {
    obstacles: Obstacle[];
    lives: number;
    near_miss_count: number;
    last_spawn_ms: number;
    spawn_interval_ms: number;
}
