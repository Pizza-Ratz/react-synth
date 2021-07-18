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
          maxPolyphony: 4,
          volume: -20,
          voice: Tone.MonoSynth,
          options: {
            oscillator: {
              voices: 3,
              detune: 1,
              type: "fatsawtooth",
            },
            envelope: {
              attack: 0.7,
              decay: 1,
              sustain: 0.4,
              release: 1,
            },
            filterEnvelope: {
              baseFrequency: 400,
              attack: 0.7,
              decay: 0,
              sustain: 1,
              release: 0.53,
            },
          },
        },
        options
      )
    );

    this.pattern = options.pattern || patterns.eternity;
    this.noteIndex = 0;
    this.logger = Debug("synth:pad1");

    this.efx = {
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
      // reverb: new Tone.Convolver({
      //   url: "../../assets/impulse/OutdoorStadium.mp3",
      // }),
    };

    this.preEfxVolume = this.volume;
    const postEfxVolume = new Tone.Volume();
    this.output.chain(
      this.efx.dist,
      this.efx.delay,
      this.efx.reverb,
      postEfxVolume
    );
    delete this.volume;
    delete this.output;
    this.output = postEfxVolume;
    this.volume = this.output.volume;

    this.noteIndex = 0;
    this.playing = false;
    this.transport = options.transport || Tone.getTransport();

    this.logger("ready");
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
    this.logger("start");
    this.pleaseStop = false;
    this.noteIndex = 0;
    this.nextEvent = this.transport.scheduleRepeat((time) => {
      this.repeater(time);
    }, "4n");
  }

  stop() {
    this.logger("stop");
    this.pleaseStop = true;
    if (this.nextEvent) this.transport.cancel(this.nextEvent);
  }

  dispose() {
    this.logger("dispose");
    for (const effect of Object.values(this.efx)) {
      effect.disposed || effect.dispose();
    }
    this.disposed || super.dispose();
  }
}
