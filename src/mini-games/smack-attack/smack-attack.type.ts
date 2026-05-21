export interface SmackTarget {
    id: string;
    x: number;
    y: number;
    radius: number;
    ttl_ms: number;
    value: number;
    color: string;
}

export interface SmackAttackState {
    targets: SmackTarget[];
    last_spawn_ms: number;
    spawn_interval_ms: number;
    hit_count: number;
    miss_count: number;
}
