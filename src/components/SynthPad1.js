import React from "react";
import PropTypes from "prop-types";
import * as Tone from "tone";
import { SynthPad1 as SynthPad1Inst } from "../lib/SynthPad1";
import Fader from "./Fader";
import Dial from "./Dial";
import "../styles/SynthPad1.scss";
import ControlGroup from "./ControlGroup";

// does log^10(val), where val is in 0-100000 => 0-5
function linearToLog(val) {
  return val > 0 ? Math.log10(Math.abs(val)) : 0;
}

// turns 0-5 into ~ -110-0 db
function scaleGain(val = 0) {
  // console.log(`${val} -> ${linearToLog(val)} => ${(60 * linearToLog(val)) - 300}`)
  return 20 * linearToLog(val) - 100;
}

const SynthPad1 = () => {
  const [synth] = React.useState(new SynthPad1Inst());

  React.useEffect(() => {
    synth.chain(
      synth.efx.gain,
      synth.efx.dist,
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
    <div className={`synth-pad-1`}>
      <h3>Synth Pad 1</h3>
      <Fader
        range={{ min: [0], max: [1000] }}
        onValueChange={(val) => (synth.volume.value = scaleGain(val * 10))}
        label="Volume"
      />
      <hr />
      <Dial
        min={0}
        max={100}
        val={synth.efx.gain.gain.value}
        color={false}
        onChange={(val) => (synth.efx.gain.gain.value = val / 100)}
      >
        <label>pre-efx gain</label>
      </Dial>
      <div className="voices">
        <ControlGroup label="Voice 0">
          <ControlGroup label="filterEnv">
            <Dial
              min={0}
              max={100}
              val={synth.voice0.filterEnvelope.value}
              color={false}
              onChange={(val) =>
                synth.voice0.filterEnvelope.set({
                  baseFrequency: Math.abs(val * 100),
                })
              }
            >
              <label>frequency</label>
            </Dial>
            <Dial
              min={0}
              max={20}
              val={synth.voice0.filterEnvelope.exponent}
              color={false}
              onChange={(val) => (synth.voice0.filterEnvelope.exponent = val)}
            >
              <label>exponent</label>
            </Dial>
          </ControlGroup>
        </ControlGroup>
        <ControlGroup label="Voice 1">
          <ControlGroup label="filterEnv">
            <Dial
              min={0}
              max={100}
              val={synth.voice1.filterEnvelope.value}
              color={false}
              onChange={(val) =>
                synth.voice1.filterEnvelope.set({
                  baseFrequency: Math.abs(val * 100),
                })
              }
            >
              <label>frequency</label>
            </Dial>
            <Dial
              min={0}
              max={20}
              val={synth.voice1.filterEnvelope.exponent}
              color={false}
              onChange={(val) => (synth.voice1.filterEnvelope.exponent = val)}
            >
              <label>exponent</label>
            </Dial>
          </ControlGroup>
        </ControlGroup>
      </div>
    </div>
  );
};

SynthPad1.propTypes = {
  className: PropTypes.string,
};

export default SynthPad1;
