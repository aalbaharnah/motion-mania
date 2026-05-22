import { Text, View } from 'react-native';
import Touchable from '../touchable';

interface MiniGameCardProps {
    name: string;
    emoji: string;
    description: string;
    is_ready: boolean;
    on_press: () => void;
}

export function MiniGameCard({ name, emoji, description, is_ready, on_press }: MiniGameCardProps) {
    return (
        <Touchable className='bg-[#e6ecff] rounded-3xl p-4 flex-row items-center gap-4' onPress={on_press}>
            <Text className='text-2xl'>{emoji}</Text>
            <View className='flex-1 flex-col '>
                <Text className='text-xl font-semibold'>{name}</Text>
                <Text className='text-sm'>{description}</Text>
            </View>

            <View className={`px-4 py-2 rounded-2xl ${is_ready ? 'bg-blue-500' : 'bg-gray-500'}`}>
                <Text className='text-white text-sm font-bold'>{is_ready ? 'PLAY' : 'SOON'}</Text>
            </View>
        </Touchable>


    );
}
