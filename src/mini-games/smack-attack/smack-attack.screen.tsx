import { router } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { Countdown } from '@/components/game/countdown.component';
import { GameOver } from '@/components/game/game-over.component';
import { GameOverlay } from '@/components/game/game-overlay.component';
import { ScoreHud } from '@/components/game/score-hud.component';
import { CameraEngine } from '@/engine/camera/camera-engine.component';
import { usePoseTracker } from '@/engine/camera/use-pose-tracker.hook';
import { useGameLoop } from '@/engine/game-loop/use-game-loop.hook';
import { haptics_manager } from '@/engine/haptics/haptics-manager.service';
import {
    getExpiredTargets,
    getSpawnInterval,
    getWristPoints,
    isTargetHit,
    spawnTarget,
    updateTargets,
} from '@/mini-games/smack-attack/smack-attack.system';
import { useSmackAttackStore } from '@/mini-games/smack-attack/smack-attack.store';
import { useGameStore } from '@/store/game.store';
import { useScoreStore } from '@/store/score.store';

export function SmackAttackScreen() {
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

    const targets = useSmackAttackStore((state) => state.targets);
    const spawn_interval_ms = useSmackAttackStore((state) => state.spawn_interval_ms);
    const last_spawn_ms = useSmackAttackStore((state) => state.last_spawn_ms);
    const set_targets = useSmackAttackStore((state) => state.setTargets);
    const add_target = useSmackAttackStore((state) => state.spawnTarget);
    const set_last_spawn_ms = useSmackAttackStore((state) => state.setLastSpawnMs);
    const set_spawn_interval = useSmackAttackStore((state) => state.setSpawnInterval);
    const apply_hit = useSmackAttackStore((state) => state.applyHit);
    const apply_miss = useSmackAttackStore((state) => state.applyMiss);
    const reset_smack_attack = useSmackAttackStore((state) => state.resetSmackAttack);

    const tick = useCallback((delta_ms: number, elapsed_ms: number) => {
        if (game_phase !== 'playing') {
            return;
        }

        increment_elapsed_ms(delta_ms);
        set_spawn_interval(getSpawnInterval(elapsed_ms));

        if (elapsed_ms - last_spawn_ms >= spawn_interval_ms) {
            add_target(spawnTarget(screen_w, screen_h, difficulty));
            set_last_spawn_ms(elapsed_ms);
        }

        const next_targets = updateTargets(targets, delta_ms);
        const expired_targets = getExpiredTargets(targets, next_targets);
        if (expired_targets.length > 0) {
            apply_miss();
            decrement_score_life();
            reset_combo();
            haptics_manager.triggerMiss();
        }

        const wrists = getWristPoints(pose_tracker.pose_shared_value.value, screen_w, screen_h);
        if (wrists.length === 0) {
            set_targets(next_targets);
            return;
        }

        const hit_ids = new Set<string>();
        let score_delta = 0;
        for (const target of next_targets) {
            const is_hit = wrists.some((wrist) => isTargetHit(target, wrist.x, wrist.y));
            if (!is_hit) {
                continue;
            }
            hit_ids.add(target.id);
            score_delta += target.value;
        }

        if (hit_ids.size > 0) {
            for (let index = 0; index < hit_ids.size; index += 1) {
                increment_combo();
            }
            add_score(score_delta);
            apply_hit();
            haptics_manager.triggerHit();
        }

        set_targets(next_targets.filter((target) => !hit_ids.has(target.id)));
    }, [
        add_score,
        add_target,
        apply_hit,
        apply_miss,
        decrement_score_life,
        difficulty,
        game_phase,
        increment_combo,
        increment_elapsed_ms,
        last_spawn_ms,
        pose_tracker.pose_shared_value,
        reset_combo,
        screen_h,
        screen_w,
        set_last_spawn_ms,
        set_spawn_interval,
        set_targets,
        spawn_interval_ms,
        targets,
    ]);

    const game_loop = useGameLoop(tick);

    useEffect(() => {
        set_game_phase('countdown');
        set_elapsed_ms(0);
        reset_score();
        reset_smack_attack();
        return () => {
            game_loop.stop();
            set_game_phase('idle');
        };
    }, [game_loop, reset_score, reset_smack_attack, set_elapsed_ms, set_game_phase]);

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
        reset_smack_attack();
    };

    const handle_exit = () => {
        game_loop.stop();
        router.back();
    };

    return (
        <View style={styles.container}>
            <CameraEngine pose_tracker={pose_tracker} />

            <View pointerEvents="none" style={StyleSheet.absoluteFill}>
                {targets.map((target) => {
                    const life_ratio = Math.max(0, Math.min(1, target.ttl_ms / 1700));
                    return (
                        <View
                            key={target.id}
                            style={[
                                styles.target,
                                {
                                    width: target.radius * 2,
                                    height: target.radius * 2,
                                    borderRadius: target.radius,
                                    left: target.x - target.radius,
                                    top: target.y - target.radius,
                                    backgroundColor: target.color,
                                    opacity: 0.3 + life_ratio * 0.7,
                                    transform: [{ scale: 0.8 + life_ratio * 0.4 }],
                                },
                            ]}
                        >
                            <Text style={styles.target_text}>+{target.value}</Text>
                        </View>
                    );
                })}
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
    target: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.55)',
    },
    target_text: {
        color: '#0A0A1A',
        fontSize: 14,
        fontWeight: '900',
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
