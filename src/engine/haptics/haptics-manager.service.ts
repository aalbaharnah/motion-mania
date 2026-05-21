import {
    AndroidHaptics,
    ImpactFeedbackStyle,
    NotificationFeedbackType,
    impactAsync,
    notificationAsync,
    performAndroidHapticsAsync,
    selectionAsync,
} from 'expo-haptics';
import { Platform } from 'react-native';

class HapticsManagerService {
    private _is_enabled = true;

    public setEnabled(is_enabled: boolean): void {
        this._is_enabled = is_enabled;
    }

    public async triggerSelection(): Promise<void> {
        if (!this._is_enabled) {
            return;
        }
        await selectionAsync();
    }

    public async triggerHit(): Promise<void> {
        if (!this._is_enabled) {
            return;
        }
        await impactAsync(ImpactFeedbackStyle.Medium);
    }

    public async triggerMiss(): Promise<void> {
        if (!this._is_enabled) {
            return;
        }

        if (Platform.OS === 'android') {
            await performAndroidHapticsAsync(AndroidHaptics.Reject);
            return;
        }

        await notificationAsync(NotificationFeedbackType.Warning);
    }

    public async triggerSuccess(): Promise<void> {
        if (!this._is_enabled) {
            return;
        }
        await notificationAsync(NotificationFeedbackType.Success);
    }

    public async triggerGameOver(): Promise<void> {
        if (!this._is_enabled) {
            return;
        }
        await notificationAsync(NotificationFeedbackType.Error);
    }
}

export const haptics_manager = new HapticsManagerService();
