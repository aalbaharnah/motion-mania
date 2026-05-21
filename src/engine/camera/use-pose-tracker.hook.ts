import { useMemo } from 'react';
import type { TfliteModel } from 'react-native-fast-tflite';
import { NitroModules } from 'react-native-nitro-modules';
import { useSharedValue } from 'react-native-reanimated';

import { usePoseDetectorModel } from '@/engine/pose/pose-detector.service';
import type { PoseFrame } from '@/engine/pose/pose.type';

type BoxedTfliteModel = { unbox: () => TfliteModel };

export interface PoseTrackerState {
    pose_shared_value: ReturnType<typeof useSharedValue<PoseFrame | null>>;
    pose_model: TfliteModel | undefined;
    boxed_model: BoxedTfliteModel | null;
    is_model_ready: boolean;
    model_error: Error | undefined;
}

export function usePoseTracker(): PoseTrackerState {
    const pose_shared_value = useSharedValue<PoseFrame | null>(null);
    const model_plugin = usePoseDetectorModel();
    const pose_model = model_plugin.state === 'loaded' ? model_plugin.model : undefined;
    const model_error = model_plugin.state === 'error' ? model_plugin.error : undefined;

    const boxed_model = useMemo<BoxedTfliteModel | null>(() => {
        if (pose_model == null) {
            return null;
        }
        return NitroModules.box(pose_model);
    }, [pose_model]);

    return {
        pose_shared_value,
        pose_model,
        boxed_model,
        is_model_ready: model_plugin.state === 'loaded' && pose_model != null,
        model_error,
    };
}
