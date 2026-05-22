import { Text, View } from 'react-native';

export default function ScoreHudBox({ label, value }: { label?: string; value?: string | number }) {
    return (
        <View className='bg-[rgba(0,0,0,0.3)] border-[rgba(255,255,255,0.3)] border rounded-3xl px-4 py-2 min-w-[80px]'>
            <Text className='text-white text-lg font-bold'>{label}</Text>
            <Text className='text-white'>{value}</Text>
        </View>
    );
}