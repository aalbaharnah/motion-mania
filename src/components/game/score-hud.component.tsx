import { View } from 'react-native';

import { useGameStore } from '@/store/game.store';
import { useScoreStore } from '@/store/score.store';
import ScoreHudBox from './score-hud-box.component';

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
        <View pointerEvents="none" className='absolute top-4 left-0 right-0 flex-row justify-between px-8'>
            <View className='flex-row gap-1'>
                <ScoreHudBox label='SCORE' value={score} />
                <ScoreHudBox label='COMBO' value={`${combo} x${combo_multiplier}`} />
            </View>

            <View className='flex-row gap-1'>
                <ScoreHudBox label='LIVES' value={'❤️'.repeat(Math.max(0, lives))} />
                <ScoreHudBox label='TIME' value={formatSeconds(elapsed_ms)} />
            </View>
        </View>
    );
}
