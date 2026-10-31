import { CALM_TRACKS } from './calmTracks';

class AudioEngine {
  private audioCtx: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNodes: GainNode[] = [];
  private masterGain: GainNode | null = null;
  private lfo: OscillatorNode | null = null;
  public isPlaying: boolean = false;
  public activeTrackId: string = 'calm_01_tamil_breath';

  public play(trackId?: string) {
    if (trackId && trackId !== this.activeTrackId) {
      this.stop();
      this.activeTrackId = trackId;
    }

    const track = CALM_TRACKS.find(t => t.id === this.activeTrackId) || CALM_TRACKS[0];
    this.isPlaying = true;

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!this.audioCtx && AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }

      if (this.audioCtx) {
        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume();
        }
        this.stopOscillators();

        const now = this.audioCtx.currentTime;

        // Master gain with smooth Apple-style damped curve to clear audible level (0.32)
        const master = this.audioCtx.createGain();
        master.gain.setValueAtTime(0.001, now);
        master.gain.exponentialRampToValueAtTime(0.32, now + 0.8);

        // Lowpass filter for warm, soothing, non-fatiguing acoustic tone
        const filter = this.audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now);

        master.connect(filter);
        filter.connect(this.audioCtx.destination);
        this.masterGain = master;

        // Harmonic frequencies tailored to raga / binaural frequencies
        const base = track.baseFreq || 432;
        // Sub-bass fundamental, root, harmonic fifth (Pa), octave (Tar Sa), and gentle third
        const harmonics = [
          { freq: base * 0.5, gain: 0.22, type: 'sine' as OscillatorType },
          { freq: base, gain: 0.28, type: 'sine' as OscillatorType },
          { freq: base * 1.5, gain: 0.16, type: 'triangle' as OscillatorType }, // Natural fifth
          { freq: base * 2.0, gain: 0.10, type: 'sine' as OscillatorType }  // Upper octave
        ];

        harmonics.forEach(({ freq, gain, type }) => {
          if (!this.audioCtx) return;
          const osc = this.audioCtx.createOscillator();
          const oscGain = this.audioCtx.createGain();

          osc.type = type;
          // Very slight chorus detune for lush acoustic warmth
          const detuneCents = (Math.random() - 0.5) * 4;
          osc.frequency.setValueAtTime(freq, now);
          osc.detune.setValueAtTime(detuneCents, now);

          oscGain.gain.setValueAtTime(gain, now);
          osc.connect(oscGain);
          oscGain.connect(master);

          osc.start(now);
          this.oscillators.push(osc);
          this.gainNodes.push(oscGain);
        });

        // Gentle breathing LFO (0.12Hz = ~5-sec calm breath cycle)
        const lfoOsc = this.audioCtx.createOscillator();
        const lfoGain = this.audioCtx.createGain();
        lfoOsc.frequency.setValueAtTime(0.12, now);
        lfoGain.gain.setValueAtTime(0.04, now);
        lfoOsc.connect(lfoGain);
        lfoGain.connect(master.gain);
        lfoOsc.start(now);
        this.lfo = lfoOsc;
      }
    } catch (err) {
      console.warn('Web Audio synthesis not available or blocked by autoplay policy:', err);
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.masterGain && this.audioCtx) {
      try {
        const now = this.audioCtx.currentTime;
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
      } catch (e) {}
    }
    setTimeout(() => {
      this.stopOscillators();
    }, 350);
  }

  private stopOscillators() {
    this.oscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {}
    });
    this.gainNodes.forEach(g => {
      try {
        g.disconnect();
      } catch (e) {}
    });
    if (this.lfo) {
      try {
        this.lfo.stop();
        this.lfo.disconnect();
      } catch (e) {}
      this.lfo = null;
    }
    this.oscillators = [];
    this.gainNodes = [];
  }
}

export const calmAudioEngine = new AudioEngine();

