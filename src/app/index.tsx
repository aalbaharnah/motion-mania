import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MiniGameCard } from '@/components/ui/mini-game-card.component';

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
          <MiniGameCard
            key={game.id}
            name={game.name}
            emoji={game.emoji}
            description={game.description}
            is_ready={game.ready}
            on_press={() => router.push(`/game/${game.id}` as any)}
          />
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
});

