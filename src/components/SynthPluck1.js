import React from "react";
import PropTypes from "prop-types";
import * as Tone from "tone";
import { SynthPluck1 as SynthPluck1Inst } from "../lib/SynthPluck1";
import Fader from "./Fader";
import Knob from "./Dial";
import ControlGroup from "./ControlGroup";
import "../styles/SynthPluck1.scss";

// does log^10(val), where val is in 0-100000 => 0-5
function linearToLog(val) {
  return val > 0 ? Math.log10(Math.abs(val)) : 0;
}

// turns 0-5 into ~ -110-0 db
function scaleGain(val = 0) {
  // console.log(`${val} -> ${linearToLog(val)} => ${(60 * linearToLog(val)) - 300}`)
  return 20 * linearToLog(val) - 100;
}

const SynthPluck1 = () => {
  const [synth] = React.useState(new SynthPluck1Inst());

  React.useEffect(() => {
    synth.chain(
      synth.efx.gain,
      synth.efx.vibrato,
      synth.efx.dist,
      synth.efx.autoFilter,
      synth.efx.pan,
      synth.efx.delay,
      synth.efx.reverb,
      Tone.Destination
    );
    synth.start();
    return () => {
      synth.stop();
    };
  }, [synth]);

  return (
    <div className={`synth-pluck-1`}>
      <h3>Synth Pluck 1</h3>
      <Fader
        range={{ min: [0], max: [100000] }}
        start={synth.volume.value}
        pips={{}}
        onValueChange={(val) => (synth.volume.value = scaleGain(val))}
        tooltips={false}
        label="Volume"
      />
      <hr />
      <ControlGroup label="filter">
        <Knob
          min={100}
          max={3000}
          value={synth.efx.autoFilter.baseFrequency}
          onChange={(val) => (synth.efx.autoFilter.baseFrequency = val)}
        >
          <label>cutoff</label>
        </Knob>
        <Knob
          min={0}
          max={1000}
          value={synth.efx.autoFilter.filter.Q.value}
          onChange={(val) =>
            (synth.efx.autoFilter.filter.Q.value = Math.abs(val / 100))
          }
        >
          <label>Q</label>
        </Knob>
      </ControlGroup>
      <Knob
        min={0}
        max={100}
        value={synth.efx.reverb.wet.value}
        onChange={(val) => (synth.efx.reverb.wet.value = Math.abs(val / 100))}
      >
        <label>reverb</label>
      </Knob>
      <Knob
        min={0}
        max={100}
        value={synth.efx.delay.feedback.value}
        onChange={(val) => (synth.efx.delay.feedback.value = Math.abs(val / 100))}
      >
        <label>delay feedback</label>
      </Knob>
    </div>
  );
};

SynthPluck1.propTypes = {
  className: PropTypes.string,
};

export default SynthPluck1;
