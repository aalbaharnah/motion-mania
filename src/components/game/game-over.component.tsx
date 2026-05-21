import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useGameStore } from '@/store/game.store';
import { useScoreStore } from '@/store/score.store';

interface GameOverProps {
    is_visible: boolean;
    on_restart: () => void;
    on_exit: () => void;
}

export function GameOver({ is_visible, on_restart, on_exit }: GameOverProps) {
    const score = useScoreStore((state) => state.score);
    const high_score = useScoreStore((state) => state.high_score);
    const active_game = useGameStore((state) => state.active_game);

    if (!is_visible) {
        return null;
    }

    return (
        <View style={styles.overlay}>
            <View style={styles.modal}>
                <Text style={styles.title}>GAME OVER</Text>
                <Text style={styles.subtitle}>{active_game ?? 'mini-game'}</Text>

                <View style={styles.stats_row}>
                    <View style={styles.stat_card}>
                        <Text style={styles.stat_label}>SCORE</Text>
                        <Text style={styles.stat_value}>{score}</Text>
                    </View>
                    <View style={styles.stat_card}>
                        <Text style={styles.stat_label}>BEST</Text>
                        <Text style={styles.stat_value}>{high_score}</Text>
                    </View>
                </View>

                <View style={styles.buttons_row}>
                    <Pressable style={[styles.button, styles.restart_button]} onPress={on_restart}>
                        <Text style={styles.button_text}>Restart</Text>
                    </Pressable>
                    <Pressable style={[styles.button, styles.exit_button]} onPress={on_exit}>
                        <Text style={styles.button_text}>Exit</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(8, 8, 20, 0.72)',
        padding: 20,
    },
    modal: {
        width: '100%',
        maxWidth: 520,
        backgroundColor: '#131327',
        borderColor: '#2B2B4A',
        borderWidth: 1,
        borderRadius: 20,
        padding: 20,
        gap: 16,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 36,
        fontWeight: '900',
        letterSpacing: 1,
        textAlign: 'center',
    },
    subtitle: {
        color: '#88AAFF',
        fontSize: 15,
        textAlign: 'center',
        textTransform: 'capitalize',
    },
    stats_row: {
        flexDirection: 'row',
        gap: 10,
    },
    stat_card: {
        flex: 1,
        borderRadius: 12,
        backgroundColor: '#1B1B35',
        paddingVertical: 12,
        paddingHorizontal: 14,
    },
    stat_label: {
        color: '#88AAFF',
        fontSize: 12,
        fontWeight: '700',
    },
    stat_value: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '800',
        marginTop: 4,
    },
    buttons_row: {
        flexDirection: 'row',
        gap: 10,
    },
    button: {
        flex: 1,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    restart_button: {
        backgroundColor: '#4444FF',
    },
    exit_button: {
        backgroundColor: '#2E2E45',
    },
    button_text: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
    },
});
