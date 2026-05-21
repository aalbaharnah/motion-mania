import { Canvas, Circle, Rect } from '@shopify/react-native-skia';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import {
    runOnJS,
    useAnimatedReaction,
    useDerivedValue,
    type SharedValue,
} from 'react-native-reanimated';

import type { PoseFrame } from '@/engine/pose/pose.type';
import { getBodyBounds } from '@/engine/pose/pose.util';

interface GameOverlayProps {
    pose_shared_value: SharedValue<PoseFrame | null>;
    show_landmarks?: boolean;
    show_body_bounds?: boolean;
}

export function GameOverlay({
    pose_shared_value,
    show_landmarks = true,
    show_body_bounds = true,
}: GameOverlayProps) {
    const { width: screen_w, height: screen_h } = useWindowDimensions();
    const [pose_frame, set_pose_frame] = useState<PoseFrame | null>(null);

    const derived_pose = useDerivedValue(() => {
        return pose_shared_value.value;
    }, [pose_shared_value]);

    useAnimatedReaction(
        () => derived_pose.value,
        (next_pose) => {
            runOnJS(set_pose_frame)(next_pose);
        },
        [derived_pose],
    );

    const body_bounds = useMemo(() => {
        if (pose_frame == null) {
            return null;
        }
        return getBodyBounds(pose_frame, screen_w, screen_h);
    }, [pose_frame, screen_w, screen_h]);

    useEffect(() => {
        return () => {
            set_pose_frame(null);
        };
    }, []);

    return (
        <View pointerEvents="none" style={styles.container}>
            <Canvas style={StyleSheet.absoluteFill}>
                {show_landmarks
                    && pose_frame?.landmarks.map((landmark, index) => (
                        <Circle
                            key={`${index}-${landmark.confidence.toFixed(3)}`}
                            cx={landmark.x * screen_w}
                            cy={landmark.y * screen_h}
                            r={Math.max(2, landmark.confidence * 8)}
                            color="rgba(108, 255, 158, 0.9)"
                        />
                    ))}

                {show_body_bounds && body_bounds != null && (
                    <Rect
                        x={body_bounds.center_x - body_bounds.width / 2}
                        y={body_bounds.center_y - body_bounds.height / 2}
                        width={body_bounds.width}
                        height={body_bounds.height}
                        color="rgba(136, 170, 255, 0.25)"
                    />
                )}
            </Canvas>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
    },
});
