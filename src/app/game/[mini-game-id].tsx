import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Phase 6: import DodgeRushScreen from '@/mini-games/dodge-rush/dodge-rush.screen';

const GAME_META: Record<string, { name: string; emoji: string }> = {
    'dodge-rush': { name: 'Dodge Rush', emoji: '🏃' },
    'smack-attack': { name: 'Smack Attack', emoji: '👋' },
    'pose-panic': { name: 'Pose Panic', emoji: '🧍' },
    'dance-madness': { name: 'Dance Madness', emoji: '💃' },
    'balance-chaos': { name: 'Balance Chaos', emoji: '⚖️' },
};

export default function MiniGameScreen() {
    const { 'mini-game-id': mini_game_id } = useLocalSearchParams<{ 'mini-game-id': string }>();

    // Phase 6: if (mini_game_id === 'dodge-rush') return <DodgeRushScreen />;

    const meta = GAME_META[mini_game_id ?? ''] ?? { name: 'Unknown', emoji: '❓' };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.emoji}>{meta.emoji}</Text>
                <Text style={styles.name}>{meta.name}</Text>
                <Text style={styles.label}>Coming Soon</Text>
                <Pressable style={styles.back_btn} onPress={() => router.back()}>
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
