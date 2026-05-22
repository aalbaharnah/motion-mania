import * as Haptics from 'expo-haptics';
import { Pressable, PressableProps, StyleSheet } from 'react-native';

export default function Touchable({ style, ...props }: PressableProps) {

    const onPressIn = () => {
        Haptics.selectionAsync();
    }

    return (
        <Pressable
            style={({ pressed }) => [style ? { ...style } : null, pressed && styles.pressed]}
            onPressIn={onPressIn}
            {...props}
        />
    );
}

const styles = StyleSheet.create({
    pressed: {
        opacity: 0.75,
        transform: [{ scale: 0.97 }],
    }
});