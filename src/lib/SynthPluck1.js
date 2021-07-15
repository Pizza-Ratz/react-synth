import * as Tone from 'tone'
import { patterns } from './Patterns'

export class SynthPluck1 extends Tone.PolySynth {
  constructor(options) {
    super(Object.assign({
      voices: 8,
      volume: -30,
      oscillator: {
        type: "pwm",
        modulationFrequency: 0.3,
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
        Q: 2,
        rolloff: -48,
        type: "lowpass",
      },
      filterEnvelope: {
        attack: 0.3,
        baseFrequency: 300,
        decay: 0.4,
        exponent: 2,
        octaves: 3,
        release: 0.7,
        sustain: 0.07,
      },
    }, options))

    this.set({
      oscillator: {
        type: "pwm",
      },
      envelope: {
        attack: 0.06,
        attackCurve: "exponential",
        decay: 0.4,
        decayCurve: "exponential",
        sustain: 0.07,
        release: 0.7,
        releaseCurve: "exponential"
      },
        filter: {
        Q: 2,
        rolloff: -24,
        type: "lowpass",
      },
      filterEnvelope: {
        attack: 0.3,
        baseFrequency: 300,
        decay: 0.4,
        exponent: 2,
        octaves: 3,
        release: 0.7,
        sustain: 0.07,
      }
    })
    this.pattern = options.pattern || patterns.prelude
    this.noteIndex = 0

    this.efx = {
      dist: new Tone.Distortion(0),
      delay: new Tone.FeedbackDelay("8n.", 0.5),
      pan: new Tone.Panner({ 
        pan: 0 
      }),
      reverb: new Tone.Freeverb({
        dampening: 12000,
        roomSize: 0.8,
        wet: 0.16
      }),
      autoFilter: new Tone.AutoFilter({
        frequency : '8n' ,
        type : 'sine' ,
        depth : 1,
        baseFrequency : 600,
        octaves : 3.6 ,
        filter : {
          type : 'lowpass' ,
          rolloff : -12 ,
          Q : 4
        }
      }),
      gain: new Tone.Gain(1),
    }
    this.efx.delay.wet.value = 1;
    this.noteIndex = 0;
    this.playing = false;

    this.chain(this.efx.gain, this.efx.dist, this.efx.autoFilter, this.efx.delay, this.efx.reverb, this.efx.pan, Tone.Destination);

    this.transport = options.transport || Tone.getTransport()
  }

  repeater(time) {
    if (this.pleaseStop) {
      this.pleaseStop = false
      return
    }
    let note = this.pattern[this.noteIndex % this.pattern.length];
    this.triggerAttackRelease(note, "8n", time);
    this.noteIndex++;
  }
  
  start() {
    this.pleaseStop = false
    this.noteIndex = 0
    this.nextEvent = this.transport.scheduleRepeat((time) => {
      this.repeater(time);
    }, "8n");  
  }

  stop() {
    this.pleaseStop = true
    if (this.nextEvent) this.transport.cancel(this.nextEvent)
  }
}