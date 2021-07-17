// Converts knob output values (0-1000) into decibel values in the range -infinity to 3 db
export function knobToDB(knob = 0) {
  if (knob < 1) return -Infinity;
  // console.log(
  //   `${val} -> ${linearToLog(val)} => ${20 * linearToLog(val) - 100}`
  // );
  return 10 * (knob - 1000 / Math.log(knob) + knob) + 3;
}

// linear value that yields approximately 0dB
export const LINEAR_ZERO_dB = 767;

export function dBToKnob(dB = -Infinity) {
  if (dB < -2400) return 0;
  console.warn("dBToKnob isn't complete");
  return LINEAR_ZERO_dB;
}
