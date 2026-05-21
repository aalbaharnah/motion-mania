import { useMemo } from 'react';
import { Platform } from 'react-native';
import {
    type TensorflowModelDelegate,
    type TfliteModel,
    useTensorflowModel,
} from 'react-native-fast-tflite';

import type { PoseFrame, PoseLandmark } from '@/engine/pose/pose.type';

const MOVENET_MODEL_SOURCE = require('../../../assets/models/movenet-lightning.tflite');
const MOVENET_KEYPOINT_COUNT = 17;
const MOVENET_VALUES_PER_KEYPOINT = 3;

function getPreferredDelegates(): TensorflowModelDelegate[] {
    if (Platform.OS === 'ios') {
        return ['core-ml'];
    }
    return ['android-gpu'];
}

function ensureArrayBuffer(input: Uint8Array): ArrayBuffer {
    const buffer = input.buffer;
    if (buffer instanceof ArrayBuffer) {
        return buffer;
    }
    return input.slice().buffer;
}

export function usePoseDetectorModel() {
    const delegates = useMemo(getPreferredDelegates, []);
    return useTensorflowModel(MOVENET_MODEL_SOURCE, delegates);
}

export function runPoseInference(
    model: TfliteModel,
    resized_buffer: Uint8Array,
    timestamp = Date.now(),
): PoseFrame | null {
    const output_buffers = model.runSync([ensureArrayBuffer(resized_buffer)]);
    const first_output = output_buffers[0];
    if (first_output == null) {
        return null;
    }

    const result_data = new Float32Array(first_output);
    const required_values = MOVENET_KEYPOINT_COUNT * MOVENET_VALUES_PER_KEYPOINT;
    if (result_data.length < required_values) {
        return null;
    }

    const landmarks: PoseLandmark[] = [];
    for (let index = 0; index < MOVENET_KEYPOINT_COUNT; index += 1) {
        const offset = index * MOVENET_VALUES_PER_KEYPOINT;

        // MoveNet output order is [y, x, confidence].
        const y_norm = result_data[offset] ?? 0;
        const x_norm = result_data[offset + 1] ?? 0;
        const confidence = result_data[offset + 2] ?? 0;

        landmarks.push({
            x: Number.isFinite(x_norm) ? x_norm : 0,
            y: Number.isFinite(y_norm) ? y_norm : 0,
            confidence: Number.isFinite(confidence) ? confidence : 0,
        });
    }

    return {
        landmarks,
        timestamp,
    };
}
