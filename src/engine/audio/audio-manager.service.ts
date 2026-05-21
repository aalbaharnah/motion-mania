import {
    createAudioPlayer,
    setAudioModeAsync,
    setIsAudioActiveAsync,
    type AudioPlayer,
    type AudioSource,
} from 'expo-audio';

class AudioManagerService {
    private _players: Set<AudioPlayer> = new Set();
    private _is_initialized = false;

    public async initialize(): Promise<void> {
        if (this._is_initialized) {
            return;
        }

        await setAudioModeAsync({
            playsInSilentMode: true,
            shouldPlayInBackground: false,
            interruptionMode: 'mixWithOthers',
        });

        await setIsAudioActiveAsync(true);
        this._is_initialized = true;
    }

    public async setAudioEnabled(is_enabled: boolean): Promise<void> {
        await setIsAudioActiveAsync(is_enabled);
    }

    public playSfx(source: AudioSource, volume = 1): void {
        const player = createAudioPlayer(source);
        player.volume = Math.max(0, Math.min(1, volume));
        player.play();

        this._players.add(player);

        const status_subscription = player.addListener('playbackStatusUpdate', (status) => {
            if (!status.isLoaded || status.didJustFinish) {
                status_subscription.remove();
                this._players.delete(player);
                player.remove();
            }
        });
    }

    public stopAll(): void {
        for (const player of this._players) {
            player.pause();
            player.remove();
        }
        this._players.clear();
    }
}

export const audio_manager = new AudioManagerService();
