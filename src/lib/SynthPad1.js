import * as Tone from 'tone'
import {Transport} from 'tone/build/esm/core/clock/Transport'
import { patterns } from './Patterns'

/**
 * A bright FM pad with a gentle attack.
 */
export class SynthPad1 extends Tone.DuoSynth {
  constructor(options) {
    super(Object.assign({
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
    }, options))

    this.pattern = options.pattern || patterns.fantasy
    this.noteIndex = 0

    this.efx = {
      dist: new Tone.Distortion(0),
      delay: new Tone.FeedbackDelay("8n.", 0.3),
      volume: new Tone.Volume(0),
      pan: new Tone.Panner({ 
        pan: 0 
      }),
      reverb: new Tone.Freeverb({
        dampening: 600,
        roomSize: 0.9,
        wet: 0.3,
      }),
      gain: new Tone.Gain(1),
    }
    this.efx.delay.wet.value = 0.2;
    this.noteIndex = 0;
    this.playing = false;

    this.chain(this.efx.gain, this.efx.dist, this.efx.delay, this.efx.reverb, this.efx.pan);

    this.transport = options.transport || new Transport()
    this.transport.scheduleRepeat((time) => {
      this.repeater(time);
    }, "8n");  
  }

  repeater = (time) => {
    let note = this.pattern[this.noteIndex % this.pattern.length];
    this.triggerAttackRelease(note, "8n", time);
    this.noteIndex++;
  }
  
  start = () => this.transport.start()
  stop = () => this.transport.stop()
  pause = () => this.transport.pause()
}