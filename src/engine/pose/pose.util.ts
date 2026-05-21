import type { BodyBounds, PoseFrame, PoseLandmark } from '@/engine/pose/pose.type';

const DEFAULT_MIN_CONFIDENCE = 0.2;

export function getBodyBounds(
    frame: PoseFrame,
    screen_w: number,
    screen_h: number,
    padding_factor = 1.5,
    min_confidence = DEFAULT_MIN_CONFIDENCE,
): BodyBounds | null {
    const valid_landmarks = frame.landmarks.filter((landmark) => landmark.confidence >= min_confidence);
    if (valid_landmarks.length === 0) {
        return null;
    }

    let min_x = Number.POSITIVE_INFINITY;
    let min_y = Number.POSITIVE_INFINITY;
    let max_x = Number.NEGATIVE_INFINITY;
    let max_y = Number.NEGATIVE_INFINITY;

    for (const landmark of valid_landmarks) {
        const pixel_x = landmark.x * screen_w;
        const pixel_y = landmark.y * screen_h;
        min_x = Math.min(min_x, pixel_x);
        min_y = Math.min(min_y, pixel_y);
        max_x = Math.max(max_x, pixel_x);
        max_y = Math.max(max_y, pixel_y);
    }

    const width = (max_x - min_x) * padding_factor;
    const height = (max_y - min_y) * padding_factor;
    const center_x = (min_x + max_x) / 2;
    const center_y = (min_y + max_y) / 2;

    return { center_x, center_y, width, height };
}

export function getLandmarkDistance(a: PoseLandmark, b: PoseLandmark): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

export function normalizeLandmark(
    landmark: PoseLandmark,
    screen_w: number,
    screen_h: number,
): PoseLandmark {
    return {
        x: landmark.x / screen_w,
        y: landmark.y / screen_h,
        confidence: landmark.confidence,
    };
}

export function computePoseSimilarity(target: PoseFrame, detected: PoseFrame): number {
    const length = Math.min(target.landmarks.length, detected.landmarks.length);
    if (length === 0) {
        return 0;
    }

    let distance_total = 0;
    let confidence_total = 0;

    for (let index = 0; index < length; index += 1) {
        const target_landmark = target.landmarks[index];
        const detected_landmark = detected.landmarks[index];
        const confidence = Math.min(target_landmark.confidence, detected_landmark.confidence);
        confidence_total += confidence;
        distance_total += getLandmarkDistance(target_landmark, detected_landmark) * confidence;
    }

    if (confidence_total === 0) {
        return 0;
    }

    const average_distance = distance_total / confidence_total;
    // Convert distance to similarity in [0..1].
    return Math.max(0, 1 - average_distance);
}
