import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    cancelAnimation,
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';

interface CountdownProps {
    is_visible: boolean;
    start_from?: number;
    on_complete?: () => void;
}

export function Countdown({ is_visible, start_from = 3, on_complete }: CountdownProps) {
    const [countdown_value, set_countdown_value] = useState(start_from);
    const scale_value = useSharedValue(1);

    useEffect(() => {
        if (!is_visible) {
            return;
        }

        set_countdown_value(start_from);
        const interval_id = setInterval(() => {
            set_countdown_value((previous) => {
                if (previous <= 1) {
                    clearInterval(interval_id);
                    on_complete?.();
                    return 0;
                }
                return previous - 1;
            });
        }, 1000);

        return () => clearInterval(interval_id);
    }, [is_visible, start_from, on_complete]);

    useEffect(() => {
        if (!is_visible || countdown_value <= 0) {
            cancelAnimation(scale_value);
            return;
        }

        scale_value.value = withRepeat(
            withTiming(1.12, {
                duration: 460,
                easing: Easing.out(Easing.cubic),
            }),
            -1,
            true,
        );

        return () => {
            cancelAnimation(scale_value);
        };
    }, [countdown_value, is_visible, scale_value]);

    const animated_style = useAnimatedStyle(() => ({
        transform: [{ scale: scale_value.value }],
    }));

    if (!is_visible) {
        return null;
    }

    return (
        <View pointerEvents="none" style={styles.container}>
            {countdown_value > 0 ? (
                <Animated.View style={animated_style}>
                    <Text style={styles.count_text}>{countdown_value}</Text>
                </Animated.View>
            ) : (
                <Text style={styles.go_text}>GO!</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
    count_text: {
        fontSize: 118,
        color: '#FFFFFF',
        fontWeight: '900',
        textShadowColor: 'rgba(0, 0, 0, 0.45)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 12,
    },
    go_text: {
        fontSize: 96,
        color: '#6CFF9E',
        fontWeight: '900',
        textShadowColor: 'rgba(0, 0, 0, 0.45)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 12,
    },
});
