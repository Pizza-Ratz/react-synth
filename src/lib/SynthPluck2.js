export const synthPluck2 = new Tone.MonoSynth({
  volume: -20,
  oscillator: {
    type: "square",
  },
  envelope: {
    attack: 0.01,
    decay: 1,
    sustain: 0,
    release: 0.2,
  },
  filter: {
    Q: 0.3,
    rolloff: -18,
    type: "lowpass",
  },
  filterEnvelope: {
    attack: 1,
    baseFrequency: 300,
    decay: 1,
    exponent: 2,
    octaves: 3,
    release: 3,
    sustain: 1,
  },
});