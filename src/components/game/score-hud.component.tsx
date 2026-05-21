import { StyleSheet, Text, View } from 'react-native';

import { useGameStore } from '@/store/game.store';
import { useScoreStore } from '@/store/score.store';

function formatSeconds(milliseconds: number): string {
    const total_seconds = Math.max(0, Math.floor(milliseconds / 1000));
    const minutes = Math.floor(total_seconds / 60);
    const seconds = total_seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function ScoreHud() {
    const score = useScoreStore((state) => state.score);
    const combo = useScoreStore((state) => state.combo);
    const combo_multiplier = useScoreStore((state) => state.combo_multiplier);
    const lives = useScoreStore((state) => state.lives);
    const elapsed_ms = useGameStore((state) => state.elapsed_ms);

    return (
        <View pointerEvents="none" style={styles.container}>
            <View style={styles.left_group}>
                <View style={styles.panel}>
                    <Text style={styles.label}>SCORE</Text>
                    <Text style={styles.value}>{score}</Text>
                </View>
                <View style={styles.panel}>
                    <Text style={styles.label}>COMBO</Text>
                    <Text style={styles.value}>{combo} x{combo_multiplier}</Text>
                </View>
            </View>

            <View style={styles.right_group}>
                <View style={styles.panel}>
                    <Text style={styles.label}>LIVES</Text>
                    <Text style={styles.value}>{'❤️'.repeat(Math.max(0, lives))}</Text>
                </View>
                <View style={styles.panel}>
                    <Text style={styles.label}>TIME</Text>
                    <Text style={styles.value}>{formatSeconds(elapsed_ms)}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    left_group: {
        flexDirection: 'row',
        gap: 8,
    },
    right_group: {
        flexDirection: 'row',
        gap: 8,
    },
    panel: {
        backgroundColor: 'rgba(10, 10, 26, 0.72)',
        borderColor: 'rgba(255, 255, 255, 0.12)',
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        minWidth: 96,
    },
    label: {
        color: '#88AAFF',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.8,
    },
    value: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '800',
        marginTop: 2,
    },
});
