import React from "react";
import PropTypes from "prop-types";
import SynthPluck1Inst from "../engines/SynthPluck1";
import Dial from "../../components/Dial";
import ControlGroup from "../../components/ControlGroup";
import "../../styles/SynthPluck1.scss";
import BusContext from "../../contexts/BusContext";
import { dBToKnob, knobToDB } from "../../lib/transformers";
import * as Tone from "tone";

const SynthPluck1 = () => {
  const [synth] = React.useState(new SynthPluck1Inst());
  const bus = React.useContext(BusContext);
  const [meter] = React.useState(new Tone.Meter());

  React.useEffect(() => {
    synth.output.connect(bus);
    synth.output.connect(meter);
    meter.normalRange = true;
    synth.start();
    return () => {
      synth.stop();
    };
  }, [synth, bus, meter]);

  return (
    <div className={`synth-pluck-1`}>
      <h3>Eternity</h3>
      <Dial
        min={0}
        max={1000}
        value={dBToKnob(synth.volume.value, 1000)}
        onChange={(val) => (synth.volume.value = knobToDB(val, 1000))}
        color={true}
        colorFn={meter.getValue.bind(meter)}
      >
        <label>Volume</label>
      </Dial>

      <ControlGroup label="filter">
        <Dial
          min={1}
          max={1500}
          value={synth.efx.autoFilter.baseFrequency}
          onChange={(val) => (synth.efx.autoFilter.baseFrequency = val)}
        >
          <label>cutoff</label>
        </Dial>
        <Dial
          min={0}
          max={1000}
          value={Math.floor(synth.efx.autoFilter.filter.Q.value) * 1000}
          onChange={(val) => (synth.efx.autoFilter.filter.Q.value = val / 1000)}
        >
          <label>Q</label>
        </Dial>
      </ControlGroup>
      <Dial
        min={0}
        max={100}
        value={Math.floor(synth.efx.reverb.wet.value) * 100}
        onChange={(val) => synth.efx.reverb.set({ wet: Math.abs(val / 100) })}
      >
        <label>reverb</label>
      </Dial>
      <Dial
        min={0}
        max={100}
        value={Math.floor(synth.efx.delay.feedback.value) * 100}
        onChange={(val) =>
          synth.efx.delay.set({ feedback: Math.abs(val / 100) })
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
