import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MINI_GAMES = [
  { id: 'dodge-rush', name: 'Dodge Rush', emoji: '🏃', description: 'Dodge flying obstacles with your body!', ready: true },
  { id: 'smack-attack', name: 'Smack Attack', emoji: '👋', description: 'Slap the creatures before they escape!', ready: false },
  { id: 'pose-panic', name: 'Pose Panic', emoji: '🧍', description: 'Strike the pose before time runs out!', ready: false },
  { id: 'dance-madness', name: 'Dance Madness', emoji: '💃', description: 'Match the moves to the beat!', ready: false },
  { id: 'balance-chaos', name: 'Balance Chaos', emoji: '⚖️', description: 'Stay inside the moving zones!', ready: false },
] as const;

export default function LobbyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MOVE MANIA</Text>
        <Text style={styles.subtitle}>🎮 Party Game</Text>
      </View>
      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {MINI_GAMES.map((game) => (
          <Pressable
            key={game.id}
            style={({ pressed }) => [styles.card, pressed && styles.card_pressed]}
            onPress={() => router.push(`/game/${game.id}` as any)}
          >
            <Text style={styles.card_emoji}>{game.emoji}</Text>
            <View style={styles.card_text}>
              <Text style={styles.card_name}>{game.name}</Text>
              <Text style={styles.card_desc}>{game.description}</Text>
            </View>
            {game.ready && (
              <View style={styles.ready_badge}>
                <Text style={styles.ready_text}>PLAY</Text>
              </View>
            )}
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A1A' },
  header: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 24 },
  title: { fontSize: 48, fontWeight: '900', color: '#FFFFFF', letterSpacing: 6 },
  subtitle: { fontSize: 18, color: '#88AAFF', marginTop: 6 },
  grid: { paddingHorizontal: 20, paddingBottom: 40, gap: 16 },
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
  ready_badge: {
    backgroundColor: '#4444FF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  ready_text: { color: '#FFFFFF', fontWeight: '800', fontSize: 13, letterSpacing: 1 },
});

