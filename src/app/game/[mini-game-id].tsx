import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Touchable from '@/components/touchable';
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
        <SafeAreaView className='flex-1 bg-white'>
            <View className='flex-1 items-center justify-center gap-4'>
                <Text className='text-8xl leading-normal'>{meta.emoji}</Text>
                <Text className='text-3xl  font-bold'>{meta.name}</Text>
                <Text className='text-[#4677FF]'>{is_known_game ? 'Coming Soon' : 'Mini-game not found'}</Text>
                <Touchable className='bg-[#141428] py-2 px-4 rounded-2xl' onPress={handle_back}>
                    <Text className='text-white font-bold text-lg'>← Back to Lobby</Text>
                </Touchable>
            </View>
        </SafeAreaView>
    );
}
