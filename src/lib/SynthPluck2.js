import * as Tone from 'tone'
import {Transport} from 'tone/build/esm/core/clock/Transport'
import { patterns } from './Patterns'

class SynthPluck2 extends Tone.MonoSynth {
  constructor(options) {
    super(Object.assign({
      transport: new Transport(),
      pattern: patterns.fantasy,
      noteIndex: 0,
      volume: -20,
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
        rolloff: -18,
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
    }, options))

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
        wet: 0.05,
      }),
      gain: new Tone.Gain(1),
    }
    this.efx.delay.wet.value = 0.2;
    this.noteIndex = 0;
    this.playing = false;

    this.chain(...this.efx, Tone.Destination);

    this.transport = this.transport || new Transport()
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

export default SynthPluck2;