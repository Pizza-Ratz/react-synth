import React from "react";
import PropTypes from "prop-types";
import engine from "../engines/SynthPad1";
import Dial from "../../components/Dial";
import "../../styles/SynthPad1.scss";
import ControlGroup from "../../components/ControlGroup";
import MasterOut from "../../contexts/MasterOutContext";

// does log^10(val), where val is in 0-100000 => 0-5
function linearToLog(val) {
  return val > 0 ? Math.log10(Math.abs(val)) : 0;
}

// turns 0-5 into ~ -110-0 db
function scaleGain(val = 0) {
  console.log(`${val} -> ${linearToLog(val)} => ${20 * linearToLog(val) - 80}`);
  return 20 * linearToLog(val) - 80;
}

const SMALL_KNOB_SIZE = 30;

const SynthPad1 = () => {
  const [synth] = React.useState(new engine());
  const master = React.useContext(MasterOut);

  React.useEffect(() => {
    synth.start();
    synth.output.connect(master);
    return () => {
      synth.stop();
    };
  }, [synth, master]);

  return (
    <div className={`synth-pad-1`}>
      <h3>Synth Pad 1</h3>
      <Dial
        min={0}
        max={1000}
        val={synth.volume.value}
        onChange={(val) => (synth.volume.value = scaleGain(val * 10))}
      >
        <label>Volume</label>
      </Dial>
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
              size={SMALL_KNOB_SIZE}
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
              size={SMALL_KNOB_SIZE}
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
              size={SMALL_KNOB_SIZE}
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
              size={SMALL_KNOB_SIZE}
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
