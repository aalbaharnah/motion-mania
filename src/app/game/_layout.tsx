import { Stack } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

export default function GameLayout() {
    useEffect(() => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        return () => {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
        };
    }, []);

    return (
        <>
            <StatusBar hidden />
            <Stack screenOptions={{ headerShown: false }} />
        </>
    );
}
