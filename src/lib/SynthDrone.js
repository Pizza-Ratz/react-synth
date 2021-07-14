import * as Tone from 'tone'

Tone.Transport.bpm.value = 60;

export function fmDrone(notes, playSeconds, tailSeconds) {
  let reverb = new Tone.Reverb({ decay: playSeconds / 4, wet: 0.8 });
  reverb.generate(); // Risky not to wait but ¯\_(ツ)_/¯

  let synth = new Tone.PolySynth(notes.length, Tone.FMSynth).chain(
    new Tone.Chorus({ frequency: 0.33, depth: 0.7, wet: 0.85 }),
    new Tone.FeedbackDelay({
      delayTime: playSeconds / 16,
      feedback: 0.33,
      wet: 0.66
    }),
    reverb,
    Tone.Destination
  );

  synth.set({
    harmonicity: 0.5,
    modulationIndex: 1,
    oscillator: {
      type: "sine"
    },
    envelope: {
      attack: playSeconds / 4,
      sustain: 1,
      release: tailSeconds - 1,
      attackCurve: "linear",
      releaseCurve: "linear"
    },
    modulation: { type: "sine" },
    modulationEnvelope: {
      attack: playSeconds * 2,
      sustain: 1,
      release: tailSeconds,
      releaseCurve: "linear"
    },
    volume: -30
  });
  synth.triggerAttackRelease(notes, playSeconds);
}

export function fmBells(notes, playSeconds, tailSeconds) {
  let delay = new Tone.FeedbackDelay({
    delayTime: playSeconds / 8,
    feedback: 0.88,
    wet: 0.66
  });

  let flanger = new Tone.FeedbackDelay({
    delayTime: 0.005,
    feedback: 0.1,
    wet: 0.33
  });
  new Tone.LFO(1, 0.003, 0.007).start().connect(flanger.delayTime);

  let reverb = new Tone.Reverb({ decay: playSeconds / 4, wet: 0.8 });
  reverb.generate(); // Risky not to wait but ¯\_(ツ)_/¯

  let synth = new Tone.PolySynth(5, Tone.FMSynth).chain(
    delay,
    flanger,
    reverb,
    Tone.Destination
  );
  synth.set({
    harmonicity: 1.4,
    modulationIndex: 1,
    oscillator: {
      type: "sine"
    },
    envelope: {
      attack: 0.01,
      decay: 0.3,
      sustain: 0.6,
      release: tailSeconds - 1
    },
    modulation: { type: "triangle" },
    modulationEnvelope: {
      attack: 0.01,
      decay: 0.3,
      sustain: 0.6,
      release: tailSeconds
    },
    volume: -30
  });
  synth.triggerAttackRelease(notes, playSeconds);
}

export function bounceChord(notes, synthFn, playDuration, tailDuration) {
  let playSeconds = Tone.Time(playDuration).toSeconds();
  let tailSeconds = Tone.Time(tailDuration).toSeconds();
  return Tone.Offline(
    () => synthFn(notes, playSeconds, tailSeconds),
    playSeconds + tailSeconds
  );
}

export function play() {
  Promise.all([
    bounceChord(["A#6", "F7", "A#7", "D#8", "F8"], fmDrone, 3, 3),
    bounceChord(["D#5", "A#5", "C6", "G6", "A#6", "C9"], fmDrone, 3, 3),
    bounceChord(["F6", "C6", "D#7", "A#7", "C8"], fmDrone, 3, 3),
    bounceChord(["A#5", "D#6", "G6", "C7", "D#7", "G8"], fmDrone, 3, 3),
    bounceChord(["A#6", "F7", "A#7", "D#8", "F8"], fmBells, 3, 3),
    bounceChord(["D#5", "A#5", "C6", "G6", "A#6", "C9"], fmBells, 3, 3),
    bounceChord(["F6", "C6", "D#7", "A#7", "C8"], fmBells, 3, 3),
    bounceChord(["A#5", "D#6", "G6", "C7", "D#7", "G8"], fmBells, 3, 3)
  ]).then(buffers => {
    let patternCtrl = new Tone.CtrlPattern([0, 1, 2, 3], "random");
    let timeCtrl = new Tone.CtrlRandom(6, 18);
    function next(time) {
      let droneBuffer = buffers[patternCtrl.next()];
      let bellBuffer = buffers[4 + patternCtrl.next()];
      new Tone.BufferSource({ buffer: droneBuffer, playbackRate: 0.125 })
        .toDestination()
        .start(time);
      new Tone.BufferSource({ buffer: bellBuffer, playbackRate: 0.125 })
        .toDestination()
        .start(time);
      Tone.Transport.scheduleOnce(next, "+" + timeCtrl.value);
    }
    next(Tone.now());
  });

  Tone.Transport.start();
  document.querySelector('button').remove();
}

document.querySelector('button').onclick = play;