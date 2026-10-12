// Web Speech API and Web Audio Sound Effects Service

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private soundEnabled: boolean = true;
  private audioCtx: AudioContext | null = null;
  private isSpeaking: boolean = false;
  private speakingListeners: Set<(speaking: boolean) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public getSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public isSpeechSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public subscribeSpeaking(listener: (speaking: boolean) => void): () => void {
    this.speakingListeners.add(listener);
    listener(this.isSpeaking);
    return () => this.speakingListeners.delete(listener);
  }

  private notifySpeaking(speaking: boolean) {
    this.isSpeaking = speaking;
    this.speakingListeners.forEach((fn) => fn(speaking));
  }

  public speak(text: string, langCode: string = 'en-US'): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.synth || !this.soundEnabled) {
        resolve(false);
        return;
      }

      try {
        // Cancel any pending speech
        this.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9; // Slightly slower for language learners
        utterance.pitch = 1.0;

        // Try to find matching voice for target language
        if (this.voices.length === 0) {
          this.voices = this.synth.getVoices();
        }

        const voicePrefix = langCode.slice(0, 2).toLowerCase();
        const matchedVoice = this.voices.find(
          (v) => v.lang.toLowerCase().startsWith(voicePrefix) || v.lang.toLowerCase().replace('_', '-').startsWith(langCode.toLowerCase())
        );

        if (matchedVoice) {
          utterance.voice = matchedVoice;
          utterance.lang = matchedVoice.lang;
        } else {
          utterance.lang = langCode;
        }

        this.notifySpeaking(true);

        utterance.onend = () => {
          this.notifySpeaking(false);
          resolve(true);
        };

        utterance.onerror = () => {
          this.notifySpeaking(false);
          resolve(false);
        };

        this.synth.speak(utterance);
      } catch (err) {
        console.warn('Speech synthesis error:', err);
        this.notifySpeaking(false);
        resolve(false);
      }
    });
  }

  // Web Audio Chimes & Feedback
  private getAudioContext(): AudioContext | null {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public playFlipSound() {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Ignore audio synthesis errors
    }
  }

  public playCorrectSound() {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // Ignore audio errors
    }
  }

  public playWrongSound() {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now); // A3
      osc.frequency.setValueAtTime(180, now + 0.12);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Ignore audio errors
    }
  }

  public playCompletionFanfare() {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = ctx.currentTime + i * 0.09;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.3);
      });
    } catch {
      // Ignore audio errors
    }
  }
}

export const speechService = new SpeechService();
