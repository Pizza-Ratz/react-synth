import * as Tone from "tone";
import { patterns } from "../../lib/Patterns";

/**
 * NOTE: For this synth, effects must be chained within the context where the instance
 * will be used. No idea why.
 */
export default class SynthPluck1 extends Tone.PolySynth {
  constructor(options = {}) {
    super(
      Object.assign(
        {
          maxPolyphony: 8,
          volume: -30,
          options: {
            oscillator: {
              type: "pwm",
              modulationFrequency: 0.2,
              width: 0.5,
            },
            envelope: {
              attack: 0.07,
              attackCurve: "exponential",
              decay: 0.44,
              decayCurve: "exponential",
              sustain: 0.07,
              release: 0.7,
              releaseCurve: "exponential",
            },
            filter: {
              Q: 2,
              rolloff: -24,
              type: "lowpass",
            },
            filterEnvelope: {
              attack: 0.3,
              baseFrequency: 500,
              decay: 0.4,
              exponent: 2,
              octaves: 3,
              release: 0.7,
              sustain: 0.07,
            },
          },
        },
        options
      )
    );

    this.pattern = options.pattern || patterns.eternity;
    this.noteIndex = 0;

    this.efx = {
      dist: new Tone.Distortion(0.4),
      delay: new Tone.FeedbackDelay({
        duration: "8n",
        feedback: 0.45,
        wet: 0.3,
      }),
      reverb: new Tone.Freeverb({
        dampening: 10000,
        roomSize: 0.8,
        wet: 0.17,
      }),
      autoFilter: new Tone.AutoFilter({
        frequency: "16n",
        type: "sine",
        depth: 1,
        baseFrequency: 580,
        octaves: 4,
        filter: {
          type: "lowpass",
          rolloff: -24,
          Q: 3.6,
        },
      }),
      vibrato: new Tone.Vibrato({
        maxDelay: 0.002,
        frequency: 7.5,
        depth: 0.16,
        type: "sine",
      }),
    };

    this.preEfxOut = this.output;
    this.noteIndex = 0;
    this.playing = false;

    this.transport = options.transport || Tone.getTransport();

    return this;
  }

  // this doesn't work for polysynths?
  // postInit() {
  //   const postEfxOut = new Tone.Volume();
  //   this.chain(
  //     this.efx.vibrato,
  //     this.efx.dist,
  //     this.efx.autoFilter,
  //     this.efx.delay,
  //     this.efx.reverb,
  //     postEfxOut
  //   );
  //   this.efx.autoFilter.start();

  //   delete this.volume;
  //   delete this.output;
  //   this.output = postEfxOut;
  //   this.volume = postEfxOut.volume;
  //   this.start();
  //   console.log(this);
  // }

  repeater(time) {
    if (this.pleaseStop) {
      this.pleaseStop = false;
      return;
    }
    let note = this.pattern[this.noteIndex % this.pattern.length];
    this.triggerAttackRelease(note, "8n", time);
    this.noteIndex++;
  }

  start() {
    this.pleaseStop = false;
    this.noteIndex = 0;
    this.nextEvent = this.transport.scheduleRepeat((time) => {
      this.repeater(time);
    }, "8n");
  }

  stop() {
    this.pleaseStop = true;
    if (this.nextEvent) this.transport.cancel(this.nextEvent);
  }

  dispose() {
    for (const effect of Object.values(this.efx)) {
      effect.dispose();
    }
    super.dispose();
  }
}
