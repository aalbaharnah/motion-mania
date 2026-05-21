import { router } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';

import { Countdown } from '@/components/game/countdown.component';
import { GameOver } from '@/components/game/game-over.component';
import { GameOverlay } from '@/components/game/game-overlay.component';
import { ScoreHud } from '@/components/game/score-hud.component';
import { CameraEngine } from '@/engine/camera/camera-engine.component';
import { usePoseTracker } from '@/engine/camera/use-pose-tracker.hook';
import { rectsOverlap } from '@/engine/collision/collision-detector.util';
import { useGameLoop } from '@/engine/game-loop/use-game-loop.hook';
import { haptics_manager } from '@/engine/haptics/haptics-manager.service';
import { getBodyBounds } from '@/engine/pose/pose.util';
import { useDodgeRushStore } from '@/mini-games/dodge-rush/dodge-rush.store';
import { checkNearMiss, getSpawnInterval, spawnObstacle, updateObstacles } from '@/mini-games/dodge-rush/dodge-rush.system';
import { useGameStore } from '@/store/game.store';
import { useScoreStore } from '@/store/score.store';

export function DodgeRushScreen() {
    const { width: screen_w, height: screen_h } = useWindowDimensions();
    const pose_tracker = usePoseTracker();

    const game_phase = useGameStore((state) => state.game_phase);
    const difficulty = useGameStore((state) => state.difficulty);
    const set_game_phase = useGameStore((state) => state.setGamePhase);
    const set_elapsed_ms = useGameStore((state) => state.setElapsedMs);
    const increment_elapsed_ms = useGameStore((state) => state.incrementElapsedMs);

    const score_lives = useScoreStore((state) => state.lives);
    const add_score = useScoreStore((state) => state.addScore);
    const increment_combo = useScoreStore((state) => state.incrementCombo);
    const reset_combo = useScoreStore((state) => state.resetCombo);
    const decrement_score_life = useScoreStore((state) => state.decrementLife);
    const reset_score = useScoreStore((state) => state.resetScore);

    const obstacles = useDodgeRushStore((state) => state.obstacles);
    const near_miss_count = useDodgeRushStore((state) => state.near_miss_count);
    const spawn_interval_ms = useDodgeRushStore((state) => state.spawn_interval_ms);
    const last_spawn_ms = useDodgeRushStore((state) => state.last_spawn_ms);
    const set_obstacles = useDodgeRushStore((state) => state.setObstacles);
    const add_obstacle = useDodgeRushStore((state) => state.spawnObstacle);
    const set_last_spawn_ms = useDodgeRushStore((state) => state.setLastSpawnMs);
    const set_spawn_interval = useDodgeRushStore((state) => state.setSpawnInterval);
    const apply_near_miss = useDodgeRushStore((state) => state.applyNearMiss);
    const decrement_dodge_life = useDodgeRushStore((state) => state.decrementLife);
    const reset_dodge_rush = useDodgeRushStore((state) => state.resetDodgeRush);

    const handled_obstacle_ids_ref = useRef<Set<string>>(new Set());

    const tick = useCallback((delta_ms: number, elapsed_ms: number) => {
        if (game_phase !== 'playing') {
            return;
        }

        increment_elapsed_ms(delta_ms);
        set_spawn_interval(getSpawnInterval(elapsed_ms));

        if (elapsed_ms - last_spawn_ms >= spawn_interval_ms) {
            add_obstacle(spawnObstacle(screen_w, screen_h, difficulty));
            set_last_spawn_ms(elapsed_ms);
        }

        const updated_obstacles = updateObstacles(obstacles, delta_ms, screen_w);
        const pose_frame = pose_tracker.pose_shared_value.value;
        const body = pose_frame == null ? null : getBodyBounds(pose_frame, screen_w, screen_h);
        let should_reset_combo = false;

        if (body != null) {
            const body_rect = {
                x: body.center_x - body.width / 2,
                y: body.center_y - body.height / 2,
                width: body.width,
                height: body.height,
            };

            for (const obstacle of updated_obstacles) {
                if (handled_obstacle_ids_ref.current.has(obstacle.id)) {
                    continue;
                }

                const obstacle_rect = {
                    x: obstacle.x,
                    y: obstacle.y,
                    width: obstacle.width,
                    height: obstacle.height,
                };

                if (rectsOverlap(obstacle_rect, body_rect)) {
                    handled_obstacle_ids_ref.current.add(obstacle.id);
                    decrement_dodge_life();
                    decrement_score_life();
                    should_reset_combo = true;
                    haptics_manager.triggerMiss();
                    continue;
                }

                if (checkNearMiss(obstacle, body)) {
                    handled_obstacle_ids_ref.current.add(obstacle.id);
                    apply_near_miss();
                    increment_combo();
                    add_score(25);
                    haptics_manager.triggerHit();
                }
            }
        }

        if (should_reset_combo) {
            reset_combo();
        }

        set_obstacles(updated_obstacles);
    }, [
        add_obstacle,
        add_score,
        apply_near_miss,
        decrement_dodge_life,
        decrement_score_life,
        difficulty,
        game_phase,
        increment_combo,
        increment_elapsed_ms,
        last_spawn_ms,
        obstacles,
        reset_combo,
        screen_h,
        screen_w,
        set_last_spawn_ms,
        set_obstacles,
        set_spawn_interval,
        spawn_interval_ms,
    ]);

    const game_loop = useGameLoop(tick);

    useEffect(() => {
        set_game_phase('countdown');
        set_elapsed_ms(0);
        reset_score();
        reset_dodge_rush();
        handled_obstacle_ids_ref.current.clear();
        return () => {
            game_loop.stop();
            set_game_phase('idle');
        };
    }, [game_loop, reset_dodge_rush, reset_score, set_elapsed_ms, set_game_phase]);

    useEffect(() => {
        if (score_lives <= 0 && game_phase !== 'gameover') {
            game_loop.stop();
            set_game_phase('gameover');
            haptics_manager.triggerGameOver();
        }
    }, [game_loop, game_phase, score_lives, set_game_phase]);

    const handle_countdown_complete = () => {
        set_game_phase('playing');
        game_loop.start();
    };

    const handle_restart = () => {
        game_loop.stop();
        set_game_phase('countdown');
        set_elapsed_ms(0);
        reset_score();
        reset_dodge_rush();
        handled_obstacle_ids_ref.current.clear();
    };

    const handle_exit = () => {
        game_loop.stop();
        router.back();
    };

    return (
        <View style={styles.container}>
            <CameraEngine pose_tracker={pose_tracker} />

            <View pointerEvents="none" style={StyleSheet.absoluteFill}>
                {obstacles.map((obstacle) => (
                    <View
                        key={obstacle.id}
                        style={[
                            styles.obstacle,
                            {
                                width: obstacle.width,
                                height: obstacle.height,
                                transform: [{ translateX: obstacle.x }, { translateY: obstacle.y }],
                            },
                        ]}
                    />
                ))}
            </View>

            <GameOverlay pose_shared_value={pose_tracker.pose_shared_value} />
            <ScoreHud />
            <Countdown
                is_visible={game_phase === 'countdown'}
                start_from={3}
                on_complete={handle_countdown_complete}
            />
            <GameOver
                is_visible={game_phase === 'gameover'}
                on_restart={handle_restart}
                on_exit={handle_exit}
            />

            <Pressable onPress={handle_exit} style={styles.exit_button}>
                <View>
                    <View style={styles.exit_icon_bar} />
                    <View style={styles.exit_icon_bar} />
                </View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#080814',
    },
    obstacle: {
        position: 'absolute',
        backgroundColor: '#FF6B6B',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FFD4D4',
    },
    exit_button: {
        position: 'absolute',
        top: 18,
        right: 18,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.45)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    exit_icon_bar: {
        width: 14,
        height: 2,
        backgroundColor: '#FFFFFF',
        marginVertical: 2,
    },
});
