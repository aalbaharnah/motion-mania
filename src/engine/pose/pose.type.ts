export interface PoseLandmark {
    x: number;
    y: number;
    confidence: number;
}

// MoveNet always returns 17 keypoints; this array is expected to be length 17.
export type PoseLandmarks = PoseLandmark[];

export interface PoseFrame {
    landmarks: PoseLandmarks;
    timestamp: number;
}

export interface BodyBounds {
    center_x: number;
    center_y: number;
    width: number;
    height: number;
}
