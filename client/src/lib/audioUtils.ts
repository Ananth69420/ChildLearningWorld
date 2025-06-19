export class AudioManager {
  private static instance: AudioManager;
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private enabled: boolean = true;

  private constructor() {
    // Initialize with simple audio using Web Audio API or basic HTML5 audio
    this.initializeSounds();
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  private initializeSounds() {
    // Create simple beep sounds using Web Audio API
    this.createBeepSound('correct', 523.25, 0.2); // C5 note
    this.createBeepSound('incorrect', 261.63, 0.3); // C4 note
    this.createBeepSound('click', 440, 0.1); // A4 note
    this.createBeepSound('coin', 659.25, 0.15); // E5 note
    this.createBeepSound('levelup', 783.99, 0.5); // G5 note
  }

  private createBeepSound(name: string, frequency: number, duration: number) {
    // Create a simple beep using Web Audio API
    const audio = new Audio();
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const createBeep = () => {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration);
      
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + duration);
    };

    // Store the beep creation function
    (audio as any).play = createBeep;
    this.sounds[name] = audio;
  }

  public play(soundName: string) {
    if (!this.enabled) return;
    
    try {
      const sound = this.sounds[soundName];
      if (sound && sound.play) {
        sound.play();
      }
    } catch (error) {
      console.warn('Could not play sound:', soundName, error);
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }
}

export const audioManager = AudioManager.getInstance();
