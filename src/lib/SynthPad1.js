import * as Tone from 'tone'
import Transport from 'tone/Tone/core/clock/Transport'

const fantasy = ["C3", "D3", "E3", "G3", "C4", "D4", "E4", "G4", "C5", "G4", "E4", "D4", "C4", "G3", "E3", "D3", "C3", "D3", "E3", "G3", "C4", "D4", "E4", "G4", "C5", "G4", "E4", "D4", "C4", "G3", "E3", "D3", "A2", "B2", "C3", "E3", "A3", "B3", "C4", "E4", "A4", "E4", "C4", "B3", "A3", "E3", "C3", "B2", "A2", "B2", "C3", "E3", "A3", "B3", "C4", "E4", "A4", "E4", "C4", "B3", "A3", "E3", "C3", "B2"];
const cMinor7 = ["C4", "D#4", "G4", "A#4", "G4", "D#4"];

/**
 * Kind of a bright FM sound with a gentle attack.
 * 
 * It is an observer of various sorts of messages; subscribing it
 * to a message-producer will cause it to response to midi-esque events
 * (that, as of this writing, have yet to be defined)
 */
class SynthPad1 extends Tone.DuoSynth {
  constructor(options) {
    super(Object.assign({
      transport: new Transport(),
      pattern: fantasy,
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

    this.efx = {
      dist: new Tone.Distortion(0),
      delay: new Tone.FeedbackDelay("8n.", 0.3),
      volume: new Tone.Volume(0),
      pan: new Tone.Panner({ pan: 0 }),
      reverb: new Tone.Freeverb({
        dampening: 600,
        roomSize: 0.9,
        wet: 0.05,
      }),
      gain = new Tone.Gain(1),
    }
    this.efx.delay.wet.value = 0.2;
    this.noteIndex = 0
    this.playing = false;

    this.chain(...this.efx, Tone.Destination);

    this.transport = new Transport()
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

export default SynthPad1