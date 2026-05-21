import { Pressable, StyleSheet, Text, View } from 'react-native';

interface MiniGameCardProps {
    name: string;
    emoji: string;
    description: string;
    is_ready: boolean;
    on_press: () => void;
}

export function MiniGameCard({ name, emoji, description, is_ready, on_press }: MiniGameCardProps) {
    return (
        <Pressable style={({ pressed }) => [styles.card, pressed && styles.card_pressed]} onPress={on_press}>
            <Text style={styles.card_emoji}>{emoji}</Text>
            <View style={styles.card_text}>
                <Text style={styles.card_name}>{name}</Text>
                <Text style={styles.card_desc}>{description}</Text>
            </View>
            <View style={[styles.badge, is_ready ? styles.badge_ready : styles.badge_soon]}>
                <Text style={styles.badge_text}>{is_ready ? 'PLAY' : 'SOON'}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#141428',
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1E1E3C',
        gap: 16,
    },
    card_pressed: { opacity: 0.75, transform: [{ scale: 0.97 }] },
    card_emoji: { fontSize: 44 },
    card_text: { flex: 1, gap: 4 },
    card_name: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
    card_desc: { fontSize: 13, color: '#6666AA', lineHeight: 18 },
    badge: {
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },
    badge_ready: { backgroundColor: '#4444FF' },
    badge_soon: { backgroundColor: '#31314D' },
    badge_text: { color: '#FFFFFF', fontWeight: '800', fontSize: 13, letterSpacing: 1 },
});
