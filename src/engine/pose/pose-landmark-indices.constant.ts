export const NOSE = 0;
export const LEFT_EYE = 1;
export const RIGHT_EYE = 2;
export const LEFT_EAR = 3;
export const RIGHT_EAR = 4;
export const LEFT_SHOULDER = 5;
export const RIGHT_SHOULDER = 6;
export const LEFT_ELBOW = 7;
export const RIGHT_ELBOW = 8;
export const LEFT_WRIST = 9;
export const RIGHT_WRIST = 10;
export const LEFT_HIP = 11;
export const RIGHT_HIP = 12;
export const LEFT_KNEE = 13;
export const RIGHT_KNEE = 14;
export const LEFT_ANKLE = 15;
export const RIGHT_ANKLE = 16;

export const TORSO_LANDMARKS = [LEFT_SHOULDER, RIGHT_SHOULDER, LEFT_HIP, RIGHT_HIP] as const;

export const UPPER_BODY_LANDMARKS = [
    NOSE,
    LEFT_EYE,
    RIGHT_EYE,
    LEFT_EAR,
    RIGHT_EAR,
    LEFT_SHOULDER,
    RIGHT_SHOULDER,
    LEFT_ELBOW,
    RIGHT_ELBOW,
    LEFT_WRIST,
    RIGHT_WRIST,
] as const;
