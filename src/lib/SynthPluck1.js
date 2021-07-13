export const synthPluck1 = new Tone.MonoSynth({
  volume: -20,
  oscillator: {
    type: "sine",
  },
  envelope: {
    attack: 0.005,
    decay: 0.5,
    sustain: 0,
    release: 0.2,
  },
  filter: {
    Q: 0.5,
    rolloff: -12,
    type: "lowpass",
  },
  filterEnvelope: {
    attack: 0.3,
    baseFrequency: 300,
    decay: 1,
    exponent: 2,
    octaves: 3,
    release: 2,
    sustain: 1,
  },
});