import { MiniGameCard } from '@/components/ui/mini-game-card.component';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const MINI_GAMES = [
  { id: 'dodge-rush', name: 'Dodge Rush', emoji: '🏃', description: 'Dodge flying obstacles with your body!', ready: true },
  { id: 'smack-attack', name: 'Smack Attack', emoji: '👋', description: 'Slap the creatures before they escape!', ready: true },
  { id: 'pose-panic', name: 'Pose Panic', emoji: '🧍', description: 'Strike the pose before time runs out!', ready: false },
  { id: 'dance-madness', name: 'Dance Madness', emoji: '💃', description: 'Match the moves to the beat!', ready: false },
  { id: 'balance-chaos', name: 'Balance Chaos', emoji: '⚖️', description: 'Stay inside the moving zones!', ready: false },
] as const;

export default function LobbyScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white flex-row">
      <View className="flex items-start p-4">
        <Text>🎮 Party Game</Text>
        <Text className='text-4xl font-bold'>MOVE MANIA</Text>
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
  grid: { paddingHorizontal: 20, paddingVertical: 18, gap: 16 },
});

