// Web Audio API ambient audio synthesizer for Catholic Devotional Screensaver
// Zero external assets required — pure browser audio synthesis!

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private organNodes: { osc: OscillatorNode; gain: GainNode }[] = [];
  private currentVolume: number = 0.25;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.currentVolume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.currentVolume, this.ctx.currentTime, 0.1);
    }
  }

  public startOrgan() {
    this.initCtx();
    if (!this.ctx) return;
    if (this.isPlaying) return;

    this.isPlaying = true;

    // Master gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(this.currentVolume, this.ctx.currentTime + 3);

    // Warm Low Pass Filter (Cathderal reverb simulation)
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(420, this.ctx.currentTime);
    filter.Q.setValueAtTime(2, this.ctx.currentTime);

    filter.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);

    // Sacred Cathedral Organ Chord (A minor Ninth / Open Fifth: A2, E3, A3, C4, E4)
    const frequencies = [110.0, 164.81, 220.0, 261.63, 329.63, 440.0];

    frequencies.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      // Organ rank mixing: combination of sine and soft triangle
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Subtle warm detune LFO effect for organ pipe realism
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.2 + i * 0.05, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(1.5, this.ctx.currentTime);
      lfo.connect(osc.frequency);
      lfo.start();

      // Volume proportional to octave
      const vol = (1 / (i + 1)) * 0.25;
      oscGain.gain.setValueAtTime(vol, this.ctx.currentTime);

      osc.connect(oscGain);
      oscGain.connect(filter);

      osc.start();
      this.organNodes.push({ osc, gain: oscGain });
    });
  }

  public stopOrgan() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;

    // Fade out over 2.5 seconds
    this.masterGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 2.5);

    setTimeout(() => {
      this.organNodes.forEach(node => {
        try {
          node.osc.stop();
          node.osc.disconnect();
        } catch {
          // Ignore
        }
      });
      this.organNodes = [];
      this.isPlaying = false;
    }, 2500);
  }

  public playSanctuaryBell(pitchMultiplier: number = 1.0) {
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const baseFreq = 220 * pitchMultiplier; // Low deep church bell

    // Master bell gain
    const bellGain = this.ctx.createGain();
    bellGain.gain.setValueAtTime(0, now);
    bellGain.gain.linearRampToValueAtTime(0.35 * this.currentVolume, now + 0.05);
    bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 7.0); // 7 second long decay!

    bellGain.connect(this.ctx.destination);

    // Bell harmomics ratios (Inharmonic strike & hum tones)
    const harmonics = [
      { ratio: 0.5, gain: 0.6, type: 'sine' as OscillatorType },  // Hum tone
      { ratio: 1.0, gain: 1.0, type: 'sine' as OscillatorType },  // Prime tone
      { ratio: 1.2, gain: 0.7, type: 'sine' as OscillatorType },  // Minor third
      { ratio: 1.5, gain: 0.5, type: 'sine' as OscillatorType },  // Fifth
      { ratio: 2.0, gain: 0.4, type: 'triangle' as OscillatorType }, // Octave
      { ratio: 2.76, gain: 0.3, type: 'sine' as OscillatorType }, // High strike
      { ratio: 3.2, gain: 0.2, type: 'sine' as OscillatorType },
    ];

    harmonics.forEach(h => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();

      osc.type = h.type;
      osc.frequency.setValueAtTime(baseFreq * h.ratio, now);

      g.gain.setValueAtTime(h.gain, now);
      // High harmonics decay faster
      g.gain.exponentialRampToValueAtTime(0.0001, now + 7.0 / (h.ratio * 0.8));

      osc.connect(g);
      g.connect(bellGain);

      osc.start(now);
      osc.stop(now + 7.2);
    });
  }

  public toggleOrgan(): boolean {
    if (this.isPlaying) {
      this.stopOrgan();
      return false;
    } else {
      this.startOrgan();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const ambientAudio = new AmbientAudioEngine();
