import { useCallback, useEffect, useRef, useState } from 'react';

const MAX_DELTA_MS = 100;

type TickCallback = (delta_ms: number, elapsed_ms: number) => void;

export interface GameLoopControls {
    start: () => void;
    stop: () => void;
    isPaused: boolean;
}

export function useGameLoop(tick: TickCallback): GameLoopControls {
    const frame_ref = useRef<number | null>(null);
    const start_time_ref = useRef<number>(0);
    const prev_time_ref = useRef<number>(0);
    const tick_ref = useRef<TickCallback>(tick);
    const [isPaused, set_is_paused] = useState(true);

    useEffect(() => {
        tick_ref.current = tick;
    }, [tick]);

    const stop = useCallback(() => {
        if (frame_ref.current != null) {
            cancelAnimationFrame(frame_ref.current);
            frame_ref.current = null;
        }
        set_is_paused(true);
    }, []);

    const loop = useCallback((timestamp: number) => {
        const elapsed_ms = timestamp - start_time_ref.current;
        const raw_delta = timestamp - prev_time_ref.current;
        const delta_ms = Math.min(raw_delta, MAX_DELTA_MS);

        prev_time_ref.current = timestamp;
        tick_ref.current(delta_ms, elapsed_ms);
        frame_ref.current = requestAnimationFrame(loop);
    }, []);

    const start = useCallback(() => {
        if (frame_ref.current != null) {
            return;
        }

        set_is_paused(false);
        const now = performance.now();
        start_time_ref.current = now;
        prev_time_ref.current = now;
        frame_ref.current = requestAnimationFrame(loop);
    }, [loop]);

    useEffect(() => stop, [stop]);

    return {
        start,
        stop,
        isPaused,
    };
}
