import * as Tone from 'tone'

/**
 * Kind of a bright FM sound with a gentle attack.
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
const synthPad1 = function () {
  // called when subscribed to a message source
  this.next = message => console.warn('ignoring message', message)

  this.synth = new Tone.DuoSynth({
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
        baseFrequency: 200,
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
        attack: 0.01,
        decay: 0,
        sustain: 1,
        release: 0.5,
      },
    },
    vibratoRate: 0.5,
    vibratoAmount: 0.1,
  })

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

  this.vibrato = {}
  this.vibrato.amount = {
    control: {
      next: (val) => this.synth.vibratoAmount.value = val
    }
  }
  Object.defineProperty(this.vibrato.amount, 'value', {
    get: () => this.synth.vibratoAmount.value,
    set: (val) => this.synth.vibratoAmount.value
  })
  this.vibrato.rate = {
    control: {
      next: (val) => this.synth.vibratoRate.value = val
    }
  }
  Object.defineProperty(this.vibrato.rate, 'value', {
    get: () => this.synth.vibratoRate.value,
    set: (val) => this.synth.vibratoRate.value = val
  })

  const dist = new Tone.Distortion(0.1);
  const delay = new Tone.FeedbackDelay("8n", 0.4);
  delay.wet.value = 0.2;
  const vol = new Tone.Volume(0);
  const verb = new Tone.Freeverb({
    dampening: 400,
    roomSize: 0.9,
    wet: 0.25,
  });

  const gain = new Tone.Gain(0.1);

  this.synth.chain(gain, dist, delay, verb, vol, Tone.Destination);

  // const cMinor7 = ["C4", "D#4", "G4", "A#4", "G4", "D#4"];
  const cMinor6 = ["C3", "D#3", "A3", "C4", "D#4", "A3"];
  let notes = cMinor6;
  let noteIndex = 0;

  const repeater = (time) => {
    let note = notes[noteIndex % notes.length];
    this.synth.triggerAttackRelease(note, "4n", time).toDestination();
    noteIndex++;
  }

  Tone.Transport.scheduleRepeat((time) => {
    repeater(time);
  }, "4n");

  return this
}


export default synthPad1