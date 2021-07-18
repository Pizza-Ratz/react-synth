import * as Tone from "tone";
import { patterns } from "../../lib/Patterns";
import Debug from "debug";

class SynthPluck2 extends Tone.MonoSynth {
  constructor(options = {}) {
    super(
      Object.assign(
        {
          volume: -0,
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
            rolloff: -24,
            type: "lowpass",
          },
          filterEnvelope: {
            attack: 1,
            baseFrequency: 300,
            decay: 0.5,
            exponent: 2,
            octaves: 3,
            release: 2,
            sustain: 1,
          },
        },
        options
      )
    );

    this.logger = Debug("synth:pluck2");

    this.efx = {
      distortion: new Tone.Distortion(0),
      delay: new Tone.FeedbackDelay("8n.", 0.3),
      pan: new Tone.Panner({
        pan: 0,
      }),
      reverb: new Tone.Freeverb({
        dampening: 600,
        roomSize: 0.9,
        wet: 0.05,
      }),
      gain: new Tone.Gain(1),
    };
    this.efx.delay.wet.value = 0.2;

    this.preEfxVol = this.volume;
    this.pattern = options.pattern || patterns.fantasy;
    this.noteIndex = 0;
    this.playing = false;

    this.transport = this.transport || Tone.getTransport();

    this.logger("Ready");

    return this;
  }

  postInit() {
    const postEfxOut = new Tone.Volume();
    this.chain(
      this.efx.gain,
      this.efx.distortion,
      this.efx.delay,
      this.efx.reverb,
      postEfxOut
    );
    delete this.volume;
    delete this.output;
    this.output = postEfxOut;
    this.volume = postEfxOut.volume;
    this.start();
  }

  repeater(time) {
    this.logger("note");
    if (this.pleaseStop) {
      this.pleaseStop = false;
      return;
    }
    let note = this.pattern[this.noteIndex % this.pattern.length];
    this.triggerAttackRelease(note, "8n", time);
    this.noteIndex++;
  }

  start() {
    this.logger("start");
    this.pleaseStop = false;
    this.noteIndex = 0;
    this.nextEvent = this.transport.scheduleRepeat((time) => {
      this.repeater(time);
    }, "8n");
  }

  stop() {
    this.logger("stop");
    this.pleaseStop = true;
    if (this.nextEvent) this.transport.cancel(this.nextEvent);
    delete this.nextEvent;
  }

  dispose() {
    this.logger("dispose");
    for (const effect of Object.values(this.efx)) {
      effect.dispose();
    }
    super.dispose();
  }
}

export default SynthPluck2;
