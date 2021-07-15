import * as Tone from 'tone'
import { patterns } from './Patterns'

export class SynthPluck1 extends Tone.Synth {
  constructor(options) {
    super(Object.assign({
      voices: 8,
      volume: -20,
      oscillator: {
        type: "sine",
      },
      envelope: {
        attack: 0.01,
        decay: 0.4,
        decayCurve: "exponential",
        sustain: 0,
        release: 0.7,
        releaseCurve: "exponential"
      },
      filter: {
        Q: 1,
        rolloff: -24,
        type: "lowpass",
      },
      filterEnvelope: {
        attack: 0.3,
        baseFrequency: 200,
        decay: 1,
        exponent: 2,
        octaves: 3,
        release: 2,
        sustain: 1,
      },
    }, options))

    this.set({
      envelope: {
        attack: 0.01,
        decay: 0.4,
        decayCurve: "exponential",
        sustain: 0,
        release: 0.7,
        releaseCurve: "exponential"
      },
        filter: {
        Q: 1,
        rolloff: -24,
        type: "lowpass",
      },
      filterEnvelope: {
        attack: 0.3,
        baseFrequency: 200,
        decay: 1,
        exponent: 2,
        octaves: 3,
        release: 2,
        sustain: 1,
      }
    })
    this.pattern = options.pattern || patterns.fantasy
    this.noteIndex = 0

    this.efx = {
      dist: new Tone.Distortion(0),
      delay: new Tone.FeedbackDelay("8n.", 0.6),
      pan: new Tone.Panner({ 
        pan: 0 
      }),
      reverb: new Tone.Freeverb({
        dampening: 12000,
        roomSize: 0.8,
        wet: 0.1
      }),
      gain: new Tone.Gain(1),
    }
    this.efx.delay.wet.value = 1;
    this.noteIndex = 0;
    this.playing = false;

    this.chain(this.efx.gain, this.efx.dist, this.efx.delay, this.efx.reverb, this.efx.pan, Tone.Destination);

    this.transport = options.transport || Tone.getTransport()
  }

  repeater(time) {
    if (this.pleaseStop) {
      this.pleaseStop = false
      return
    }
    let note = this.pattern[this.noteIndex % this.pattern.length];
    this.triggerAttackRelease(note, "16n.", time);
    this.noteIndex++;
  }
  
  start() {
    this.pleaseStop = false
    this.noteIndex = 0
    this.nextEvent = this.transport.scheduleRepeat((time) => {
      this.repeater(time);
    }, "16n.");  
  }

  stop() {
    this.pleaseStop = true
    if (this.nextEvent) this.transport.cancel(this.nextEvent)
  }
}