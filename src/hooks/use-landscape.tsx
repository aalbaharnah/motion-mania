import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect, useState } from "react";

export default function useLandscape() {
    const [loaded, setLoaded] = useState(false);

    const lock_landscape = async () => {
        try {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        } catch (error) {
            console.error('Failed to lock screen orientation:', error);
        } finally {
            setLoaded(true);
        }

    };

    useEffect(() => {
        lock_landscape();
    }, []);

    return loaded;
}