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

const synthPad2 = function () {
  // called when subscribed to a message source
  this.next = message => console.warn('ignoring message', message)

  this.synth = new Tone.Synth({
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
      rolloff: -6,
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

  const autoFilter = new Tone.AutoFilter('8n');
  const dist = new Tone.Distortion(0.05);
  const delay = new Tone.FeedbackDelay("8n.", 0.4);
  delay.wet.value = 0.165;
  const vol = new Tone.Volume(0);
  const panner = new Tone.Panner({ pan: 0 });
  const verb = new Tone.Freeverb({
    dampening: 400,
    roomSize: 0.8,
    wet: 0.16,
  });
  const gain = new Tone.Gain(0.1);

  this.synth.chain(gain, dist, autoFilter, delay, verb, vol, panner, Tone.Destination);

  // const cMinor7 = ["C4", "D#4", "G4", "A#4", "G4", "D#4"];
  const fantasy = ["C3", "D3", "E3", "G3", "C4", "D4", "E4", "G4", "C5", "G4", "E4", "D4", "C4", "G3", "E3", "D3", "C3", "D3", "E3", "G3", "C4", "D4", "E4", "G4", "C5", "G4", "E4", "D4", "C4", "G3", "E3", "D3", "A2", "B2", "C3", "E3", "A3", "B3", "C4", "E4", "A4", "E4", "C4", "B3", "A3", "E3", "C3", "B2", "A2", "B2", "C3", "E3", "A3", "B3", "C4", "E4", "A4", "E4", "C4", "B3", "A3", "E3", "C3", "B2"];
  let notes = fantasy;
  let noteIndex = 0;

  const repeater = (time) => {
    let note = notes[noteIndex % notes.length];
    this.synth.triggerAttackRelease(note, "8n", time);
    noteIndex++;
  }

  Tone.Transport.bpm.value = 160;
  Tone.Transport.scheduleRepeat((time) => {
    repeater(time);
  }, "8n");

  return this
}

export default synthPad2