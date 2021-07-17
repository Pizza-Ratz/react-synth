import * as Tone from "tone";
import { patterns } from "../../lib/Patterns";
import Debug from "debug";
import { debug } from "tone";

class SynthPluck2 extends Tone.MonoSynth {
  constructor(options = {}) {
    super(
      Object.assign(
        {
          noteIndex: 0,
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
            decay: 1,
            exponent: 2,
            octaves: 3,
            release: 3,
            sustain: 1,
          },
        },
        options
      )
    );

    this.debug = Debug("synth:pluck2");

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
    this.volume = this.output.volume;

    this.pattern = options.pattern || patterns.fantasy;
    this.noteIndex = 0;
    this.playing = false;

    this.transport = this.transport || Tone.getTransport();

    this.debug("Ready");

    return this;
  }

  repeater(time) {
    this.debug("note");
    if (this.pleaseStop) {
      this.pleaseStop = false;
      return;
    }
    let note = this.pattern[this.noteIndex % this.pattern.length];
    this.triggerAttackRelease(note, "8n", time);
    this.noteIndex++;
  }

  start() {
    this.debug("start");
    this.pleaseStop = false;
    this.noteIndex = 0;
    this.nextEvent = this.transport.scheduleRepeat((time) => {
      this.repeater(time);
    }, "8n");
  }

  stop() {
    this.debug("stop");
    this.pleaseStop = true;
    if (this.nextEvent) this.transport.cancel(this.nextEvent);
    delete this.nextEvent;
  }

  dispose() {
    this.debug("dispose");
    for (const effect of Object.values(this.efx)) {
      effect.dispose();
    }
    super.dispose();
  }
}

export default SynthPluck2;
