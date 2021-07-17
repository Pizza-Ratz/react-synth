import React from "react";
import PropTypes from "prop-types";
import * as Tone from "tone";
import { SynthPluck1 as SynthPluck1Inst } from "../lib/SynthPluck1";
import Dial from "./Dial";
import ControlGroup from "./ControlGroup";
import "../styles/SynthPluck1.scss";
import MasterOutContext from "../contexts/MasterOutContext";
// does log^10(val), where val is in 0-100000 => 0-5
function linearToLog(val) {
  return val > 0 ? Math.log10(Math.abs(val)) : 0;
}

// turns 0-5 into ~ -110-0 db
function linearToDecibels(val = 0) {
  // console.log(`${val} -> ${linearToLog(val)} => ${(60 * linearToLog(val)) - 300}`)
  return 20 * linearToLog(val) - 100;
}

// // turns 0-1200 into -12 - 0
// function knobToDecibels(val) {
//   return (Math.abs(val) - 1000) * 10;
// }

// // clamps dB to -12000-0 and scales it to -12-0
// function decibelsToKnob(dB) {
//   return -(Math.abs(dB) % 12000) / 10 + 1200;
// }

const SynthPluck1 = () => {
  const [synth] = React.useState(new SynthPluck1Inst());
  const matster = React.useContext(MasterOutContext);

  React.useEffect(() => {
    synth.chain(
      synth.efx.gain,
      synth.efx.vibrato,
      synth.efx.dist,
      synth.efx.autoFilter,
      synth.efx.pan,
      synth.efx.delay,
      synth.efx.reverb
    );
    //  synth.start();
    return () => {
      synth.stop();
    };
  }, [synth]);

  return (
    <div className={`synth-pluck-1`}>
      <h3>Synth Pluck 1</h3>
      <Dial
        min={0}
        max={100000}
        onChange={(val) => (synth.volume.value = linearToDecibels(val))}
        // onChange={(val) => console.log(`[${val}] -> ${linearToDecibels(val)}`)}
      >
        <label>Volume</label>
      </Dial>

      <ControlGroup label="filter">
        <Dial
          min={100}
          max={3000}
          value={synth.efx.autoFilter.baseFrequency}
          onChange={(val) => (synth.efx.autoFilter.baseFrequency = val)}
        >
          <label>cutoff</label>
        </Dial>
        <Dial
          min={0}
          max={1000}
          value={synth.efx.autoFilter.filter.Q.value}
          onChange={(val) =>
            (synth.efx.autoFilter.filter.Q.value = Math.abs(val / 100))
          }
        >
          <label>Q</label>
        </Dial>
      </ControlGroup>
      <Dial
        min={0}
        max={100}
        value={synth.efx.reverb.wet.value}
        onChange={(val) => (synth.efx.reverb.wet.value = Math.abs(val / 100))}
      >
        <label>reverb</label>
      </Dial>
      <Dial
        min={0}
        max={100}
        value={synth.efx.delay.feedback.value}
        onChange={(val) =>
          (synth.efx.delay.feedback.value = Math.abs(val / 100))
        }
      >
        <label>delay feedback</label>
      </Dial>
    </div>
  );
};

SynthPluck1.propTypes = {
  className: PropTypes.string,
};

export default SynthPluck1;
