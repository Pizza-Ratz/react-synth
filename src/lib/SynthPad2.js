import * as Tone from 'tone'
import Transport from 'tone/Tone/core/clock/Transport'

const fantasy = ["C3", "D3", "E3", "G3", "C4", "D4", "E4", "G4", "C5", "G4", "E4", "D4", "C4", "G3", "E3", "D3", "C3", "D3", "E3", "G3", "C4", "D4", "E4", "G4", "C5", "G4", "E4", "D4", "C4", "G3", "E3", "D3", "A2", "B2", "C3", "E3", "A3", "B3", "C4", "E4", "A4", "E4", "C4", "B3", "A3", "E3", "C3", "B2", "A2", "B2", "C3", "E3", "A3", "B3", "C4", "E4", "A4", "E4", "C4", "B3", "A3", "E3", "C3", "B2"];

/**
 * A Warm Polysynth Pad
 */
class SynthPad2 extends Tone.PolySynth {
  constructor() {
    super({
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
    })

    const autoFilter = new Tone.AutoFilter({
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
    });
    
    this.efx = {
      distortion: new Tone.Distortion(0),
      delay: new Tone.FeedbackDelay("4n", 0.88),
      volume: new Tone.Volume(0),
      pan: new Tone.Panner({ pan: 0 }),
      chorus: new Tone.Chorus({ frequency: 0.33, depth: 0.8, wet: 0.8 }),
      verb: new Tone.Freeverb({
        dampening: 12000,
        roomSize: 0.95,
        wet: 0.2,
      }),
      gain: new Tone.Gain(1),
    }
    this.delay.wet.value = 0.33;

    this.chain(...this.efx, Tone.Destination);

    this.transport = new Transport()

    return this
  }
  
  // called when subscribed to a message source
  next = message => console.warn('ignoring message', message)

  playing = () => this.transport.state === 'started'

  start = () => {
    let notes = fantasy;
    this.noteIndex = 0;

    const repeater = (time) => {
      let note = notes[noteIndex % notes.length];
      this.triggerAttackRelease(note, "4n", time);
      this.noteIndex++;
    }

    this.transport.bpm.value = 40;
    this.transport.scheduleRepeat((time) => {
      repeater(time);
    }, "4n");
    this.transport.start()
  }
}

export default SynthPad2