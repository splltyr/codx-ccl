// procedural lofi synth & ui sound effects (pure web audio api, 0 external audio files)
class CyberAudioSystem {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.ambientNodes = [];
    this.barInterval = null;
    this.arpeggioInterval = null;
    this.currentBarIndex = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  // browser requires user interaction before audio starts
  unlockAudio() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  toggleSound() {
    this.init();
    if (!this.ctx) return false;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopAmbient();
    } else {
      this.startAmbient();
      this.playChime(523.25, 0.2); // C5 chime
    }
    return !this.isMuted;
  }

  playClick() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // AudioContext policy catch
    }
  }

  playChime(freq = 659.25, duration = 0.25) {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.25, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.035, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // AudioContext policy catch
    }
  }

  // subtle ambient hum for background stars
  playConstellationCrackleHum() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      const now = this.ctx.currentTime;
      // Soft throttle (350ms) to prevent overlapping buildup
      if (this._lastHumTime && (now - this._lastHumTime) < 0.35) {
        return;
      }
      this._lastHumTime = now;

      const duration = 0.8;
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      // Generate subtle electrical crackle noise with rare microscopic impulses
      for (let i = 0; i < bufferSize; i++) {
        const r = Math.random() * 2 - 1;
        const crackle = Math.random() > 0.985 ? (Math.random() * 2 - 1) * 1.5 : r * 0.4;
        output[i] = crackle;
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      // Deep, warm low-pass filter (140Hz - 190Hz) to keep it completely subterranean and non-clashing
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, now);
      filter.frequency.linearRampToValueAtTime(190, now + 0.3);
      filter.frequency.exponentialRampToValueAtTime(120, now + duration);
      filter.Q.setValueAtTime(1.8, now);

      // Extremely subtle, minimal gain (0.007) so it never clashes with the chill lofi music
      const gainNode = this.ctx.createGain();
      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.linearRampToValueAtTime(0.007, now + 0.15);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      noiseSource.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      noiseSource.start(now);
      noiseSource.stop(now + duration);
    } catch {
      // AudioContext policy catch
    }
  }

  // intro chord swells on scroll milestones
  playIntroChordSwell(stage = 0) {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      const now = this.ctx.currentTime;
      // Soft throttle (1.8s) per swell unless stage changed
      if (this._lastSwellTime && (now - this._lastSwellTime) < 1.8 && this._lastSwellStage === stage) {
        return;
      }
      this._lastSwellTime = now;
      this._lastSwellStage = stage;

      // 3 Harmonic Dreamy Chord Voicings for the Ascent Stages:
      // Stage 0: Fmaj9 (warm, uplifting launch)
      // Stage 1: Cmaj9 (spacious high-altitude drift)
      // Stage 2: Dm9 (mysterious celestial arrival)
      const SWELL_CHORDS = [
        [87.31, 130.81, 174.61, 220.00, 261.63, 329.63], // F2, C3, F3, A3, C4, E4 (Fmaj9)
        [65.41, 98.00, 164.81, 196.00, 246.94, 293.66],  // C2, G2, E3, G3, B3, D4 (Cmaj9)
        [73.42, 110.00, 146.83, 174.61, 220.00, 293.66]  // D2, A2, D3, F3, A3, D4 (Dm9)
      ];

      const chord = SWELL_CHORDS[stage % SWELL_CHORDS.length];
      const duration = 2.6;

      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, now);
      masterGain.gain.linearRampToValueAtTime(0.045, now + 0.35); // warm swell attack
      masterGain.gain.setValueAtTime(0.045, now + 0.9);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      // Warm analog low-pass filter with gentle frequency sweep
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.Q.setValueAtTime(1.1, now);
      filter.frequency.setValueAtTime(320, now);
      filter.frequency.linearRampToValueAtTime(680, now + 0.6);
      filter.frequency.exponentialRampToValueAtTime(360, now + duration);

      masterGain.connect(filter);
      filter.connect(this.ctx.destination);

      chord.forEach((freq, idx) => {
        // Dual detuned voices per note for rich electric-piano / pad depth
        [-1.2, 1.2].forEach((detune) => {
          const osc = this.ctx.createOscillator();
          const voiceGain = this.ctx.createGain();

          osc.type = idx === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq + detune, now);

          const vol = idx === 0 ? 0.35 : 0.18;
          voiceGain.gain.setValueAtTime(vol, now);

          osc.connect(voiceGain);
          voiceGain.connect(masterGain);

          osc.start(now);
          osc.stop(now + duration);
        });
      });
    } catch {
      // AudioContext policy catch
    }
  }

  // dextron robot voice blips (animal crossing / undertale style)
  playDextronRobotVoice() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      const now = this.ctx.currentTime;
      if (this._lastRobotVoice && (now - this._lastRobotVoice) < 1.4) {
        return;
      }
      this._lastRobotVoice = now;

      // 7 bubbly, cheerful pitch-modulated robot melody blips:
      // Musical pentatonic contour that playfully chirps "Wel-come, Ta-ma-raw!"
      const blips = [
        { freq: 659.25, time: 0.00, dur: 0.065 },   // E5
        { freq: 783.99, time: 0.075, dur: 0.065 },  // G5
        { freq: 987.77, time: 0.150, dur: 0.065 },  // B5
        { freq: 1318.51, time: 0.225, dur: 0.075 }, // E6 (sparkle high)
        { freq: 1174.66, time: 0.310, dur: 0.065 }, // D6
        { freq: 1318.51, time: 0.385, dur: 0.070 }, // E6
        { freq: 1567.98, time: 0.465, dur: 0.130 }, // G6 (bright bubbly resolution)
      ];

      blips.forEach(({ freq, time, dur }) => {
        const t = now + time;

        // 1. Primary bubbly sine carrier with fast exponential pitch drop (iconic animalese / Wall-E chirp attack)
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * 1.35, t);
        osc.frequency.exponentialRampToValueAtTime(freq, t + 0.016);
        osc.frequency.setValueAtTime(freq, t + dur - 0.015);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.08, t + dur);

        // 2. Subtle square wave harmonic for cute retro robotic vocal resonance
        const sqOsc = this.ctx.createOscillator();
        const sqGain = this.ctx.createGain();
        sqOsc.type = 'square';
        sqOsc.frequency.setValueAtTime(freq * 1.35, t);
        sqOsc.frequency.exponentialRampToValueAtTime(freq, t + 0.016);
        sqGain.gain.setValueAtTime(0.012, t);
        sqGain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

        // 3. Resonant robot vocal tract bandpass filter (simulates miniature speaker horn)
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1450, t);
        filter.Q.setValueAtTime(3.2, t);

        // 4. Amplitude Envelope: snappy attack, round bubbly decay
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.042, t + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

        osc.connect(filter);
        sqOsc.connect(sqGain);
        sqGain.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        sqOsc.start(t);
        osc.stop(t + dur);
        sqOsc.stop(t + dur);
      });
    } catch {
      // AudioContext policy catch
    }
  }

  // rocket boost whoosh sound
  playRocketBoost(duration = 1.8) {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      const now = this.ctx.currentTime;
      // Prevent overlapping boosts during fast scroll
      if (this._lastBoostTime && (now - this._lastBoostTime) < 1.4) {
        return;
      }
      this._lastBoostTime = now;

      // 1. Generate White Noise Buffer
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      // 2. Resonant Filter Sweep (Simulates Rocket Thruster Acceleration & Ignition)
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.Q.setValueAtTime(3.4, now);
      filter.frequency.setValueAtTime(110, now);
      filter.frequency.exponentialRampToValueAtTime(980, now + duration * 0.45);
      filter.frequency.exponentialRampToValueAtTime(360, now + duration);

      // 3. Sub-Bass Engine Rumble Oscillator
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(60, now);
      subOsc.frequency.exponentialRampToValueAtTime(92, now + duration * 0.4);
      subOsc.frequency.exponentialRampToValueAtTime(45, now + duration);

      subGain.gain.setValueAtTime(0.0001, now);
      subGain.gain.linearRampToValueAtTime(0.04, now + 0.15);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);

      // 4. Master Boost Envelope
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, now);
      masterGain.gain.linearRampToValueAtTime(0.065, now + 0.18);
      masterGain.gain.setValueAtTime(0.065, now + duration * 0.6);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(this.ctx.destination);

      whiteNoise.start(now);
      subOsc.start(now);
      whiteNoise.stop(now + duration);
      subOsc.stop(now + duration);
    } catch {
      // AudioContext policy catch
    }
  }


  // Play a soft kalimba / electric piano pluck note for the arpeggio
  playPluckNote(freq) {
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(500, now + 0.4);

      // Soft gentle envelope
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.022, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch {
      // ignore
    }
  }

  startAmbient() {
    if (this.ambientNodes.length > 0 || !this.ctx) return;

    try {
      // 4-Bar Soothing Lofi Progression: Fmaj7 -> Em7 -> Dm7 -> Cmaj7
      const BARS = [
        {
          name: 'Fmaj7',
          padFreqs: [87.31, 130.81, 174.61, 220.00, 261.63], // F2, C3, F3, A3, C4
          melodyPool: [261.63, 329.63, 392.00, 440.00, 523.25] // C4, E4, G4, A4, C5
        },
        {
          name: 'Em7',
          padFreqs: [82.41, 123.47, 164.81, 196.00, 246.94], // E2, B2, E3, G3, B3
          melodyPool: [246.94, 293.66, 329.63, 392.00, 493.88] // B3, D4, E4, G4, B4
        },
        {
          name: 'Dm7',
          padFreqs: [73.42, 110.00, 146.83, 174.61, 220.00], // D2, A2, D3, F3, A3
          melodyPool: [220.00, 261.63, 293.66, 349.23, 440.00] // A3, C4, D4, F4, A4
        },
        {
          name: 'Cmaj7',
          padFreqs: [65.41, 98.00, 130.81, 164.81, 196.00], // C2, G2, C3, E3, G3
          melodyPool: [196.00, 246.94, 261.63, 329.63, 392.00] // G3, B3, C4, E4, G4
        }
      ];

      const now = this.ctx.currentTime;
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, now);
      masterGain.gain.linearRampToValueAtTime(0.028, now + 2.0); // Gentle 2s fade-in

      // Warm analog low-pass filter
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(420, now);
      filter.Q.setValueAtTime(1.2, now);

      masterGain.connect(filter);
      filter.connect(this.ctx.destination);

      // Initialize pad oscillators for 5 voices
      const oscillators = [];
      const initialBar = BARS[0];

      initialBar.padFreqs.forEach((freq, idx) => {
        // Dual voice micro-detuned for width
        [-0.5, 0.5].forEach((detune) => {
          const osc = this.ctx.createOscillator();
          const voiceGain = this.ctx.createGain();

          osc.type = idx === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq + detune, now);

          // Subtle volume per voice
          const vol = idx === 0 ? 0.28 : 0.16;
          voiceGain.gain.setValueAtTime(vol, now);

          osc.connect(voiceGain);
          voiceGain.connect(masterGain);
          osc.start();

          oscillators.push({ osc, voiceIdx: idx, detune });
        });
      });

      this.currentBarIndex = 0;

      // Chord progression timer: Switch chords every 4.2 seconds
      this.barInterval = setInterval(() => {
        if (!this.ctx || this.isMuted) return;
        this.currentBarIndex = (this.currentBarIndex + 1) % BARS.length;
        const currentBar = BARS[this.currentBarIndex];
        const t = this.ctx.currentTime;

        // Smooth 1.4s portamento between chords
        oscillators.forEach(({ osc, voiceIdx, detune }) => {
          const targetFreq = currentBar.padFreqs[voiceIdx] + detune;
          osc.frequency.cancelScheduledValues(t);
          osc.frequency.setValueAtTime(osc.frequency.value, t);
          osc.frequency.exponentialRampToValueAtTime(targetFreq, t + 1.4);
        });
      }, 4200);

      // Gentle plucky arpeggio melody sequencer (plays every 525ms ~70 BPM)
      let arpeggioStep = 0;
      this.arpeggioInterval = setInterval(() => {
        if (!this.ctx || this.isMuted) return;
        const currentBar = BARS[this.currentBarIndex];
        const pool = currentBar.melodyPool;

        // Lofi pattern with occasional pauses for natural human feel
        if (arpeggioStep % 4 !== 3) {
          const noteIndex = (arpeggioStep * 2 + Math.floor(Math.random() * 2)) % pool.length;
          this.playPluckNote(pool[noteIndex]);
        }
        arpeggioStep = (arpeggioStep + 1) % 16;
      }, 525);

      this.ambientNodes = [masterGain, filter, ...oscillators.map(o => o.osc)];
    } catch {
      // AudioContext policy catch
    }
  }

  stopAmbient() {
    if (this.barInterval) {
      clearInterval(this.barInterval);
      this.barInterval = null;
    }
    if (this.arpeggioInterval) {
      clearInterval(this.arpeggioInterval);
      this.arpeggioInterval = null;
    }

    if (this.ambientNodes.length > 0 && this.ctx) {
      const master = this.ambientNodes[0];
      if (master && master.gain) {
        try {
          master.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.4);
        } catch {
          // ignore
        }
      }
    }

    setTimeout(() => {
      this.ambientNodes.forEach((node) => {
        try {
          if (node.stop) node.stop();
          if (node.disconnect) node.disconnect();
        } catch {
          // ignore
        }
      });
      this.ambientNodes = [];
    }, 500);
  }
}

export const cyberAudio = new CyberAudioSystem();
