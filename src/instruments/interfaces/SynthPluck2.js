import React from "react";
import PropTypes from "prop-types";
import SynthPluckInst from "../../instruments/engines/SynthPluck2";
import Dial from "../../components/Dial";
import "../../styles/SynthPluck2.scss";
import MasterOutContext from "../../contexts/MasterOutContext";

// does log^10(val), where val is in 0-100000 => 0-5
function linearToLog(val) {
  return val > 0 ? Math.log10(Math.abs(val)) : 0;
}

// turns 0-100000 into ~ -110-0 db
function linearToDecibels(val = 0) {
  // console.log(
  //   `${val} -> ${linearToLog(val)} => ${20 * linearToLog(val) - 100}`
  // );
  return 20 * linearToLog(val) - 100;
}

const SynthPluck2 = () => {
  const [synth, setSynth] = React.useState(new SynthPluckInst());
  const master = React.useContext(MasterOutContext);

  React.useEffect(() => {
    // synth.chain(
    //   synth.efx.gain,
    //   synth.efx.distortion,
    //   synth.efx.pan,
    //   synth.efx.delay,
    //   synth.efx.reverb,
    //   master
    // );
    synth.output.connect(master);
    synth.start();
    return () => {
      synth.stop();
    };
  }, [synth, master]);

  return (
    <div className={`synth-pluck-2`}>
      <h3>Fantasy</h3>
      <Dial
        min={0}
        max={100000}
        onChange={(val) => {
          synth.volume.value = linearToDecibels(val);
        }}
      >
        <label>Volume</label>
      </Dial>
      <Dial
        min={1}
        max={100}
        value={synth.efx.distortion.wet.value}
        onChange={(val) =>
          (synth.efx.distortion.wet.value = Math.abs(val / 100))
        }
      >
        <label>cutoff</label>
      </Dial>
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

SynthPluck2.propTypes = {
  className: PropTypes.string,
};

export default SynthPluck2;
