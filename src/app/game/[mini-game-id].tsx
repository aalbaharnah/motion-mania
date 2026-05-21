import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DodgeRushScreen } from '@/mini-games/dodge-rush/dodge-rush.screen';
import { SmackAttackScreen } from '@/mini-games/smack-attack/smack-attack.screen';
import { useGameStore } from '@/store/game.store';

const GAME_META: Record<string, { name: string; emoji: string }> = {
    'dodge-rush': { name: 'Dodge Rush', emoji: '🏃' },
    'smack-attack': { name: 'Smack Attack', emoji: '👋' },
    'pose-panic': { name: 'Pose Panic', emoji: '🧍' },
    'dance-madness': { name: 'Dance Madness', emoji: '💃' },
    'balance-chaos': { name: 'Balance Chaos', emoji: '⚖️' },
};

export default function MiniGameScreen() {
    const set_active_game = useGameStore((state) => state.setActiveGame);
    const set_game_phase = useGameStore((state) => state.setGamePhase);
    const { 'mini-game-id': mini_game_id } = useLocalSearchParams<{ 'mini-game-id': string }>();

    const game_key = mini_game_id ?? '';
    const is_known_game = game_key in GAME_META;
    const meta = GAME_META[game_key] ?? { name: 'Unknown', emoji: '❓' };

    useEffect(() => {
        if (is_known_game) {
            set_active_game(game_key);
            set_game_phase('idle');
        }

        return () => {
            set_active_game(null);
            set_game_phase('idle');
        };
    }, [game_key, is_known_game, set_active_game, set_game_phase]);

    const handle_back = () => {
        set_active_game(null);
        set_game_phase('idle');
        router.back();
    };

    if (mini_game_id === 'dodge-rush') {
        return <DodgeRushScreen />;
    }

    if (mini_game_id === 'smack-attack') {
        return <SmackAttackScreen />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.emoji}>{meta.emoji}</Text>
                <Text style={styles.name}>{meta.name}</Text>
                <Text style={styles.label}>{is_known_game ? 'Coming Soon' : 'Mini-game not found'}</Text>
                <Pressable style={styles.back_btn} onPress={handle_back}>
                    <Text style={styles.back_text}>← Back to Lobby</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A0A1A' },
    content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
    emoji: { fontSize: 72 },
    name: { fontSize: 32, fontWeight: '900', color: '#FFFFFF', letterSpacing: 2 },
    label: { fontSize: 18, color: '#88AAFF' },
    back_btn: {
        marginTop: 24,
        backgroundColor: '#141428',
        borderRadius: 12,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#1E1E3C',
    },
    back_text: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
});
