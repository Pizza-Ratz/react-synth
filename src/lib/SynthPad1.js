import * as Tone from "tone";
import { patterns } from "./Patterns";

/**
 * A bright FM pad with a gentle attack.
 */
export class SynthPad1 extends Tone.DuoSynth {
  constructor(options = {}) {
    super(
      Object.assign(
        {
          harmonicity: 0.5,
          volume: -20,
          voice0: {
            oscillator: { type: "sawtooth" },
            envelope: {
              attack: 4,
              decay: 1,
              sustain: 0.4,
              release: 7,
            },
            filterEnvelope: {
              baseFrequency: 400,
              attack: 0.01,
              decay: 0,
              sustain: 1,
              release: 0.53,
            },
          },
          voice1: {
            oscillator: { type: "sine" },
            envelope: {
              attack: 3,
              decay: 1,
              sustain: 0.4,
              release: 7,
            },
            filterEnvelope: {
              baseFrequency: 1200,
              attack: 0.01,
              decay: 0.5,
              sustain: 1,
              release: 2,
            },
          },
          vibratoRate: 0.5,
          vibratoAmount: 0.1,
        },
        options
      )
    );

    this.pattern = options.pattern || patterns.eternity;
    this.noteIndex = 0;

    this.efx = {
      gain: new Tone.Gain(0.2),
      dist: new Tone.Distortion(0),
      delay: new Tone.FeedbackDelay({
        duration: "8n.",
        feedback: 0.3,
        wet: 0.2,
      }),
      reverb: new Tone.Freeverb({
        dampening: 2000,
        roomSize: 0.9,
        wet: 0.3,
      }),
    };
    this.noteIndex = 0;
    this.playing = false;
    this.transport = options.transport || Tone.getTransport();

    return this;
  }
  // delete this.volume;
  // delete this.output;
  // this.output = new Tone.Volume(-20);
  // this.volume = this.  }

  repeater(time) {
    if (this.pleaseStop) {
      this.pleaseStop = false;
      return;
    }
    let note = this.pattern[this.noteIndex % this.pattern.length];
    this.triggerAttackRelease(note, "4n", time);
    this.noteIndex++;
  }

  start() {
    this.pleaseStop = false;
    this.noteIndex = 0;
    this.nextEvent = this.transport.scheduleRepeat((time) => {
      this.repeater(time);
    }, "4n");
  }

  stop() {
    this.pleaseStop = true;
    if (this.nextEvent) this.transport.cancel(this.nextEvent);
  }

  dispose() {
    for (const effect of Object.values(this.efx)) {
      effect.disposed || effect.dispose();
    }
    this.disposed || super.dispose();
  }
}
