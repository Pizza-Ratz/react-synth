import * as Tone from 'tone'
import {Transport} from 'tone/build/esm/core/clock/Transport'
import { patterns } from './Patterns'

class SynthPluck3 extends Tone.Synth {
  constructor(options) {
    super(Object.assign({
      transport: new Transport(),
      pattern: patterns.fantasy,
      noteIndex: 0,
      volume: -20,
      oscillator: {
        type: 'fmsquare',
        modulationType: 'sine',
        modulationIndex: 2,
        harmonicity: 3
      },
      envelope: {
        attack: 0.05,
        decay: 0.06,
        sustain: 0.15,
        release: 0.1
      },
      filter: {
        Q: 0.3,
        rolloff: -12,
        type: "lowpass",
      },
      filterEnvelope: {
        octaves: 5,
        baseFrequency: 200,
        attack: 0.13,
        decay: 0,
        sustain: 0.5,
        release: 0.15,
      },
    }, options))

    this.efx = {
      autoFilter: new Tone.AutoFilter('1n'),
      dist: new Tone.Distortion(0.05),
      delay: new Tone.FeedbackDelay("8n.", 0.3),
      volume: new Tone.Volume(0),
      pan: new Tone.Panner({ 
        pan: 0 
      }),
      reverb: new Tone.Freeverb({
        dampening: 400,
        roomSize: 0.8,
        wet: 0.16,
      }),
      gain: new Tone.Gain(0.1),
    }
    this.efx.delay.wet.value = 0.165;
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

export default SynthPluck3;