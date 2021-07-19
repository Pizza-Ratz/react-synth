import * as Tone from "tone";
import { patterns } from "../../lib/Patterns";
import Debug from "debug";

/**
 * A bright FM pad with a gentle attack.
 */
export default class SynthPad1 extends Tone.PolySynth {
  constructor(options = {}) {
    super(
      Object.assign(
        {
          maxPolyphony: 8,
          volume: -20,
          voice: Tone.MonoSynth,
          options: {
            oscillator: {
              voices: 3,
              detune: 1,
              type: "fatsawtooth",
            },
            envelope: {
              attack: 1,
              decay: 0.5,
              sustain: 0.4,
              release: 1.5,
            },
            filterEnvelope: {
              baseFrequency: 1100,
              attack: 0.8,
              decay: 0,
              sustain: 1,
              release: 1,
            },
          },
        },
        options
      )
    );

    this.efx = {
      dist: new Tone.Distortion(0),
      delay: new Tone.FeedbackDelay({
        delayTime: "8n.",
        feedback: 0.3,
        wet: 0.2,
      }),
      // reverb: new Tone.Freeverb({
      //   dampening: 2000,
      //   roomSize: 0.9,
      //   wet: 0.3,
      // }),
      reverb: new Tone.Reverb({
        // convolver: this.efx.convolver,
        decay: 6,
        preDelay: 0.2,
        wet: 0.8,
      }),
      // reverb: new Tone.Convolver({
      //   url: "../../assets/impulse/OutdoorStadium.mp3",
      // }),
    };

    this.efx.reverb.generate();
    this.pattern = options.pattern || patterns.eternity;
    this.preEfxOut = this.output
    this.noteIndex = 0;
    this.playing = false;
    this.transport = options.transport || Tone.getTransport();

    return this;
  }

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
