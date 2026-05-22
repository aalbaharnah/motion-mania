import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function GameLayout() {
    return (
        <>
            <StatusBar hidden />
            <Stack screenOptions={{ headerShown: false }} />
        </>
    );
}
