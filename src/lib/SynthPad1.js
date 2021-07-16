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
          harmonicity: 1,
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

    this.pattern = options.pattern || patterns.fantasy;
    this.noteIndex = 0;

    this.efx = {
      distortion: new Tone.Distortion(0),
      delay: new Tone.FeedbackDelay("8n.", 0.3),
      pan: new Tone.Panner({
        pan: 0,
      }),
      reverb: new Tone.Freeverb({
        dampening: 600,
        roomSize: 0.9,
        wet: 0.3,
      }),
      gain: new Tone.Gain(1),
    };
    this.efx.delay.wet.value = 0.2;
    this.noteIndex = 0;
    this.playing = false;

    delete this.volume;
    delete this.output;
    this.output = new Tone.Volume(-20);
    this.volume = this.output.volume;

    this.chain(
      this.efx.gain,
      this.efx.distortion,
      this.efx.delay,
      this.efx.reverb,
      this.efx.pan,
      this.output
    );

    this.transport = options.transport || Tone.getTransport();
  }

  repeater(time) {
    if (this.pleaseStop) {
      this.pleaseStop = false;
      return;
    }
    console.log("SynthPad1 playing a note");
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
}
