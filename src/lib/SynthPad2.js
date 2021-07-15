import * as Tone from 'tone'
import { patterns } from './Patterns'

/**
 * A Warm Polysynth Pad
 */
class SynthPad2 extends Tone.PolySynth {
  constructor(options) {
    super(Object.assign({
      pattern: patterns.fantasy,
      noteIndex: 0,
      voices: 5,
      volume: 10,
      harmonicity: 1,
      modulationIndex: 1,
      oscillator: {
        type: "sine"
      },
      envelope: {
        attack: 8,
        decay: 0.3,
        sustain: 0.6,
        release: 7
      },
      modulation: { type: "triangle" },
      modulationEnvelope: {
        attack: 0.01,
        decay: 0.3,
        sustain: 0.6,
        release: 8
      },
    }, options))
    
    this.efx = {
      distortion: new Tone.Distortion(0),
      delay: new Tone.FeedbackDelay("4n", 0.88),
      pan: new Tone.Panner({ 
        pan: 0 
      }),
      chorus: new Tone.Chorus({ 
        frequency: 0.33, 
        depth: 0.8, 
        wet: 0.8 ,
      }),
      reverb: new Tone.Freeverb({
        dampening: 12000,
        roomSize: 0.95,
        wet: 0.2,
      }),
      autoFilter: new Tone.AutoFilter({
        frequency : '8n' ,
        type : 'sine' ,
        depth : 1,
        baseFrequency : 6000,
        octaves : 3.6 ,
        filter : {
          type : 'lowpass' ,
          rolloff : -12 ,
          Q : 4
        }
      }),
      gain: new Tone.Gain(1),
    }
    this.delay.wet.value = 0.33;
    this.chain(this.efx.gain);

    this.noteIndex = 0;
    this.playing = false;

    this.transport = options.transport || Tone.getTransport()
    if (!options.transport) this.transport.bpm.value = 40;
  }
  
  repeater(time) {
    if (this.pleaseStop) {
      this.pleaseStop = false
      return
    }
    let note = this.pattern[this.noteIndex % this.pattern.length];
    this.triggerAttackRelease(note, "4n", time);
    this.noteIndex++;
  }
  
  start() {
    this.pleaseStop = false
    this.noteIndex = 0
    this.nextEvent = this.transport.scheduleRepeat((time) => {
      this.repeater(time);
    }, "4n");
  }

  stop() {
    this.pleaseStop = true
    if (this.nextEvent) this.transport.cancel(this.nextEvent)
  }
}

export default SynthPad2