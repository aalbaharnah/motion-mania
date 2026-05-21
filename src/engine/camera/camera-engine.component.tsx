import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
    Camera,
    useCameraDevice,
    useCameraPermission,
    useSkiaFrameProcessor,
} from 'react-native-vision-camera';
import { useResizePlugin } from 'vision-camera-resize-plugin';

import type { PoseTrackerState } from '@/engine/camera/use-pose-tracker.hook';
import { runPoseInference } from '@/engine/pose/pose-detector.service';

const MOVENET_INPUT_SIZE = 192;

interface CameraEngineProps {
    pose_tracker: PoseTrackerState;
}

export function CameraEngine({ pose_tracker }: CameraEngineProps) {
    const device = useCameraDevice('front');
    const { hasPermission, requestPermission } = useCameraPermission();
    const { resize } = useResizePlugin();
    const { boxed_model, pose_shared_value, is_model_ready, model_error } = pose_tracker;

    useEffect(() => {
        if (!hasPermission) {
            requestPermission();
        }
    }, [hasPermission, requestPermission]);

    const frame_processor = useSkiaFrameProcessor(
        (frame) => {
            'worklet';

            frame.render();

            const model = boxed_model?.unbox();
            if (model == null) {
                return;
            }

            const resized_buffer = resize(frame, {
                scale: { width: MOVENET_INPUT_SIZE, height: MOVENET_INPUT_SIZE },
                pixelFormat: 'rgb',
                dataType: 'uint8',
            });

            const pose_frame = runPoseInference(model, resized_buffer, Date.now());
            if (pose_frame != null) {
                pose_shared_value.value = pose_frame;
            }
        },
        [boxed_model, pose_shared_value, resize],
    );

    if (!hasPermission) {
        return (
            <View style={styles.centered}>
                <Text style={styles.message}>Camera permission is required</Text>
                <Pressable onPress={requestPermission} style={styles.button}>
                    <Text style={styles.button_text}>Grant Permission</Text>
                </Pressable>
            </View>
        );
    }

    if (model_error != null) {
        return (
            <View style={styles.centered}>
                <Text style={styles.message}>Failed to load pose model</Text>
            </View>
        );
    }

    if (device == null || !is_model_ready) {
        return (
            <View style={styles.centered}>
                <Text style={styles.message}>Preparing camera...</Text>
            </View>
        );
    }

    return (
        <Camera
            device={device}
            isActive
            style={StyleSheet.absoluteFill}
            pixelFormat="yuv"
            frameProcessor={frame_processor}
        />
    );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0A0A1A',
        gap: 16,
    },
    message: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    button: {
        backgroundColor: '#4444FF',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    button_text: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
});
