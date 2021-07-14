import * as Tone from 'tone'

/**
 * A Warm Polysynth Pad
 * 
 * It is an observer of various sorts of messages; subscribing it
 * to a message-producer will cause it to response to midi-esque events
 * (that, as of this writing, have yet to be defined)
 * 
 * @implements Observer
 * @public volume listens for numbers indicating the instrument's volume
 * @public vibrato.amount
 * @public vibrato.rate
 * 
 */

const synthPad2 = function () {
  // called when subscribed to a message source
  this.next = message => console.warn('ignoring message', message)

  this.synth = new Tone.PolySynth(Tone.FMSynth, {
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
    
  });

  // this.synth = new Tone.DuoSynth({
  //   harmonicity: 1,
  //   volume: -20,
  //   detune: 0,
  //   voice0: {
  //     oscillator: { type: "sine" },
  //     envelope: {
  //       attack: 10,
  //       decay: 1.8,
  //       sustain: 0.4,
  //       release: 8,
  //     },
  //     filterEnvelope: {
  //       frequency: '2n.',
  //       baseFrequency: 100,
  //       attack: 0.01,
  //       decay: 0,
  //       sustain: 1,
  //       release: 0.53,
  //     },
  //   },
  //   voice1: {
  //     oscillator: { type: "triangle" },
  //     envelope: {
  //       attack: 9,
  //       decay: 2.8,
  //       sustain: 0.5,
  //       release: 9,
  //     },
  //     filterEnvelope: {
  //       frequency: '2n',
  //       baseFrequency: 1200,
  //       attack: 0.01,
  //       decay: 0.5,
  //       sustain: 1,
  //       release: 2,
  //     },
  //   },
  // })

  // gain goes from -7db - +3d
  this.volume = {
    control: {
      next: (val) => this.synth.volume.value = val
    },
  }
  Object.defineProperty(this.volume, 'value', {
    get: () => this.synth.volume.value,
    set: (val) => this.synth.volume.value = val
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
  const dist = new Tone.Distortion(0);
  const delay = new Tone.FeedbackDelay("4n", 0.88);
  delay.wet.value = 0.33;
  const vol = new Tone.Volume(0);
  const panner = new Tone.Panner({ pan: 0 });
  const chorus = new Tone.Chorus({ frequency: 0.33, depth: 0.8, wet: 0.8 });
  const verb = new Tone.Freeverb({
    dampening: 12000,
    roomSize: 0.95,
    wet: 0.2,
  });

  // const verb2 = new Tone.JCReverb({
  //   roomSize: 0.4,
  //   wet: 0.2,
  // });
  const gain = new Tone.Gain(1);

  this.synth.chain(gain, dist, chorus, autoFilter, vol, verb, panner, Tone.Destination);

  // const cMinor7 = ["C4", "D#4", "G4", "A#4", "G4", "D#4"];
  const fantasy = ["C3", "D3", "E3", "G3", "C4", "D4", "E4", "G4", "C5", "G4", "E4", "D4", "C4", "G3", "E3", "D3", "C3", "D3", "E3", "G3", "C4", "D4", "E4", "G4", "C5", "G4", "E4", "D4", "C4", "G3", "E3", "D3", "A2", "B2", "C3", "E3", "A3", "B3", "C4", "E4", "A4", "E4", "C4", "B3", "A3", "E3", "C3", "B2", "A2", "B2", "C3", "E3", "A3", "B3", "C4", "E4", "A4", "E4", "C4", "B3", "A3", "E3", "C3", "B2"];
  let notes = fantasy;
  let noteIndex = 0;

  const repeater = (time) => {
    let note = notes[noteIndex % notes.length];
    this.synth.triggerAttackRelease(note, "4n", time);
    noteIndex++;
  }

  Tone.Transport.bpm.value = 40;
  Tone.Transport.scheduleRepeat((time) => {
    repeater(time);
  }, "4n");

  return this
}

export default synthPad2